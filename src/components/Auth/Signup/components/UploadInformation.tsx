import DragDropFile from '@/components/SharedUI/DragDropFile'
import {useState} from 'react'
import {VendorOnboardingProps} from '../utils'

const UploadInformation = (props: VendorOnboardingProps) => {
  const {handleChange, title_header, values, touched, errors, setFieldValue, showProfile = true} = props
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const [bannerUploadedDetails, setBannerUploadedDetails] = useState<File | null>(null)
  const [bannerUploadedFile, setBannerUploadedFile] = useState<string | null>(null)

  return (
    <div className="mb-[50px]">
      <div className="mt-[52px] flex flex-col gap-8">
        {showProfile && (
          <div className="">
            <DragDropFile
              errorText="Profile image do not meet the required dimension"
              id="image-upload"
              accept=".png, .jpeg, .jpg, .webp"
              title={
                <div>
                  Upload a Profile Picture <span className="text-[12px]">(optional)</span>
                </div>
              }
              placeholder={'PNG, JPG, JPEG (max. 100×100px)'}
              heightLimit={200}
              widthLimit={200}
              uploadedDetails={values.profile_picture_path}
              setUploadedDetails={e => {
                setUploadedDetails(e)
                setFieldValue('profile_picture_path', e)
              }}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          </div>
        )}

        <div className="">
          <DragDropFile
            errorText="Banner image do not meet the required dimension"
            id="banner-upload"
            accept=".png, .jpeg, .jpg, .webp"
            text="Upload a Store Banner"
            title={
              <div>
                {!showProfile ? 'Update a Store Banner' : 'Upload a Store Banner'}{' '}
                <span className="text-[12px]">(optional)</span>
              </div>
            }
            heightLimit={728}
            widthLimit={300}
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
