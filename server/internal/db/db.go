package db

import (
	"context"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Jamnic98/jstimpson/server/internal/config"
)

const (
	ActivitiesCollection   = "activities"
	StravaTokensCollection = "strava_tokens"
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

func (d *DB) Close(ctx context.Context) error {
	return d.client.Disconnect(ctx)
}
