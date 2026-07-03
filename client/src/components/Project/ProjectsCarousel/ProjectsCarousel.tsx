'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import { Card } from '@/components'
import { useWidth } from '@/utils'
import { extMap } from '@/utils/constants'
import { LinkType, type Project } from '@/types'

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

  // zero-padded, matches PAGE 01 / 04 from the spec rather than PAGE 1 / 4
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div>
      <div ref={carouselRef} className="flex overflow-hidden">
        {pages.map((page, pageIndex) => (
          <div key={pageIndex} className="flex w-full shrink-0 justify-start px-2 py-6">
            {page.map((projectData) => (
              <div key={projectData.id} className="w-full px-2 sm:w-1/2 lg:w-1/4">
                <Card
                  title={projectData.title}
                  description={projectData.summary}
                  imageURI={projectData.screenshotURIs[0]}
                  linkURI={`/coding/${projectData.id}`}
                  tag={projectData.mainLanguage[0]}
                  fileLabel={`${projectData.id}.${extMap[projectData.mainLanguage[0]] ?? 'tsx'}`}
                  liveURL={projectData.links?.find((link) => link.type === LinkType.LIVE)?.URL}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 font-mono text-[11px] text-neutral-500">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300
            transition-colors hover:border-orange-500 hover:text-orange-600 disabled:opacity-30
            disabled:hover:border-neutral-300 disabled:hover:text-neutral-500 cursor-pointer"
        >
          <IoChevronBack className="h-3.5 w-3.5" />
        </button>

        <span className="uppercase tracking-[0.08em]">
          page {pad(currentPage + 1)} / {pad(totalPages)}
          <span className="mx-2 text-neutral-300">·</span>
          {items.length} project{items.length !== 1 && 's'}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300
            transition-colors hover:border-orange-500 hover:text-orange-600 disabled:opacity-30
            disabled:hover:border-neutral-300 disabled:hover:text-neutral-500 cursor-pointer"
        >
          <IoChevronForward className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
