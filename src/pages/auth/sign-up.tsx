import Signup from '@/components/Auth/Signup/Signup'
import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import React from 'react'

const SignUpIndex = () => {
  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | Sign Up`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="md:my-8">
          {' '}
          <Signup />
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default SignUpIndex
