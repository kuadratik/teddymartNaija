import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Grid, Pagination} from 'swiper/modules'
import AdvertCardSkeleton from './AdvertCardSkeleton'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'

interface NewAdvertSwiperSkeletonProps {
  count?: number
}

const NewAdvertSwiperSkeleton = ({count = 6}: NewAdvertSwiperSkeletonProps) => {
  return (
    <div className="swiper-container-with-custom-pagination">
      <Swiper
        slidesPerView={3}
        grid={{
          rows: 3,
          fill: 'row'
        }}
        spaceBetween={20}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            grid: {
              rows: 1
            }
          },
          640: {
            slidesPerView: 2,
            grid: {
              rows: 2
            }
          },
          1024: {
            slidesPerView: 3,
            grid: {
              rows: 2
            }
          }
        }}
        modules={[Grid, Pagination]}
        className="mySwiper w-full"
      >
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`}>
              <AdvertCardSkeleton />
            </SwiperSlide>
          ))}
      </Swiper>

      <style jsx global>{`
        .swiper-container-with-custom-pagination .swiper-pagination {
          position: relative;
          bottom: -0px !important;
          padding-block: 10px;
        }

        .swiper-container-with-custom-pagination .swiper-pagination-bullet {
          background-color: white;
          border: 1px solid #cccccc;
          opacity: 1;
        }

        .swiper-container-with-custom-pagination .swiper-pagination-bullet-active {
          background-color: #007aff;
          border: 1px solid #007aff;
        }
      `}</style>
    </div>
  )
}

export default NewAdvertSwiperSkeleton
