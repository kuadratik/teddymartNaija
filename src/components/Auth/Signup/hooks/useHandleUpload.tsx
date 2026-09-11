import {OnboardingType} from '@/components/Auth/Signup/utils'
import {fileToBase64} from '@/components/Vendor/utils'
import {useResendOtpMutation} from '@/services/auth'
import {useUploadImageFileMutation} from '@/services/general/general'

const useHandleUploadQuery = () => {
  const [uploadFile, {isLoading}] = useUploadImageFileMutation()

  const handleUploadQuery = async ({payload, successFunction}: {payload: OnboardingType; successFunction?: any}) => {
    try {
      const profileImg = await fileToBase64(payload.profile_picture_path as File)
      const bannerImg = await fileToBase64(payload.banner_path as File)

      let base64Images = {
        images: [profileImg, bannerImg]
      }

      await uploadFile({body: base64Images})
        .unwrap()
        .then(res => {
          console.log(res?.data)
          successFunction?.({payload: {...payload, profile_picture_path: res?.data[0], banner_path: res?.data[1]}})
        })
    } catch (err: any) {}
  }
  return {isLoading, handleUploadQuery}
}

export default useHandleUploadQuery
