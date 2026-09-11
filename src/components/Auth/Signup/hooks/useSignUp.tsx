import {useSignUpMutation} from '@/services/auth'
import {SignUpRequestModel} from '@/types/types'
import {useRouter} from 'next/router'
import {useLocalStorage} from 'react-use'

const useSignUpQuery = () => {
  const [signUpUser, {isLoading}] = useSignUpMutation()
  const router = useRouter()

  const redirect = Array.isArray(router.query.redirect) ? router.query.redirect[0] : router.query.redirect

  const [signUpUserCred, setSignUpUserCred] = useLocalStorage<SignUpRequestModel | null>('signUpUser', null)

  const handleSignUpUser = async ({payload, setFieldError}: {payload: SignUpRequestModel; setFieldError?: any}) => {
    try {
      await signUpUser(payload)
        .unwrap()
        .then(res => {
          setSignUpUserCred(payload as SignUpRequestModel)

          setTimeout(() => {
            if (redirect) {
              router.push(`/auth/verify?redirect=${encodeURIComponent(redirect)}`)
            } else {
              router.push('/auth/verify')
            }
          }, 0)
        })
    } catch (err: any) {
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The email has already been taken.')) {
        setFieldError('email', 'Email has already been taken')
      }
    }
  }
  return {isLoading, handleSignUpUser}
}

export default useSignUpQuery
