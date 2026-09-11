import React, {useEffect} from 'react'
import BottomNavigation from './BottomNavigation'
import {useSelector} from 'react-redux'
import {useActiveUserQuery} from '@/services/auth'
import {useAppDispatch} from '@/hooks/reduxHooks'
import {setCredentials} from '@/redux/apiSlice/authSlice'
import {useLocalStorage} from 'react-use'
import {useRouter} from 'next/router'

interface IVendorLayoutProp {
  children: React.ReactNode
}

const VendorLayout = ({children}: IVendorLayoutProp) => {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const {type} = useSelector((state: any) => state.vendor)

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)

  const {isLoading, data, isSuccess} = useActiveUserQuery({})
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setCredentials({token: token, user: data?.data}))
      // Optionally, update local storage

      setToken(token)
      setUser(data?.data as any)

      if (!data?.data?.has_store) {
        // Redirect to dashboard or other page
        setTimeout(() => {
          router.push('/')
        }, 0)
        // Example redirect to dashboard
      }
    }
  }, [data])

  return data?.data?.has_store ? (
    <div className="pb-[100px]">
      {children}
      <BottomNavigation
        navItems={[
          {title: 'Home', link: '/vendor', icon: 'teenyicons:home-solid'},
          {
            title: `Add ${type === 'product' ? 'Product' : 'Service'}`,
            link: `/vendor/${type === 'product' ? 'add-product' : 'add-service'}`,
            icon: 'lets-icons:add-duotone'
          },
          {title: 'Profile', link: '/vendor/profile', icon: 'solar:user-bold'}
        ]}
      />
    </div>
  ) : (
    <></>
  )
}

export default VendorLayout
