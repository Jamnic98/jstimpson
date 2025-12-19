import {
  reduceSumFunc,
  getAverageDistanceString,
  getAverageDurationString,
  getFurthestDistanceString,
  getTotalDistanceString,
  getTotalDurationString,
} from 'utils'
import { type RunData } from 'types'

interface RunningStatsProps {
  runData: RunData[]
}

export const RunningStats: React.FC<RunningStatsProps> = ({ runData }) => {
  // distance
  const distanceList = runData.map((runData: RunData) => runData.distance)
  const furthestDistanceInMeters = distanceList.length ? Math.max(...distanceList) : 0
  const totalDistanceInMeters = distanceList.length
    ? distanceList.reduce((a, b) => reduceSumFunc(a, b))
    : 0

  // duration
  const durationList = runData.map((runData: RunData) => runData.duration)
  const totalDurationInSeconds = durationList.length
    ? durationList.reduce((a, b) => reduceSumFunc(a, b))
    : 0

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
        <span className="text-xl text-gray-950">Run count: {runData.length}</span>
      </li>
    </ul>
  )
}
