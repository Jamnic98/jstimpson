package stats

import (
	"sort"
	"time"

	"github.com/Jamnic98/jstimpson/server/internal/models"
)

type DayAggregate struct {
	Date       string  `json:"date"` // YYYY-MM-DD
	Count      int     `json:"count"`
	DistanceKm float64 `json:"distance_km"`
	Hours      float64 `json:"hours"`
}

type WeekAggregate struct {
	WeekStart  string  `json:"week_start"` // Monday, YYYY-MM-DD
	Count      int     `json:"count"`
	DistanceKm float64 `json:"distance_km"`
}

type MonthAggregate struct {
	Month      string  `json:"month"` // YYYY-MM
	Count      int     `json:"count"`
	DistanceKm float64 `json:"distance_km"`
}

type Summary struct {
	Type              string           `json:"type"`
	TotalCount        int              `json:"total_count"`
	TotalDistanceKm   float64          `json:"total_distance_km"`
	TotalHours        float64          `json:"total_hours"`
	StreakDays        int              `json:"streak_days"`
	LongestStreakDays int              `json:"longest_streak_days"`
	ActiveDaysLast7   int              `json:"active_days_last_7"`
	ActiveDaysLast30  int              `json:"active_days_last_30"`
	Daily             []DayAggregate   `json:"daily"`   // trailing 182 days, incl. zero days
	Weekly            []WeekAggregate  `json:"weekly"`  // trailing 8 weeks
	Monthly           []MonthAggregate `json:"monthly"` // trailing 6 months
	LastActivity      *time.Time       `json:"last_activity,omitempty"`
}

type GoalProgress struct {
	Goal         models.Goal `json:"goal"`
	Actual       float64     `json:"actual"`
	ProgressPct  float64     `json:"progress_pct"`
	ExpectedPct  float64     `json:"expected_pct"` // linear pace for this point in the month
	OnTrack      bool        `json:"on_track"`
}

func dayKey(t time.Time) string  { return t.Format("2006-01-02") }
func monthKey(t time.Time) string { return t.Format("2006-01") }

func weekStart(t time.Time) time.Time {
	wd := (int(t.Weekday()) + 6) % 7 // Monday = 0
	return time.Date(t.Year(), t.Month(), t.Day()-wd, 0, 0, 0, 0, time.UTC)
}

func todayUTC(now time.Time) time.Time {
	return time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
}

// FilterByType returns activities of the given sport type, sorted by start time.
func FilterByType(activities []models.Activity, sportType string) []models.Activity {
	out := make([]models.Activity, 0, len(activities))
	for _, a := range activities {
		if a.StartDateLocal == nil {
			continue
		}
		if sportType != "any" && a.SportType != sportType {
			continue
		}
		out = append(out, a)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].StartDateLocal.Before(*out[j].StartDateLocal) })
	return out
}

