package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"github.com/Jamnic98/jstimpson/server/internal/config"
	"github.com/Jamnic98/jstimpson/server/internal/db"
	"github.com/Jamnic98/jstimpson/server/internal/updater"
)

func main() {
	cfg := config.Load()
	d, err := db.Get()
	if err != nil {
		slog.Error("failed to create MongoDB client", "error", err)
		os.Exit(1)
	}
	u := updater.New(d, cfg)

	lambda.Start(func(ctx context.Context, _ events.CloudWatchEvent) (updater.Result, error) {
		return u.Run(ctx), nil
	})
}
