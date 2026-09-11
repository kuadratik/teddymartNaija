import VerifyVendorComponent from '@/components/Auth/Signup/Verify'
import BaseLayout from '@/components/Layout/BaseLayout'
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
      <BaseLayout className="">
        <div className="md:my-8">
          <VerifyVendorComponent />{' '}
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default VerifyVendorPage
