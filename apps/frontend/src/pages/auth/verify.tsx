import VerifyVendorComponent from '@/components/Auth/Signup/Verify'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useAppSelector} from '@/hooks/reduxHooks'
import {SignUpRequestModel} from '@/types/types'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useLocalStorage} from 'react-use'

const VerifyVendorPage = () => {
  const router = useRouter()
  const [signUpUserCred, setSignUpUserCred] = useLocalStorage<SignUpRequestModel | null>('signUpUser', null)

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  useEffect(() => {
    if (isAuthenticatedUser && isAuthenticatedToken) {
      // User is already authenticated, redirect to dashboard
      router.push('/')
    }

    if (!signUpUserCred) {
      // User is already authenticated, redirect to dashboard
      router.push('/')
    }
  }, [])

  if (!signUpUserCred) return null // Prevent rendering until sign up user credentials are loaded

  return (
    <React.Fragment>
      <SEOHead
        title={`AfricanDiasporaMart | Verify`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="">
          <VerifyVendorComponent />{' '}
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

VerifyVendorPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default VerifyVendorPage
