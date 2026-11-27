import { type WeekAggregate } from '@/types'

export const WeeklyChart = ({ weekly }: { weekly: WeekAggregate[] }) => {
  const max = Math.max(...weekly.map((w) => w.distance_km), 1)
  const BAR_W = 24
  const GAP = 10
  const HEIGHT = 140
  const width = weekly.length * (BAR_W + GAP)

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${HEIGHT + 24}`}
      className="max-w-full"
      role="img"
      aria-label="Weekly distance, last 8 weeks"
    >
      {weekly.map((w, i) => {
        const h = (w.distance_km / max) * HEIGHT
        return (
          <g key={w.week_start}>
            <rect
              x={i * (BAR_W + GAP)}
              y={HEIGHT - h}
              width={BAR_W}
              height={h}
              rx={3}
              fill="#f97316"
              opacity={w.count ? 0.85 : 0.15}
            >
              <title>{`${w.week_start}: ${w.count} ${
                w.count === 1 ? 'activity' : 'activities'
              }, ${w.distance_km.toFixed(1)} km`}</title>
            </rect>
            <text
              x={i * (BAR_W + GAP) + BAR_W / 2}
              y={HEIGHT + 14}
              textAnchor="middle"
              fontSize="8"
              fill="#737373"
              className="font-mono"
            >
              {w.week_start.slice(5)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
