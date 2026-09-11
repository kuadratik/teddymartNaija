import {useUpdateProfileMutation} from '@/services/Profile'
import {VendorPersonalType} from '../utils'
import {useRouter} from 'next/router'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'

const useUpdateProfile = () => {
  const router = useRouter()

  const [updateVendorProfile, {isLoading}] = useUpdateProfileMutation()
  const updateVendorProfileHandler = async (payload: VendorPersonalType) => {
    try {
      await updateVendorProfile(payload)
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Personal Information Updated</>}
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
      console.log(err, 'Error updating vendor profile')
    }
  }

  return {updateVendorProfileHandler, isLoading}
}

export default useUpdateProfile
