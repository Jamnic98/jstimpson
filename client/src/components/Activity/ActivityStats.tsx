import {
  reduceSumFunc,
  getAverageDistanceString,
  getAverageDurationString,
  getFurthestDistanceString,
  getTotalDistanceString,
  getTotalDurationString,
} from '@/utils'
import { type ActivityData } from '@/types'

interface ActivityStatsProps {
  activityData: ActivityData[]
  unit: 'metric' | 'imperial'
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ activityData, unit }) => {
  if (activityData.length === 0) {
    return <p className="font-mono text-xs text-neutral-300 mt-4 ml-4">No activities logged yet</p>
  }

  const distanceList = activityData.map((a) => a.distance)
  const furthestDistanceInMeters = Math.max(...distanceList)
  const totalDistanceInMeters = distanceList.reduce(reduceSumFunc)

  const durationList = activityData.map((a) => a.moving_time)
  const totalDurationInSeconds = durationList.reduce(reduceSumFunc)

  return (
    <ul className="grid list-inside list-disc grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-1 p-0 font-mono">
      <li className="text-emerald-400">
        <span className="text-sm text-gray-400">
          {getTotalDistanceString(totalDistanceInMeters, unit)}
        </span>
      </li>
      <li className="text-emerald-400">
        <span className="text-sm text-gray-400">
          {getFurthestDistanceString(furthestDistanceInMeters, unit)}
        </span>
      </li>
      <li className="text-emerald-400">
        <span className="text-sm text-gray-400">
          {getAverageDistanceString(totalDistanceInMeters / distanceList.length, unit)}
        </span>
      </li>
      <li className="text-emerald-400">
        <span className="text-sm text-gray-400">
          {getTotalDurationString(totalDurationInSeconds)}
        </span>
      </li>
      <li className="text-emerald-400">
        <span className="text-sm text-gray-400">
          {getAverageDurationString(totalDurationInSeconds / durationList.length)}
        </span>
      </li>
      <li className="text-emerald-400">
        <span className="text-sm text-gray-400">Activity count: {activityData.length}</span>
      </li>
    </ul>
  )
}
