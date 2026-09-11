import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {fileToBase64} from '@/components/Vendor/utils'
import {useUploadImageFileMutation} from '@/services/general/general'
import {useUpdateStoreInformationMutation} from '@/services/Profile'

interface Base64Images {
  images: string[]
}

const useUpdateProfilePicture = () => {
  const [uploadFile, {isLoading, data}] = useUploadImageFileMutation()

  const [updateStoreInformation, {isLoading: updateStoreIsLoading}] = useUpdateStoreInformationMutation()

  const handleUpdateBannerPicture = async ({payload}: {payload: any}) => {
    try {
      // Initialize an empty array to store images
      let base64Images: Base64Images = {images: []}

      // Process profile picture if it's defined
      if (payload.banner_path) {
        const profileImg = await fileToBase64(payload.banner_path as File)
        base64Images.images[0] = profileImg
      }

      await uploadFile({body: base64Images})
        .unwrap()
        .then(res => {
          updateStoreInformation({...payload, banner_path: res?.data[0]})
            .unwrap()
            .then(() => {
              showPlannerToast({
                options: {
                  customToast: (
                    <CustomToast
                      altText={''}
                      title={<>Banner Picture Updated</>}
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
  return {isLoading, updateStoreIsLoading, handleUpdateBannerPicture, data}
}

export default useUpdateProfilePicture
