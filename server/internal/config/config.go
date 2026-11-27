package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	DBURI              string
	DBName             string
	Port               string
	APIKey             string
	StravaClientID     string
	StravaClientSecret string
	StravaLookbackDays int
	RequestTimeout     time.Duration
}

func Load() Config {
	return Config{
		DBURI:              getEnv("DB_URI", "mongodb://localhost:27017"),
		DBName:             getEnv("DB_NAME", "dev_database"),
		Port:               getEnv("PORT", "8080"),
		APIKey:             os.Getenv("API_KEY"),
		StravaClientID:     os.Getenv("STRAVA_CLIENT_ID"),
		StravaClientSecret: os.Getenv("STRAVA_CLIENT_SECRET"),
		StravaLookbackDays: getEnvInt("STRAVA_LOOKBACK_DAYS", 30),
		RequestTimeout:     time.Duration(getEnvInt("REQUEST_TIMEOUT_SECONDS", 10)) * time.Second,
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}
