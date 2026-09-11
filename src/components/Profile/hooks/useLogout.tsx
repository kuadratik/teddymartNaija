import {useChangePasswordMutation, useLogoutMutation} from '@/services/Profile'
import {VendorPasswordType} from '../utils'
import {useRouter} from 'next/router'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {useDispatch} from 'react-redux'
import {logout} from '@/redux/apiSlice/authSlice'
import {destroyCookie} from 'nookies'
import {Uuid} from '@/utils/fx'

const useLogout = () => {
  const router = useRouter()

  const [logoutUser, {isLoading}] = useLogoutMutation()
  const dispatch = useDispatch()
  const id = Uuid()
  const logoutUserHandler = async ({logoutFunc}: {logoutFunc?: VoidFunction}) => {
    try {
      await logoutUser({})
        .unwrap()
        .then(res => {
          localStorage.removeItem('authUser')
          localStorage.removeItem('authToken')
          localStorage.removeItem('Clip-Uid')
          dispatch(logout())
          destroyCookie(null, 'token')

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

          router.push('/')

          logoutFunc && logoutFunc()

          localStorage.setItem('Clip-Uid', JSON.stringify(id))
        })
    } catch (err) {
      console.log(err, 'Error logging out user')
    }
  }

  return {logoutUserHandler, isLoading}
}

export default useLogout
