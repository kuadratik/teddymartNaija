import {useLoginMutation} from '@/services/auth'
import {VendorLoginType} from '../utils'
import {useDispatch} from 'react-redux'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useLocalStorage} from 'react-use'
import {useRouter} from 'next/router'
import {useAppSelector} from '@/hooks/reduxHooks'

const useLoginQuery = () => {
  const [loginUser, {isLoading, error, isError}] = useLoginMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const {redirect} = router.query

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const handleLoginUser = async ({payload, setFieldError}: {payload: VendorLoginType; setFieldError?: any}) => {
    try {
      const response = await loginUser(payload).unwrap()

      const {token, user} = response?.data
      dispatch(setCredentials({token: token, user: user}))
      if (isActiveUser) {
        const activeStore = user?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          dispatch(setActiveStore({activeUser: activeStore[0]}))
        } else {
          dispatch(setActiveStore({activeUser: user?.store[0]}))
        }
      } else {
        dispatch(setActiveStore({activeUser: user?.store[0]}))
      }
      // Optionally, update local storage
      setToken(token)
      setUser(user as any)
      setTimeout(() => {
        router.push((redirect as string) || '/')
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
