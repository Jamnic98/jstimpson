'use client'

import * as d3 from 'd3'
import { useState } from 'react'

import { ActivityStats, Histogram, LineGraph, ScatterGraph } from '@/components'
import { type ActivityData } from '@/types'

interface ActivityDataViewProps {
  activityData: ActivityData[]
  activityType: string
}

export const ActivityDataView = ({ activityData, activityType }: ActivityDataViewProps) => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')

  return (
    <>
      <div className="bg-neutral-800 border border-gray-600 rounded-2xl p-4">
        {/* Flex container to align title and toggle inline */}
        <div className="flex items-center justify-between">
          <h2 className="mb-0 text-lg font-semibold">All Time Data</h2>

          {/* Toggle Switch with w-fit to contain width */}
          <div className="flex w-fit bg-neutral-900 rounded-lg border border-gray-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => setUnit('metric')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                unit === 'metric'
                  ? 'bg-orange-800 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              km
            </button>
            <button
              type="button"
              onClick={() => setUnit('imperial')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                unit === 'imperial'
                  ? 'bg-orange-800 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              mi
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-500" />
        <ActivityStats activityData={activityData} unit={unit} />
      </div>

      <br />
      <br />

      <div className="bg-neutral-800 border border-gray-600 rounded-2xl p-4">
        <h3 className="font-semibold">Date / Distance</h3>
        <LineGraph
          data={activityData.map((data) => ({
            x: data.start_date_local,
            y: data.distance / 1000,
          }))}
          xAxisObj={{
            label: 'Date (mm/yy)',
            labelOffset: 10,
            labelFormatter: d3.timeFormat('%m/%y'),
          }}
          yAxisObj={{
            label: 'Distance (km)',
            labelOffset: -5,
          }}
        />
      </div>

      <br />
      <br />

      <div className="bg-neutral-800 border border-gray-600 rounded-2xl p-4">
        <h3 className="font-semibold">Distance / Average Pace</h3>
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
            label: activityType === 'Running' ? 'Ave. pace (min / km)' : 'Ave. pace (km/h)',
            labelOffset: -10,
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
      </div>

      <br />
      <br />

      <div className="bg-neutral-800 border border-gray-600 rounded-2xl p-4">
        <h3 className="font-semibold">Distance / Frequency</h3>
        <Histogram
          data={activityData.map((a) => ({ x: a.distance }))}
          xAxisObj={{
            label: 'Distance (km)',
            labelOffset: 0,
          }}
          yAxisObj={{
            label: 'Frequency',
            labelOffset: -10,
          }}
        />
      </div>
    </>
  )
}
