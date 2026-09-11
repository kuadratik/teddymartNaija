import {useChangePasswordMutation} from '@/services/Profile'
import {VendorPasswordType} from '../utils'
import {useRouter} from 'next/router'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'

const useChangeVendorPassword = () => {
  const router = useRouter()

  const [changeVendorPassword, {isLoading}] = useChangePasswordMutation()
  const changeVendorPasswordHandler = async (payload: VendorPasswordType) => {
    try {
      await changeVendorPassword(payload)
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Password Changed Successfully</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          router.push('/vendor/profile')
        })
    } catch (err) {
      console.log(err, 'Error updating vendor password')
    }
  }

  return {changeVendorPasswordHandler, isLoading}
}

export default useChangeVendorPassword
