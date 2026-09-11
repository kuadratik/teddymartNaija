import {useSignUpMutation, useVerifyMutation} from '@/services/auth'
import {SignUpRequestModel, VerifyRequestModel} from '@/types/types'
import {useRouter} from 'next/router'
import {useLocalStorage} from 'react-use'
import useLoginQuery from '../../Login/hooks/useLogin'
import {useEffect, useState} from 'react'

const useVerifyQuery = () => {
  const [verifyUser, {isLoading}] = useVerifyMutation()
  const router = useRouter()

  const {isLoading: loginUser, handleLoginUser} = useLoginQuery()

  const [signUpUser, setSignUpUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = JSON.parse(localStorage.getItem('signUpUser')!)
      setSignUpUser(uuid)
    }
  }, []) // Run only once on mount

  const handleVerifyUser = async ({payload, setFieldError}: {payload: VerifyRequestModel; setFieldError?: any}) => {
    try {
      await verifyUser(payload)
        .unwrap()
        .then(res => {
          handleLoginUser({payload: signUpUser})
        })
    } catch (err: any) {
      if (err?.data?.errors?.code && err?.data?.errors?.code[0].includes('The provided OTP is invalid.')) {
        setFieldError('code', 'OTP is invalid')
      }
    }
  }
  return {isLoading, handleVerifyUser}
}

export default useVerifyQuery
