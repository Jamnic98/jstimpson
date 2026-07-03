'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoOpenOutline } from 'react-icons/io5'

import { Loader } from '@/components'

const cardImgDimensions = { width: 300, height: 300 }

export interface CardProps {
  title: string
  description: string
  imageURI?: string // now optional — falls back to filename placeholder when absent
  linkURI: string
  tag?: string // e.g. "REACT", "PYTHON" — shown as a mono label under the description
  fileLabel?: string // e.g. "render.png", "alt-world.tsx" — caption over image, or the placeholder text itself when there's no image
  dateRange?: string // placeholder until dateStarted/dateRange exists on Project
  liveURL?: string
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageURI,
  linkURI,
  tag,
  fileLabel,
  liveURL,
}) => {
  const [loading, setLoading] = useState(true)

  return (
    <div
      className="group flex h-full w-full flex-col justify-between overflow-hidden rounded-lg
        border border-neutral-600 bg-neutral-800 transition-colors duration-150
        hover:border-orange-500/40"
    >
      <Link href={linkURI} className="flex grow flex-col">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden">
          {imageURI ? (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                  <Loader />
                </div>
              )}

              <Image
                src={imageURI}
                alt={title}
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  loading ? 'opacity-0' : 'opacity-100'
                }`}
                width={cardImgDimensions.width}
                height={cardImgDimensions.height}
                onLoad={() => setLoading(false)}
              />

              {/* Scrim + filename caption, matches the render/viewport treatment used elsewhere */}
              {fileLabel && !loading && (
                <>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/55 to-transparent" />
                  {/* <span className="absolute bottom-2 left-2.5 font-mono text-[10px] tracking-wide text-white">
                    {fileLabel}
                  </span> */}
                </>
              )}
            </>
          ) : (
            // No screenshots — same treatment as FeaturedProjectCard's filename block,
            // just filling the full aspect-square slot instead of a fixed h-24.
            <div className="flex h-full w-full items-center justify-center bg-[#0B0D0C] px-4">
              <span className="truncate font-mono text-[11px] text-orange-500/80">{fileLabel}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex grow flex-col p-4">
          <div className="mb-1 text-sm font-semibold text-white transition-colors group-hover:text-orange-600">
            {title}
          </div>
          <div className="line-clamp-3 text-xs leading-relaxed text-neutral-300">{description}</div>
        </div>
      </Link>

      {/* Meta row — date placeholder, tag, live link (mirrors FeaturedProjectCard) */}
      <div className="flex items-center justify-between border-t border-neutral-700/60 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {tag && (
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-orange-600">
              {tag}
            </span>
          )}
        </div>
        <div>
          {liveURL && (
            <a
              href={liveURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full px-2.5 py-1
                font-mono text-[10px] uppercase tracking-wide leading-none text-emerald-400
                transition-colors hover:bg-orange-600/20"
            >
              <span>live</span>
              <IoOpenOutline className="h-3 w-3 shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
