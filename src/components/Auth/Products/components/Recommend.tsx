import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetRecommendedStoresQuery} from '@/services/general/general'
import {capitalizeFirstLetter} from '@/utils/fx'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
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
  const [isLoadingImage, setIsLoadingImage] = useState(true)

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

  return (
    <div className="lg:mt-[40px]">
      <section className="mt-[10px] lg:mt-[36px]">
        {isDesktop && (
          <div className="flex h-[439px] w-full flex-row gap-4">
            <div className="h-full w-full rounded-[8px] bg-[url('/assets/banner-advert.jpg')] bg-cover bg-center">
              <div className="p-12">
                <h3 className="pb-5 text-[26px] font-semibold text-white">Advertise a {capitalizeFirstLetter(type)}</h3>
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
        )}
      </section>
    </div>
  )
}

export default RecommendedComponent
