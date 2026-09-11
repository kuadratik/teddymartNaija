import {useAppSelector, useAppDispatch} from '@/hooks/reduxHooks'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {parseCookies} from 'nookies'
import {setSuperAdminCredentials} from '@/redux/apiSlice/superAdminAuthSlice'

export const useSuperAdminAuth = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {token, admin} = useAppSelector(state => state.superAdminAuth)
  const [isInitialized, setIsInitialized] = useState(false)

  // Restore auth state from cookies and localStorage on mount
  useEffect(() => {
    if (!token || !admin) {
      const cookies = parseCookies()
      const superAdminToken = cookies.superAdminToken

      if (superAdminToken) {
        // Try to get admin data from localStorage
        const storedAdminData = localStorage.getItem('superAdminData')
        if (storedAdminData) {
          try {
            const adminData = JSON.parse(storedAdminData)
            // Restore credentials to Redux
            dispatch(setSuperAdminCredentials({token: superAdminToken, admin: adminData}))
            setIsInitialized(true)
            return
          } catch (error) {
            console.error('Failed to parse stored admin data:', error)
          }
        }
      }
    }
    setIsInitialized(true)
  }, [dispatch, token, admin])

  // Redirect to login if not authenticated after initialization
  useEffect(() => {
    if (isInitialized && (!token || !admin)) {
      router.replace('/super-admin/login')
    }
  }, [isInitialized, token, admin, router])

  return {token, admin, isAuthenticated: !!(token && admin), isInitialized}
}
