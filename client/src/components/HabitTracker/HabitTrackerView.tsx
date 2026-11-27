'use client'

import { useState } from 'react'

import { GoalProgressList } from './GoalProgressList'
import { Heatmap } from './Heatmap'
import { WeeklyChart } from './WeeklyChart'
import { type ActivitySummary, type GoalProgress } from '@/types'

type ActivityKind = 'running' | 'cycling'

const tabs: { key: ActivityKind; label: string }[] = [
  { key: 'running', label: 'Running' },
  { key: 'cycling', label: 'Cycling' },
]

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{label}</div>
    <div className="mt-1 text-sm text-white">{value}</div>
  </div>
)

export const HabitTrackerView = ({
  summaries,
  goalProgress,
  month,
}: {
  summaries: Record<ActivityKind, ActivitySummary>
  goalProgress: GoalProgress[]
  month: string
}) => {
  const [kind, setKind] = useState<ActivityKind>('running')
  const s = summaries[kind]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-fit rounded-lg border border-neutral-700 bg-neutral-900 p-0.5 font-mono text-[11px] uppercase tracking-widest">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setKind(tab.key)}
            className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${
              kind === tab.key
                ? 'bg-orange-600/20 text-orange-500'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-8">
        <StatCard label="current streak" value={`${s.streak_days} days`} />
        <StatCard label="longest streak" value={`${s.longest_streak_days} days`} />
        <StatCard label="active last 7d" value={String(s.active_days_last_7)} />
        <StatCard label="active last 30d" value={String(s.active_days_last_30)} />
        <StatCard label="total distance" value={`${s.total_distance_km.toFixed(1)} km`} />
        <StatCard label="total time" value={`${s.total_hours.toFixed(1)} h`} />
        <StatCard
          label="all time"
          value={`${s.total_count} ${kind === 'running' ? 'runs' : 'rides'}`}
        />
      </div>

      <section className="rounded-2xl border border-gray-600 bg-neutral-800 p-4">
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
          last 26 weeks
        </h3>
        <Heatmap daily={s.daily} />
      </section>

      <section className="rounded-2xl border border-gray-600 bg-neutral-800 p-4">
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
          weekly distance (km) — last 8 weeks
        </h3>
        <WeeklyChart weekly={s.weekly} />
      </section>

      <section className="rounded-2xl border border-gray-600 bg-neutral-800 p-4">
        <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
          goals — {month}
        </h3>
        <GoalProgressList progress={goalProgress} month={month} />
      </section>
    </div>
  )
}
