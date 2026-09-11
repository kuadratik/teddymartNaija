import AlsoLikeComponent from '@/components/Auth/Products/components/AlsoLike'
import CustomerHeader from '@/components/Auth/Products/components/CustomerHeader'
import AdsInfo from '@/components/Customer/Advert/AdsInfo'
import RatingCard from '@/components/Customer/Advert/RatingCard'
import SingleAdvertActions from '@/components/Customer/Advert/SingleAdvertActions'
import CustomerLayout from '@/components/Layout/Customerlayout'
import Carousel from '@/components/SharedUI/Carousel'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import SEOHead from '@/components/SharedUI/SEOHead'
import VideoView from '@/components/SharedUI/VideoView'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetSingleAdsGalleryQuery} from '@/services/Adsgallery'
import {useGetAllRatedAdvertQuery} from '@/services/advertisement'
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
  console.log('🚀 ~ AdsGalleryIdPage ~ adsInfo:', adsInfo)
  const router = useRouter()
  const {id} = router.query
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  console.log('🚀 ~ AdsGalleryIdPage ~ isAuthenticatedUser:', isAuthenticatedUser?.id)
  const [isWishlisted, setIsWishlisted] = useState(false) // State to track if the ad is wishlisted
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const {data: singleDataClient, refetch: refetchSingleAdvert} = useGetSingleAdsGalleryQuery({
    params: {advert: id as string}
  })
  const {
    data: adsRatedData,
    isLoading: adsRatedIsLoading,
    isFetching: adsRatedIsFetching,
    refetch: adsRatedRefetch
  } = useGetAllRatedAdvertQuery({
    advert_id: id as string
  })

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(0) // State to track the active index

  // Create a ref for the Swiper instance
  const swiperRef = useRef<SwiperCore | null>(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  useEffect(() => {
    getClipUid()
    getAuthToken()

    // Check if the ad is wishlisted

    const isWishlisted = singleDataClient?.data?.wishlisted_by_users?.some(
      (user: any) => user.id === isAuthenticatedUser?.id
    )
    setIsWishlisted(isWishlisted)
  }, [singleDataClient])
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
        title={`AfricanDiasporaMart | ${adsDataVal?.title}`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />

      <div className="mt-[20px] w-full max-w-7xl lg:mx-auto">
        <div className="px-4">
          <CustomerHeader btnText="Back" showInput={false} titleHeader={'Ad Details'} />
          <div className="mx-auto flex items-center justify-center lg:w-[75%]">
            <StyledContentWrapper className="mt-[23px] w-full lg:w-[75%]">
              <div className="flex w-full flex-col gap-4 lg:flex-row">
                <div className="flex flex-col gap-3 lg:w-[45%]">
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
                        <SwiperSlide className="relative w-full px-2" key={i}>
                          <div key={i} className="w-full rounded-[8px] bg-[#F0F4F7]">
                            <div className="h-[350px] min-w-[300px] overflow-hidden rounded-[4px] lg:h-[400px]">
                              {listing?.type === 'image' ? (
                                <ImageComponent
                                  // onError={error => {
                                  //   error.currentTarget.src = '/assets/default_banner.jpg'
                                  // }}
                                  isLoadingImage={isLoadingImage}
                                  setIsLoadingImage={setIsLoadingImage}
                                  src={`${process.env.imageBaseUrl}/${listing?.file_path}`}
                                  alt="product-image"
                                  className={`h-full w-full rounded-[4px] border border-[#EAECEF] object-cover`}
                                  width={500}
                                  quality={80}
                                  height={500}
                                />
                              ) : (
                                <VideoView
                                  src={`${process.env.imageBaseUrl}/${listing?.file_path}`}
                                  width="230"
                                  className="w-full rounded-[4px] border border-[#EAECEF]"
                                  height="230"
                                />
                              )}
                            </div>
                            {adsDataVal?.is_available === false && (
                              <div className="absolute -left-0 top-5 z-40">
                                <Image
                                  src={`/assets/unavailable-tag.svg`}
                                  alt={listing?.title}
                                  width={150}
                                  height={30}
                                  className="h-[35px] w-[100px] object-center"
                                />
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}{' '}
                    </Swiper>
                  </div>
                  <div className="mt-[10px] grid grid-cols-3 justify-between gap-3 px-2 md:gap-6">
                    {adsDataVal?.media?.map((productIn: any, id: any) => {
                      return (
                        <div key={id} className="flex cursor-pointer gap-2" onClick={() => goToSlide(id)}>
                          <div
                            // @ts-ignore
                            className={`h-[86px] min-w-full overflow-hidden rounded-[8px] border-2 ${adsDataVal?.media[activeIndex]?.id == productIn?.id ? 'border-[#AF52DE]' : 'border-[#F2F2F2]'}`}
                          >
                            {productIn?.type === 'image' ? (
                              <ImageComponent
                                isLoadingImage={isLoadingImage}
                                setIsLoadingImage={setIsLoadingImage}
                                enhanceOldImages={true}
                                src={`${process.env.imageBaseUrl}/${productIn?.file_path}`}
                                alt="product-image"
                                className={`h-full w-full rounded-[4px] object-cover`}
                                width={96}
                                height={87}
                              />
                            ) : (
                              <VideoView
                                src={`${process.env.imageBaseUrl}/${productIn?.file_path}`}
                                width="100%"
                                height="87"
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex w-full flex-col justify-between gap-y-5 lg:w-[55%]">
                  <AdsInfo adsDataVal={adsDataVal} />
                  <SingleAdvertActions
                    refetchSingleAdvert={refetchSingleAdvert}
                    data={adsDataVal}
                    adsRatedRefetch={adsRatedRefetch}
                    isWishlisted={isWishlisted}
                  />
                </div>
              </div>
            </StyledContentWrapper>
          </div>
          {adsRatedData?.data?.ratings.length! > 0 && (
            <div className="mt-[30px] lg:mt-[55px]">
              <h3 className="relative text-[20px] font-semibold lg:top-0 lg:pb-5">Ratings</h3>
              <div className="mt-1 hidden grid-cols-4 gap-3 rounded-lg bg-white p-4 lg:mt-0 lg:grid">
                {adsRatedData?.data.ratings?.map(item => {
                  console.log('🚀 ~ AdsGalleryIdPage ~ item:', item)

                  return (
                    <RatingCard
                      key={item?.id}
                      rating={item}
                      average_rating={adsRatedData?.data?.average_rating}
                      total_ratings={adsRatedData?.data?.total_ratings}
                    />
                  )
                })}
              </div>

              <div className="block lg:hidden">
                <Carousel<any>
                  items={adsRatedData?.data?.ratings!}
                  scrollAmount={300}
                  containerClassName="my-0 p-0"
                  buttonClassName=""
                  renderItem={(item, index) => (
                    <div key={item?.id} className="">
                      <RatingCard
                        rating={item}
                        average_rating={adsRatedData?.data?.average_rating!}
                        total_ratings={adsRatedData?.data?.total_ratings!}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
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
    // Strip HTML tags from description
    const cleanDescription = data?.data.description
      ? data?.data.description.replace(/<[^>]*>/g, '')
      : 'Ads description not available'

    // Update the description in the data object
    data.data.description = cleanDescription
    // Add null checks and provide fallback values
    const seoData = {
      title: `AfricanDiasporaMart | ${data?.data?.title || 'Ads Title'}`,
      description: cleanDescription || 'Ads description not available',
      // Check if images array exists and has items
      image:
        data?.data?.media?.length && data?.data?.media[0].type === 'image'
          ? `${process.env.imageBaseUrl}/${data?.data?.media[0].file_path}`
          : '/assets/ads_dummy_vidz.jpg', // Provide a default image path
      slug: data?.data?.slug || ''
    }

    return {props: {data, seoData, hasAdSenseScript: true}}
  } catch (error) {
    console.error('Error fetching product data:', error)
    return {notFound: true}
  }
}
