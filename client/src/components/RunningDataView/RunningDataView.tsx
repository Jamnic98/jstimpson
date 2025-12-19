'use client'
import * as d3 from 'd3'

import { Histogram, LineGraph, RunningStats, ScatterGraph } from 'components'
import { type RunData } from 'types'

interface RunningDataViewProps {
  runData: RunData[]
}

export const RunningDataView = ({ runData }: RunningDataViewProps) => (
  <>
    <h2 className="mb-0 text-3xl font-semibold">All Time Data</h2>
    <hr className="my-4 border-gray-300" />
    <RunningStats runData={runData} />

    {/* TODO: Remove */}
    <br />
    <br />

    <h3 className="text-2xl font-semibold">Date / Distance:</h3>
    <LineGraph
      data={runData?.map((data: RunData) => {
        const { start_date_local, distance } = data
        return {
          x: start_date_local,
          y: distance / 1000,
        }
      })}
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

    {/* TODO: Remove */}
    <br />

    <h3 className="text-2xl font-semibold">Distance / Average Pace:</h3>
    <ScatterGraph
      data={runData?.map((data: RunData) => {
        const { distance, duration, start_date_local } = data
        const distanceInKm = distance / 1000
        return {
          x: distanceInKm,
          y: duration / 60 / distanceInKm,
          start_date_local,
        }
      })}
      xAxisObj={{
        label: 'Distance (km)',
        labelOffset: 0,
      }}
      yAxisObj={{
        label: 'Ave. pace (min / km)',
        labelOffset: -15,
        labelFormatter: (data: number) => {
          const minutes = Math.floor(data)
          const seconds = Number((60 * (data - Math.floor(data))).toFixed(0))
          const secondsStr = seconds === 0 ? `:${seconds}0` : `:${seconds}`
          return minutes + secondsStr
        },
      }}
    />

    {/* TODO: Remove */}
    <br />

    <h3 className="text-2xl font-semibold">Distance / Frequency:</h3>
    <Histogram
      data={runData.map((run) => ({ x: run.distance }))}
      xAxisObj={{
        label: 'Distance (km)',
        labelOffset: 0,
      }}
      yAxisObj={{
        label: 'Frequency',
        labelOffset: -15,
        // labelFormatter: (data: number) => {
        //   const minutes = Math.floor(data)
        //   const seconds = Number((60 * (data - Math.floor(data))).toFixed(0))
        //   const secondsStr = seconds === 0 ? `:${seconds}0` : `:${seconds}`
        //   return minutes + secondsStr
        // },
      }}
    />
  </>
)
