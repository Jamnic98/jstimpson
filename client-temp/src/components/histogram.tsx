'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export interface HistogramProps {
  data: { x: number }[]
  xAxisObj: {
    label: string
    labelOffset: number
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

export const Histogram: React.FC<HistogramProps> = ({ data, xAxisObj, yAxisObj }) => {
  const ref = useRef<SVGSVGElement>(null)

  const margins = { top: 30, right: 30, bottom: 30, left: 30 }
  const width = 400 - margins.left - margins.right
  const height = 200 - margins.top - margins.bottom

  useEffect(() => {
    if (!ref.current) return
    const svgElement = d3.select(ref.current)

    // Clear existing content
    svgElement.selectAll('*').remove()

    // X scale
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x) ?? 1000])
      .range([0, width])

    // Step in km
    const binStepKm = 2.5

    // Max in metres
    const maxX = d3.max(data, (d) => d.x) ?? 0
    const maxXKm = Math.ceil(maxX / 1000)

    // Round up to nearest bin step
    const upperLimitKm = Math.ceil(maxXKm / binStepKm) * binStepKm

    // Generate thresholds in metres
    const thresholds = d3.range(0, upperLimitKm * 1000 + 1, binStepKm * 1000)

    const bins = d3
      .histogram<{ x: number }, number>()
      .value((d) => d.x)
      .domain(x.domain() as [number, number])
      .thresholds(thresholds)(data)

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length) ?? 1])
      .range([height, 0])

    // Draw bars
    svgElement
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.x0!))
      .attr('y', (d) => y(d.length))
      .attr('width', (d) => Math.max(0, x(d.x1!) - x(d.x0!) - 1))
      .attr('height', (d) => height - y(d.length))
      .style('fill', '#f54900')

    // Append X axis
    svgElement
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          // .tickValues(thresholds) // use custom thresholds
          .tickFormat((d) => `${(d as number) / 1000}`)
      )
      .selectAll('text')
      .style('text-anchor', 'middle')
    // .attr('dx', '-.8em')
    // .attr('dy', '.15em')
    // .attr('transform', 'rotate(-60)')

    // X axis label
    svgElement
      .append('text')
      .attr('transform', 'translate(' + width / 2 + ' ,' + (height + margins.top) + ')')
      .style('text-anchor', 'middle')
      .style('font', '0.5em arial')
      .text(xAxisObj.label)

    // Append Y axis
    svgElement.append('g').call(d3.axisLeft(y))

    // Y axis label
    svgElement
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margins.left + yAxisObj.labelOffset)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font', '0.5em arial')
      .text(yAxisObj.label)
  }, [data, xAxisObj, yAxisObj, width, height, margins.left, margins.top])

  return (
    <div id="svgContainer">
      <svg viewBox="-45 -5 400 178" ref={ref} />
    </div>
  )
}
