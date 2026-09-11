import React, {useEffect} from 'react'
import BottomNavigation from './BottomNavigation'
import {useSelector} from 'react-redux'
import {useActiveUserQuery} from '@/services/auth'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
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
  // console.log(isActiveUser)
  // if (isActiveUser) {
  // } else {
  //   dispatch(setActiveStore({activeUser: user?.store[0]}))
  // }
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setCredentials({token: token, user: data?.data}))
      if (isActiveUser) {
        const activeStore = data?.data?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          dispatch(setActiveStore({activeUser: activeStore[0]}))
        } else {
          dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
        }
      } else {
        dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
      }

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
      <div className="mx-auto max-w-[900px]">
        {children}
        <BottomNavigation
          navItems={[
            {title: 'Home', link: '/vendor', icon: 'teenyicons:home-solid'},
            {
              title: `Add ${type === 'product' ? 'Product' : 'Service'}`,
              link: `/vendor/${type === 'product' ? 'add-product' : 'add-service'}`,
              icon: 'lets-icons:add-duotone'
            },
            {title: 'New Store', link: '/vendor/new-store', icon: 'lets-icons:add-duotone'},
            {title: 'Profile', link: '/vendor/profile', icon: 'solar:user-bold'}
          ]}
        />
      </div>
    </div>
  ) : (
    <></>
  )
}

export default VendorLayout
