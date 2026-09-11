import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import ProductDetailsView from '@/components/Vendor/components/Product/ProductDetailsView'
import {Icon} from '@iconify/react'
import {Layout} from 'antd'
import React, {useRef, useState} from 'react'
import {Navigation} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Swiper as SwiperCore} from 'swiper/types' // Import Swiper types

const productInfo = [
  {id: 1, image: '/assets/shirt_1.png'},
  {id: 2, image: '/assets/shirt_2.png'},
  {id: 3, image: '/assets/shirt_3.png'},
  {id: 4, image: '/assets/shirt_1.png'}
]

const {Content} = Layout

const ProductDetails = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0) // State to track the active index

  // Function to handle slide change
  const handleSlideChange = (swiper: SwiperCore): void => {
    console.log(productInfo[swiper.activeIndex])
    setActiveIndex(swiper.activeIndex) // Update the active index
  }
  // Create a ref for the Swiper instance
  const swiperRef = useRef<SwiperCore | null>(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index) // Go to the desired slide
    }
  }

  return (
    <div>
      {' '}
      <DashboardHeader btnText="Back" titleHeader="Product Details" showInput={false} />
      <Content className="mt-[47px] rounded-md bg-white p-[18px] text-[#000]">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-shrink-0 lg:w-[400px]">
            <div className="relative w-full">
              <div
                ref={prevRef}
                className="swiper-button-disabled absolute left-3 top-[45%] z-10 -translate-y-1/2 cursor-pointer rounded-[4px] bg-[#CAE3FF] p-1 transition"
              >
                <Icon icon="tabler:chevron-left" width={24} className="text-[#216FC7]" height={24} />
              </div>
              <div
                ref={nextRef}
                className="swiper-button-disabled absolute right-3 top-[45%] z-10 -translate-y-1/2 cursor-pointer rounded-[4px] bg-[#CAE3FF] p-1 transition"
              >
                <Icon icon="tabler:chevron-right" className="text-[#216FC7]" width={24} height={24} />
              </div>
              <Swiper
                onSlideChange={handleSlideChange}
                breakpoints={{
                  320: {
                    slidesPerView: 1
                  },
                  640: {
                    slidesPerView: 1
                  },
                  768: {
                    slidesPerView: 1
                  },
                  1200: {
                    slidesPerView: 1
                  }
                }}
                spaceBetween={20}
                onSwiper={swiper => (swiperRef.current = swiper)}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current
                }}
                onBeforeInit={swiper => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = prevRef.current
                  // @ts-ignore
                  swiper.params.navigation.nextEl = nextRef.current
                }}
                modules={[Navigation]}
                mousewheel={{forceToAxis: true}} // Enable mousewheel scrolling
                className="mt-[20px] flex h-full !w-full flex-col gap-8 md:grid md:grid-cols-3 md:gap-6"
              >
                {productInfo?.map((listing: any, i: number) => (
                  <SwiperSlide className="w-full" key={i}>
                    <div key={i} className="w-full rounded-[8px] bg-[#F0F4F7]">
                      <div className="h-[400px] min-w-[230px] overflow-hidden rounded-[4px]">
                        <ImageComponent
                          src={listing.image}
                          alt="product-image"
                          className={`rounded-[4px] object-cover`}
                          width={230}
                          height={230}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}{' '}
              </Swiper>
            </div>
            <div className="mt-[10px] grid grid-cols-3 gap-3 md:flex md:gap-2">
              {' '}
              {productInfo?.map((productIn, id) => {
                return (
                  <div key={id} className="flex cursor-pointer gap-2" onClick={() => goToSlide(id)}>
                    <div
                      // @ts-ignore
                      className={`h-[86px] min-w-[94px] overflow-hidden rounded-[8px] border-[1px] border-[#F2F2F2] ${productInfo[activeIndex]?.id == productIn?.id ? 'bg-[#F0F4F7]' : ''}`}
                    >
                      <ImageComponent
                        src={productIn.image}
                        alt="product-image"
                        className={`rounded-[4px] object-cover`}
                        width={94}
                        height={80}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex-[4]">
            <ProductDetailsView />
          </div>
        </div>
      </Content>
    </div>
  )
}

ProductDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default ProductDetails
