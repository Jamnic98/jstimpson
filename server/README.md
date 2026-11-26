# jstimpson-server (Go)

Backend for my portfolio website, rewritten in Go. Runs on AWS Lambda
(`provided.al2023`, arm64) behind API Gateway, with a scheduled Lambda that
backfills Strava activities into MongoDB Atlas once a day.

## Layout

- `cmd/api` — HTTP API (`GET /health`, `GET /activities?after=&type=`, `GET /runs?after=`).
  Outside Lambda it serves plain HTTP on `PORT` (default 8080) for local dev.
- `cmd/activities-updater` — scheduled Lambda that pulls activities from the
  Strava API (lookback window `STRAVA_LOOKBACK_DAYS`, default 30 days) and
  inserts new ones into MongoDB, deduped by `strava_id`. Failures return a
  500 status so they show up in Lambda error metrics.
- `internal/` — config, MongoDB handle, models, Strava client, API handlers,
  updater logic.

## Local dev

```sh
go run ./cmd/api                 # serves :8080 (docker-compose wires this to ./server)
go run ./cmd/activities-updater  # needs env vars, runs one backfill then exits... (in Lambda it is scheduled)
```

Environment variables: `DB_URI`, `DB_NAME`, `PORT`, `STRAVA_CLIENT_ID`,
`STRAVA_CLIENT_SECRET`, `STRAVA_LOOKBACK_DAYS`, `REQUEST_TIMEOUT_SECONDS`.

## Tests

```sh
make test
make vet
```

## Deploy (SAM)

```sh
sam build           # compiles the Go binaries itself via the Makefile (BuildMethod: makefile)
sam deploy --guided
```

`sam build` invokes `make build-ApiFunction` / `make build-ActivitiesUpdaterFunction`
(see `Makefile`), producing a static `bootstrap` binary per function. No pre-build
step is needed. Requires the SAM parameters `StravaClientId`, `StravaClientSecret`,
`DbName`, `DbUri`. `make build` still works for producing local binaries under `bin/`.

### Go version: 1.26+
