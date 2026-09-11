import Signup from '@/components/Auth/Signup/Signup'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import React from 'react'

const SignUpPage = () => {
  return (
    <React.Fragment>
      <SEOHead
        title={`AfricanDiasporaMart | Sign Up`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="lg:my-8">
          {' '}
          <Signup />
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

SignUpPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default SignUpPage
