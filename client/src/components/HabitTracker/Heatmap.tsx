import { type DayAggregate } from '@/types'

const CELL = 12
const GAP = 3
const WEEKS = 26

export const Heatmap = ({ daily }: { daily: DayAggregate[] }) => {
  const byDate = new Map(daily.map((d) => [d.date, d]))
  const last = daily[daily.length - 1]
  const lastDate = new Date(`${last.date}T00:00:00Z`)
  const monday = new Date(lastDate)
  monday.setUTCDate(lastDate.getUTCDate() - ((lastDate.getUTCDay() + 6) % 7))

  const cells = []
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(monday)
      date.setUTCDate(monday.getUTCDate() + w * 7 + d)
      const key = date.toISOString().slice(0, 10)
      const agg = byDate.get(key)
      const count = agg?.count ?? 0
      const level = count === 0 ? 0 : Math.min(4, count)
      const fill = level === 0 ? '#27272a' : `rgba(249, 115, 22, ${0.25 + 0.75 * (level / 4)})`
      cells.push(
        <rect
          key={key}
          x={w * (CELL + GAP)}
          y={d * (CELL + GAP)}
          width={CELL}
          height={CELL}
          rx={2}
          fill={fill}
        >
          <title>{`${key}: ${count} ${count === 1 ? 'activity' : 'activities'}, ${(
            agg?.distance_km ?? 0
          ).toFixed(1)} km`}</title>
        </rect>
      )
    }
  }

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${WEEKS * (CELL + GAP)} ${7 * (CELL + GAP)}`}
      className="max-w-full"
      role="img"
      aria-label="Activity heatmap, last 26 weeks"
    >
      {cells}
    </svg>
  )
}
