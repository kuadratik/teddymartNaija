import {OnboardingType} from '@/components/Auth/Signup/utils'
import {fileToBase64} from '@/components/Vendor/utils'
import {useResendOtpMutation} from '@/services/auth'
import {useUploadImageFileMutation} from '@/services/general/general'
import {useUpdateStoreInformationMutation} from '@/services/Profile'
import {VendorStoreInformationType} from '../utils'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'

interface Base64Images {
  images: string[]
}

const useUpdateProfilePicture = () => {
  const [uploadFile, {isLoading}] = useUploadImageFileMutation()

  const [updateStoreInformation, {isLoading: updateStoreIsLoading}] = useUpdateStoreInformationMutation()

  const handleUpdateProfilePicture = async ({payload}: {payload: any}) => {
    try {
      // Initialize an empty array to store images
      let base64Images: Base64Images = {images: []}

      // Process profile picture if it's defined
      if (payload.profile_picture_path) {
        const profileImg = await fileToBase64(payload.profile_picture_path as File)
        base64Images.images[0] = profileImg
      }

      await uploadFile({body: base64Images})
        .unwrap()
        .then(res => {
          updateStoreInformation({...payload, profile_picture_path: res?.data[0]})
            .unwrap()
            .then(() => {
              showPlannerToast({
                options: {
                  customToast: (
                    <CustomToast
                      altText={''}
                      title={<>Profile Picture Updated</>}
                      textColor="#FFF"
                      message={''}
                      backgroundColor="#000"
                    />
                  )
                },
                message: 'message'
              })
            })
        })
    } catch (err: any) {}
  }
  return {isLoading, updateStoreIsLoading, handleUpdateProfilePicture}
}

export default useUpdateProfilePicture
