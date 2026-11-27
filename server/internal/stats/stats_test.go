package stats

import (
	"testing"
	"time"

	"github.com/Jamnic98/jstimpson/server/internal/models"
)

func ptrFloat(v float64) *float64 { return &v }
func ptrInt(v int64) *int64       { return &v }

func act(sportType, day string, km float64, movingSecs int64) models.Activity {
	t, _ := time.Parse("2006-01-02", day)
	return models.Activity{
		SportType:      sportType,
		StartDateLocal: &t,
		Distance:       ptrFloat(km * 1000),
		MovingTime:     ptrInt(movingSecs),
	}
}

var now = time.Date(2026, 11, 26, 12, 0, 0, 0, time.UTC)

func TestSummarizeStreaks(t *testing.T) {
	acts := []models.Activity{
		act("Run", "2026-11-24", 5, 1800),
		act("Run", "2026-11-25", 5, 1800),
		act("Run", "2026-11-26", 10, 3600), // today
		act("Run", "2026-11-20", 5, 1800),
		act("Run", "2026-11-21", 5, 1800),
		act("Ride", "2026-11-26", 30, 5400), // different type, ignored
	}
	s := Summarize(acts, "Run", now)

	if s.TotalCount != 5 {
		t.Fatalf("total count = %d, want 5", s.TotalCount)
	}
	if s.StreakDays != 3 {
		t.Fatalf("streak = %d, want 3", s.StreakDays)
	}
	if s.LongestStreakDays != 3 {
		t.Fatalf("longest = %d, want 3", s.LongestStreakDays)
	}
	if s.ActiveDaysLast7 != 5 {
		t.Fatalf("active last 7 = %d, want 5 (11-20..11-26 window)", s.ActiveDaysLast7)
	}
	if s.ActiveDaysLast30 != 5 {
		t.Fatalf("active last 30 = %d, want 5", s.ActiveDaysLast30)
	}
	if s.TotalDistanceKm != 30 {
		t.Fatalf("total km = %v, want 30", s.TotalDistanceKm)
	}
	if len(s.Daily) != 182 || len(s.Weekly) != 8 || len(s.Monthly) != 6 {
		t.Fatalf("series lengths wrong: daily=%d weekly=%d monthly=%d", len(s.Daily), len(s.Weekly), len(s.Monthly))
	}
	if s.LastActivity == nil || dayKey(*s.LastActivity) != "2026-11-26" {
		t.Fatalf("last activity wrong: %v", s.LastActivity)
	}
}

func TestSummarizeStreakTodayMissing(t *testing.T) {
	acts := []models.Activity{
		act("Run", "2026-11-24", 5, 1800),
		act("Run", "2026-11-25", 5, 1800),
	}
	s := Summarize(acts, "Run", now) // today 11-26 has no activity
	if s.StreakDays != 2 {
		t.Fatalf("streak = %d, want 2 (today not done yet must not break streak)", s.StreakDays)
	}
}

func TestSummarizeEmpty(t *testing.T) {
	s := Summarize(nil, "Run", now)
	if s.TotalCount != 0 || s.StreakDays != 0 || len(s.Daily) != 182 {
		t.Fatalf("empty summary wrong: %+v", s)
	}
}

func TestGoalProgress(t *testing.T) {
	acts := []models.Activity{
		act("Run", "2026-11-01", 10, 3600),
		act("Run", "2026-11-15", 10, 3600),
		act("Run", "2026-10-31", 50, 18000), // previous month, excluded
	}
	goal := models.Goal{Name: "Nov run", Type: "Run", Metric: "distance_km", Target: 40, Month: "2026-11", Active: true}
	p := GoalProgressFor(acts, goal, now) // 20km of 40 => 50%; day 26/30 elapsed => expected ~86.7%

	if p.Actual != 20 {
		t.Fatalf("actual = %v, want 20", p.Actual)
	}
	if p.ProgressPct != 50 {
		t.Fatalf("pct = %v, want 50", p.ProgressPct)
	}
	if p.OnTrack {
		t.Fatalf("should be off track at 50%% vs %.1f%% expected pace", p.ExpectedPct)
	}

	countGoal := models.Goal{Name: "Nov runs", Type: "Run", Metric: "count", Target: 2, Month: "2026-11"}
	pc := GoalProgressFor(acts, countGoal, now)
	if pc.Actual != 2 || pc.ProgressPct != 100 || !pc.OnTrack {
		t.Fatalf("count goal wrong: %+v", pc)
	}
}
