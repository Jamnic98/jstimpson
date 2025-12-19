'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import { Card } from 'components'
import { useWidth } from 'utils'
import { type Project } from 'types'

interface ProjectsCarouselProps {
  items: Project[]
}

export const ProjectsCarousel = ({ items }: ProjectsCarouselProps) => {
  const width = useWidth()
  const prevWidth = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const PROJECTS_PER_PAGE = useMemo(() => {
    if (width && width < 640) return 1
    if (width && width < 1024) return 2
    return 4
  }, [width])

  const pages: Project[][] = []
  for (let i = 0; i < items.length; i += PROJECTS_PER_PAGE) {
    pages.push(items.slice(i, i + PROJECTS_PER_PAGE))
  }

  const totalPages = pages.length

  useEffect(() => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const scrollAmount = container.clientWidth * currentPage
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' })
  }, [currentPage, PROJECTS_PER_PAGE])

  useEffect(() => {
    if (!carouselRef.current) return
    const container = carouselRef.current

    if (prevWidth.current !== null && prevWidth.current !== width) {
      const scrollAmount = container.clientWidth * currentPage
      container.scrollLeft = scrollAmount
    }

    prevWidth.current = width
  }, [width, currentPage])

  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(0)
    }
  }, [items.length, totalPages, currentPage])

  if (width == null) return null

  const progressPercent = totalPages > 1 ? (currentPage / (totalPages - 1)) * 100 : 100

  return (
    <div className="mt-2">
      <div ref={carouselRef} className="flex overflow-hidden py-2">
        {pages.map((page, pageIndex) => (
          <div key={pageIndex} className="flex w-full shrink-0 justify-start px-2">
            {page.map((projectData) => (
              <div key={projectData.id} className="w-full px-2 sm:w-1/2 lg:w-1/4">
                <Card
                  title={projectData.title}
                  description={projectData.summary}
                  imageURI={projectData.screenshotURIs[0]}
                  linkURI={`/coding/${projectData.id}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="rounded-full p-2 transition hover:cursor-pointer hover:bg-gray-200 disabled:opacity-30"
        >
          <IoChevronBack className="h-6 w-6 text-gray-700" />
        </button>

        {/* Progress bar */}
        <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-300">
          <div
            className="h-full bg-orange-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-base text-gray-700">
          Showing <span className="font-semibold">{items.length}</span> project
          {items.length !== 1 && 's'} · Page{' '}
          <span className="font-semibold">{currentPage + 1}</span> of{' '}
          <span className="font-semibold">{totalPages}</span>
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="rounded-full p-2 transition hover:cursor-pointer hover:bg-gray-200 disabled:opacity-30"
        >
          <IoChevronForward className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  )
}
