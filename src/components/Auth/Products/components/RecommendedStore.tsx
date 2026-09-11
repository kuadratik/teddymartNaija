import CustomButton from '@/components/SharedUI/Buttons/Button'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetRecommendedStoresNewQuery, useGetRecommendedStoresQuery} from '@/services/general/general'
import {Icon} from '@iconify/react'
import NextImage from 'next/image'
import {useRouter} from 'next/router'
import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {Autoplay, Mousewheel, Navigation} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

const Reommended = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = JSON.parse(localStorage.getItem('Clip-Uid') || 'null')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const router = useRouter()

  // const {data, isLoading} = useGetRecommendedStoresQuery({
  //   uuid: clipUuid
  // })

  const {data, isLoading} = useGetRecommendedStoresNewQuery({
    uuid: clipUuid,
    country: selectedLanguage.name
  })

  const offers_product = React.useMemo(
    () =>
      data?.data?.data
        ? data?.data?.data?.filter((store: {user: {offers_product: any}}) => store.user.offers_product)
        : [],
    [data?.data?.data]
  )

  const offers_service = React.useMemo(
    () =>
      data?.data?.data
        ? data?.data?.data?.filter((store: {user: {offers_service: any}}) => store.user.offers_service)
        : [],
    [data?.data?.data]
  )

  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const prevRef = useRef(null)
  const nextRef = useRef(null)

  // Ensure navigation is updated after Swiper initialization
  useEffect(() => {
    if (swiperInstance && swiperInstance.navigation) {
      swiperInstance.navigation.update()
    }
  }, [swiperInstance])
  return (
    <div className="mt-[25px] px-4 lg:px-0">
      {' '}
      <TextComponent as="p" className="text-base font-bold leading-[24px] lg:text-[18px]">
        {(type === 'product' ? offers_product : offers_service)?.length > 0 ? `Stores Recommended for You` : ''}
      </TextComponent>
      <div className="mt-[10px] w-full lg:mt-[30px]">
        {isDesktop ? (
          <>
            {isLoading ? (
              <div className="mt-4 flex h-[239px] w-full flex-row gap-4">
                <div className="grid w-full grid-cols-4 gap-[10px]">
                  {[1, 2, 3, 4].map(item => {
                    return <div key={item} className="h-full w-full animate-pulse rounded-[9px] bg-gray-300" />
                  })}
                </div>
              </div>
            ) : (
              (type === 'product' ? offers_product : offers_service)?.length > 0 && (
                <div className="relative mt-4 w-full">
                  {/* <div
                    ref={prevRef}
                    className="swiper-button-disabled absolute -left-2 top-1/3 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                  >
                    <Icon icon="tabler:chevron-left" width={24} height={24} />
                  </div>
                  <div
                    ref={nextRef}
                    className="swiper-button-disabled absolute right-0 top-1/3 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                  >
                    <Icon icon="tabler:chevron-right" width={24} height={24} />
                  </div> */}
                  <Swiper
                    breakpoints={{
                      320: {
                        slidesPerView: 2
                      },
                      640: {
                        slidesPerView: 2
                      },
                      768: {
                        slidesPerView: 3
                      },
                      1200: {
                        slidesPerView: 4
                      }
                    }}
                    spaceBetween={20}
                    onSwiper={swiper => setSwiperInstance(swiper)}
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
                    modules={[Navigation, Mousewheel]}
                    mousewheel={{forceToAxis: true}} // Enable mousewheel scrolling
                    className="mt-[20px]"
                  >
                    <div className="border-800 grid grid-cols-1 border-2">
                      {' '}
                      {(type === 'product' ? offers_product : offers_service)?.map((listing: any, i: number) => (
                        <div
                          onClick={() => {
                            router.push(`/store/${listing.slug}?type=${type}`)
                          }}
                          key={i}
                          className="w-full rounded-[8px] border-[1px] border-solid border-[#EDEDED] bg-white p-[14px]"
                        >
                          <div className="relative h-[170px] w-full overflow-hidden rounded-[9px] hover:opacity-90">
                            <ImageComponent
                              src={
                                listing.banner_path
                                  ? `${process.env.imageBaseUrl}/${listing.banner_path}`
                                  : '/assets/default_banner.jpg'
                              }
                              alt="Banner-image"
                              width={100}
                              className={`!h-[170px] !rounded-[9px] object-cover`}
                              height={100}
                            />
                          </div>
                          <div className="flex flex-col gap-[14px]">
                            <p className="whitespace-wrap mt-[10px] text-left text-[14px] font-semibold text-[#181A20] underline">
                              {listing.name}
                            </p>

                            <div className="flex items-center justify-between">
                              <CustomButton
                                className="flex h-[27px] w-[89px] cursor-pointer items-center justify-center rounded-[5px] bg-[#000]"
                                onClick={() => {
                                  router.push(`/store/${listing.slug}?type=${type}`)
                                }}
                              >
                                <TextComponent
                                  as="span"
                                  className="whitespace-nowrap text-[12px] font-semibold text-white"
                                >
                                  {type === 'product' ? 'Shop Now' : 'Book Now'}
                                </TextComponent>
                              </CustomButton>

                              <div className="flex items-center gap-5">
                                {/* <Icon icon="line-md:heart" className="h-6 w-6 text-gray-600" /> */}
                                <Icon icon="lucide:share" className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}{' '}
                    </div>
                  </Swiper>
                </div>
              )
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col gap-4">
            <Swiper
              slidesPerView={2}
              spaceBetween={20}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false
              }}
              modules={[Autoplay]}
              pagination={{
                clickable: false
              }}
              className="mt-4 h-full w-full border-2 border-red-800"
            >
              {(type === 'product' ? offers_product : offers_service)?.map((listing: any, i: number) => (
                <SwiperSlide key={i} className="w-full">
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => {
                      router.push(`/store/${listing.slug}?type=${type}`)
                    }}
                  >
                    <NextImage
                      src={`${process.env.imageBaseUrl}/${listing?.banner_path}`}
                      alt="Banner-image"
                      width={100}
                      onLoadStart={() => {
                        setIsLoadingImage(true)
                      }}
                      onError={error => {
                        error.currentTarget.src = '/assets/default_banner.jpg'
                        setIsLoadingImage(false)
                      }}
                      onLoad={() => {
                        setIsLoadingImage(false)
                      }}
                      layout="responsive" // Makes the image responsive // Percentage of the parent width
                      className="!h-[150px] !rounded-[9px] object-cover"
                      height={47}
                    />

                    <div className="flex flex-col gap-4">
                      <p className="whitespace-wrap mt-[10px] text-left text-[14px] font-semibold leading-[19px] text-[#181A20] underline">
                        {listing.name}
                      </p>

                      <div className="flex items-center justify-between">
                        <CustomButton
                          className="flex h-[27px] w-[89px] cursor-pointer items-center justify-center rounded-[5px] bg-[#000]"
                          onClick={() => {
                            router.push(`/store/${listing.slug}?type=${type}`)
                          }}
                        >
                          <TextComponent as="span" className="whitespace-nowrap text-[12px] font-semibold text-white">
                            {type === 'product' ? 'Shop Now' : 'Book Now'}
                          </TextComponent>
                        </CustomButton>

                        <div className="flex items-center gap-5">
                          {/* <Icon icon="line-md:heart" className="h-6 w-6 text-gray-600" /> */}
                          <Icon icon="lucide:share" className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reommended
