'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'

import { Loader, Thumbnail } from 'components'

interface ProjectGalleryProps {
  screenshotURIs: string[]
  imageDimensions?: { width: number; height: number }
  isBlenderImage?: boolean
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  screenshotURIs,
  imageDimensions = { width: 800, height: 800 },
  isBlenderImage = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!selectedImage) return

    // Pre-check if the image is already cached by the browser
    const img = document.querySelector<HTMLImageElement>(`img[src="${selectedImage}"]`)
    if (img?.complete) {
      setLoading(false) // already cached → skip loader
    } else {
      setLoading(true) // needs to load → show loader
    }
  }, [selectedImage])

  return (
    <>
      {/* Grid Gallery */}
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          isBlenderImage ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
        }`}
      >
        {screenshotURIs.map((screenshotURI, index) => (
          <Thumbnail
            key={index}
            src={screenshotURI}
            alt={`Project screenshot ${index + 1}`}
            width={imageDimensions.width}
            height={imageDimensions.height}
            onClick={() => setSelectedImage(screenshotURI)}
            isWide={isBlenderImage}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/75"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative mx-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loader overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader />
              </div>
            )}

            <Image
              key={selectedImage}
              src={selectedImage}
              alt="Selected project image"
              width={isBlenderImage ? 1280 : imageDimensions.width}
              height={isBlenderImage ? 720 : imageDimensions.height}
              className={`rounded object-cover transition-opacity duration-300 ${
                loading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setLoading(false)}
              priority
            />

            <button
              className="absolute top-4 right-4 cursor-pointer focus:outline-hidden"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              <IoClose className="text-3xl text-white hover:text-orange-600" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
