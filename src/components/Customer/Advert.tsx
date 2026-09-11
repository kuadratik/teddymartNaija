import {useAppSelector} from '@/hooks/reduxHooks'
import useQueryParams from '@/hooks/useQueryParams'
import {useGetUserAdsGalleryQuery} from '@/services/Adsgallery'
import {GetAdsGalleryQuery} from '@/types/adsgallery'
import {Button, Pagination, Tabs} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useLocalStorage, useLocation} from 'react-use'
import tw from 'tailwind-styled-components'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '../SharedUI/TextComponent'
import SingleAdvertCardProfile from './Advert/SingleAdvertCardProfile'
import useVerifyPayment from './hooks/useVerifyPayment'
import Promotions from './Promotions'

const Advert = () => {
  const router = useRouter()

  const {selectedLanguage} = useAppSelector(state => state.country)
  const [adStatus, setAdStatus] = useLocalStorage<string | null>('adStatus', null)
  console.log("🚀 ~ Advert ~ adStatus:", adStatus)

  // const {type} = useSelector((state: any) => state.vendor)

  const {queryParams, updateQueryParams} = useQueryParams<GetAdsGalleryQuery>({
    page: 1
  })

  const {
    data: adsInfo,
    isLoading: adsIsLoading,
    isFetching: adsIsFetching,
    isSuccess,
    refetch
  } = useGetUserAdsGalleryQuery({params: queryParams})

  const [key, setKey] = useState('adverts')

  const onChange = (key: string) => {
    setKey(key)
  }

  useEffect(() => {
    setTimeout(() => {
      if ((adStatus as any)?.listing?.id) {
        refetch()
        setAdStatus(null)
        // clear the local storage
        localStorage.removeItem('adStatus')
      }
    }, 2000)
  }, [(adStatus as any)?.listing?.id])

  const tabsData = [
    {
      tabTitle: <p className="p_">My Adverts</p>,
      tabBody: (
        <AdvertComponent
          isSuccess={isSuccess}
          adsRefetch={refetch}
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
            isSuccess={isSuccess}
            adsRefetch={refetch}
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
  adsRefetch,
  selectedLanguage,
  isSuccess
}: {
  data: any
  adsIsLoading: boolean
  adsIsFetching: boolean
  adsRefetch: () => void
  selectedLanguage: any
  isSuccess: boolean
}) => {
  console.log('🚀 ~ data:', data)
  const router = useRouter()

  const query = router.query

  const location = useLocation()

  const [promoteCurrency, setPromoteCurrency] = React.useState()
  const [closeCurrentWindow, setCloseCurrentWindow] = useState(false)
  console.log('🚀 ~ closeCurrentWindow:', closeCurrentWindow)
  const {isLoading, verifyPaymentHandler, isSuccess: isSuccessVerify} = useVerifyPayment()

  const [showRetry, setShowRetry] = React.useState(false)
  const [title, setTitle] = React.useState('Promote Ad')
  const [buttonText, setButtonText] = React.useState('Promote')
  const [currentlyClickedAd, setCurrentlyClickedAd] = React.useState<any>(null)

  useEffect(() => {
    if (query?.reference) {
      verifyPaymentHandler({
        token: query?.reference ?? '',
        gateway: 'paystack',
        adsRefetch: adsRefetch
      })
    }
    if (query?.token) {
      verifyPaymentHandler({
        token: query?.token ?? '',
        gateway: 'paypal',
        adsRefetch: adsRefetch
      })
    }
  }, [])

  useEffect(() => {
    if (router?.query?.token && router?.query?.PayerID) {
      setTimeout(async () => {
        try {
          await adsRefetch()
        } catch (error) {
          console.error('Refetch failed:', error)
        } finally {
          // Try to close the window
          const closeWindow: any = window.close()
          adsRefetch()
          // If closing fails, redirect instead
          if (!closeWindow) {
            setCloseCurrentWindow(true)
            const path = window.location.pathname
            const tab = router.query.tab || 'adverts'
            window.location.href = `${path}?tab=${tab}`
            adsRefetch()
          }
        }
      }, 1000)
      setShowRetry(false)
    }
  }, [router?.query?.token, router?.query?.PayerID])
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
    <>
      {router?.pathname !== '/vendor/user-profile' && <h3 className="text-[24px] font-semibold">My Ads</h3>}
      <Grid2Layout className="mt-2">
        {data?.map((ad: any, index: React.Key | null | undefined) => {
          return (
            <SingleAdvertCardProfile
              buttonText={buttonText}
              currentlyClickedAd={currentlyClickedAd}
              index={index}
              adsRefetch={adsRefetch}
              promoteCurrency={promoteCurrency}
              selectedLanguage={selectedLanguage}
              setShowRetry={setShowRetry}
              showRetry={showRetry}
              setTitle={setTitle}
              setButtonText={setButtonText}
              setCurrentlyClickedAd={setCurrentlyClickedAd}
              setPromoteCurrency={setPromoteCurrency}
              title={title}
              ad={ad}
              key={index}
            />
          )
        })}
      </Grid2Layout>
    </>
  )
}

export const SingleAdvertWrapper = tw.div`p-2 transform overflow-hidden rounded-lg  border-[#EAECEF] transition duration-300 hover:scale-105`

export const Grid2Layout = tw.div`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4`

export default Advert
