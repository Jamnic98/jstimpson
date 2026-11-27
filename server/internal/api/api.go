package api

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strconv"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Jamnic98/jstimpson/server/internal/config"
	"github.com/Jamnic98/jstimpson/server/internal/db"
	"github.com/Jamnic98/jstimpson/server/internal/models"
	"github.com/Jamnic98/jstimpson/server/internal/stats"
)

var allowedOrigins = map[string]bool{
	"http://localhost:3000":  true,
	"http://localhost":       true,
	"https://jstimpson.co.uk": true,
}

type API struct {
	db  *db.DB
	cfg config.Config
}

func New(d *db.DB, cfg config.Config) *API {
	return &API{db: d, cfg: cfg}
}

func (a *API) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", a.health)
	mux.HandleFunc("GET /activities", a.activities)
	mux.HandleFunc("GET /runs", a.runs)
	mux.HandleFunc("GET /stats/activities", a.statsActivities)
	mux.HandleFunc("GET /stats/goals", a.goalProgress)
	mux.HandleFunc("GET /stats/habits", a.statsHabits)
	mux.HandleFunc("GET /goals", a.listGoals)
	mux.HandleFunc("POST /goals", a.createGoal)
	mux.HandleFunc("DELETE /goals/{id}", a.deleteGoal)
	mux.HandleFunc("GET /habits", a.listHabits)
	mux.HandleFunc("POST /habits", a.createHabit)
	mux.HandleFunc("PATCH /habits/{id}", a.updateHabit)
	mux.HandleFunc("DELETE /habits/{id}", a.deleteHabit)
	mux.HandleFunc("GET /checkins", a.listCheckins)
	mux.HandleFunc("POST /checkins", a.upsertCheckin)
	mux.HandleFunc("PATCH /checkins/{id}", a.updateCheckin)
	mux.HandleFunc("DELETE /checkins/{id}", a.deleteCheckin)
	return cors(authMiddleware(a.cfg.APIKey, mux))
}

// authMiddleware requires the x-api-key header on every request except CORS
// preflights and the health check. An empty key disables auth (local dev only —
// Lambda always has API_KEY set via the SAM template).
func authMiddleware(apiKey string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if apiKey == "" || r.Method == http.MethodOptions || (r.Method == http.MethodGet && r.URL.Path == "/health") {
			next.ServeHTTP(w, r)
			return
		}
		if r.Header.Get("X-Api-Key") != apiKey {
			writeError(w, http.StatusUnauthorized, "Unauthorized: missing or invalid API key")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		slog.Error("failed to encode response", "error", err)
	}
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"detail": msg})
}

// parseAfter parses the optional "after" query param (unix milliseconds).
func parseAfter(raw string) (*time.Time, error) {
	if raw == "" {
		return nil, nil
	}
	ms, err := strconv.ParseInt(raw, 10, 64)
	if err != nil || ms < 0 {
		return nil, strconv.ErrSyntax
	}
	t := time.UnixMilli(ms)
	return &t, nil
}

