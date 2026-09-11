import CustomButton from '@/components/SharedUI/Buttons/Button'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetAllPromotedStoresQuery} from '@/services/advertisement'
import copyToClipboard from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Button} from 'antd'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

const Recommended = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const [clipUuid, setClipUuid] = useState<any>(null)

  // const {data, isLoading} = useGetRecommendedStoresNewQuery({
  //   uuid: clipUuid,
  //   // currency: selectedLanguage.value
  //   country: selectedLanguage.name
  // })

  const {data, isLoading} = useGetAllPromotedStoresQuery({
    currency: selectedLanguage.value
  })
  console.log('🚀 ~ Recommended ~ data:', data?.data)

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

  const router = useRouter()

  console.log()

  const handleCopyLink = (text: string) =>
    copyToClipboard(text)
      .then(() => {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>Store Link Copied Successfully</>}
                image={'/assets/states/notificationToasts/successcheck.svg'}
                textColor="#fff"
                message=""
                backgroundColor="#000"
              />
            )
          },
          message: 'Copied'
        })
      })
      .catch(() =>
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>Unable to copy!</>}
                image={'/assets/states/notificationToasts/error.svg'}
                textColor="red"
                message="Unable to copy"
                backgroundColor="#FCFCFD"
              />
            )
          },
          message: 'Oops, Something went wrong'
        })
      )

  return (
    <div className="mt-[25px] px-4 lg:px-0">
      {(data?.data || []).length ? (
        <TextComponent as="p" className="mb-6 text-base font-bold leading-[24px] lg:text-[18px]">
          {`Stores Recommended for You`}
        </TextComponent>
      ) : null}
      {isLoading ? (
        <div className="mt-4 flex h-[239px] w-full flex-row gap-4">
          <div className="hidden w-full grid-cols-4 gap-[10px] pb-5 lg:grid">
            {[1, 2, 3, 4].map(item => {
              return <div key={item} className="h-full w-full animate-pulse rounded-[9px] bg-gray-300" />
            })}
          </div>
          <div className="grid w-full grid-cols-2 pb-5 gap-[10px] lg:hidden">
            {[1, 2].map(item => {
              return <div key={item} className="h-[80%] w-full animate-pulse rounded-[9px] bg-gray-300" />
            })}
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-2 overflow-x-auto">
          <div className="flex w-[calc(100%*4)] gap-5 overflow-x-auto md:w-full">
            {(Array.isArray(data?.data) ? data?.data : []).map((listing: any, i: any) => (
              <div
                key={i}
                onClick={() => router.push(`/store/${listing.slug}?type=${type}`)}
                className="w-[80%] flex-shrink-0 rounded-[8px] border-[1px] border-solid border-[#EDEDED] bg-white p-[14px] sm:w-[90%] md:w-1/4"
              >
                <div className="relative h-[170px] w-full overflow-hidden rounded-[9px] hover:opacity-90">
                  <ImageComponent
                    isLoadingImage={isLoadingImage}
                    setIsLoadingImage={setIsLoadingImage}
                    src={
                      listing.banner_path
                        ? `${process.env.imageBaseUrl}/${listing.banner_path}`
                        : '/assets/default_banner.jpg'
                    }
                    alt="Banner-image"
                    width={100}
                    className="!h-[170px] !rounded-[9px] object-cover"
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
                      onClick={() => router.push(`/store/${listing.slug}?type=${type}`)}
                    >
                      <TextComponent as="span" className="whitespace-nowrap text-[12px] font-semibold text-white">
                        {type === 'product' ? 'Shop Now' : 'Book Now'}
                      </TextComponent>
                    </CustomButton>

                    <Button
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleCopyLink(`${window.location.origin}/store/${listing.slug}?type=${type}`)
                      }}
                      className="!hover:bg-transparent flex items-center gap-5 !border-none bg-transparent !p-0"
                    >
                      <Icon icon="lucide:share" className="h-6 w-6 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Recommended
