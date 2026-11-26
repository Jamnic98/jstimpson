package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/lambda"

	"github.com/Jamnic98/jstimpson/server/internal/api"
	"github.com/Jamnic98/jstimpson/server/internal/config"
	"github.com/Jamnic98/jstimpson/server/internal/db"
)

func main() {
	cfg := config.Load()
	d, err := db.Get()
	if err != nil {
		slog.Error("failed to create MongoDB client", "error", err)
		os.Exit(1)
	}
	a := api.New(d, cfg)

	// Outside Lambda (local dev / docker-compose) serve plain HTTP on PORT.
	if os.Getenv("AWS_LAMBDA_RUNTIME_API") == "" {
		addr := ":" + cfg.Port
		slog.Info("starting local HTTP server", "addr", addr)
		if err := http.ListenAndServe(addr, a.Handler()); err != nil {
			slog.Error("HTTP server failed", "error", err)
			os.Exit(1)
		}
		return
	}

	lambda.Start(a.LambdaHandler)
}
