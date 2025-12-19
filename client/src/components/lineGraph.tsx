'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

import { leastSquares } from 'utils'

export interface LineGraphProps {
  data: { x: Date; y: number }[]
  xAxisObj: {
    label: string
    labelOffset: number
    labelFormatter: (d: Date) => string
  }
  yAxisObj: {
    label: string
    labelOffset: number
  }
}

d3.selection.prototype.moveToFront = function () {
  return this.each(() => {
    this.parentNode.appendChild(this)
  })
}

export const LineGraph: React.FC<LineGraphProps> = ({
  data,
  xAxisObj,
  yAxisObj,
}: LineGraphProps) => {
  const ref = useRef<SVGSVGElement>(null)

  const margins = { top: 30, right: 30, bottom: 30, left: 30 }
  const width = 400 - margins.left - margins.right
  const height = 200 - margins.top - margins.bottom

  useEffect(() => {
    if (!ref.current) return
    const svgElement = d3.select(ref.current)
    const x = configureXAxis(svgElement, xAxisObj)
    const y = configureYAxis(svgElement, yAxisObj)

    // extract the x labels for the axis and scale domain
    const xLabels = data
      .sort((a, b) => (new Date(a.x) > new Date(b.x) ? 1 : -1))
      .map((d: { x: Date; y: number }) => new Date(d.x))

    // get the x and y values for least squares
    const xSeries = d3.range(1, xLabels.length + 1)
    const ySeries = data.map((d: { x: Date; y: number }) => d.y)

    const leastSquaresCoeff = leastSquares(xSeries, ySeries)

    // apply the results of the least squares regression
    const x1 = new Date(xLabels[0]).setDate(0)
    const y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1]
    const x2 = xLabels[xLabels.length - 1]
    const y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1]
    const trendData = [[x1, y1, x2, y2]]

    const trendLine = svgElement.selectAll('.trendLine').data(trendData)

    trendLine
      .enter()
      .append('line')
      .attr('class', 'trendLine')
      .attr('x1', (d) => x(d[0]))
      .attr('y1', (d) => y(d[1]))
      .attr('x2', (d) => x(d[2]))
      .attr('y2', (d) => y(d[3]))
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)

    // add data
    svgElement
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: { x: Date; y: number }) => x(new Date(d.x)))
      .attr('cy', (d: { x: Date; y: number }) => y(d.y))
      .attr('r', 0.8)
      .style('fill', '#f54900')
  })

  const configureXAxis = (
    svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    xAxisObj: {
      label: string
      labelOffset: number
      labelFormatter: (d: Date) => string
    }
  ) => {
    const minDate = Math.min(...data.map((d: { x: Date; y: number }) => new Date(d.x).getTime()))

    const x = d3
      .scaleTime()
      .domain([new Date(minDate).setDate(0), Date.now()])
      .range([0, width])

    const xAxis = d3.axisBottom(x)
    xAxis.tickFormat((d) => xAxisObj.labelFormatter(new Date(d as number)))

    svgElement
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.1em')
      .attr('transform', 'rotate(-60)')

    // text label for the x axis
    svgElement
      .append('text')
      .attr(
        'transform',
        'translate(' + width / 2 + ' ,' + (height + margins.top + xAxisObj.labelOffset) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font', '0.5em arial')
      .text(xAxisObj.label)

    return x
  }

  const configureYAxis = (
    svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    yAxisObj: {
      label: string
      labelOffset: number
    }
  ) => {
    // Add Y axis
    const yDomain = d3.extent(data, (d: { x: Date; y: number }) => d.y)
    const y = d3
      .scaleLinear()
      .domain([Number(yDomain[0]) - 0.1, Number(yDomain[1]) + 0.1])
      .range([height, 0])

    // format the y axis
    const yAxis = d3.axisLeft(y)
    svgElement.append('g').call(yAxis)

    // text label for the y axis
    svgElement
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - height / 2)
      .attr('y', +yAxisObj.labelOffset - margins.left)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font', '0.5em arial')
      .text(yAxisObj.label)

    return y
  }

  return (
    <div id="svgContainer">
      <svg viewBox="-45 -5 400 195" ref={ref} />
    </div>
  )
}
