package updater

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Jamnic98/jstimpson/server/internal/config"
	"github.com/Jamnic98/jstimpson/server/internal/db"
	"github.com/Jamnic98/jstimpson/server/internal/models"
	"github.com/Jamnic98/jstimpson/server/internal/strava"
)

type Updater struct {
	db     *db.DB
	cfg    config.Config
	strava *strava.Client
}

func New(d *db.DB, cfg config.Config) *Updater {
	return &Updater{
		db:     d,
		cfg:    cfg,
		strava: strava.NewClient(cfg.StravaClientID, cfg.StravaClientSecret, cfg.RequestTimeout),
	}
}

type Result struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

// Run backfills Strava activities into MongoDB over the configured lookback
// window. Failures return a 500 status so they are visible in Lambda metrics.
func (u *Updater) Run(ctx context.Context) Result {
	after := time.Now().Add(-time.Duration(u.cfg.StravaLookbackDays) * 24 * time.Hour)

	token, err := u.validToken(ctx)
	if err != nil {
		slog.Error("failed to obtain valid Strava token", "error", err)
		return Result{StatusCode: 500, Body: fmt.Sprintf("Failed to obtain Strava token: %v", err)}
	}

	stravaActivities, err := u.strava.ListActivities(ctx, token.AccessToken, after.Unix())
	if err != nil {
		slog.Error("failed to fetch activities from Strava", "error", err)
		return Result{StatusCode: 500, Body: fmt.Sprintf("Failed to fetch Strava activities: %v", err)}
	}

	existingIDs, existingTimes, err := u.existingActivityKeys(ctx, after)
	if err != nil {
		slog.Error("failed to read existing activities", "error", err)
		return Result{StatusCode: 500, Body: fmt.Sprintf("Database error: %v", err)}
	}

	newActivities := filterNew(stravaActivities, existingIDs, existingTimes)
	if len(newActivities) == 0 {
		slog.Info("no new activities to upload")
		return Result{StatusCode: 200, Body: "Uploaded 0 activities"}
	}

	docs := make([]any, len(newActivities))
	for i, a := range newActivities {
		docs[i] = a
	}
	if _, err := u.db.Activities().InsertMany(ctx, docs); err != nil {
		slog.Error("failed to insert activities", "error", err)
		return Result{StatusCode: 500, Body: fmt.Sprintf("Failed to insert activities: %v", err)}
	}

	slog.Info("inserted new activities", "count", len(newActivities))
	return Result{StatusCode: 200, Body: fmt.Sprintf("Uploaded %d activities", len(newActivities))}
}

// filterNew drops activities already stored, matching by strava_id first and
// falling back to start_date_local for legacy documents without a strava_id.
func filterNew(activities []models.Activity, existingIDs map[string]bool, existingTimes map[int64]bool) []models.Activity {
	var out []models.Activity
	for _, a := range activities {
		if a.StravaID != "" && existingIDs[a.StravaID] {
			continue
		}
		if a.StartDateLocal != nil && existingTimes[a.StartDateLocal.Unix()] {
			continue
		}
		out = append(out, a)
	}
	return out
}

func (u *Updater) existingActivityKeys(ctx context.Context, after time.Time) (map[string]bool, map[int64]bool, error) {
	cur, err := u.db.Activities().Find(ctx, bson.M{"start_date_local": bson.M{"$gte": after}})
	if err != nil {
		return nil, nil, err
	}
	var existing []models.Activity
	if err := cur.All(ctx, &existing); err != nil {
		return nil, nil, err
	}
	ids := make(map[string]bool, len(existing))
	times := make(map[int64]bool, len(existing))
	for _, a := range existing {
		if a.StravaID != "" {
			ids[a.StravaID] = true
		}
		if a.StartDateLocal != nil {
			times[a.StartDateLocal.Unix()] = true
		}
	}
	return ids, times, nil
}

func (u *Updater) validToken(ctx context.Context) (*models.StravaToken, error) {
	var token models.StravaToken
	err := u.db.StravaTokens().FindOne(ctx, bson.M{"_id": models.DefaultStravaTokenID}).Decode(&token)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("no Strava token found in database")
	}
	if err != nil {
		return nil, err
	}
	if token.ExpiresAt > time.Now().Unix() {
		return &token, nil
	}

	slog.Info("Strava token expired, refreshing")
	refreshed, err := u.strava.RefreshToken(ctx, token.RefreshToken)
	if err != nil {
		return nil, fmt.Errorf("failed to refresh Strava token: %w", err)
	}
	opts := options.FindOneAndReplace().SetUpsert(true).SetReturnDocument(options.After)
	res := u.db.StravaTokens().FindOneAndReplace(ctx, bson.M{"_id": models.DefaultStravaTokenID}, refreshed, opts)
	if err := res.Err(); err != nil {
		return nil, fmt.Errorf("failed to persist refreshed Strava token: %w", err)
	}
	slog.Info("refreshed Strava token")
	return refreshed, nil
}