// Summarize aggregates activities into streaks, active-day counts and
// daily/weekly/monthly series. now is injected for testability.
func Summarize(activities []models.Activity, sportType string, now time.Time) Summary {
	acts := FilterByType(activities, sportType)
	s := Summary{
		Type:    sportType,
		Daily:   []DayAggregate{},
		Weekly:  []WeekAggregate{},
		Monthly: []MonthAggregate{},
	}
	dayAgg := map[string]*DayAggregate{}
	for _, a := range acts {
		start := *a.StartDateLocal
		s.TotalCount++
		if a.Distance != nil {
			s.TotalDistanceKm += *a.Distance / 1000
		}
		if a.MovingTime != nil {
			s.TotalHours += float64(*a.MovingTime) / 3600
		}
		k := dayKey(start)
		d := dayAgg[k]
		if d == nil {
			d = &DayAggregate{Date: k}
			dayAgg[k] = d
		}
		d.Count++
		if a.Distance != nil {
			d.DistanceKm += *a.Distance / 1000
		}
		if a.MovingTime != nil {
			d.Hours += float64(*a.MovingTime) / 3600
		}
		s.LastActivity = &start
	}

	dayKeys := make([]string, 0, len(dayAgg))
	for k := range dayAgg {
		dayKeys = append(dayKeys, k)
	}
	sort.Strings(dayKeys)

	s.StreakDays = currentStreak(dayKeys, now)
	s.LongestStreakDays = longestStreak(dayKeys)

	today := todayUTC(now)
	s.ActiveDaysLast7 = activeDays(dayKeys, today.AddDate(0, 0, -6), today)
	s.ActiveDaysLast30 = activeDays(dayKeys, today.AddDate(0, 0, -29), today)

	// daily series: trailing 182 days including zero days (for heatmaps)
	for i := 181; i >= 0; i-- {
		d := today.AddDate(0, 0, -i)
		k := dayKey(d)
		if agg := dayAgg[k]; agg != nil {
			s.Daily = append(s.Daily, *agg)
		} else {
			s.Daily = append(s.Daily, DayAggregate{Date: k})
		}
	}

	// weekly series: trailing 8 weeks (Monday starts)
	weekAgg := map[string]*WeekAggregate{}
	for _, k := range dayKeys {
		t, err := time.Parse("2006-01-02", k)
		if err != nil {
			continue
		}
		ws := dayKey(weekStart(t))
		w := weekAgg[ws]
		if w == nil {
			w = &WeekAggregate{WeekStart: ws}
			weekAgg[ws] = w
		}
		d := dayAgg[k]
		w.Count += d.Count
		w.DistanceKm += d.DistanceKm
	}
	wsNow := weekStart(today)
	for i := 7; i >= 0; i-- {
		ws := dayKey(wsNow.AddDate(0, 0, -7*i))
		if agg := weekAgg[ws]; agg != nil {
			s.Weekly = append(s.Weekly, *agg)
		} else {
			s.Weekly = append(s.Weekly, WeekAggregate{WeekStart: ws})
		}
	}

	// monthly series: trailing 6 months
	monthAgg := map[string]*MonthAggregate{}
	for _, k := range dayKeys {
		t, err := time.Parse("2006-01-02", k)
		if err != nil {
			continue
		}
		mk := monthKey(t)
		m := monthAgg[mk]
		if m == nil {
			m = &MonthAggregate{Month: mk}
			monthAgg[mk] = m
		}
		d := dayAgg[k]
		m.Count += d.Count
		m.DistanceKm += d.DistanceKm
	}
	for i := 5; i >= 0; i-- {
		mk := monthKey(today.AddDate(0, -i, 0))
		if agg := monthAgg[mk]; agg != nil {
			s.Monthly = append(s.Monthly, *agg)
		} else {
			s.Monthly = append(s.Monthly, MonthAggregate{Month: mk})
		}
	}

	return s
}

func currentStreak(dayKeys []string, now time.Time) int {
	if len(dayKeys) == 0 {
		return 0
	}
	set := make(map[string]bool, len(dayKeys))
	for _, k := range dayKeys {
		set[k] = true
	}
	today := todayUTC(now)
	d := today
	if !set[dayKey(d)] {
		d = d.AddDate(0, 0, -1) // today not done yet doesn't break the streak
	}
	streak := 0
	for set[dayKey(d)] {
		streak++
		d = d.AddDate(0, 0, -1)
	}
	return streak
}

func longestStreak(dayKeys []string) int {
	longest := 0
	run := 0
	var prev time.Time
	for i, k := range dayKeys {
		t, err := time.Parse("2006-01-02", k)
		if err != nil {
			continue
		}
		if i > 0 && t.Sub(prev) == 24*time.Hour {
			run++
		} else {
			run = 1
		}
		if run > longest {
			longest = run
		}
		prev = t
	}
	return longest
}

func activeDays(dayKeys []string, from, to time.Time) int {
	count := 0
	for _, k := range dayKeys {
		t, err := time.Parse("2006-01-02", k)
		if err != nil {
			continue
		}
		if !t.Before(from) && !t.After(to) {
			count++
		}
	}
	return count
}

// GoalProgressFor computes actual vs target for a goal's month and whether the
// current linear pace is on track.
func GoalProgressFor(activities []models.Activity, goal models.Goal, now time.Time) GoalProgress {
	acts := FilterByType(activities, goal.Type)
	var actual float64
	for _, a := range acts {
		if a.StartDateLocal == nil || monthKey(*a.StartDateLocal) != goal.Month {
			continue
		}
		switch goal.Metric {
		case "distance_km":
			if a.Distance != nil {
				actual += *a.Distance / 1000
			}
		case "time_hours":
			if a.MovingTime != nil {
				actual += float64(*a.MovingTime) / 3600
			}
		default: // count
			actual++
		}
	}

	pct := 0.0
	if goal.Target > 0 {
		pct = actual / goal.Target * 100
	}

	today := todayUTC(now)
	firstOfMonth := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, time.UTC)
	daysInMonth := time.Date(today.Year(), today.Month()+1, 0, 0, 0, 0, 0, time.UTC).Day()
	elapsed := today.Sub(firstOfMonth).Hours()/24 + 1
	expectedPct := 0.0
	if daysInMonth > 0 {
		expectedPct = elapsed / float64(daysInMonth) * 100
	}

	return GoalProgress{
		Goal:        goal,
		Actual:      actual,
		ProgressPct: pct,
		ExpectedPct: expectedPct,
		OnTrack:     pct >= expectedPct,
	}
}
