import VerifyVendorComponent from '@/components/Auth/Signup/Verify'
import BaseLayout from '@/components/Layout/BaseLayout'
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
        title={`myEKI | Verify`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="md:my-8">
          <VerifyVendorComponent />{' '}
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default VerifyVendorPage
