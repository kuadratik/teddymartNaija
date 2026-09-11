import {memo, useCallback, useEffect, useMemo, useState} from 'react'
// Import Swiper React components
import type SwiperCore from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'

// import required modules
import {SingleAdvertWrapper} from '@/components/Customer/Advert'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import VideoView from '@/components/SharedUI/VideoView'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {Autoplay, Grid, Pagination} from 'swiper/modules'

interface NewAdvertSwiperProps {
  data: any[]
  countries?: any
  isHideDeleteSaveAds?: boolean
  isDeleteWishlistLoading?: boolean
  handleDeleteWishlistAdvert?: (ad: any) => void
}

// Memoized components
const MemoizedTextComponent = memo(TextComponent)
const MemoizedFormatNumberCurrency = memo(FormatNumberCurrency)
const MemoizedImage = memo(Image)

function NewAdvertSwiper({
  data = [],
  countries,
  isHideDeleteSaveAds = false,
  isDeleteWishlistLoading = false,
  handleDeleteWishlistAdvert = () => {}
}: NewAdvertSwiperProps) {
  const router = useRouter()
  const [selectedAds, setSelectedAds] = useState<any>(null)
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null)
  // Use ref for loading images to prevent re-renders
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})
  const [swiperReady, setSwiperReady] = useState(false)

  // Wait for component to fully mount before initializing Swiper (run once)
  useEffect(() => {
    setSwiperReady(true)

    // Clean up function
    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true)
      }
    }
  }, [])

  // Memoized function to update loading state for a specific image
  const setImageLoading = useCallback((id: string, isLoading: boolean) => {
    setLoadingImages(prev => ({
      ...prev,
      [id]: isLoading
    }))
  }, [])

  // Manual autoplay implementation with cleanup
  useEffect(() => {
    if (!swiperInstance) return

    const interval = setInterval(() => {
      if (swiperInstance && !swiperInstance.destroyed) {
        if (swiperInstance.isEnd) {
          swiperInstance.slideTo(0, 300)
        } else {
          swiperInstance.slideNext(300)
        }
      }
    }, 3000) // 3 seconds interval

    return () => clearInterval(interval)
  }, [swiperInstance])

  // Memoize the navigation handler
  const handleNavigateToAd = useCallback(
    (id: number) => {
      router.push(`/ads-gallery/${id}`)
    },
    [router]
  )

  // Memoize the delete handler
  const handleDeleteAd = useCallback(
    (ad: any) => {
      handleDeleteWishlistAdvert(ad)
      setSelectedAds(ad)
    },
    [handleDeleteWishlistAdvert]
  )

  // Memoize the SwiperSlide renderer to prevent recreating components on each render
  const renderSwiperSlide = useCallback(
    (ad: any, index: number) => {
      const adId = ad?.id || `ad-${index}`
      const imageUrl = `${process.env.imageBaseUrl}/${ad?.media?.[0]?.file_path}`
      const findCountry = countries?.data?.find((country: any) => country?.id === ad?.country_id)

      return (
        <SwiperSlide key={adId}>
          <div className="group relative">
            {isHideDeleteSaveAds && (
              <button
                disabled={isDeleteWishlistLoading}
                className="absolute right-2 top-2 z-30 hidden cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-colors duration-200 hover:bg-gray-100 group-hover:flex"
                onClick={e => {
                  e.stopPropagation()
                  handleDeleteAd(ad)
                }}
              >
                {isDeleteWishlistLoading && ad?.id === selectedAds?.id ? (
                  <Spinner className="border-black" />
                ) : (
                  <MemoizedImage src="/assets/delete.svg" alt="delete" width={20} height={20} />
                )}
              </button>
            )}
            <SingleAdvertWrapper className="cursor-pointer bg-white" onClick={() => handleNavigateToAd(ad.id)}>
              <div className="relative flex flex-col px-2 py-1 lg:flex-row lg:items-center">
                <div className="relative rounded-[6px] bg-[#F5F5F5] lg:h-[130px] lg:w-[130px]">
                  {ad?.media?.[0]?.type === 'image' ? (
                    <ImageComponent
                      src={imageUrl}
                      alt={ad?.title || 'Advertisement'}
                      className="h-full w-full rounded-[6px] border border-gray-100 object-cover object-center"
                      width={200}
                      height={200}
                      isLoadingImage={loadingImages[adId] || false}
                      setIsLoadingImage={(isLoading: any) => setImageLoading(adId, isLoading)}
                    />
                  ) : (
                    <VideoView
                      className="w-full"
                      src={`${process.env.imageBaseUrl}/${ad?.media?.[0]?.file_path}`}
                      width="200"
                      height="50"
                    />
                  )}
                  {ad?.is_available === false && (
                    <div className="absolute -left-2 top-2">
                      <MemoizedImage
                        src={`/assets/unavailable-tag.svg`}
                        alt="Unavailable"
                        width={100}
                        height={30}
                        className="h-[35px] object-center"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-4 lg:w-2/3">
                  <MemoizedTextComponent as="h2" className="text-[15px] font-bold leading-4 text-black/80">
                    {capitalizeOnlyFirstLetter(ad?.title)}
                  </MemoizedTextComponent>
                  <MemoizedTextComponent as="h2" className="text-[17px] font-bold text-black">
                    {ad?.price_on_request ? (
                      'Please Contact'
                    ) : (
                      <MemoizedFormatNumberCurrency value={+ad.price} currency={ad?.currency} />
                    )}
                  </MemoizedTextComponent>
                  <p className="text-[14px] lg:h-[63px]">
                    {capitalizeOnlyFirstLetter(ad?.description).length > 50 ? (
                      <>
                        <span
                          className="ql-content"
                          dangerouslySetInnerHTML={{
                            __html: capitalizeOnlyFirstLetter(ad?.description).slice(0, 50) + '...'
                          }}
                        />{' '}
                        <span
                          onClick={() => {
                            router.push(`/ads-gallery/${ad.id}`)
                          }}
                          className="cursor-pointer underline group-hover:font-bold"
                        >
                          see more
                        </span>
                      </>
                    ) : (
                      <span
                        className="ql-content"
                        dangerouslySetInnerHTML={{
                          __html: capitalizeOnlyFirstLetter(ad?.description)
                        }}
                      />
                    )}
                  </p>
                </div>
              </div>
              <div className="relative -top-1 px-4">
                <div className="flex items-center justify-end gap-2 text-[14px] font-[500] lg:text-[12px]">
                  <Icon icon="duo-icons:location" width="14" height="14" />
                  <span className="">
                    {ad?.state}, {findCountry?.name ?? ''}
                  </span>
                </div>
              </div>
            </SingleAdvertWrapper>
          </div>
        </SwiperSlide>
      )
    },
    [
      countries,
      handleDeleteAd,
      handleNavigateToAd,
      isDeleteWishlistLoading,
      isHideDeleteSaveAds,
      loadingImages,
      selectedAds?.id,
      setImageLoading
    ]
  )

  // Only re-render if data, countries or loading states change
  const memoizedData = useMemo(() => data, [data])

  // Memoize swiper options to prevent recreating objects
  const swiperOptions = useMemo(
    () => ({
      slidesPerView: 3,
      grid: {
        rows: 3,
        fill: 'row' as 'row'
      },
      spaceBetween: 20,
      pagination: {
        clickable: true,
        dynamicBullets: true
      },
      breakpoints: {
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
      }
    }),
    []
  )

  return (
    <>
      <div className="swiper-container-with-custom-pagination">
        {swiperReady && memoizedData && memoizedData.length > 0 && (
          <Swiper
            {...swiperOptions}
            onSwiper={setSwiperInstance}
            modules={[Grid, Pagination, Autoplay]}
            className="mySwiper w-full"
          >
            {memoizedData.map(renderSwiperSlide)}
          </Swiper>
        )}
      </div>
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
    </>
  )
}

export default memo(NewAdvertSwiper)
