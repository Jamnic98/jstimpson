# Build Stage
FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/api ./cmd/api

# Production Stage
FROM alpine:3.21

RUN adduser -D appuser
USER appuser

COPY --from=builder /out/api /usr/local/bin/api

EXPOSE 8080

CMD ["api"]
