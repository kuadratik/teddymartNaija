import LoginComponent from '@/components/Auth/Login'
import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import React from 'react'
import {GoogleLogin, useGoogleOneTapLogin} from '@react-oauth/google'
import CustomerLayout from '@/components/Layout/Customerlayout'

const LoginPage = () => {
  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | Login`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="lg:my-6">
          {' '}
          <LoginComponent />
        </div>
      </BaseLayout>
      {/* <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse)
        }}
        onError={() => {
          console.log('Login Failed')
        }}
        useOneTap
      /> */}
    </React.Fragment>
  )
}

LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default LoginPage
