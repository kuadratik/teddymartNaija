import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  quality?: number
  setIsLoadingImage: (isLoading: boolean) => void
  isLoadingImage: boolean
  imageId?: string
  enhanceOldImages?: boolean
  aspectRatio?: string // Add aspect ratio control
  objectFit?: 'cover' | 'contain' | 'fill' // Add object fit control
  index?: number // Add index to determine priority loading
}

const ImageComponent = ({
  src,
  alt,
  className,
  width,
  height,
  quality,
  setIsLoadingImage,
  isLoadingImage,
  imageId,
  enhanceOldImages = true,
  aspectRatio = '1/1', // Default square aspect ratio
  objectFit = 'cover', // Default to cover
  index = -1 // Default to -1 if not provided
}: IProps) => {
  const prevSrcRef = useRef(src)
  const [isLowQuality, setIsLowQuality] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  // Use useEffect to set loading initially and when src changes
  useEffect(() => {
    // Only trigger loading state when source actually changes
    if (prevSrcRef.current !== src) {
      setIsLoadingImage(true)
      prevSrcRef.current = src
      setIsLowQuality(false) // Reset quality assessment when source changes
    }

    // Create an image object to preload and track loading
    const img = new window.Image()
    img.src = src

    // When the image loads or errors, set loading to false
    const onLoad = () => {
      setIsLoadingImage(false)

      // Detect if an image might be low quality based on dimensions
      if (enhanceOldImages && img.naturalWidth > 0) {
        const expectedWidth = width || 500
        const ratio = img.naturalWidth / expectedWidth

        // If the natural width is significantly lower than our display width
        // or if the image is unusually small, mark it as low quality
        if (ratio < 0.8 || img.naturalWidth < 200) {
          setIsLowQuality(true)
        }
      }
    }

    const onError = () => setIsLoadingImage(false)

    img.onload = onLoad
    img.onerror = onError

    // Clean up
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, setIsLoadingImage, width, enhanceOldImages])

  // Detect image URL patterns that might indicate older compressed images
  useEffect(() => {
    if (enhanceOldImages) {
      const isOldImagePattern = /\/old_compressed\/|\/pre_march_2025\/|_low\.jpg/i.test(src)
      if (isOldImagePattern) {
        setIsLowQuality(true)
      }
    }
  }, [src, enhanceOldImages])

  // Enhancement styles for low-quality images
  const enhancementStyle: React.CSSProperties =
    isLowQuality && enhanceOldImages
      ? {
          filter: 'contrast(1.08) brightness(1.03) saturate(1.15) blur(0.4px)',
          imageRendering: 'auto' as React.CSSProperties['imageRendering']
        }
      : {}

  // Determine if this image should be prioritized (first two images)
  const shouldPrioritize = index < 2 && index >= 0

  // Container styles for consistent aspect ratio
  const containerStyle = {
    aspectRatio, // CSS aspect ratio
    position: 'relative' as const,
    width: '100%',
    overflow: 'hidden'
  }

  return (
    <div className="relative h-full w-full" style={containerStyle}>
      {/* Placeholder that shows only while loading */}
      {isLoadingImage ? (
        <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-gray-100">
          <img src="/assets/loading_img.png" alt="loading placeholder" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div style={enhancementStyle} className="h-full w-full">
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={alt}
              loading={shouldPrioritize ? undefined : 'lazy'}
              ref={imageRef}
              onError={error => {
                error.currentTarget.src = '/assets/default_banner.jpg'
                setIsLoadingImage(false)
              }}
              priority={shouldPrioritize}
              quality={isLowQuality ? 100 : quality || 80}
              className={twMerge(
                className,
                'mix-blend-darken',
                isLowQuality ? 'enhanced-image' : '',
                `object-${objectFit}` // Apply object-fit from props
              )}
              fill // Use fill mode instead of width/height
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit, // Apply object-fit property directly
                objectPosition: 'center'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageComponent
