import React, {useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useGetAllIndustriesQuery} from '@/services/category/category'
import {Checkbox, Form, RadioChangeEvent, Image} from 'antd'
import {useMediaQuery} from '@/hooks/use-media-query'
import TextInput from '../SharedUI/Input/TextInput'

import TextAreaInput from '../SharedUI/Input/TextAreaInput'
import CustomButton from '../SharedUI/Buttons/Button'
import DragDropFile from '../SharedUI/DragDropFile'
import TextComponent from '../SharedUI/TextComponent'
import Spinner from '../SharedUI/Spinner'
import PhoneInputWithCountry from '../SharedUI/PhoneInputWithCountry'
import {fileToBase64} from '../Vendor/utils'
import {useCreateBusinessListingMutation} from '@/services/myBussiness'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {useUploadImageFileWithoutAuthMutation} from '@/services/general/general'
import SelectInput from '../SharedUI/Input/SelectInput'

type Props = {}

const CreateYourBusiness = (props: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [replacingImage, setReplacingImage] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [externalError, setExternalError] = useState(false)

  const [showDesrciption, setShowDescription] = useState(true)
  const [showEmail, setShowEmail] = useState(true)
  const [showAddress, setShowAddress] = useState(true)

  const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})

  const [createBusinessListing, {isLoading}] = useCreateBusinessListingMutation()
  const [uploadFile, {isLoading: fileUpLoading}] = useUploadImageFileWithoutAuthMutation()

  const transformData = industries?.data.map((industry: any) => ({
    label: industry.name,
    value: industry.id
  }))

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        business_name: '',
        business_description: '',
        industry_id: null,
        business_email: '',
        business_address: '',
        business_contact_number: '',
        business_logo_url: null,
        show_business_description: true,
        show_business_email: true,
        show_business_address: true
      },
      validationSchema: Yup.object().shape({
        industry_id: Yup.string().required('Industry is required'),
        business_name: Yup.string().required('Business name is required'),
        business_contact_number: Yup.string().required('Contact number is required')
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async () => {
        await handleUpload()
      }
    }
  )

  const handleUpload = async () => {
    let newFile = null

    const payload = {
      ...values
    }

    // console.log('payload', payload)

    try {
      if (uploadedDetails) {
        // Convert file to Base64 if uploadedDetails exists
        newFile = await fileToBase64(uploadedDetails as File)
        // Upload file and get the URL, then update payload
        const uploadResponse = await uploadFile({body: {images: newFile}}).unwrap()
        payload.business_logo_url = uploadResponse?.data[0] // Add URL to payload
      }
      //  Submit form data to createBusinessListing, with or without business_logo_url
      await createBusinessListing({body: payload})
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>Business listing created successfully</>}
                  textColor="#FFF"
                  message=""
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
      resetForm()
    } catch (err) {
      console.log('Error in handleUpload:', err)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Error creating business listing</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 lg:items-center lg:justify-center">
      <div className="flex w-full max-w-6xl justify-center bg-white p-4 text-[#141414] md:p-10 lg:mx-auto">
        <div className="w-full md:w-[60%]">
          <h2 className="text-[24px] font-bold">Your Business Deserves to Shine! List it on myEKI Today!</h2>
          <p className="my-8 text-[24px] font-bold">Business Details </p>

          <Form className="flex w-full flex-col gap-6" onFinish={handleSubmit} layout="vertical">
            <SelectInput
              data={transformData}
              value={values?.industry_id ?? undefined}
              errorMessage={typeof errors.industry_id === 'string' ? errors.industry_id : ''}
              onChange={value => {
                setFieldValue('industry_id', value)
              }}
              placeholder="Select Industry*"
              disabled={false}
              notFoundContent={'Industry not found'}
            />

            <TextInput
              placeholder={`Business Name*`}
              onChange={e => {
                if (e.target.value.length <= 75) {
                  handleChange(e)
                }
              }}
              name={'business_name'}
              type={'text'}
              value={values.business_name}
              errorMessage={errors && errors.business_name ? errors.business_name : ''}
            />
            <div>
              <TextAreaInput
                maxLength={250}
                onChange={handleChange}
                name={'business_description'}
                row={4}
                value={values.business_description}
                placeholder={'Business Description'}
                errorMessage={errors && errors.business_description ? errors.business_description : ''}
              />
              <div className="flex justify-end">
                <Checkbox
                  name={'show_business_description'}
                  onChange={e => {
                    setShowDescription(e.target.checked)
                    setFieldValue('show_business_description', e.target.checked)
                  }}
                  value={showDesrciption}
                  checked={showDesrciption}
                >
                  Show
                </Checkbox>
              </div>
            </div>
            <div>
              <TextInput
                placeholder="Email"
                errorMessage={errors.business_email ? errors.business_email : ''}
                onChange={handleChange}
                name={'business_email'}
                value={values.business_email}
                type={'email'}
              />
              <div className="flex justify-end">
                <Checkbox
                  name={'show_business_email'}
                  onChange={e => {
                    setShowEmail(e.target.checked)
                    setFieldValue('show_business_email', e.target.checked)
                  }}
                  value={showEmail}
                  checked={showEmail}
                >
                  Show
                </Checkbox>
              </div>
            </div>
            <div>
              <TextAreaInput
                maxLength={150}
                onChange={handleChange}
                name={'business_address'}
                row={2}
                value={values.business_address}
                placeholder={'Business Address'}
                errorMessage={errors.business_address ? errors.business_address : ''}
              />
              <div className="flex justify-end">
                <Checkbox
                  name={'show_business_address'}
                  onChange={e => {
                    setShowAddress(e.target.checked)
                    setFieldValue('show_business_address', e.target.checked)
                  }}
                  value={showAddress}
                  checked={showAddress}
                >
                  Show
                </Checkbox>
              </div>
            </div>
            <div>
              <PhoneInputWithCountry
                errorMessage={typeof errors.business_contact_number === 'string' ? errors.business_contact_number : ''}
                title="Store Contact Number*"
                inputProps={{
                  name: 'business_contact_number',
                  id: 'business_contact_number'
                }}
                placeholder={''}
                disabled={false}
                fontSize={14}
                color={'#3D3D3D'}
                value={values.business_contact_number}
                onChange={e => {
                  setFieldValue('business_contact_number', e)
                }}
              />
            </div>
            <div>
              <TextComponent as="h4">Upload Business Logo</TextComponent>
              <div className="mt-[24px] flex flex-col gap-6">
                {editMode && replacingImage === false ? (
                  <div className="flex w-full flex-col items-center justify-center gap-3 rounded-[6px] border border-[#EAECEF] py-[26px]">
                    <div className="flex h-[211px] w-[211px] items-center justify-center overflow-hidden">
                      <Image
                        src={`${process.env.imageBaseUrl}/${values.images[0]}`}
                        alt="business logo"
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
                      errorText={
                        externalError ? 'This is a required Field' : 'The Image does not meet the required dimension'
                      }
                      id="image-upload"
                      accept=".png, .jpeg, .jpg, .webp"
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
              </div>
            </div>
            <CustomButton
              onClick={() => {
                handleSubmit()
              }}
              type="button"
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              {isLoading ? <Spinner /> : 'Get Listed'}
            </CustomButton>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default CreateYourBusiness
