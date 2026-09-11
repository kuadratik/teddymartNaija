import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppSelector} from '@/hooks/reduxHooks'
import {logout} from '@/redux/apiSlice/authSlice'
import {useLogoutMutation} from '@/services/Profile'
import {Uuid} from '@/utils/fx'
import {useRouter} from 'next/router'
import {destroyCookie, parseCookies, setCookie} from 'nookies'
import {useDispatch} from 'react-redux'

const useLogout = () => {
  const router = useRouter()
  const {pathname} = router
  console.log('🚀 ~ useLogout ~ pathname:', pathname)
  const isRedirectToLogin =
    pathname === '/post-ad' ||
    pathname === '/mek/onboarding' ||
    pathname === '/mek/verify' ||
    pathname.includes('/vendor/dashboard')
  const [logoutUser, {isLoading}] = useLogoutMutation()
  const dispatch = useDispatch()
  const id = Uuid()
  const activeUser = useAppSelector(state => state.auth.activeUser)

  const logoutUserHandler = async ({logoutFunc}: {logoutFunc?: VoidFunction}) => {
    try {
      // Get current Clip-Uid value before logout
      const cookies = parseCookies()
      const currentClipUid = cookies['Clip-Uid'] || id

      if (activeUser?.id) {
        localStorage.setItem(
          'lastActiveStoreId',
          JSON.stringify({
            id: activeUser.id,
            payment_status: activeUser.payment_status
          })
        )
      }

      await logoutUser({})
        .unwrap()
        .then(res => {
          // Remove user data from localStorage but preserve Clip-Uid
          localStorage.removeItem('authUser')
          localStorage.removeItem('selectedShippingAddress')
          localStorage.removeItem('authToken')

          // Clean up Echo connection on logout
          if (window.Echo) {
            console.log('Disconnecting websocket from logout handler')
            window.Echo.disconnect()
          }

          dispatch(logout())
          destroyCookie(null, 'token')

          // Note: We're keeping the Clip-Uid cookie as well

          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Logged out Successfully</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          router.push(isRedirectToLogin ? '/auth/login' : '/', undefined, {shallow: true})

          logoutFunc && logoutFunc()
          // Preserve the current Clip-Uid value instead of generating a new one
          setCookie(null, 'Clip-Uid', currentClipUid, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/'
          })
        })
    } catch (err) {
      console.log(err, 'Error logging out user')
    }
  }

  return {logoutUserHandler, isLoading}
}

export default useLogout
