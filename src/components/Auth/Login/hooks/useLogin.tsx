import {useAppSelector} from '@/hooks/reduxHooks'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useLoginMutation} from '@/services/auth'
import {useRouter} from 'next/router'
import {useDispatch} from 'react-redux'
import {useLocalStorage} from 'react-use'
import {VendorLoginType} from '../utils'

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
      console.log("🚀 ~ handleLoginUser ~ response:", response)

      const {token, user} = response?.data
      dispatch(setCredentials({token: token, user: user}))
      let storeToSet = null
      const rawLastActiveStore = localStorage.getItem('lastActiveStoreId')
      let lastActiveStore: { id?: number | string; payment_status?: string } | null = null

      if (rawLastActiveStore) {
        try {
          lastActiveStore = JSON.parse(rawLastActiveStore)
        } catch (e) {
          // fallback: value might be a simple id string/number
          lastActiveStore = isNaN(Number(rawLastActiveStore))
        ? { id: rawLastActiveStore }
        : { id: Number(rawLastActiveStore) }
        }
      }

      console.log('🚀 ~ handleLoginUser ~ lastActiveStore:', lastActiveStore)

      if (isActiveUser) {
        const activeStore = user?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          storeToSet = activeStore[0]
        } else {
          storeToSet = user?.store[0]
        }
      } else if (lastActiveStore?.id) {
        const lastStore = user?.store.find((item: any) => item.id == lastActiveStore?.id)
        if (lastStore) {
          storeToSet = lastStore
        } else {
          storeToSet = user?.store[0]
        }
      } else {
        storeToSet = user?.store[0]
      }

      if (storeToSet) {
        dispatch(setActiveStore({activeUser: storeToSet}))
      }

      // Optionally, update local storage
      setToken(token)
      setUser(user as any)

      // Set hasSeenCountryModal to false to ensure modal appears
      localStorage.removeItem('hasSeenCountryModal')
      localStorage.setItem('hasSeenCountryModal', 'false')
      localStorage.removeItem('signUpUser')

      // Explicitly trigger storage event to notify other components
      window.dispatchEvent(new Event('storage'))
      console.log('Login successful, modal state reset')

      // Navigate and force reload
      if (storeToSet && storeToSet.active === 0 && storeToSet.payment_status !== 'success') {
        router.push(`/mek/onboarding?store_id=${storeToSet.id}`)
      } else {
        const targetPath = (redirect as string) || '/'
        router.replace(targetPath)
      }
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
