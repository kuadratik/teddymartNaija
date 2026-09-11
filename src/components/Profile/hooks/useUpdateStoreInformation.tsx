import {useUpdateStoreInformationMutation} from '@/services/Profile'
import {VendorStoreInformationType} from '../utils'
import {useRouter} from 'next/router'

const useUpdateStoreInformation = () => {
  const router = useRouter()

  const [updateStoreInformation, {isLoading}] = useUpdateStoreInformationMutation()
  const updateVendorProfileHandler = async (payload: VendorStoreInformationType) => {
    try {
      await updateStoreInformation(payload)
        .unwrap()
        .then(res => {
          router.push('/vendor/profile')
        })
    } catch (err) {
      console.log(err, 'Error updating store information')
    }
  }

  return {updateVendorProfileHandler, isLoading}
}

export default useUpdateStoreInformation
