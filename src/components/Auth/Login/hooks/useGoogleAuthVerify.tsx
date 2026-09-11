import {useGoogleAuthVerifyMutation, useLoginMutation} from '@/services/auth'
import {GoogleAuthType, VendorLoginType} from '../utils'
import {useDispatch} from 'react-redux'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useLocalStorage} from 'react-use'
import {useRouter} from 'next/router'
import {useAppSelector} from '@/hooks/reduxHooks'

const useGoogleAuthVerifyQuery = () => {
  const [googleAuthUser, {isLoading, error, isError}] = useGoogleAuthVerifyMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const {redirect} = router.query

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const handleGoogleAuthUser = async ({payload, setFieldError}: {payload: GoogleAuthType; setFieldError?: any}) => {
    try {
      const response = await googleAuthUser(payload).unwrap()

      const {token, user} = response?.data
      console.log(isActiveUser, response?.data)

      dispatch(setCredentials({token: token, user: user}))
      if (isActiveUser) {
        const activeStore = user?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          dispatch(setActiveStore({activeUser: activeStore[0]}))
        } else {
          dispatch(setActiveStore({activeUser: user?.store[0]}))
        }
      } else {
        if (user?.store) dispatch(setActiveStore({activeUser: user?.store[0]}))
      }
      console.log(token)
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
  return {isLoading, handleGoogleAuthUser, error, isError}
}

export default useGoogleAuthVerifyQuery
