import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import CustomerProductDetailsView from '@/components/Store/CustomerProductDetailsView'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetUserStoreListingItemQuery} from '@/services/vendor/vendor'
// import ProductDetailsView from '@/components/Vendor/components/Product/ProductDetailsView'
import {Icon} from '@iconify/react'
import {Layout} from 'antd'
import {useRouter} from 'next/router'
import React, {useRef, useState} from 'react'
import {Navigation} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

import {Swiper as SwiperCore} from 'swiper/types' // Import Swiper types

const productInfo = [
  {id: 1, image: '/assets/shoe.jpeg'},
  {id: 2, image: '/assets/shoe.jpeg'},
  {id: 3, image: '/assets/shoe.jpeg'},
  {id: 4, image: '/assets/shoe.jpeg'}
]

const {Content} = Layout

const ProductDetails = () => {
  const router = useRouter()
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState(null)

  const [currVariant, setCurrVariant] = useState(null)

  const {id} = router.query

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const [activeIndex, setActiveIndex] = useState<number>(0) // State to track the active index

  // Function to handle slide change
  const handleSlideChange = (swiper: SwiperCore): void => {
    // console.log(productInfo[swiper.activeIndex])
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

  const {data: productData, isLoading} = useGetUserStoreListingItemQuery({
    userStore: isActiveUser?.slug!,
    listing: id as string
  })

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div>
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
                className="flex h-full !w-full flex-col gap-8 md:grid md:grid-cols-3 md:gap-6"
              >
                {(currVariant !== null ? productData?.data?.variants[currVariant] : productData?.data)?.images?.map(
                  (listing: any, i: number) => (
                    <SwiperSlide className="w-full" key={i}>
                      <div key={i} className="w-full rounded-[8px] bg-[#F0F4F7]">
                        <div className="h-[350px] min-w-[230px] overflow-hidden rounded-[4px]">
                          <ImageComponent
                            isLoadingImage={isLoadingImage}
                            setIsLoadingImage={setIsLoadingImage}
                            src={`${process.env.imageBaseUrl}/${listing}`}
                            alt="product-image"
                            className={`rounded-[4px] object-cover`}
                            width={500}
                            height={500}
                          />
                          {/* <Image
                        
                          onError={error => {
                            error.currentTarget.src = '/assets/default_banner.jpg'
                          }}
                          src={`${process.env.imageBaseUrl}/${listing}`}
                          alt={'img'}
                          width={230}
                          preview={false}
                          height={350}
                          className="h-full w-full rounded-[4px] object-cover"
                        /> */}
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            </div>
            <div className="mt-[10px] grid grid-cols-3 gap-3 md:flex md:gap-2">
              {(currVariant !== null ? productData?.data?.variants[currVariant] : productData?.data)?.images?.map(
                (productIn: any, id: any) => {
                  return (
                    <div key={id} className="flex cursor-pointer gap-2" onClick={() => goToSlide(id)}>
                      <div
                        // @ts-ignore
                        className={`h-[86px] min-w-[94px] overflow-hidden rounded-[8px] ${activeIndex == id ? 'border-[2px] border-black' : 'border-[1px] border-[#F2F2F2]'}`}
                      >
                        {/* <ImageComponent
                        src={`${process.env.imageBaseUrl}/${productIn}`}
                        alt="product-image"
                        className={`rounded-[4px] object-cover`}
                        width={94}
                        height={86}
                      /> */}
                        <ImageComponent
                          isLoadingImage={isLoadingImage}
                          setIsLoadingImage={setIsLoadingImage}
                          src={`${process.env.imageBaseUrl}/${productIn}`}
                          alt={'img'}
                          width={94}
                          height={86}
                          className="h-full w-full rounded-[4px] object-cover"
                        />
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>
          <div className="flex-[4]">
            {/* <ProductDetailsView data={productData?.data} currVariant={currVariant} setCurrVariant={setCurrVariant} /> */}

            <CustomerProductDetailsView
              selectedVariantId={selectedVariantId}
              setSelectedVariantId={setSelectedVariantId}
              customer={false}
              data={productData?.data}
              currVariant={currVariant}
              setCurrVariant={setCurrVariant}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}

ProductDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout maxWidth={true}>{page}</VendorNewLayout>
}

export default ProductDetails
