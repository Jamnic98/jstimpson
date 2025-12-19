'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Loader } from 'components'

interface ThumbnailProps {
  src: string
  alt: string
  width: number
  height: number
  onClick?: () => void
  isWide?: boolean // 👈 new
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  src,
  alt,
  width,
  height,
  onClick,
  isWide = false,
}) => {
  const [loading, setLoading] = useState(true)

  return (
    <div
      className={`relative w-full cursor-pointer rounded shadow-md transition-transform hover:scale-[103%] ${
        isWide ? 'aspect-video' : 'aspect-square'
      }`}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <Loader />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`h-full w-full rounded object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
      />
    </div>
  )
}
