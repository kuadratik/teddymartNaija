'use client'

import VerifyVendorComponent from '@/components/Auth/Signup/Verify'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import {useAppSelector} from '@/hooks/reduxHooks'
import {SignUpRequestModel} from '@/types/types'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {useLocalStorage} from 'react-use'

export default function VerifyVendorPage() {
  const router = useRouter()
  const [signUpUserCred, setSignUpUserCred] = useLocalStorage<SignUpRequestModel | null>('signUpUser', null)

  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token)

  useEffect(() => {
    document.title = 'myEKI | Verify'

    if (isAuthenticatedUser && isAuthenticatedToken) {
      router.push('/')
    }

    if (!signUpUserCred) {
      router.push('/')
    }
  }, [isAuthenticatedUser, isAuthenticatedToken, signUpUserCred, router])

  if (!signUpUserCred) return null

  return (
    <CustomerLayout>
      <BaseLayout className="">
        <div className="">
          <VerifyVendorComponent />
        </div>
      </BaseLayout>
    </CustomerLayout>
  )
}
