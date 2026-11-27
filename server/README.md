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

Environment variables: `DB_URI`, `DB_NAME`, `PORT`, `API_KEY`, `STRAVA_CLIENT_ID`,
`STRAVA_CLIENT_SECRET`, `STRAVA_LOOKBACK_DAYS`, `REQUEST_TIMEOUT_SECONDS`.

### API authentication

All endpoints except `GET /health` (and CORS preflights) require an
`x-api-key` header matching `API_KEY`. The website sends it server-side
(`SERVER_API_KEY` on Vercel), so it is never exposed to the browser. An empty
`API_KEY` disables auth — only for local dev; Lambda always has it set.

### Gated logs pages (client)

The Next.js client gates `/logs/*` behind an access token: `src/middleware.ts`
checks the `logs_session` cookie against `LOGS_ACCESS_TOKEN` (Vercel env var)
and redirects to `/logs-gate`, which sets the cookie via `POST /api/logs-gate`.
Public pages must not link to `/logs/*`.

## Tests

```sh
make test
make vet
```

## Deploy (SAM)

```sh
make build          # cross-compiles bin/api/bootstrap and bin/activities-updater/bootstrap
sam build
sam deploy --guided
```

Requires the SAM parameters `StravaClientId`, `StravaClientSecret`, `DbName`, `DbUri`.

### Go version: 1.26+
