package updater

import (
	"testing"
	"time"

	"github.com/Jamnic98/jstimpson/server/internal/models"
)

func TestFilterNew(t *testing.T) {
	when := time.Date(2026, 1, 10, 7, 0, 0, 0, time.UTC)

	activities := []models.Activity{
		{StravaID: "1", StartDateLocal: &when},                          // existing by id
		{StravaID: "2", StartDateLocal: ptrTime(when.Add(time.Hour))},   // existing by date only
		{StravaID: "3", StartDateLocal: ptrTime(when.Add(2 * time.Hour))}, // new
		{StravaID: "", StartDateLocal: ptrTime(when.Add(3 * time.Hour))},  // new, no id
	}

	got := filterNew(activities,
		map[string]bool{"1": true},
		map[int64]bool{when.Add(time.Hour).Unix(): true},
	)

	if len(got) != 2 {
		t.Fatalf("expected 2 new activities, got %d", len(got))
	}
	if got[0].StravaID != "3" || got[1].StravaID != "" {
		t.Fatalf("unexpected activities kept: %+v", got)
	}
}

func ptrTime(t time.Time) *time.Time { return &t }
