import useQueryParams from '@/hooks/useQueryParams'
import {useGetUserAdsGalleryQuery} from '@/services/Adsgallery'
import {GetAdsGalleryQuery} from '@/types/adsgallery'
import {Button, Pagination, Tabs} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '../SharedUI/TextComponent'
import VideoView from '../SharedUI/VideoView'
import Promotions from './Promotions'
import RetryPaymentModal from './RetryPaymentModal'
import {useAppSelector} from '@/hooks/reduxHooks'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {useLocation} from 'react-use'
import useVerifyPayment from './hooks/useVerifyPayment'
import CustomButton from '../SharedUI/Buttons/Button'

const Advert = () => {
  const router = useRouter()

  const {selectedLanguage} = useAppSelector(state => state.country)

  // const {type} = useSelector((state: any) => state.vendor)

  const {queryParams, updateQueryParams} = useQueryParams<GetAdsGalleryQuery>({
    page: 1
  })

  const {
    data: adsInfo,
    isLoading: adsIsLoading,
    isFetching: adsIsFetching
  } = useGetUserAdsGalleryQuery({params: queryParams})

  const [key, setKey] = useState('adverts')

  const onChange = (key: string) => {
    setKey(key)
  }

  const tabsData = [
    {
      tabTitle: <p className="p_">My Adverts</p>,
      tabBody: (
        <AdvertComponent
          selectedLanguage={selectedLanguage}
          data={adsInfo?.data?.data}
          adsIsFetching={adsIsFetching}
          adsIsLoading={adsIsLoading}
        />
      ),
      path: 'adverts'
    },
    {
      tabTitle: <p className="p_">My Promotion</p>,
      tabBody: <Promotions />,
      path: 'promotions'
    }
  ]

  const handlePagination = (page: number) => {
    if (!adsInfo?.data?.data) return

    updateQueryParams({page: page})
  }

  const totalPages = adsInfo?.data?.pagination?.total ?? undefined

  // console.log(adsInfo?.data?.pagination?.total)

  // console.log(adsInfo)

  const isUserProfileAdverts = router.pathname === '/vendor/user-profile'

  return (
    <div>
      <div className="">
        {isUserProfileAdverts ? (
          <Tabs
            activeKey={key}
            items={tabsData.map(val => ({
              key: val.path,
              label: <div className="px-1">{val.tabTitle}</div>,
              children: val.tabBody
            }))}
            onChange={onChange}
            className="custom-active-tab"
          />
        ) : (
          <AdvertComponent
            selectedLanguage={selectedLanguage}
            data={adsInfo?.data?.data}
            adsIsFetching={adsIsFetching}
            adsIsLoading={adsIsLoading}
          />
        )}
      </div>

      {key !== 'promotions' && adsInfo?.data?.data?.length ? (
        <div className="my-8 flex justify-end">
          <Pagination
            current={queryParams.page ? queryParams.page : 1}
            showSizeChanger={false}
            onChange={page => {
              handlePagination(page)
            }}
            className="mx-auto my-[0] flex w-fit flex-row items-center justify-center self-center rounded-md bg-white p-2 text-white lg:mx-0"
            showLessItems={true}
            pageSize={queryParams.per_page ? queryParams.per_page : 15}
            total={totalPages}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export const AdvertComponent = ({
  data,
  adsIsLoading,
  adsIsFetching,
  selectedLanguage
}: {
  data: any
  adsIsLoading: boolean
  adsIsFetching: boolean
  selectedLanguage: any
}) => {
  const router = useRouter()

  const query = router.query

  const location = useLocation()

  const [promoteCurrency, setPromoteCurrency] = React.useState()

  const {isLoading, verifyPaymentHandler} = useVerifyPayment()

  const [showRetry, setShowRetry] = React.useState(false)
  const [title, setTitle] = React.useState('Promote Ad')
  const [buttonText, setButtonText] = React.useState('Promote')
  const [currentlyClickedAd, setCurrentlyClickedAd] = React.useState<any>(null)

  useEffect(() => {
    if (query?.reference) {
      verifyPaymentHandler({
        token: query?.reference ?? '',
        gateway: 'paystack'
      })
    }
    if (query?.token) {
      verifyPaymentHandler({
        token: query?.token ?? '',
        gateway: 'paypal'
      })
    }
  }, [])

  if (adsIsLoading) {
    return <SkeletonLoaderForPage />
  }


  if (!data?.length) {
    return (
      <>
        {' '}
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <Image src="/assets/new-empty-state.svg" alt="empty" width={157} height={157} />
          <TextComponent as="p" className="text-[14px] leading-[18px] text-[#6B7280]">
            Nothing to see here
          </TextComponent>
          <Button
            onClick={() => {
              router.push('/post-ad')
            }}
            style={{
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
            htmlType="button"
            className="mt-4 w-[150px] whitespace-nowrap rounded-lg bg-[#000] px-2 py-[22px] text-white"
          >
            Post Ads
          </Button>
        </div>
      </>
    )
  }

  return (
    <Grid2Layout className="">
      {data?.map((ad: any, index: React.Key | null | undefined) => {
        // console.log('ad-price', ad.price)
        return (
          <SingleAdvertWrapper key={index} className="">
            <div className="flex flex-col p-3 lg:flex-row lg:p-6">
              {/* <div className="rounded-lg lg:w-1/3">
              <Image
                onError={error => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                }}
                src={ad.image}
                alt={ad.title}
                width={200}
                height={50}
                className="h-full w-full object-cover"
              />
            </div> */}
              <div className="h-[300px] rounded-full lg:h-[130px] lg:w-1/3">
                {ad?.media[0]?.type === 'image' ? (
                  <Image
                    onError={error => {
                      error.currentTarget.src = '/assets/default_banner.jpg'
                    }}
                    src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                    alt={ad?.title}
                    width={200}
                    height={50}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <VideoView
                    className="w-full"
                    src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                    width="200"
                    height="50"
                  />

                  // <video
                  //   ref={videoRef}
                  //   src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                  //   width="200"
                  //   height="50"
                  //   className="h-full w-full rounded-lg object-cover"
                  //   // muted
                  //   loop // Optional: loops the video
                  //   onMouseEnter={handleMouseEnter}
                  //   onMouseLeave={handleMouseLeave}
                  //   style={{cursor: 'pointer'}}
                  // />
                )}
              </div>

              <div className="flex flex-col p-4 lg:w-2/3">
                <TextComponent as="h2" className="text-[18px] font-bold leading-[22px] text-[#4d4d4d]">
                  {ad?.title}
                </TextComponent>
                <TextComponent as="h2" className="mt-2 text-[16px] font-normal text-[#6B7280]">
                  {ad?.promote_plans[ad?.promote_plans?.length - 1]?.name === 'Free'
                    ? 'Free'
                    : ad?.payment?.status == 'success'
                      ? 'Payment Successful'
                      : ad?.payment?.status == 'pending_payment'
                        ? 'Payment Pending'
                        : ad?.payment?.status == null
                          ? 'Awaiting your payment'
                          : ad?.payment?.status == 'failed'
                            ? 'Payment Unsuccessful'
                            : ''}
                </TextComponent>

                {ad?.promote_plans[ad?.promote_plans?.length - 1]?.name === 'Free' ? (
                  <CustomButton
                    onClick={() => {
                      if (selectedLanguage?.value !== ad?.currency && location?.pathname == '/customer') {
                        showPlannerToast({
                          options: {
                            customToast: (
                              <CustomToast
                                altText={''}
                                title={`Please promote the Ad in the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''} market. Simply click on the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''}  flag at the top panel.`}
                                textColor="#FFF"
                                message={''}
                                backgroundColor="#000"
                              />
                            )
                          },
                          message: 'message'
                        })
                      } else {
                        setPromoteCurrency(ad?.currency)
                        setShowRetry(true)
                        setTitle('Promote Ad')
                        setButtonText('Promote')
                        setCurrentlyClickedAd(index)
                      }
                    }}
                    style={{
                      backgroundColor: '#fff',
                      color: 'black',
                      // Force the styles to remain the same on hover
                      transition: 'none' // Disable any transitions
                    }}
                    type="button"
                    className="mt-4 w-[150px] whitespace-nowrap rounded-lg !border-[1.5px] !border-black bg-[#fff] px-7 py-3.5 text-black"
                  >
                    Promote Ad
                  </CustomButton>
                ) : ad?.payment?.status === 'failed' ? (
                  <CustomButton
                    onClick={() => {
                      if (selectedLanguage?.value !== ad?.currency && location?.pathname == '/customer') {
                        showPlannerToast({
                          options: {
                            customToast: (
                              <CustomToast
                                altText={''}
                                title={`Please promote the Ad in the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''} market. Simply click on the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''}  flag at the top panel.`}
                                textColor="#FFF"
                                message={''}
                                backgroundColor="#000"
                              />
                            )
                          },
                          message: 'message'
                        })
                      } else {
                        setPromoteCurrency(ad?.currency)
                        setShowRetry(true)
                        setTitle('Retry Payment')
                        setButtonText('Retry')
                        setCurrentlyClickedAd(index)
                      }
                    }}
                    style={{
                      backgroundColor: '#000',
                      color: 'white',
                      border: 'none',
                      // Force the styles to remain the same on hover
                      transition: 'none' // Disable any transitions
                    }}
                    type="button"
                    className="mt-4 w-[150px] whitespace-nowrap rounded-lg bg-[#000] px-2 py-3.5 text-white"
                  >
                    Retry Payment
                  </CustomButton>
                ) : ad?.payment?.status == null ? (
                  <CustomButton
                    onClick={() => {
                      if (selectedLanguage?.value !== ad?.currency && location?.pathname == '/customer') {
                        showPlannerToast({
                          options: {
                            customToast: (
                              <CustomToast
                                altText={''}
                                title={`Please promote the Ad in the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''} market. Simply click on the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''}  flag at the top panel.`}
                                textColor="#FFF"
                                message={''}
                                backgroundColor="#000"
                              />
                            )
                          },
                          message: 'message'
                        })
                      } else {
                        setPromoteCurrency(ad?.currency)
                        setShowRetry(true)
                        setTitle('Promote Ad')
                        setButtonText('Promote')
                        setCurrentlyClickedAd(index)
                      }
                    }}
                    style={{
                      backgroundColor: '#000',
                      color: 'white',
                      border: 'none',
                      // Force the styles to remain the same on hover
                      transition: 'none' // Disable any transitions
                    }}
                    type="button"
                    className="mt-4 w-[150px] whitespace-nowrap rounded-lg bg-[#000] px-2 py-3.5 text-white"
                  >
                    Pay Now
                  </CustomButton>
                ) : (
                  <></>
                )}
                {/* {ad?.payment?.status === 'failed' && (
                  <Button
                    onClick={() => {
                      setShowRetry(true)
                      setTitle('Promote Ad')
                      setButtonText('Promote')
                      setCurrentlyClickedAd(index)
                    }}
                    style={{
                      backgroundColor: '#000',
                      color: 'white',
                      border: 'none',
                      // Force the styles to remain the same on hover
                      transition: 'none' // Disable any transitions
                    }}
                    htmlType="button"
                    className="mt-4 w-[150px] whitespace-nowrap rounded-lg bg-[#000] px-2 py-[22px] text-white"
                  >
                    Retry Payment
                  </Button>
                )} */}
                {ad?.payment?.status === 'success' && (
                  <TextComponent as="h2" className="mt-8 flex justify-end text-[16px] font-normal text-[#6B7280]">
                    {ad?.promote_plans[0]?.duration_days > 0
                      ? `Payment valid for ${ad?.promote_plans[0]?.duration_days} days`
                      : ''}
                  </TextComponent>
                )}
              </div>
            </div>
            {currentlyClickedAd === index && (
              <RetryPaymentModal
                promoteCurrency={promoteCurrency}
                showRetry={showRetry}
                setCurrentlyClickedAd={setCurrentlyClickedAd}
                setShowRetry={setShowRetry}
                advert={ad.id}
                price={ad.price}
                title={title}
                buttonText={buttonText}
                promotion={false}
              />
            )}
          </SingleAdvertWrapper>
        )
      })}
    </Grid2Layout>
  )
}

export const SingleAdvertWrapper = tw.div`p-2 transform overflow-hidden rounded-lg border-[1.5px] border-[#EAECEF] transition duration-300 hover:scale-105`

export const Grid2Layout = tw.div`grid grid-cols-1 gap-6 md:grid-cols-2 mt-4`

export default Advert
