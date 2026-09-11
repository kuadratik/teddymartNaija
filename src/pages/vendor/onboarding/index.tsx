import Onboarding from '@/components/Auth/Signup/Onboarding'
import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import React from 'react'

const OnboardingPage = () => {
  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | Onboarding`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="">
              <Onboarding />{' '}
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default OnboardingPage
