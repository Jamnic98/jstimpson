package api

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"regexp"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Jamnic98/jstimpson/server/internal/models"
	"github.com/Jamnic98/jstimpson/server/internal/stats"
)

var datePattern = regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)

func (a *API) dbErr(w http.ResponseWriter, err error) {
	slog.Error("database error", "error", err)
	writeError(w, http.StatusServiceUnavailable, "Internal Server Error: Database operation failed")
}

// ---------- habits ----------

func (a *API) listHabits(w http.ResponseWriter, r *http.Request) {
	opts := options.Find().SetSort(bson.D{{Key: "name", Value: 1}})
	cur, err := a.db.Habits().Find(r.Context(), bson.M{"active": true}, opts)
	if err != nil {
		a.dbErr(w, err)
		return
	}
	var habits []models.Habit
	if err := cur.All(r.Context(), &habits); err != nil {
		a.dbErr(w, err)
		return
	}
	if habits == nil {
		habits = []models.Habit{}
	}
	writeJSON(w, http.StatusOK, map[string]any{"habits": habits})
}

func validateHabit(h *models.Habit) string {
	if h.Name == "" {
		return "name is required"
	}
	if !models.ValidVerificationSources[h.VerificationSource] {
		return "invalid verification_source: " + h.VerificationSource
	}
	if h.VerificationSource == "strava" && !models.ValidSportTypes[h.SportType] {
		return "strava habits require a valid sport_type"
	}
	if h.TargetPerWeek < 0 {
		return "target_per_week must be >= 0"
	}
	for _, d := range h.Schedule {
		if !models.ValidWeekdays[d] {
			return "invalid schedule weekday: " + d
		}
	}
	return ""
}

func (a *API) createHabit(w http.ResponseWriter, r *http.Request) {
	var h models.Habit
	if err := json.NewDecoder(r.Body).Decode(&h); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	h.ID = primitive.NilObjectID
	if h.VerificationSource == "" {
		h.VerificationSource = "manual"
	}
	if msg := validateHabit(&h); msg != "" {
		writeError(w, http.StatusBadRequest, msg)
		return
	}
	h.Active = true
	h.CreatedAt = time.Now().UTC()

	res, err := a.db.Habits().InsertOne(r.Context(), h)
	if err != nil {
		a.dbErr(w, err)
		return
	}
	h.ID = res.InsertedID.(primitive.ObjectID)
	writeJSON(w, http.StatusCreated, h)
}

