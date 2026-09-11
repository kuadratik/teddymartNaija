import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import SEOHead from '@/components/SharedUI/SEOHead'
import OnBoardFailed from '@/components/Store/components/PaymentStatus/OnBoardFailed'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'

const OnboardingCancelPaymentPage = () => {
  const router = useRouter()
  const {store_id, reference, gateway} = router.query
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticated = isAuthenticatedToken
  const normalizedGateway = Array.isArray(gateway) ? gateway[0] : gateway
  const normalizedStoreId = Array.isArray(store_id) ? store_id[0] : store_id

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push('/')
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }
  }, [isAuthenticated])

  const onboardingRetryUrl = normalizedStoreId ? `/mek/onboarding?store_id=${normalizedStoreId}` : '/mek/onboarding'
  if (!isAuthenticated) {
    return <></>
  }

  return (
    <React.Fragment>
      <SEOHead
        title={`AfricanDiasporaMart | Onboarding`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <NewNavigation />
        <div className="lg:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="">
              <div className="mx-auto mb-6 flex w-full justify-center px-6 lg:w-[400px]">
                <OnBoardFailed />
              </div>

              <div className="relative bottom-8 flex justify-center">
                <CustomButton
                  type={'button'}
                  onClick={() => router.push(onboardingRetryUrl)}
                  className="w-[90%] rounded-[10px] border border-black bg-white px-1 py-4 text-[14px] text-black hover:bg-gray-50 md:w-[30%]"
                >
                  Try again
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

OnboardingCancelPaymentPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={true}>
      {page}
    </CustomerLayout>
  )
}

export default OnboardingCancelPaymentPage
