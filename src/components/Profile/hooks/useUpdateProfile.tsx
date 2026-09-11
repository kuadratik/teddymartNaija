import {useUpdateProfileMutation} from '@/services/Profile'
import {VendorPersonalType} from '../utils'
import {useRouter} from 'next/router'

const useUpdateProfile = () => {
  const router = useRouter()

  const [updateVendorProfile, {isLoading}] = useUpdateProfileMutation()
  const updateVendorProfileHandler = async (payload: VendorPersonalType) => {
    try {
      await updateVendorProfile(payload)
        .unwrap()
        .then(res => {
          router.push('/vendor/profile')
        })
    } catch (err) {
      console.log(err, 'Error updating vendor profile')
    }
  }

  return {updateVendorProfileHandler, isLoading}
}

export default useUpdateProfile
