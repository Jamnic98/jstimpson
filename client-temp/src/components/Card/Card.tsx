'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Loader } from 'components'

const cardImgDimensions = { width: 300, height: 300 }

export interface CardProps {
  title: string
  description: string
  imageURI: string
  linkURI: string
}

export const Card: React.FC<CardProps> = ({ title, description, imageURI, linkURI }) => {
  const [loading, setLoading] = useState(true)

  return (
    <Link
      href={linkURI}
      className="group flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded bg-neutral-50 shadow transition-all duration-200 hover:scale-[103%] hover:shadow-lg"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden">
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
      </div>

      {/* Content */}
      <div className="flex grow flex-col p-4">
        <div className="mb-2 text-2xl font-medium text-orange-600 group-hover:text-gray-900">
          {title}
        </div>
        <div className="line-clamp-3 text-xl">{description}</div>
      </div>
    </Link>
  )
}
