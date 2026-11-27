import { type GoalProgress } from '@/types'

const unitLabel = (metric: GoalProgress['goal']['metric']) =>
  metric === 'distance_km' ? 'km' : metric === 'time_hours' ? 'h' : 'sessions'

const formatActual = (p: GoalProgress) =>
  p.goal.metric === 'count' ? String(Math.round(p.actual)) : p.actual.toFixed(1)

export const GoalProgressList = ({
  progress,
  month,
}: {
  progress: GoalProgress[]
  month: string
}) => {
  if (!progress.length) {
    return <p className="font-mono text-xs text-neutral-500">no active goals for {month} yet</p>
  }

  return (
    <ul className="flex flex-col gap-4">
      {progress.map((p) => (
        <li key={p.goal.id}>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-neutral-300">{p.goal.name}</span>
            <span className={p.on_track ? 'text-emerald-400' : 'text-orange-500'}>
              {formatActual(p)} / {p.goal.target} {unitLabel(p.goal.metric)} —{' '}
              {p.progress_pct.toFixed(0)}%
            </span>
          </div>
          <div className="mt-1 h-2 rounded bg-neutral-800">
            <div
              className={`h-2 rounded ${p.on_track ? 'bg-emerald-500' : 'bg-orange-600'}`}
              style={{ width: `${Math.min(100, p.progress_pct)}%` }}
            />
          </div>
          <div className="relative mt-1 h-1 rounded bg-neutral-800/60">
            <div
              className="absolute top-0 h-1 w-px bg-neutral-500"
              style={{ left: `${Math.min(100, p.expected_pct)}%` }}
              title={`expected pace at this point in the month: ${p.expected_pct.toFixed(0)}%`}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
