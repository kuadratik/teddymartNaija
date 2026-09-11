import {Icon} from '@iconify/react'
import Link from 'next/link'
import React, {ReactNode, useEffect, useRef, useState} from 'react'
import {twMerge} from 'tailwind-merge'

interface CarouselProps<T> {
  items: T[] // Generic type for items
  title?: string
  scrollAmount?: number
  containerClassName?: string
  buttonClassName?: string
  renderItem: (item: T, index: number) => ReactNode // Function to render items
  showArrows?: boolean
  titleClassName?: string
  showSeeAllLink?: boolean
  seeAllLinkHref?: string
}

const Carousel = <T extends {id: string | number}>({
  items,
  title,
  scrollAmount = 200,
  containerClassName = '',
  buttonClassName = '',
  renderItem,
  showArrows = true,
  titleClassName = '',
  showSeeAllLink = false,
  seeAllLinkHref = '/'
}: CarouselProps<T>) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const scrollLeft = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (carouselRef.current) {
      carouselRef.current.scrollBy({left: -scrollAmount, behavior: 'smooth'})
    }
  }

  const scrollRight = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (carouselRef.current) {
      carouselRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'})
    }
  }

  const checkScrollPosition = () => {
    const container = carouselRef.current
    if (!container) return

    const {scrollLeft, scrollWidth, clientWidth} = container
    setIsAtStart(scrollLeft <= 0)
    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1)
  }

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return

    // Check initial state
    checkScrollPosition()

    // Add scroll listener
    container.addEventListener('scroll', checkScrollPosition)

    // Window resize can also affect scroll state
    window.addEventListener('resize', checkScrollPosition)

    // Clean up
    return () => {
      container.removeEventListener('scroll', checkScrollPosition)
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [])

  return (
    <div className={twMerge('my-8', containerClassName)}>
      {title && (
        <div className="mb-3 flex w-full items-center justify-between">
          <h2 className={twMerge('w-full text-center lg:text-xl text-lg font-medium lg:text-left', titleClassName)}>{title}</h2>
          {showSeeAllLink && (
            <div className="whitespace-nowrap pr-2">
              <Link href={seeAllLinkHref}>
                <span className="flex items-center gap-1 text-base font-bold underline">
                  See all
                  <Icon icon="ic:round-keyboard-arrow-right" width="24" height="24" />
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
      <div className="group relative">
        {showArrows && !(isAtStart && isAtEnd) && (
          <div className="hidden lg:block">
            <button
              onClick={scrollLeft}
              disabled={isAtStart}
              className={`invisible absolute -left-5 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white group-hover:visible lg:block ${
                isAtStart ? 'cursor-not-allowed bg-gray-500' : 'bg-gray-800 hover:bg-gray-600'
              } ${buttonClassName}`}
            >
              <Icon icon="akar-icons:arrow-left" width={24} height={24} color="#fff" />
            </button>
            <button
              onClick={scrollRight}
              disabled={isAtEnd}
              className={`invisible absolute -right-5 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white group-hover:visible lg:block ${
                isAtEnd ? 'cursor-not-allowed bg-gray-500' : 'bg-gray-800 hover:bg-gray-600'
              } ${buttonClassName}`}
            >
              <Icon icon="akar-icons:arrow-right" width={24} height={24} color="#fff" />
            </button>
          </div>
        )}

        <div ref={carouselRef} className="hide-scrollbar flex gap-4 overflow-x-scroll scroll-smooth">
          {items?.map((item, index) => (
            <div key={item.id} className="flex-shrink-0">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
