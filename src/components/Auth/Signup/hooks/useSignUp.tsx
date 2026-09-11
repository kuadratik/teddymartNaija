import {useSignUpMutation} from '@/services/auth'
import {SignUpRequestModel} from '@/types/types'
import {useRouter} from 'next/router'
import {useLocalStorage} from 'react-use'

const useSignUpQuery = () => {
  const [signUpUser, {isLoading}] = useSignUpMutation()
  const router = useRouter()

  const redirect = Array.isArray(router.query.redirect) ? router.query.redirect[0] : router.query.redirect
  const referralCode = Array.isArray(router.query.referral_code)
    ? router.query.referral_code[0]
    : router.query.referral_code
  const referralType = Array.isArray(router.query.referralType)
    ? router.query.referralType[0]
    : router.query.referralType

  const [signUpUserCred, setSignUpUserCred] = useLocalStorage<SignUpRequestModel | null>('signUpUser', null)

  const handleSignUpUser = async ({payload, setFieldError}: {payload: SignUpRequestModel; setFieldError?: any}) => {
    console.log('🚀 ~ handleSignUpUser ~ payload:', payload)
    try {
      await signUpUser(payload)
        .unwrap()
        .then(res => {
          setSignUpUserCred(payload as SignUpRequestModel)

          setTimeout(() => {
            // let verifyUrl = '/auth/login'
            let verifyUrl = '/auth/verify'
            const queryParams = new URLSearchParams()

            if (redirect) {
              queryParams.append('redirect', redirect)
            }
            if (referralCode || payload.refferalCode) {
              queryParams.append('referral_code', referralCode || (payload as any).refferalCode)
            }
            if (referralType) {
              queryParams.append('referralType', referralType)
            }

            const queryString = queryParams.toString()
            if (queryString) {
              verifyUrl += `?${queryString}`
            }

            router.push(verifyUrl)
          }, 0)
        })
    } catch (err: any) {
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The email has already been taken.')) {
        setFieldError('email', 'Email has already been taken')
      }
      if (err?.data?.errors?.password && err?.data?.errors?.password[0]) {
        setFieldError('password', err?.data?.errors?.password[0])
      }
    }
  }
  return {isLoading, handleSignUpUser}
}

export default useSignUpQuery
