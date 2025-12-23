import {
  reduceSumFunc,
  getAverageDistanceString,
  getAverageDurationString,
  getFurthestDistanceString,
  getTotalDistanceString,
  getTotalDurationString,
} from 'utils'
import { type ActivityData } from 'types'

interface ActivityStatsProps {
  activityData: ActivityData[]
  type: string
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ activityData, type }) => {
  const distanceList = activityData.map((a) => a.distance)
  const furthestDistanceInMeters = distanceList.length ? Math.max(...distanceList) : 0
  const totalDistanceInMeters = distanceList.length ? distanceList.reduce(reduceSumFunc) : 0

  const durationList = activityData.map((a) => a.moving_time)
  const totalDurationInSeconds = durationList.length ? durationList.reduce(reduceSumFunc) : 0

  const displayType = type === 'Run' ? 'Run' : type === 'Ride' ? 'Ride' : type

  return (
    <ul className="grid list-inside list-disc grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 p-0">
      <li className="text-2xl text-orange-600">
        <span className="text-xl text-gray-950">
          {getTotalDistanceString(totalDistanceInMeters)}
        </span>
      </li>
      <li className="text-2xl text-orange-600">
        <span className="text-xl text-gray-950">
          {getFurthestDistanceString(furthestDistanceInMeters)}
        </span>
      </li>
      <li className="text-2xl text-orange-600">
        <span className="text-xl text-gray-950">
          {getAverageDistanceString(
            distanceList.length ? totalDistanceInMeters / distanceList.length : 0
          )}
        </span>
      </li>
      <li className="text-2xl text-orange-600">
        <span className="text-xl text-gray-950">
          {getTotalDurationString(totalDurationInSeconds)}
        </span>
      </li>
      <li className="text-2xl text-orange-600">
        <span className="text-xl text-gray-950">
          {getAverageDurationString(
            durationList.length ? totalDurationInSeconds / durationList.length : 0
          )}
        </span>
      </li>
      <li className="text-2xl text-orange-600">
        <span className="text-xl text-gray-950">
          {displayType} count: {activityData.length}
        </span>
      </li>
    </ul>
  )
}
