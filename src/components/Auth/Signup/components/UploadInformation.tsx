import DragDropFile from '@/components/SharedUI/DragDropFile'
import ProgressBar from '@/components/SharedUI/ProgressBar'
import TextComponent from '@/components/SharedUI/TextComponent'
import { useState } from 'react'
import { VendorOnboardingProps } from '../utils'

const UploadInformation = (props: VendorOnboardingProps) => {
  const { handleChange, title_header, values, touched, errors, setFieldValue, showProfile = true } = props
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const [bannerUploadedDetails, setBannerUploadedDetails] = useState<File | null>(null)
  const [bannerUploadedFile, setBannerUploadedFile] = useState<string | null>(null)

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
              errorText={errors.profile_picture_path || "Profile picture is required"}
              id="image-upload"
              accept=".png, .jpeg, .jpg, .webp"
              title="Upload a Profile Picture"
              placeholder={'PNG, JPG, JPEG (max. 800×400px)'}
              heightLimit={400}
              widthLimit={800}
              uploadedDetails={values.profile_picture_path}
              setUploadedDetails={e => {
                setUploadedDetails(e)
                setFieldValue('profile_picture_path', e)
              }}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              externalError={!!errors.profile_picture_path}
            />
          </div>
        )}

        <div className="">
          <DragDropFile
            errorText={errors.banner_path || "Store banner is required"}
            id="banner-upload"
            accept=".png, .jpeg, .jpg, .webp"
            text="Upload a Store Banner"
            title="Upload a Store Banner"
            heightLimit={400}
            widthLimit={800}
            placeholder={'PNG, JPG, JPEG (max. 800×400px)'}
            uploadedDetails={values.banner_path}
            setUploadedDetails={e => {
              setBannerUploadedDetails(e)
              setFieldValue('banner_path', e)
            }}
            uploadedFile={bannerUploadedFile}
            setUploadedFile={setBannerUploadedFile}
            externalError={!!errors.banner_path}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadInformation
