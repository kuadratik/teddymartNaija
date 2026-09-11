import DragDropFile from '@/components/SharedUI/DragDropFile'
import ProgressBar from '@/components/SharedUI/ProgressBar'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useEffect, useState} from 'react'
import {VendorOnboardingProps} from '../utils'

const UploadInformation = (props: VendorOnboardingProps) => {
  const {handleChange, title_header, values, touched, errors, setFieldValue, showProfile = true} = props
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const [bannerUploadedDetails, setBannerUploadedDetails] = useState<File | null>(null)
  const [bannerUploadedFile, setBannerUploadedFile] = useState<string | null>(null)

  // Initialize profile picture prefill
  useEffect(() => {
    if (values.profile_picture_path) {
      if (typeof values.profile_picture_path === 'string') {
        // If it's a URL string, set it as the uploaded file
        setUploadedFile(values.profile_picture_path)
      } else if (values.profile_picture_path instanceof File) {
        // If it's already a File object
        setUploadedDetails(values.profile_picture_path)
      }
    }
  }, [values.profile_picture_path])

  // Initialize banner prefill
  useEffect(() => {
    if (values.banner_path) {
      if (typeof values.banner_path === 'string') {
        // If it's a URL string, set it as the uploaded file
        setBannerUploadedFile(values.banner_path)
      } else if (values.banner_path instanceof File) {
        // If it's already a File object
        setBannerUploadedDetails(values.banner_path)
      }
    }
  }, [values.banner_path])

  return (
    <div className="mb-[80px]">
      {title_header && (
        <div className="mt-[50px]">
          <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
            Tell us about your store{' '}
          </TextComponent>
          <div className="mt-6">
            <ProgressBar currentStep={2} totalSteps={3} />
          </div>
        </div>
      )}

      <div className={`${title_header ? 'mt-[24px]' : 'mt-[52px]'} flex flex-col gap-8`}>
        {showProfile && (
          <div className="">
            <DragDropFile
              errorText={errors.profile_picture_path && 'Profile picture is required'}
              id="image-upload"
              accept=".png, .jpeg, .jpg, .webp"
              title="Upload a Profile Picture"
              placeholder={'PNG, JPG, JPEG (max. 800×400px)'}
              heightLimit={400}
              widthLimit={800}
              uploadedDetails={uploadedDetails}
              setUploadedDetails={e => {
                setUploadedDetails(e)
                setFieldValue('profile_picture_path', e)
                if (!e) {
                  setUploadedFile(null)
                  // If there's an existing store ID, don't set to null (keep original value)
                  // This allows skipping upload for existing stores
                  if (!values.id) {
                    setFieldValue('profile_picture_path', null)
                  }
                }
              }}
              uploadedFile={uploadedFile}
              setUploadedFile={file => {
                setUploadedFile(file)
                if (!file && !values.id) {
                  // Only set to null if it's a new store (no id)
                  setFieldValue('profile_picture_path', null)
                }
              }}
              externalError={!!errors.profile_picture_path}
            />
          </div>
        )}

        <div className="">
          <DragDropFile
            errorText={errors.banner_path && 'Store banner is required'}
            id="banner-upload"
            accept=".png, .jpeg, .jpg, .webp"
            text="Upload a Store Banner"
            title="Upload a Store Banner"
            heightLimit={400}
            widthLimit={800}
            placeholder={'PNG, JPG, JPEG (max. 800×400px)'}
            uploadedDetails={bannerUploadedDetails}
            setUploadedDetails={e => {
              setBannerUploadedDetails(e)
              setFieldValue('banner_path', e)
              if (!e) {
                setBannerUploadedFile(null)
                // If there's an existing store ID, don't set to null (keep original value)
                // This allows skipping upload for existing stores
                if (!values.id) {
                  setFieldValue('banner_path', null)
                }
              }
            }}
            uploadedFile={bannerUploadedFile}
            setUploadedFile={file => {
              setBannerUploadedFile(file)
              if (!file && !values.id) {
                // Only set to null if it's a new store (no id)
                setFieldValue('banner_path', null)
              }
            }}
            externalError={!!errors.banner_path}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadInformation
