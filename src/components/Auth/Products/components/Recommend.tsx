import AdvertComponent from '@/components/Advert'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetRecommendedStoresQuery} from '@/services/general/general'
import {capitalizeFirstLetter} from '@/utils/fx'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Autoplay} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
const RecommendedComponent = () => {
  const dispatch = useDispatch()

  const [clipUuid, setClipUuid] = useState<any>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated token

  const isAuth = isAuthenticatedToken

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = JSON.parse(localStorage.getItem('Clip-Uid') || 'null')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  // remove string from uuid

  const {data, isLoading} = useGetRecommendedStoresQuery({
    uuid: clipUuid
  })

  // console.log('data', data)

  return (
    <div className="lg:mt-[40px]">
      <TextComponent as="p" className="text-[18px] lg:font-bold lg:leading-[24px]">
        {data?.data?.data?.length ? `Recommended ${isDesktop ? 'for you' : ''}` : ''}
      </TextComponent>

      <section className="mt-[10px] lg:mt-[36px]">
        {isDesktop ? (
          <div className="flex h-[439px] w-full flex-row gap-4">
            {isLoading ? (
              <div className="grid h-full w-[600px] grid-cols-2 gap-[10px]">
                {[1, 2, 3, 4].map(item => {
                  return <div key={item} className="h-full w-full animate-pulse rounded-[9px] bg-gray-300" />
                })}
              </div>
            ) : data?.data?.data?.length > 0 ? (
              <div className="grid h-full w-[600px] grid-cols-2 gap-[10px]">
                {data?.data?.data?.slice(0, 4)?.map((category: any, i: number) => (
                  <Link
                    href={`/store/${category.slug}`}
                    key={i}
                    className="col-span-[0.5] flex h-[214px] w-full flex-col gap-[10px] rounded-[9px] border border-[#EAECEF] p-[10px]"
                  >
                    <div className="relative h-[125.32px] w-full overflow-hidden rounded-[9px]">
                      {/* <Image
                        src={`${process.env.imageBaseUrl}/${category.banner_path}`}
                        alt="image"
                        className="w-full object-cover"
                        width={100}
                        quality={100}
                        height={100}
                      /> */}

                      <Image
                        src={`${process.env.imageBaseUrl}/${category.banner_path}`}
                        alt="Banner-image"
                        width={100}
                        layout="responsive" // Makes the image responsive // Percentage of the parent width
                        className="!h-[220px] !rounded-[9px] object-cover"
                        height={47}
                      />
                    </div>
                    <div className="flex flex-col gap-[10px]">
                      <p className="whitespace-wrap mt-[10px] text-left text-[14px] font-semibold text-[#181A20]">
                        {category.name}
                      </p>
                      <CustomButton
                        className="flex h-[27px] w-[89px] cursor-pointer items-center justify-center rounded-[5px] bg-[#000]"
                        onClick={() => {
                          router.push(`/store/${category.slug}`)
                        }}
                      >
                        <TextComponent as="span" className="whitespace-nowrap text-[12px] font-semibold text-white">
                          {type === 'product' ? 'Shop Now' : 'Book Now'}
                        </TextComponent>
                      </CustomButton>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              ''
            )}

            <div className="h-full w-full rounded-[8px] bg-[url('/assets/banner-advert.jpg')] bg-cover bg-center">
              <div className="p-12">
                <h3 className="pb-5 text-[26px] font-semibold capitalize text-white">
                  Advertise a {capitalizeFirstLetter(type)}
                </h3>
                <CustomButton
                  className="flex h-[30px] w-[89px] cursor-pointer items-center justify-center rounded-[5px] bg-white py-2"
                  onClick={() => {
                    if (isAuth) {
                      if (isAuthenticatedUser?.offers_product) {
                        dispatch(setType({type: 'product'}))
                        setTimeout(() => {
                          router.push('/vendor')
                        }, 0)
                      } else if (isAuthenticatedUser?.offers_service) {
                        dispatch(setType({type: 'service'}))
                        setTimeout(() => {
                          router.push('/vendor')
                        }, 0)
                      } else {
                        {
                          router.push('/vendor/onboarding')
                        }
                      }
                    } else {
                      router.push('/vendor/onboarding')
                    }
                  }}
                >
                  <TextComponent as="span" className="whitespace-nowrap text-[12px] font-semibold text-black">
                    Start Now
                  </TextComponent>
                </CustomButton>
              </div>
            </div>
          </div>
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
              className="h-full w-full"
            >
              {data?.data?.data?.map((category: any, i: number) => (
                <SwiperSlide key={i} className="w-full">
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => {
                      router.push(`/store/${category.slug}`)
                    }}
                  >
                    <Image
                      src={`${process.env.imageBaseUrl}/${category.banner_path}`}
                      alt="Banner-image"
                      width={100}
                      layout="responsive" // Makes the image responsive // Percentage of the parent width
                      className="!h-[150px] !rounded-[9px] object-cover"
                      height={47}
                    />

                    <p className="whitespace-wrap mt-[10px] text-center text-[14px] text-[#181A20]">{category.name}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>
    </div>
  )
}

export default RecommendedComponent
