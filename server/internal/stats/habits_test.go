package stats

import (
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/Jamnic98/jstimpson/server/internal/models"
)

var habitNow = time.Date(2026, 11, 26, 12, 0, 0, 0, time.UTC) // a Thursday

func mkHabit(id string, schedule []string) models.Habit {
	oid, _ := primitive.ObjectIDFromHex(id)
	return models.Habit{
		ID: oid, Name: "Reading", Schedule: schedule, VerificationSource: "manual", Active: true,
	}
}

func mkCheckin(habitID, date string, status models.CheckinStatus, verified bool) models.Checkin {
	oid, _ := primitive.ObjectIDFromHex(habitID)
	return models.Checkin{HabitID: oid, Date: date, Status: status, Verified: verified}
}

func TestSummarizeHabits(t *testing.T) {
	h := mkHabit("0123456789abcdef01234567", []string{"mon", "wed", "thu"})
	checkins := []models.Checkin{
		mkCheckin(h.ID.Hex(), "2026-11-23", models.CheckinDoneUnverified, false), // Mon
		mkCheckin(h.ID.Hex(), "2026-11-25", models.CheckinDone, true),             // Wed
		mkCheckin(h.ID.Hex(), "2026-11-26", models.CheckinDoneUnverified, false), // Thu (today)
		mkCheckin(h.ID.Hex(), "2026-11-24", models.CheckinMissed, false),          // Tue — not scheduled anyway
	}

	s := SummarizeHabits([]models.Habit{h}, checkins, false, habitNow)
	if len(s) != 1 {
		t.Fatalf("want 1 summary, got %d", len(s))
	}
	sum := s[0]
	if sum.StreakDays != 2 { // Wed + Thu (Tue missed breaks it)
		t.Fatalf("streak = %d, want 2", sum.StreakDays)
	}
	if sum.DoneTotal != 3 {
		t.Fatalf("done total = %d, want 3", sum.DoneTotal)
	}
	// current week Mon 11-23 .. Thu 11-26: scheduled mon,wed,thu = 3, done = 3 → 100%
	if sum.WeeklyPct != 100 {
		t.Fatalf("weekly pct = %v, want 100", sum.WeeklyPct)
	}
	// month Nov: scheduled mon/wed/thu in Nov 1..26: mon: 2,9,16,23 = 4; wed: 4,11,18,25 = 4; thu: 5,12,19,26 = 4 → 12; done = 3 → 25%
	if sum.MonthlyPct != 25 {
		t.Fatalf("monthly pct = %v, want 25", sum.MonthlyPct)
	}

	// verifiedOnly: only Wed counts → streak 1, weekly 1/3 = 33.33
	sv := SummarizeHabits([]models.Habit{h}, checkins, true, habitNow)[0]
	if sv.StreakDays != 1 || sv.DoneTotal != 1 {
		t.Fatalf("verifiedOnly: streak=%d done=%d, want 1/1", sv.StreakDays, sv.DoneTotal)
	}
	if sv.WeeklyPct < 33.33 || sv.WeeklyPct > 33.34 {
		t.Fatalf("verifiedOnly weekly pct = %v, want ~33.33", sv.WeeklyPct)
	}
}

func TestScheduledDaysEmptyScheduleIsEveryDay(t *testing.T) {
	h := mkHabit("0123456789abcdef01234567", nil)
	from := time.Date(2026, 11, 20, 0, 0, 0, 0, time.UTC)
	to := time.Date(2026, 11, 26, 0, 0, 0, 0, time.UTC)
	if got := scheduledDays(h, from, to); got != 7 {
		t.Fatalf("scheduledDays = %d, want 7", got)
	}
}
