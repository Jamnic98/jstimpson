export type DayAggregate = {
  date: string
  count: number
  distance_km: number
  hours: number
}

export type WeekAggregate = {
  week_start: string
  count: number
  distance_km: number
}

export type MonthAggregate = {
  month: string
  count: number
  distance_km: number
}

export type ActivitySummary = {
  type: string
  total_count: number
  total_distance_km: number
  total_hours: number
  streak_days: number
  longest_streak_days: number
  active_days_last_7: number
  active_days_last_30: number
  daily: DayAggregate[]
  weekly: WeekAggregate[]
  monthly: MonthAggregate[]
  last_activity?: string
}

export type Goal = {
  id: string
  name: string
  type: string
  metric: 'distance_km' | 'count' | 'time_hours'
  target: number
  month: string
  active: boolean
}

export type GoalProgress = {
  goal: Goal
  actual: number
  progress_pct: number
  expected_pct: number
  on_track: boolean
}
