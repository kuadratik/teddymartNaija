import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetUserPromotionQuery} from '@/services/Adsgallery'
import {Button} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '../SharedUI/TextComponent'
import {Grid2Layout} from './Advert'
import SingleAdvertPromotionCard from './Advert/SingleAdvertPromotionCard'
import useVerifyPayment from './hooks/useVerifyPayment'

const Promotions = () => {
  const router = useRouter()

  const query = router.query

  const {isLoading, verifyPaymentHandler} = useVerifyPayment()

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const {data: promotionInfo, isLoading: promotionIsLoading, refetch} = useGetUserPromotionQuery({})
  const [showRetry, setShowRetry] = React.useState(false)
  const [title, setTitle] = React.useState('Promote Ad')
  const [promoteCurrency, setPromoteCurrency] = React.useState()

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

  if (promotionIsLoading) {
    return <SkeletonLoaderForPage />
  }

  if (!promotionInfo?.data?.length) {
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
              router.push('/promote-store')
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
            Promote Store
          </Button>
        </div>
      </>
    )
  }

  return (
    <Grid2Layout className="">
      {promotionInfo?.data?.map((ad: any, index: React.Key | null | undefined) => (
        <SingleAdvertPromotionCard
          adsRefetch={refetch}
          key={index}
          ad={ad}
          index={index}
          buttonText={buttonText}
          currentlyClickedAd={currentlyClickedAd}
          setCurrentlyClickedAd={setCurrentlyClickedAd}
          setButtonText={setButtonText}
          setTitle={setTitle}
          title={title}
          promoteCurrency={promoteCurrency}
          setPromoteCurrency={setPromoteCurrency}
          showRetry={showRetry}
          setShowRetry={setShowRetry}
        />
      ))}
    </Grid2Layout>
  )
}

export default Promotions
