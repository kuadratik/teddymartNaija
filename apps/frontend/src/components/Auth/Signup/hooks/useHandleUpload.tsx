import {OnboardingType} from '@/components/Auth/Signup/utils'
import {fileToBase64} from '@/components/Vendor/utils'
import {useUploadImageFileMutation} from '@/services/general/general'

const isFileValue = (value: unknown): value is File => typeof File !== 'undefined' && value instanceof File

type UploadableKeys = 'profile_picture_path' | 'banner_path'

type UploadEntry = {
  key: UploadableKeys
  base64: string
}

const useHandleUploadQuery = () => {
  const [uploadFile, {isLoading}] = useUploadImageFileMutation()

  const handleUploadQuery = async ({
    payload,
    successFunction,
    step
  }: {
    payload: OnboardingType
    successFunction?: ({payload, step}: {payload: OnboardingType; step: number}) => void
    step: number
  }) => {
    try {
      const updatedPayload: OnboardingType = {...payload}
      const uploadEntries: UploadEntry[] = []

      if (isFileValue(payload.profile_picture_path)) {
        const profileImg = await fileToBase64(payload.profile_picture_path)
        uploadEntries.push({key: 'profile_picture_path', base64: profileImg})
      }

      if (isFileValue(payload.banner_path)) {
        const bannerImg = await fileToBase64(payload.banner_path)
        uploadEntries.push({key: 'banner_path', base64: bannerImg})
      }

      if (!uploadEntries.length) {
        successFunction?.({payload: updatedPayload, step})
        return
      }

      const response = await uploadFile({body: {images: uploadEntries.map(entry => entry.base64)}}).unwrap()
      const uploadedPaths = response?.data ?? []

      uploadEntries.forEach((entry, index) => {
        if (uploadedPaths[index]) {
          updatedPayload[entry.key] = uploadedPaths[index]
        }
      })

      successFunction?.({payload: updatedPayload, step})
    } catch (err: unknown) {
      console.error('useHandleUploadQuery error', err)
    }
  }
  return {isLoading, handleUploadQuery}
}

export default useHandleUploadQuery
