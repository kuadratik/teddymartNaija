import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import React, {useState} from 'react'
import {IProductInfoProps} from './ProductInfo'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DragDropFile from '@/components/SharedUI/DragDropFile'
import TextComponent from '@/components/SharedUI/TextComponent'
import {capitalizeFirstLetter} from '@/utils/fx'
import {useSelector} from 'react-redux'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import {useCreateUserStoreListingItemMutation, useUpdateUserStoreItemMutation} from '@/services/vendor/vendor'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import Spinner from '@/components/SharedUI/Spinner'
import {useRouter} from 'next/router'
import {useUploadImageFileMutation} from '@/services/general/general'
import {Image} from 'antd'
import {useAppSelector} from '@/hooks/reduxHooks'
import {fileToBase64} from '../utils'

const ImageSectionComponent = ({
  active,
  setActive,
  handleChange,
  editMode = false,
  values,
  setFieldValue,
  setFieldError
}: IProductInfoProps) => {
  const {type} = useSelector((state: any) => state.vendor)
  const [createStoreListing, {isLoading}] = useCreateUserStoreListingItemMutation()
  const [updateStoreListing, {isLoading: isUpdateLoading}] = useUpdateUserStoreItemMutation()
  const [uploadFile, {isLoading: isUploadLoading}] = useUploadImageFileMutation()
  const router = useRouter()
  const {id} = router.query
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user

  // states
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const [bannerUploadedDetails, setBannerUploadedDetails] = useState<File | null>(null)
  const [bannerUploadedFile, setBannerUploadedFile] = useState<string | null>(null)
  const [replacingImage, setReplacingImage] = useState(false)

  console.log(uploadedDetails, bannerUploadedDetails)

  const [showSuccess, setShowSuccess] = useState(false)
  const [externalError, setExternalError] = useState(false)

  const handleUpload = async () => {
    const newFile = await fileToBase64(uploadedDetails as File)
    let payload = {
      images: [newFile]
    }

    console.log('payload', payload)

    try {
      const res = await uploadFile({
        body: payload
      })
        .unwrap()
        .then(data => {
          console.log('uploaded file', data)
          // setUploadedFile(data.url)
          handleSubmit(data.data[0])
        })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Add {capitalizeFirstLetter(type)}!</>}
              image={errorToastIcon}
              textColor="red"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#FCFCFD"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const handleSubmit = async (uploadedFile: string | null) => {
    let payload = {
      ...values,
      type
    }

    if (uploadedFile) {
      payload['images'] = [uploadedFile]
    }
    // else {
    //   delete payload.images
    // }

    // remove price if type is service
    if (type === 'service') {
      delete payload.price
    }

    try {
      if (editMode === true) {
        const res = await updateStoreListing({
          userStore: isAuthenticatedUser?.store?.slug!,
          listing: id as string,
          body: payload
        }).unwrap()
        setShowSuccess(true)
        return
      }
      const res = await createStoreListing({
        body: payload
      }).unwrap()

      setShowSuccess(true)
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Add {capitalizeFirstLetter(type)}!</>}
              image={errorToastIcon}
              textColor="red"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#FCFCFD"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  return (
    <div className="mb-[70px]">
      <TextComponent as="h4">{capitalizeFirstLetter(type)} Upload</TextComponent>
      <div className="mt-[24px] flex flex-col gap-6">
        {editMode && replacingImage === false ? (
          <div className="flex w-full flex-col items-center justify-center gap-3 rounded-[6px] border border-[#EAECEF] py-[26px]">
            <div className="flex h-[211px] w-[211px] items-center justify-center overflow-hidden">
              <Image
                src={`${process.env.imageBaseUrl}/${values.images[0]}`}
                alt="product image"
                preview={false}
                className="object-cover"
              />
            </div>

            <CustomButton
              type="button"
              className="w-[123px] rounded-[7px] px-4 py-[10px]"
              onClick={() => {
                setReplacingImage(true)
              }}
            >
              <TextComponent as="span" className="whitespace-nowrap text-[12px] leading-[15.62px] text-[#fff]">
                Replace Image
              </TextComponent>
            </CustomButton>
          </div>
        ) : (
          <div className="">
            <DragDropFile
              errorText={externalError ? 'This is a required Field' : 'The Image does not meet the required dimension'}
              id="image-upload"
              accept=".png, .jpeg, .jpg"
              title=""
              placeholder={'PNG, JPG, JPEG (max. 1080×1080px)'}
              uploadedDetails={uploadedDetails}
              setUploadedDetails={setUploadedDetails}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              heightLimit={1080}
              widthLimit={1080}
              externalError={externalError}
            />
          </div>
        )}

        <div className="mt-3 flex w-full items-center gap-4">
          <CustomButton
            onClick={() => {
              setActive(prev => prev - 1)
            }}
            type="button"
            className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
          >
            Back
          </CustomButton>

          <CustomButton
            onClick={() => {
              if (!uploadedFile && editMode === false) {
                setExternalError(true)
              } else if (uploadedFile && editMode === false) {
                handleUpload()
              } else {
                if (editMode === true && uploadedFile) {
                  handleUpload()
                } else if (editMode === true && !uploadedFile) {
                  handleSubmit(null)
                  return
                }

                // handleSubmit()
              }
            }}
            type="button"
            className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
          >
            {isLoading || isUploadLoading || isUpdateLoading ? <Spinner /> : 'Publish'}
          </CustomButton>
        </div>
      </div>

      {showSuccess && (
        <PlannerModal modalOpen={showSuccess} setModalOpen={setShowSuccess} maskCloseable={true}>
          <SuccessModal
            successTitle={'Success'}
            primaryButtonText={`Add Another ${capitalizeFirstLetter(type)}`}
            primaryButtonAction={() => {
              setShowSuccess(false)
              Object.keys(values).map(key => {
                setFieldValue(key, '')
              })
              setActive(1)
            }}
            secondaryButtonText="Close"
            secondaryButtonAction={() => {
              // setShowSuccess(false)
              router.push('/vendor')
            }}
          />
        </PlannerModal>
      )}
    </div>
  )
}

export default ImageSectionComponent
