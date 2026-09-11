import {Icon} from '@iconify/react'
import React, {ReactNode, useRef} from 'react'

interface CarouselProps<T> {
  items: T[] // Generic type for items
  title?: string
  scrollAmount?: number
  containerClassName?: string
  buttonClassName?: string
  renderItem: (item: T, index: number) => ReactNode // Function to render items
  showArrows?: boolean
}

const Carousel = <T extends {id: string | number}>({
  items,
  title,
  scrollAmount = 200,
  containerClassName = '',
  buttonClassName = '',
  renderItem,
  showArrows = true
}: CarouselProps<T>) => {
  const carouselRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className={`my-8 ${containerClassName}`}>
      {title && <h2 className="mb-3 w-full text-center text-xl font-medium lg:text-left">{title}</h2>}
      <div className="relative">
        {showArrows && (
          <>
            <button
              onClick={scrollLeft}
              className={`absolute -left-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-600 lg:block ${buttonClassName}`}
            >
              <Icon icon="akar-icons:arrow-left" width={24} height={24} color="#fff" />
            </button>
            <button
              onClick={scrollRight}
              className={`absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-600 lg:block ${buttonClassName}`}
            >
              <Icon icon="akar-icons:arrow-right" width={24} height={24} color="#fff" />
            </button>
          </>
        )}

        <div ref={carouselRef} className="hide-scrollbar flex gap-4 overflow-x-scroll scroll-smooth lg:p-4">
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