func (a *API) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (a *API) activities(w http.ResponseWriter, r *http.Request) {
	slog.Info("fetching activities from database")
	q := r.URL.Query()

	after, err := parseAfter(q.Get("after"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid timestamp: must be a positive integer")
		return
	}

	filter := bson.M{}
	if after != nil {
		filter["start_date_local"] = bson.M{"$gt": after}
	}
	if sportType := q.Get("type"); sportType != "" {
		if !models.ValidSportTypes[sportType] {
			writeError(w, http.StatusUnprocessableEntity, "Invalid sport type: "+sportType)
			return
		}
		filter["sport_type"] = sportType
	}

	opts := options.Find().SetSort(bson.D{{Key: "start_date_local", Value: 1}})
	cur, err := a.db.Activities().Find(r.Context(), filter, opts)
	if err != nil {
		slog.Error("database error", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	var activities []models.Activity
	if err := cur.All(r.Context(), &activities); err != nil {
		slog.Error("failed to decode activities", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	if activities == nil {
		activities = []models.Activity{}
	}
	writeJSON(w, http.StatusOK, models.ActivityCollection{Activities: activities})
}

func (a *API) runs(w http.ResponseWriter, r *http.Request) {
	slog.Info("fetching runs from database")
	q := r.URL.Query()

	after, err := parseAfter(q.Get("after"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid timestamp: must be a positive integer")
		return
	}

	filter := bson.M{"sport_type": "Run"}
	if after != nil {
		filter["start_date_local"] = bson.M{"$gt": after}
	}

	opts := options.Find().SetSort(bson.D{{Key: "start_date_local", Value: 1}})
	cur, err := a.db.Activities().Find(r.Context(), filter, opts)
	if err != nil {
		slog.Error("database error", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	var activities []models.Activity
	if err := cur.All(r.Context(), &activities); err != nil {
		slog.Error("failed to decode activities", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}

	runs := make([]models.Run, 0, len(activities))
	for _, act := range activities {
		if act.Distance == nil || act.MovingTime == nil || act.StartDateLocal == nil {
			continue
		}
		runs = append(runs, models.Run{
			Distance:       *act.Distance,
			Duration:       *act.MovingTime,
			StartDateLocal: *act.StartDateLocal,
		})
	}
	writeJSON(w, http.StatusOK, models.RunCollection{Runs: runs})
}

func (a *API) allActivities(ctx context.Context) ([]models.Activity, error) {
	opts := options.Find().SetSort(bson.D{{Key: "start_date_local", Value: 1}})
	cur, err := a.db.Activities().Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	var acts []models.Activity
	if err := cur.All(ctx, &acts); err != nil {
		return nil, err
	}
	return acts, nil
}

func (a *API) statsActivities(w http.ResponseWriter, r *http.Request) {
	sportType := r.URL.Query().Get("type")
	if sportType == "" {
		sportType = "Run"
	}
	if sportType != "any" && !models.ValidSportTypes[sportType] {
		writeError(w, http.StatusUnprocessableEntity, "Invalid sport type: "+sportType)
		return
	}

	acts, err := a.allActivities(r.Context())
	if err != nil {
		slog.Error("database error", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	writeJSON(w, http.StatusOK, stats.Summarize(acts, sportType, time.Now()))
}

var monthPattern = regexp.MustCompile(`^\d{4}-\d{2}$`)

func (a *API) listGoals(w http.ResponseWriter, r *http.Request) {
	opts := options.Find().SetSort(bson.D{{Key: "month", Value: -1}})
	cur, err := a.db.Goals().Find(r.Context(), bson.M{"active": true}, opts)
	if err != nil {
		slog.Error("database error", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	var goals []models.Goal
	if err := cur.All(r.Context(), &goals); err != nil {
		slog.Error("failed to decode goals", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	if goals == nil {
		goals = []models.Goal{}
	}
	writeJSON(w, http.StatusOK, map[string]any{"goals": goals})
}

func (a *API) createGoal(w http.ResponseWriter, r *http.Request) {
	var goal models.Goal
	if err := json.NewDecoder(r.Body).Decode(&goal); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	goal.ID = primitive.NilObjectID
	if goal.Name == "" {
		writeError(w, http.StatusBadRequest, "name is required")
		return
	}
	if goal.Type != "any" && !models.ValidSportTypes[goal.Type] {
		writeError(w, http.StatusBadRequest, "Invalid goal type: "+goal.Type)
		return
	}
	if !models.ValidGoalMetrics[goal.Metric] {
		writeError(w, http.StatusBadRequest, "Invalid metric: "+goal.Metric)
		return
	}
	if goal.Target <= 0 {
		writeError(w, http.StatusBadRequest, "target must be positive")
		return
	}
	if !monthPattern.MatchString(goal.Month) {
		writeError(w, http.StatusBadRequest, "month must be YYYY-MM")
		return
	}
	goal.Active = true

	res, err := a.db.Goals().InsertOne(r.Context(), goal)
	if err != nil {
		slog.Error("failed to insert goal", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	goal.ID = res.InsertedID.(primitive.ObjectID)
	writeJSON(w, http.StatusCreated, goal)
}

func (a *API) deleteGoal(w http.ResponseWriter, r *http.Request) {
	id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid goal id")
		return
	}
	res, err := a.db.Goals().DeleteOne(r.Context(), bson.M{"_id": id})
	if err != nil {
		slog.Error("database error", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	if res.DeletedCount == 0 {
		writeError(w, http.StatusNotFound, "Goal not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"deleted": true})
}

func (a *API) goalProgress(w http.ResponseWriter, r *http.Request) {
	month := r.URL.Query().Get("month")
	if month == "" {
		month = time.Now().Format("2006-01")
	}
	if !monthPattern.MatchString(month) {
		writeError(w, http.StatusBadRequest, "month must be YYYY-MM")
		return
	}

	cur, err := a.db.Goals().Find(r.Context(), bson.M{"month": month, "active": true})
	if err != nil {
		slog.Error("database error", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}
	var goals []models.Goal
	if err := cur.All(r.Context(), &goals); err != nil {
		slog.Error("failed to decode goals", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}

	acts, err := a.allActivities(r.Context())
	if err != nil {
		slog.Error("database error", "error", err)
		writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
		return
	}

	now := time.Now()
	out := make([]stats.GoalProgress, 0, len(goals))
	for _, g := range goals {
		out = append(out, stats.GoalProgressFor(acts, g, now))
	}
	writeJSON(w, http.StatusOK, map[string]any{"month": month, "goals": out})
}

// LambdaHandler adapts API Gateway HTTP API (payload v2) events to the HTTP handler.
func (a *API) LambdaHandler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	httpReq, err := http.NewRequestWithContext(ctx, req.RequestContext.HTTP.Method, req.RawPath, nil)
	if err != nil {
		return events.APIGatewayV2HTTPResponse{StatusCode: http.StatusInternalServerError, Body: `{"detail":"bad request"}`}, nil
	}
	httpReq.URL.RawQuery = req.RawQueryString
	for k, v := range req.Headers {
		httpReq.Header.Set(k, v)
	}

	rec := httptest.NewRecorder()
	a.Handler().ServeHTTP(rec, httpReq)

	resp := rec.Result()
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return events.APIGatewayV2HTTPResponse{StatusCode: http.StatusInternalServerError, Body: `{"detail":"internal error"}`}, nil
	}

	headers := map[string]string{}
	for k, v := range resp.Header {
		if len(v) > 0 {
			headers[k] = v[0]
		}
	}
	return events.APIGatewayV2HTTPResponse{
		StatusCode: resp.StatusCode,
		Headers:    headers,
		Body:       string(body),
	}, nil
}
