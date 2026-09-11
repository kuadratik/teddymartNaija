import React, {useState} from 'react'
import {VendorOnboardingProps} from '../utils'
import DragDropFile from '@/components/SharedUI/DragDropFile'

const UploadInformation = (props: VendorOnboardingProps) => {
  const {handleChange, title_header, values, touched, errors, setFieldValue} = props
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const [bannerUploadedDetails, setBannerUploadedDetails] = useState<File | null>(null)
  const [bannerUploadedFile, setBannerUploadedFile] = useState<string | null>(null)

  return (
    <div className="mb-[70px]">
      <div className="mt-[52px] flex flex-col gap-8">
        <div className="">
          <DragDropFile
            errorText="Profile image do not meet the required dimension"
            id="image-upload"
            accept=".png, .jpeg, .jpg"
            title="Upload a Profile Picture*"
            placeholder={'PNG, JPG, JPEG (max. 100×100px)'}
            heightLimit={100}
            widthLimit={100}
            uploadedDetails={values.profile_picture_path}
            setUploadedDetails={e => {
              setUploadedDetails(e)
              setFieldValue('profile_picture_path', e)
            }}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
          />
        </div>

        <div className="">
          <DragDropFile
            errorText="Banner image do not meet the required dimension"
            id="banner-upload"
            accept=".png, .jpeg, .jpg"
            text="Upload Banner"
            title="Upload a Store Banner*"
            heightLimit={300}
            widthLimit={728}
            placeholder={'PNG, JPG, JPEG (max. 728×300px)'}
            uploadedDetails={values.banner_path}
            setUploadedDetails={e => {
              setBannerUploadedDetails(e)
              setFieldValue('banner_path', e)
            }}
            uploadedFile={bannerUploadedFile}
            setUploadedFile={setBannerUploadedFile}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadInformation
