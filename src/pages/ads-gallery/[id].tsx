import {MainWrapper} from '@/components/Auth/Products'
import AlsoLikeComponent from '@/components/Auth/Products/components/AlsoLike'
import CustomerHeader from '@/components/Auth/Products/components/CustomerHeader'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import AdsInfo from '@/components/Customer/Advert/AdsInfo'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import VideoView from '@/components/SharedUI/VideoView'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Layout} from 'antd'
import axios from 'axios'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {Navigation} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Swiper as SwiperCore} from 'swiper/types' // Import Swiper types

export function getClipUid() {
  if (typeof window !== 'undefined') {
    const clipUid = localStorage.getItem('Clip-Uid')
    if (clipUid) {
      // console.log('🚀 ~ getClipUid ~ clipUid:', clipUid)
      // Set the Clip-Uid as a cookie so it can be accessed in getServerSideProps
      return clipUid
    }
  }
  return null
}
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      // console.log('🚀 ~ getAuthToken ~ authToken:', authToken)
      // Set the Clip-Uid as a cookie so it can be accessed in getServerSideProps
      return authToken
    }
  }
  return null
}

const {Content} = Layout

const AdsGalleryIdPage = ({data: adsInfo, seoData}: any) => {
  const router = useRouter()

  const {id} = router.query

  // const {
  //   data: adsInfo,
  //   isLoading: adsIsLoading,
  //   isFetching: adsIsFetching
  // } = useGetSingleAdsGalleryQuery({params: {advert: id}})

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(0) // State to track the active index

  // Create a ref for the Swiper instance
  const swiperRef = useRef<SwiperCore | null>(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  useEffect(() => {
    getClipUid()
    getAuthToken()
  }, [])
  const handleSlideChange = (swiper: SwiperCore): void => {
    setActiveIndex(swiper.activeIndex) // Update the active index
  }

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index) // Go to the desired slide
    }
  }

  const adsDataVal = adsInfo?.data

  const {type} = useSelector((state: any) => state.vendor)

  return (
    <div>
      <SEOHead
        title={`myEKI | ${adsDataVal?.title}`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <MainWrapper className="">
        {/* Ads Gallery */}
        <div className="flex w-full flex-col">
          {/* <Category open={open} setOpen={setOpen} /> */}
          <div className="flex w-full flex-col-reverse lg:flex-col">
            <NewNavigation />
          </div>
        </div>
      </MainWrapper>
      <div className="mt-[20px] w-full max-w-7xl lg:mx-auto lg:mt-[50px]">
        <div className="px-4">
          <CustomerHeader
            btnText="Back"
            showInput={false}
            titleHeader={type === 'product' ? 'Product Details' : 'Service Details'}
          />

          <div className="mx-auto flex items-center justify-center lg:w-[70%]">
            <StyledContentWrapper className="mt-[23px] w-full lg:w-[70%]">
              <div className="flex w-full flex-col gap-4 lg:flex-row">
                <div className="flex flex-col gap-3 lg:w-[50%]">
                  <div className="relative">
                    <div
                      ref={prevRef}
                      className="swiper-button-disabled absolute left-3 top-[48%] z-10 -translate-y-1/2 cursor-pointer rounded-[4px] bg-[#CAE3FF] p-1 transition"
                    >
                      <Icon icon="tabler:chevron-left" width={24} className="text-[#216FC7]" height={24} />
                    </div>
                    <div
                      ref={nextRef}
                      className="swiper-button-disabled absolute right-3 top-[48%] z-10 -translate-y-1/2 cursor-pointer rounded-[4px] bg-[#CAE3FF] p-1 transition"
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
                      {adsDataVal?.media?.map((listing: any, i: number) => (
                        <SwiperSlide className="w-full" key={i}>
                          <div key={i} className="w-full rounded-[8px] bg-[#F0F4F7]">
                            <div className="h-[350px] min-w-[230px] overflow-hidden rounded-[4px] lg:h-[350px]">
                              {listing?.type === 'image' ? (
                                <Image
                                  // onError={error => {
                                  //   error.currentTarget.src = '/assets/default_banner.jpg'
                                  // }}
                                  src={`${process.env.imageBaseUrl}/${listing?.file_path}`}
                                  alt="product-image"
                                  className={`h-full w-full rounded-[4px] object-cover`}
                                  width={230}
                                  height={350}
                                />
                              ) : (
                                <VideoView
                                  src={`${process.env.imageBaseUrl}/${listing?.file_path}`}
                                  width="230"
                                  className="w-full"
                                  height="230"
                                />
                              )}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}{' '}
                    </Swiper>
                  </div>
                  <div className="mt-[10px] grid grid-cols-3 gap-3 md:flex md:gap-2">
                    {adsDataVal?.media?.map((productIn: any, id: any) => {
                      return (
                        <div key={id} className="flex cursor-pointer gap-2" onClick={() => goToSlide(id)}>
                          <div
                            // @ts-ignore
                            className={`h-[86px] min-w-[94px] overflow-hidden rounded-[8px] border-[1.5px] ${adsDataVal?.media[activeIndex]?.id == productIn?.id ? 'border-[#AF52DE]' : 'border-[#F2F2F2]'}`}
                          >
                            {productIn?.type === 'image' ? (
                              <Image
                                onError={error => {
                                  error.currentTarget.src = '/assets/default_banner.jpg'
                                }}
                                src={`${process.env.imageBaseUrl}/${productIn?.file_path}`}
                                alt="product-image"
                                className={`h-full w-full rounded-[4px] object-cover`}
                                width={96}
                                height={87}
                              />
                            ) : (
                              <VideoView
                                src={`${process.env.imageBaseUrl}/${productIn?.file_path}`}
                                width="96"
                                height="87"
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="w-full lg:w-[50%]">
                  <AdsInfo adsDataVal={adsDataVal} />
                </div>
              </div>
            </StyledContentWrapper>
          </div>

          <AlsoLikeComponent />
        </div>
      </div>
    </div>
  )
}

export const StyledContentWrapper = styled(Content)`
  border-radius: 0.375rem;
  background-color: white;
  padding: 12px;
  color: #000;
`

AdsGalleryIdPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool>
      {page}
    </CustomerLayout>
  )
}

export default AdsGalleryIdPage

export const getServerSideProps = async (context: any) => {
  const {id, slug} = context.query
  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || ''
  const authToken = cookies['authToken'] || ''

  try {
    const res = await axios.get(`${process.env.baseUrl}front/advert/${id}/gallery`, {
      headers: {
        Authorization: authToken || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'clip-uid': clipUid
      }
    })

    const data = await res.data

    // Add null checks and provide fallback values
    const seoData = {
      title: `myEKI | ${data?.data?.title || 'Product Title'}`,
      description: data?.data?.description || 'Product description not available',
      // Check if images array exists and has items
      image:
        data?.data?.media?.length && data?.data?.media[0].type === 'image'
          ? `${process.env.imageBaseUrl}/${data?.data?.media[0].file_path}`
          : '/assets/ads_dummy_vidz.jpg', // Provide a default image path
      slug: data?.data?.slug || ''
    }

    return {props: {data, seoData}}
  } catch (error) {
    console.error('Error fetching product data:', error)
    return {notFound: true}
  }
}
