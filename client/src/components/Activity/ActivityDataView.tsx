'use client'
import * as d3 from 'd3'

import { ActivityStats, Histogram, LineGraph, ScatterGraph } from 'components'
import { type ActivityData } from 'types'

interface ActivityDataViewProps {
  activityData: ActivityData[]
  activityType: string
}

export const ActivityDataView = ({ activityData, activityType }: ActivityDataViewProps) => {
  return (
    <>
      <h2 className="mb-0 text-3xl font-semibold">All Time Data</h2>
      <hr className="my-4 border-gray-300" />
      <ActivityStats activityData={activityData} type={activityType} />

      <br />
      <br />

      <h3 className="text-2xl font-semibold">Date / Distance</h3>
      <LineGraph
        data={activityData.map((data) => ({
          x: data.start_date_local,
          y: data.distance / 1000,
        }))}
        xAxisObj={{
          label: 'Date (mm/yy)',
          labelOffset: 15,
          labelFormatter: d3.timeFormat('%m/%y'),
        }}
        yAxisObj={{
          label: 'Distance (km)',
          labelOffset: -10,
        }}
      />

      <br />

      <h3 className="text-2xl font-semibold">Distance / Average Pace</h3>
      <ScatterGraph
        data={activityData.map((data) => {
          const distanceInKm = data.distance / 1000
          return {
            x: distanceInKm,
            y: data.moving_time / 60 / distanceInKm,
            start_date_local: data.start_date_local,
          }
        })}
        xAxisObj={{
          label: 'Distance (km)',
          labelOffset: 0,
        }}
        yAxisObj={{
          label: activityType === 'Running' ? 'Ave. pace (min / km)' : 'Ave. speed (km/h)',
          labelOffset: -15,
          labelFormatter: (value: number) => {
            if (activityType === 'Running') {
              const minutes = Math.floor(value)
              const seconds = Math.round(60 * (value - minutes))
              const secondsStr = seconds < 10 ? `:0${seconds}` : `:${seconds}`
              return minutes + secondsStr
            } else {
              return value.toFixed(1)
            }
          },
        }}
      />

      <br />

      <h3 className="text-2xl font-semibold">Distance / Frequency</h3>
      <Histogram
        data={activityData.map((a) => ({ x: a.distance }))}
        xAxisObj={{
          label: 'Distance (km)',
          labelOffset: 0,
        }}
        yAxisObj={{
          label: 'Frequency',
          labelOffset: -15,
        }}
      />
    </>
  )
}
