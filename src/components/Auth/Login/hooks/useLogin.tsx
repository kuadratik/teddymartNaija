import {useLoginMutation} from '@/services/auth'
import {VendorLoginType} from '../utils'
import {useDispatch} from 'react-redux'
import {setCredentials} from '@/redux/apiSlice/authSlice'
import {useLocalStorage} from 'react-use'
import {useRouter} from 'next/router'

const useLoginQuery = () => {
  const [loginUser, {isLoading, error, isError}] = useLoginMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const {redirect} = router.query

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)

  const handleLoginUser = async ({payload, setFieldError}: {payload: VendorLoginType; setFieldError?: any}) => {
    try {
      const response = await loginUser(payload).unwrap()

      const {token, user} = response?.data

      dispatch(setCredentials({token: token, user: user}))

      // Optionally, update local storage
      setToken(token)
      setUser(user as any)
      setTimeout(() => {
        if (user.has_store) {
          router.push('/vendor')
        } else {
          router.push((redirect as string) || '/')
        }
      }, 0)
      localStorage.removeItem('signUpUser')
    } catch (err: any) {
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The provided credentials are invalid.')) {
        setFieldError('password', 'Password is invalid')
      }
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The selected email is invalid.')) {
        setFieldError('email', 'Email is invalid')
      }
    }
  }
  return {isLoading, handleLoginUser, error, isError}
}

export default useLoginQuery



