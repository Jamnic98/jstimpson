package db

import (
	"context"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Jamnic98/jstimpson/server/internal/config"
)

const (
	ActivitiesCollection   = "activities"
	StravaTokensCollection = "strava_tokens"
	GoalsCollection        = "goals"
	HabitsCollection       = "habits"
	CheckinsCollection     = "checkins"
)

type DB struct {
	client *mongo.Client
	cfg    config.Config
}

var getDB = sync.OnceValues(func() (*DB, error) {
	cfg := config.Load()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.DBURI))
	if err != nil {
		return nil, err
	}
	return &DB{client: client, cfg: cfg}, nil
})

// Get returns the shared MongoDB handle. The client is created once and reused
// across warm Lambda invocations.
func Get() (*DB, error) {
	return getDB()
}

func (d *DB) Activities() *mongo.Collection {
	return d.client.Database(d.cfg.DBName).Collection(ActivitiesCollection)
}

func (d *DB) StravaTokens() *mongo.Collection {
	return d.client.Database(d.cfg.DBName).Collection(StravaTokensCollection)
}

func (d *DB) Goals() *mongo.Collection {
	return d.client.Database(d.cfg.DBName).Collection(GoalsCollection)
}

func (d *DB) Habits() *mongo.Collection {
	return d.client.Database(d.cfg.DBName).Collection(HabitsCollection)
}

func (d *DB) Checkins() *mongo.Collection {
	return d.client.Database(d.cfg.DBName).Collection(CheckinsCollection)
}

// EnsureIndexes creates the unique (habit_id, date) index on checkins.
// Call it in the background: it must not block startup when Mongo is
// unreachable (local dev without a database).
func (d *DB) EnsureIndexes(ctx context.Context) error {
	_, err := d.Checkins().Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "habit_id", Value: 1}, {Key: "date", Value: 1}},
		Options: options.Index().SetUnique(true),
	})
	return err
}

func (d *DB) Close(ctx context.Context) error {
	return d.client.Disconnect(ctx)
}
