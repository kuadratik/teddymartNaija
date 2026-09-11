import React, {useEffect} from 'react'
import {Grid2Layout, SingleAdvertWrapper} from './Advert'
import Image from 'next/image'
import {useGetUserPromotionQuery} from '@/services/Adsgallery'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '../SharedUI/TextComponent'
import {Button} from 'antd'
import RetryPaymentModal from './RetryPaymentModal'
import {useRouter} from 'next/router'
import {useAppSelector} from '@/hooks/reduxHooks'
import useVerifyPayment from './hooks/useVerifyPayment'

const Promotions = () => {
  const router = useRouter()

  const query = router.query

  const {isLoading, verifyPaymentHandler} = useVerifyPayment()

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const {data: promotionInfo, isLoading: promotionIsLoading} = useGetUserPromotionQuery({})
  const [showRetry, setShowRetry] = React.useState(false)
  const [title, setTitle] = React.useState('Promote Ad')
  const [promoteCurrency, setPromoteCurrency] = React.useState()

  const [buttonText, setButtonText] = React.useState('Promote')

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
        <SingleAdvertWrapper key={index} className="">
          <div className="flex flex-col p-3 lg:flex-row lg:p-6">
            <div className="h-[300px] rounded-full lg:h-[130px] lg:w-1/3">
              <Image
                onError={error => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                }}
                src={`${process.env.imageBaseUrl}/${ad?.banner_path}`}
                alt={ad?.name}
                width={200}
                height={50}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>

            <div className="flex flex-col p-4 lg:w-2/3">
              <TextComponent as="h2" className="text-[18px] font-bold leading-[22px] text-[#4d4d4d]">
                {ad?.name}
              </TextComponent>

              <TextComponent as="h2" className="mt-2 text-[18px] font-bold leading-[22px] text-[#4d4d4d]">
                {ad?.type === 'product' ? 'Product' : 'Service'}
              </TextComponent>

              <TextComponent as="h2" className="mt-2 text-[16px] font-normal text-[#6B7280]">
                {ad?.promoted_stores?.payment_id == null
                  ? 'Awaiting your payment'
                  : ad?.promoted_stores?.status === 'pending_payment'
                    ? 'Payment Pending'
                    : ad?.promoted_stores?.status === 'active'
                      ? 'Payment Successful'
                      : 'Payment Unsuccessful'}
              </TextComponent>
              {ad?.promoted_stores?.status === 'failed' && (
                <Button
                  onClick={() => {
                    setPromoteCurrency(ad?.currency)
                    setShowRetry(true)
                    setTitle('Retry Payment')
                    setButtonText('Retry')
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
              )}

              {ad?.promoted_stores?.payment_id == null && (
                <Button
                  onClick={() => {
                    setPromoteCurrency(ad?.currency)
                    setShowRetry(true)
                    setTitle('Promote Store')
                    setButtonText('Promote')
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
                  Pay Now
                </Button>
              )}

              {ad?.promoted_stores?.status === 'active' && (
                <TextComponent as="h2" className="mt-8 flex justify-end text-[16px] font-normal text-[#6B7280]">
                  {ad?.promoted_stores?.store_promote_plan?.duration_days > 0
                    ? `Payment valid for ${ad?.promoted_stores?.store_promote_plan?.duration_days} days`
                    : ''}
                </TextComponent>
              )}
            </div>
          </div>
          {index === promotionInfo?.data?.length - 1 && (
            <RetryPaymentModal
              showRetry={showRetry}
              promoteCurrency={promoteCurrency}
              setShowRetry={setShowRetry}
              promotion={true}
              advert={ad.id}
              price={ad.price}
              title={title}
              buttonText={buttonText}
            />
          )}
        </SingleAdvertWrapper>
      ))}
    </Grid2Layout>
  )
}

export default Promotions
