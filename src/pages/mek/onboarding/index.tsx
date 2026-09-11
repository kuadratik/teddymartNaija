import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import Onboarding from '@/components/Auth/Signup/Onboarding'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import NewStoreComponent from '@/components/Store/components/NewStore'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'

const OnboardingPage = () => {
  const router = useRouter()

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuthenticated = isAuthenticatedToken

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push('/')
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <></>
  }

  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | Onboarding`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <NewNavigation />
        <div className="lg:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="">
              <NewStoreComponent />{' '}
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

OnboardingPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={true}>
      {page}
    </CustomerLayout>
  )
}

export default OnboardingPage
