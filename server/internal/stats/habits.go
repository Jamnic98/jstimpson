package stats

import (
	"sort"
	"time"

	"github.com/Jamnic98/jstimpson/server/internal/models"
)

type HabitSummary struct {
	Habit          models.Habit `json:"habit"`
	StreakDays     int          `json:"streak_days"`
	DoneTotal      int          `json:"done_total"`
	DoneDaysLast7  int          `json:"done_days_last_7"`
	DoneDaysLast30 int          `json:"done_days_last_30"`
	ScheduledLast7 int          `json:"scheduled_last_7"`
	WeeklyPct      float64      `json:"weekly_pct"`  // done / scheduled, current week (Mon-Sun)
	MonthlyPct     float64      `json:"monthly_pct"` // done / scheduled, current month
}

var weekdayNames = map[time.Weekday]string{
	time.Monday: "mon", time.Tuesday: "tue", time.Wednesday: "wed", time.Thursday: "thu",
	time.Friday: "fri", time.Saturday: "sat", time.Sunday: "sun",
}

func isDoneStatus(s models.CheckinStatus) bool {
	return s == models.CheckinDone || s == models.CheckinDoneUnverified
}

// scheduledDays counts days in [from, to] whose weekday is in the habit schedule.
// An empty schedule means "every day".
func scheduledDays(h models.Habit, from, to time.Time) int {
	count := 0
	for d := from; !d.After(to); d = d.AddDate(0, 0, 1) {
		if len(h.Schedule) == 0 || contains(h.Schedule, weekdayNames[d.Weekday()]) {
			count++
		}
	}
	return count
}

func contains(list []string, v string) bool {
	for _, x := range list {
		if x == v {
			return true
		}
	}
	return false
}

func doneDaySet(checkins []models.Checkin, verifiedOnly bool) map[string]bool {
	set := map[string]bool{}
	for _, c := range checkins {
		if !isDoneStatus(c.Status) {
			continue
		}
		if verifiedOnly && !c.Verified {
			continue
		}
		set[c.Date] = true
	}
	return set
}

// SummarizeHabits computes per-habit streaks and completion percentages.
// verifiedOnly restricts "done" to externally verified check-ins.
func SummarizeHabits(habits []models.Habit, checkins []models.Checkin, verifiedOnly bool, now time.Time) []HabitSummary {
	today := todayUTC(now)
	weekStart := weekStart(today)
	monthStart := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, time.UTC)

	byHabit := map[string][]models.Checkin{} // habit id hex -> checkins
	for _, c := range checkins {
		byHabit[c.HabitID.Hex()] = append(byHabit[c.HabitID.Hex()], c)
	}

	out := make([]HabitSummary, 0, len(habits))
	for _, h := range habits {
		cs := byHabit[h.ID.Hex()]
		done := doneDaySet(cs, verifiedOnly)

		keys := make([]string, 0, len(done))
		for k := range done {
			keys = append(keys, k)
		}
		sort.Strings(keys)

		doneTotal := len(keys)
		done7 := activeDays(keys, today.AddDate(0, 0, -6), today)
		done30 := activeDays(keys, today.AddDate(0, 0, -29), today)

		sched7 := scheduledDays(h, today.AddDate(0, 0, -6), today)
		schedWeek := scheduledDays(h, weekStart, today)
		schedMonth := scheduledDays(h, monthStart, today)

		out = append(out, HabitSummary{
			Habit:          h,
			StreakDays:     currentStreak(keys, now),
			DoneTotal:      doneTotal,
			DoneDaysLast7:  done7,
			DoneDaysLast30: done30,
			ScheduledLast7: sched7,
			WeeklyPct:      pct(doneTotalInRange(keys, weekStart, today), schedWeek),
			MonthlyPct:     pct(doneTotalInRange(keys, monthStart, today), schedMonth),
		})
	}
	return out
}

func doneTotalInRange(dayKeys []string, from, to time.Time) int {
	return activeDays(dayKeys, from, to)
}

func pct(done, scheduled int) float64 {
	if scheduled == 0 {
		return 0
	}
	return float64(done) / float64(scheduled) * 100
}
