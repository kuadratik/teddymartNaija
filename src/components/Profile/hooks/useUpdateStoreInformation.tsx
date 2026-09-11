import {useUpdateStoreInformationMutation} from '@/services/Profile'
import {VendorStoreInformationType} from '../utils'
import {useRouter} from 'next/router'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'

const useUpdateStoreInformation = () => {
  const router = useRouter()

  const [updateStoreInformation, {isLoading}] = useUpdateStoreInformationMutation()
  const updateVendorProfileHandler = async (payload: VendorStoreInformationType, resetForm?: VoidFunction) => {
    try {
      await updateStoreInformation(payload)
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Store Information Updated</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          // router.push('/vendor/profile')
        })
    } catch (err) {
      console.log(err, 'Error updating store information')
    }
  }

  return {updateVendorProfileHandler, isLoading}
}

export default useUpdateStoreInformation
