import {useState} from 'react'
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'

// import required modules
import {SingleAdvertWrapper} from '@/components/Customer/Advert'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import VideoView from '@/components/SharedUI/VideoView'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {Grid, Pagination} from 'swiper/modules'

interface NewAdvertSwiperProps {
  data: any[]
  countries?: any
  isHideDeleteSaveAds?: boolean
  isDeleteWishlistLoading?: boolean
  handleDeleteWishlistAdvert?: (ad: any) => void
}

export default function NewAdvertSwiper({
  data = [],
  countries,
  isHideDeleteSaveAds = false,
  isDeleteWishlistLoading = false,
  handleDeleteWishlistAdvert = () => {}
}: NewAdvertSwiperProps) {
  const router = useRouter()
  const [selectedAds, setSelectedAds] = useState<any>(null)

  return (
    <>
      <Swiper
        slidesPerView={1}
        grid={{
          rows: 1,
          fill: 'row'
        }}
        spaceBetween={20}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            grid: {rows: 2}
          },
          1024: {
            slidesPerView: 3,
            grid: {rows: 2}
          }
        }}
        modules={[Grid, Pagination]}
        className="mySwiper !pb-12"
      >
        {data.map((ad: any, index: any) => {
          const findCountry = countries?.data.find((country: any) => country?.id === ad?.country_id)

          return (
            <SwiperSlide key={ad?.id || index} className="h-auto">
              <div className="group relative h-full">
                {isHideDeleteSaveAds && (
                  <button
                    disabled={isDeleteWishlistLoading}
                    className="absolute right-2 top-2 z-30 hidden cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-colors duration-200 hover:bg-gray-100 group-hover:flex"
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteWishlistAdvert(ad)
                      setSelectedAds(ad)
                    }}
                  >
                    {isDeleteWishlistLoading && ad?.id === selectedAds?.id ? (
                      <Spinner className="border-black" />
                    ) : (
                      <Image src="/assets/delete.svg" alt="delete" width={20} height={20} />
                    )}
                  </button>
                )}
                <SingleAdvertWrapper
                  className="flex h-full cursor-pointer flex-col bg-white shadow-sm hover:shadow-md"
                  onClick={() => {
                    router.push(`/ads-gallery/${ad.id}`)
                  }}
                >
                  <div className="relative flex flex-1 flex-col">
                    <div className="relative h-[180px] w-full rounded-t-[6px] bg-[#F5F5F5]">
                      {ad?.media?.[0]?.type === 'image' ? (
                        <Image
                          onError={error => {
                            error.currentTarget.src = '/assets/default_banner.jpg'
                          }}
                          src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                          alt={ad?.title}
                          loading="lazy"
                          fill
                          className="rounded-t-[6px] border border-gray-100 bg-[#F5F5F5] object-cover object-center"
                        />
                      ) : (
                        <VideoView
                          className="h-full w-full rounded-t-[6px]"
                          src={`${process.env.imageBaseUrl}/${ad?.media?.[0]?.file_path}`}
                          width="100%"
                          height="100%"
                        />
                      )}
                      {ad?.is_available === false && (
                        <div className="absolute -left-2 top-2">
                          <Image
                            src={`/assets/unavailable-tag.svg`}
                            alt={ad?.title}
                            width={100}
                            height={30}
                            className="h-[35px] object-center"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <TextComponent as="h2" className="mb-1 text-[15px] font-bold leading-5 text-black/80">
                          {capitalizeOnlyFirstLetter(ad?.title)}
                        </TextComponent>
                        <TextComponent as="h2" className="mb-2 text-[17px] font-bold text-black">
                          {ad?.price_on_request ? (
                            'Please Contact'
                          ) : (
                            <FormatNumberCurrency value={+ad.price} currency={ad?.currency} />
                          )}
                        </TextComponent>
                        <p className="line-clamp-3 text-[14px]">
                          {capitalizeOnlyFirstLetter(ad?.description)?.length > 50 ? (
                            <>
                              {capitalizeOnlyFirstLetter(ad?.description).slice(0, 50)}...{' '}
                              <span
                                onClick={e => {
                                  e.stopPropagation()
                                  router.push(`/ads-gallery/${ad.id}`)
                                }}
                                className="cursor-pointer underline group-hover:font-bold"
                              >
                                see more
                              </span>
                            </>
                          ) : (
                            capitalizeOnlyFirstLetter(ad?.description)
                          )}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-2 text-[12px] font-[500] text-gray-600">
                        <Icon icon="duo-icons:location" width="14" height="14" />
                        <span>
                          {ad?.state}, {findCountry?.name ?? ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </SingleAdvertWrapper>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