func (a *API) updateHabit(w http.ResponseWriter, r *http.Request) {
	id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid habit id")
		return
	}

	var patch struct {
		Name               *string   `json:"name"`
		Category           *string   `json:"category"`
		Unit               *string   `json:"unit"`
		TargetPerWeek      *int      `json:"target_per_week"`
		Schedule           *[]string `json:"schedule"`
		VerificationSource *string   `json:"verification_source"`
		SportType          *string   `json:"sport_type"`
		MinDistanceKm      *float64  `json:"min_distance_km"`
		Active             *bool     `json:"active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&patch); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	set := bson.M{}
	if patch.Name != nil {
		set["name"] = *patch.Name
	}
	if patch.Category != nil {
		set["category"] = *patch.Category
	}
	if patch.Unit != nil {
		set["unit"] = *patch.Unit
	}
	if patch.TargetPerWeek != nil {
		if *patch.TargetPerWeek < 0 {
			writeError(w, http.StatusBadRequest, "target_per_week must be >= 0")
			return
		}
		set["target_per_week"] = *patch.TargetPerWeek
	}
	if patch.Schedule != nil {
		for _, d := range *patch.Schedule {
			if !models.ValidWeekdays[d] {
				writeError(w, http.StatusBadRequest, "invalid schedule weekday: "+d)
				return
			}
		}
		set["schedule"] = *patch.Schedule
	}
	if patch.VerificationSource != nil {
		if !models.ValidVerificationSources[*patch.VerificationSource] {
			writeError(w, http.StatusBadRequest, "invalid verification_source")
			return
		}
		set["verification_source"] = *patch.VerificationSource
	}
	if patch.SportType != nil {
		set["sport_type"] = *patch.SportType
	}
	if patch.MinDistanceKm != nil {
		set["min_distance_km"] = *patch.MinDistanceKm
	}
	if patch.Active != nil {
		set["active"] = *patch.Active
	}
	if len(set) == 0 {
		writeError(w, http.StatusBadRequest, "No fields to update")
		return
	}

	res, err := a.db.Habits().UpdateOne(r.Context(), bson.M{"_id": id}, bson.M{"$set": set})
	if err != nil {
		a.dbErr(w, err)
		return
	}
	if res.MatchedCount == 0 {
		writeError(w, http.StatusNotFound, "Habit not found")
		return
	}
	var h models.Habit
	if err := a.db.Habits().FindOne(r.Context(), bson.M{"_id": id}).Decode(&h); err != nil {
		a.dbErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, h)
}

func (a *API) deleteHabit(w http.ResponseWriter, r *http.Request) {
	id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid habit id")
		return
	}
	// soft delete: keep history, hide from active lists
	res, err := a.db.Habits().UpdateOne(r.Context(), bson.M{"_id": id}, bson.M{"$set": bson.M{"active": false}})
	if err != nil {
		a.dbErr(w, err)
		return
	}
	if res.MatchedCount == 0 {
		writeError(w, http.StatusNotFound, "Habit not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"deleted": true})
}

// ---------- checkins ----------

func (a *API) listCheckins(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := bson.M{}
	if habitID := q.Get("habit_id"); habitID != "" {
		oid, err := primitive.ObjectIDFromHex(habitID)
		if err != nil {
			writeError(w, http.StatusBadRequest, "Invalid habit_id")
			return
		}
		filter["habit_id"] = oid
	}
	if from := q.Get("from"); from != "" {
		if !datePattern.MatchString(from) {
			writeError(w, http.StatusBadRequest, "from must be YYYY-MM-DD")
			return
		}
		filter["date"] = bson.M{"$gte": from}
	}
	if to := q.Get("to"); to != "" {
		if !datePattern.MatchString(to) {
			writeError(w, http.StatusBadRequest, "to must be YYYY-MM-DD")
			return
		}
		if existing, ok := filter["date"].(bson.M); ok {
			existing["$lte"] = to
		} else {
			filter["date"] = bson.M{"$lte": to}
		}
	}

	opts := options.Find().SetSort(bson.D{{Key: "date", Value: 1}})
	cur, err := a.db.Checkins().Find(r.Context(), filter, opts)
	if err != nil {
		a.dbErr(w, err)
		return
	}
	var checkins []models.Checkin
	if err := cur.All(r.Context(), &checkins); err != nil {
		a.dbErr(w, err)
		return
	}
	if checkins == nil {
		checkins = []models.Checkin{}
	}
	writeJSON(w, http.StatusOK, map[string]any{"checkins": checkins})
}

// upsertCheckin creates or updates the check-in for (habit_id, date).
// A manual post never downgrades an existing verified check-in.
func (a *API) upsertCheckin(w http.ResponseWriter, r *http.Request) {
	var body struct {
		HabitID string `json:"habit_id"`
		Date    string `json:"date"`
		Status  string `json:"status"`
		Note    string `json:"note"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	oid, err := primitive.ObjectIDFromHex(body.HabitID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid habit_id")
		return
	}
	if !datePattern.MatchString(body.Date) {
		writeError(w, http.StatusBadRequest, "date must be YYYY-MM-DD")
		return
	}
	status := models.CheckinDoneUnverified
	if body.Status != "" {
		if !models.ValidCheckinStatuses[body.Status] {
			writeError(w, http.StatusBadRequest, "invalid status: "+body.Status)
			return
		}
		status = models.CheckinStatus(body.Status)
	}

	var habit models.Habit
	if err := a.db.Habits().FindOne(r.Context(), bson.M{"_id": oid}).Decode(&habit); err != nil {
		writeError(w, http.StatusNotFound, "Habit not found")
		return
	}

	now := time.Now().UTC()
	filter := bson.M{"habit_id": oid, "date": body.Date}

	// never downgrade a verified check-in with a manual one
	var existing models.Checkin
	_ = a.db.Checkins().FindOne(r.Context(), filter).Decode(&existing)
	if existing.Verified && existing.Status == models.CheckinDone {
		writeJSON(w, http.StatusOK, existing)
		return
	}

	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"verified":   false,
			"source":     "manual",
			"note":       body.Note,
			"updated_at": now,
		},
		"$setOnInsert": bson.M{"created_at": now},
	}
	opts := options.Update().SetUpsert(true)
	if _, err := a.db.Checkins().UpdateOne(r.Context(), filter, update, opts); err != nil {
		a.dbErr(w, err)
		return
	}

	var out models.Checkin
	if err := a.db.Checkins().FindOne(r.Context(), filter).Decode(&out); err != nil {
		a.dbErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (a *API) updateCheckin(w http.ResponseWriter, r *http.Request) {
	id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid checkin id")
		return
	}
	var patch struct {
		Status *string `json:"status"`
		Note   *string `json:"note"`
	}
	if err := json.NewDecoder(r.Body).Decode(&patch); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	set := bson.M{"updated_at": time.Now().UTC()}
	if patch.Status != nil {
		if !models.ValidCheckinStatuses[*patch.Status] {
			writeError(w, http.StatusBadRequest, "invalid status: "+*patch.Status)
			return
		}
		set["status"] = *patch.Status
	}
	if patch.Note != nil {
		set["note"] = *patch.Note
	}
	res, err := a.db.Checkins().UpdateOne(r.Context(), bson.M{"_id": id}, bson.M{"$set": set})
	if err != nil {
		a.dbErr(w, err)
		return
	}
	if res.MatchedCount == 0 {
		writeError(w, http.StatusNotFound, "Checkin not found")
		return
	}
	var out models.Checkin
	if err := a.db.Checkins().FindOne(r.Context(), bson.M{"_id": id}).Decode(&out); err != nil {
		a.dbErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}

func (a *API) deleteCheckin(w http.ResponseWriter, r *http.Request) {
	id, err := primitive.ObjectIDFromHex(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid checkin id")
		return
	}
	res, err := a.db.Checkins().DeleteOne(r.Context(), bson.M{"_id": id})
	if err != nil {
		a.dbErr(w, err)
		return
	}
	if res.DeletedCount == 0 {
		writeError(w, http.StatusNotFound, "Checkin not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"deleted": true})
}

// ---------- habit stats ----------

func (a *API) statsHabits(w http.ResponseWriter, r *http.Request) {
	verifiedOnly := r.URL.Query().Get("verified_only") == "true"

	cur, err := a.db.Habits().Find(r.Context(), bson.M{"active": true})
	if err != nil {
		a.dbErr(w, err)
		return
	}
	var habits []models.Habit
	if err := cur.All(r.Context(), &habits); err != nil {
		a.dbErr(w, err)
		return
	}

	ccur, err := a.db.Checkins().Find(r.Context(), bson.M{})
	if err != nil {
		a.dbErr(w, err)
		return
	}
	var checkins []models.Checkin
	if err := ccur.All(r.Context(), &checkins); err != nil {
		a.dbErr(w, err)
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"verified_only": verifiedOnly,
		"habits":        stats.SummarizeHabits(habits, checkins, verifiedOnly, time.Now()),
	})
}
