import {Icon} from '@iconify/react'
import Link from 'next/link'
import React, {ReactNode, useRef, useState} from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import type {SwiperOptions, Swiper as SwiperType} from 'swiper/types'
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
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  breakpoints?: SwiperOptions['breakpoints']
  loop?: boolean
  allowTouchMove?: boolean
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
  seeAllLinkHref = '/',
  slidesPerView = 4,
  spaceBetween = 16,
  breakpoints = {
    320: {
      slidesPerView: 1.1,
      spaceBetween: 16
    },
    370: {
      slidesPerView: 1.2,
      spaceBetween: 16
    },
    400: {
      slidesPerView: 1.3,
      spaceBetween: 16
    },
    450: {
      slidesPerView: 1.5,
      spaceBetween: 16
    },
    540: {
      slidesPerView: 1.7,
      spaceBetween: 16
    },
    640: {
      slidesPerView: 2.2,
      spaceBetween: 15
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 20
    },
    1024: {
      slidesPerView: 3.1,
      spaceBetween: 25
    }, 
    1280: {
      slidesPerView: 4,
      spaceBetween: 30
    }
  },
  loop = false,
  allowTouchMove = true
}: CarouselProps<T>) => {
  const swiperInstanceRef = useRef<SwiperType | null>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  // Preserve scrollAmount prop for backwards compatibility with previous API
  void scrollAmount

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperInstanceRef.current = swiper
    setIsAtStart(swiper.isBeginning)
    setIsAtEnd(swiper.isEnd)
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setIsAtStart(swiper.isBeginning)
    setIsAtEnd(swiper.isEnd)
  }

  const scrollLeft = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    swiperInstanceRef.current?.slidePrev()
  }

  const scrollRight = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    swiperInstanceRef.current?.slideNext()
  }

  return (
    <div className={twMerge('my-8', containerClassName)}>
      {title && (
        <div className="mb-3 flex w-full items-center justify-between">
          <h2 className={twMerge('w-full text-center text-lg font-medium lg:text-left lg:text-xl', titleClassName)}>
            {title}
          </h2>
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
              aria-label="Scroll left"
            >
              <Icon icon="akar-icons:arrow-left" width={24} height={24} color="#fff" />
            </button>
            <button
              onClick={scrollRight}
              disabled={isAtEnd}
              className={`invisible absolute -right-5 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white group-hover:visible lg:block ${
                isAtEnd ? 'cursor-not-allowed bg-gray-500' : 'bg-gray-800 hover:bg-gray-600'
              } ${buttonClassName}`}
              aria-label="Scroll right"
            >
              <Icon icon="akar-icons:arrow-right" width={24} height={24} color="#fff" />
            </button>
          </div>
        )}

        <Swiper
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          breakpoints={breakpoints}
          loop={loop}
          allowTouchMove={allowTouchMove}
          className="!overflow-hidden"
        >
          {items?.map((item, index) => (
            <SwiperSlide key={item.id} className="!h-auto w-[200px]">
              {renderItem(item, index)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Carousel
