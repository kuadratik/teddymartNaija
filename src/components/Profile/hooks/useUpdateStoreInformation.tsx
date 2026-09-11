import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useUpdateStoreInformationMutation} from '@/services/Profile'
import {useRouter} from 'next/router'
import {VendorStoreInformationType} from '../utils'

const useUpdateStoreInformation = () => {
  const router = useRouter()

  const [updateStoreInformation, {isLoading, isSuccess}] = useUpdateStoreInformationMutation()
  const updateVendorProfileHandler = async (
    payload: VendorStoreInformationType,
    resetForm?: VoidFunction,
    resetFormCallback?: () => void
  ) => {
    try {
      const response = await updateStoreInformation(payload)
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
          if (typeof resetFormCallback === 'function') {
            console.log('Calling resetFormCallback after successful update')
            resetFormCallback()
          }

          // router.push('/vendor/profile')
        })
    } catch (err: any) {
      console.log(err, 'Error updating store information')
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={err?.data.message || <>An Error occurred!</>}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'Please try again'
      })
    }
  }

  return {updateVendorProfileHandler, isLoading, isSuccess}
}

export default useUpdateStoreInformation
