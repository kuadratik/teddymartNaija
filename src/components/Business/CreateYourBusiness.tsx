import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllIndustriesQuery} from '@/services/category/category'
import {Icon} from '@iconify/react'
import {Checkbox, Form, Image} from 'antd'
import {useRouter} from 'next/router'
import {useCallback, useEffect, useState} from 'react'
import {useQuill} from 'react-quilljs'
import defaultLogo from '../../../public/assets/default_banner.jpg'
import CustomButton from '../SharedUI/Buttons/Button'
import DragDropFile from '../SharedUI/DragDropFile'
import CountryInput from '../SharedUI/Input/CountryInput'
import SelectInput from '../SharedUI/Input/SelectInput'
import StateInput from '../SharedUI/Input/StateInput'
import TextAreaInput from '../SharedUI/Input/TextAreaInput'
import TextInput from '../SharedUI/Input/TextInput'
import PhoneInputWithCountry from '../SharedUI/PhoneInputWithCountry'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'
import BusinessCard from './BusinessCard'

export const colorCards = ['#000000', '#FE0000', '#C200DB', '#FED000', '#1300D5', '#0BCF00', '#00A7AA', '#FF5D00']
export const businessOwnersRole = [
  {
    label: 'Business Owner',
    value: 'business owner'
  },
  {
    label: 'Business Manager',
    value: 'business manager'
  },
  {
    label: 'Managing Director',
    value: 'Managing Director'
  },
  {
    label: 'CEO',
    value: 'CEO'
  },
  {
    label: 'CEO & Founder',
    value: 'CEO & Founder'
  },
  {
    label: 'Co-founder',
    value: 'Co-founder'
  }
  // {
  //   label: 'Owner',
  //   value: 'Owner'
  // }
]

type Props = {
  handleSubmit: any
  handleChange: any
  values: any
  setFieldValue: any
  errors: any
  setUploadedDetails: any
  uploadedDetails: any
  setUploadedFile: any
  uploadedFile: any
  isLoading: boolean
  setActiveColor: React.Dispatch<React.SetStateAction<string>>
  activeColor: string
}

const CreateYourBusiness = ({
  handleSubmit,
  handleChange,
  values,
  setFieldValue,
  errors,
  setUploadedDetails,
  uploadedDetails,
  setUploadedFile,
  uploadedFile,
  isLoading,
  setActiveColor,
  activeColor
}: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [replacingImage, setReplacingImage] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const router = useRouter()
  const [externalError, setExternalError] = useState(false)
  const [showDesrciption, setShowDescription] = useState(true)
  const [showEmail, setShowEmail] = useState(true)
  const [showAddress, setShowAddress] = useState(true)
  const [showSecondaryEmail, setShowSecondaryEmail] = useState(true)
  const [showSecondaryContact, setShowSecondaryContact] = useState(true)
  const [showWebsiteLink, setShowWebsiteLink] = useState(true)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})

  const MAX_DESCRIPTION_LENGTH = 5000

  const transformData = industries?.data.map((industry: any) => ({
    label: industry.name,
    value: industry.id
  }))
  useEffect(() => {
    if (!isAuthenticatedToken) {
      // Check if the user is logged in
      router.push(`/auth/sign-up?redirect=${encodeURIComponent('/get-list')}`)
    }
  }, [isAuthenticatedToken])

  // Quill editor configuration
  const {quill, quillRef} = useQuill({
    placeholder: 'Business Description',
    theme: 'snow',
    modules: {
      toolbar: [['bold', 'italic', 'underline'], [{list: 'ordered'}, {list: 'bullet'}], ['clean']]
    }
  })

  // Memoized function to enforce character limit
  const enforceCharacterLimit = useCallback(() => {
    if (!quill) return

    // Get plain text without HTML tags
    const text = quill.getText().trim()

    // If text exceeds maxLength
    if (text.length > MAX_DESCRIPTION_LENGTH) {
      // Save selection before modifications
      const selection = quill.getSelection()

      // Disable the text-change event temporarily to prevent infinite loop
      quill.off('text-change')

      // Calculate how many chars to delete
      const deleteCount = text.length - MAX_DESCRIPTION_LENGTH

      // Get the position where to truncate
      if (deleteCount > 0) {
        // Delete the excess characters from the end of the selection
        const currentPosition = selection ? selection.index : text.length

        // If the cursor is at the end of excess content, move it back
        if (selection && selection.index > MAX_DESCRIPTION_LENGTH) {
          // Delete from the cursor position
          quill.deleteText(MAX_DESCRIPTION_LENGTH, currentPosition)
        } else {
          // Delete from the end
          quill.deleteText(text.length - deleteCount, text.length)
        }
      }

      // Re-enable the text-change event handler
      quill.on('text-change', enforceCharacterLimit)

      // Update the form field with the truncated content
      setFieldValue('business_description', quill.root.innerHTML)
    } else {
      // If within limits, update normally
      setFieldValue('business_description', quill.root.innerHTML)
    }
  }, [quill, setFieldValue, MAX_DESCRIPTION_LENGTH])

  // Initialize quill with existing value and set up content change handler
  useEffect(() => {
    if (quill) {
      // Set content when values.business_description changes
      if (values.business_description) {
        // Only update content if it's different to avoid cursor jumps
        const currentContent = quill.root.innerHTML
        if (currentContent !== values.business_description) {
          quill.clipboard.dangerouslyPasteHTML(values.business_description)
        }
      }

      // Listen for content changes
      quill.on('text-change', enforceCharacterLimit)

      // Clean up event listener
      return () => {
        quill.off('text-change', enforceCharacterLimit)
      }
    }
  }, [quill, values.business_description, setFieldValue, enforceCharacterLimit])
  // Prevent cursor position issues by avoiding re-renders that could affect the editor
  const characterCount = quill ? quill.getText().trim().length : 0

  if (!isAuthenticatedToken) {
    return null // or a loading spinner, or redirect to login, etc.
  }
  return (
    <div className="flex w-full flex-col gap-8 lg:items-center lg:justify-center">
      <div className="flex w-full max-w-6xl justify-center bg-white p-4 text-[#141414] md:p-10 lg:mx-auto">
        <div className="w-full md:w-[80%]">
          <h2 className="text-center text-[24px] font-bold">
            Your Business Deserves to Shine! List it on myEKI Today!
          </h2>
          <p className="my-8 text-[24px] font-bold">Business Details</p>

          <Form className="flex w-full flex-col gap-6" onFinish={handleSubmit} layout="vertical">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SelectInput
                data={transformData}
                value={values?.industry_id ?? undefined}
                errorMessage={typeof errors.industry_id === 'string' ? errors.industry_id : ''}
                onChange={value => {
                  setFieldValue('industry_id', value)
                }}
                className="py-1"
                placeholder="Select Industry*"
                disabled={false}
                notFoundContent={'Industry not found'}
              />
              <TextInput
                placeholder={`Your Name*`}
                onChange={e => {
                  if (e.target.value.length <= 75) {
                    handleChange(e)
                  }
                }}
                name={'owner_name'}
                type={'text'}
                value={values.owner_name}
                errorMessage={errors && errors.owner_name ? errors.owner_name : ''}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SelectInput
                data={businessOwnersRole}
                value={values?.owner_role || undefined}
                errorMessage={''}
                onChange={value => {
                  setFieldValue('owner_role', value)
                }}
                className="py-1"
                placeholder="Select Role*"
                disabled={false}
                notFoundContent={'Role not found'}
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
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CountryInput
                placeholder={'Country'}
                errorMessage={typeof errors.country_id === 'string' ? errors.country_id : ''}
                className="py-1"
                value={values?.country_id ?? undefined}
                onChange={value => {
                  setFieldValue('country_id', value)
                }}
              />
              <StateInput
                errorMessage={typeof errors.state === 'string' ? errors.state : ''}
                className="py-1"
                countryId={values.country_id}
                value={values.state || undefined}
                onChange={value => {
                  setFieldValue('state', value)
                }}
                placeholder="State/Province"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="">
                <div className="">
                  <div ref={quillRef} className="rounded-b-md" style={{height: '150px', marginBottom: '0px'}} />
                  <div className="relative bottom-6 right-2 text-right text-xs text-gray-500">{`${characterCount}/5000 characters`}</div>
                  {errors && errors.business_description && (
                    <div className="text-sm text-red-500">{errors.business_description}</div>
                  )}
                </div>
                <div className="relative bottom-2 flex justify-end">
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
                <TextAreaInput
                  maxLength={150}
                  onChange={handleChange}
                  name={'business_address'}
                  row={4}
                  className="h-[190px]"
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
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <TextInput
                  placeholder="Primary Email"
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
                <TextInput
                  placeholder="Secondary Email"
                  errorMessage={errors.secondary_business_email ? errors.secondary_business_email : ''}
                  onChange={handleChange}
                  name={'secondary_business_email'}
                  value={values.secondary_business_email}
                  type={'email'}
                />
                <div className="flex justify-end">
                  <Checkbox
                    name={'show_secondary_email'}
                    onChange={e => {
                      setShowSecondaryEmail(e.target.checked)
                      setFieldValue('show_secondary_email', e.target.checked)
                    }}
                    value={showSecondaryEmail}
                    checked={showSecondaryEmail}
                  >
                    Show
                  </Checkbox>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <PhoneInputWithCountry
                  errorMessage={
                    typeof errors.business_contact_number === 'string' ? errors.business_contact_number : ''
                  }
                  title="Primary Store Contact Number*"
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
                <PhoneInputWithCountry
                  errorMessage={''}
                  title="Secondary Store Contact Number"
                  inputProps={{
                    name: 'secondary_contact_number',
                    id: 'secondary_contact_number'
                  }}
                  placeholder={''}
                  disabled={false}
                  fontSize={14}
                  color={'#3D3D3D'}
                  value={values.secondary_contact_number}
                  onChange={e => {
                    setFieldValue('secondary_contact_number', e)
                  }}
                />
                <div className="flex justify-end">
                  <Checkbox
                    name={'show_secondary_contact'}
                    onChange={e => {
                      setShowSecondaryContact(e.target.checked)
                      setFieldValue('show_secondary_contact', e.target.checked)
                    }}
                    value={showSecondaryContact}
                    checked={showSecondaryContact}
                  >
                    Show
                  </Checkbox>
                </div>
              </div>
            </div>
            <div className="w-full">
              <TextInput
                placeholder={`Website Link`}
                onChange={e => {
                  const value = e.target.value
                  if (value.length <= 150) {
                    // Allow input and let Yup handle validation
                    handleChange(e)
                  }
                }}
                name={'website_link'}
                type={'url'}
                value={values.website_link}
                errorMessage={errors.website_link}
              />
              <div className="flex justify-end">
                <Checkbox
                  name={'show_website_link'}
                  onChange={e => {
                    setShowWebsiteLink(e.target.checked)
                    setFieldValue('show_website_link', e.target.checked)
                  }}
                  value={showWebsiteLink}
                  checked={showWebsiteLink}
                >
                  Show
                </Checkbox>
              </div>
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
            <div className="rounded-[8px] bg-[#F9FAFB] p-[15px]">
              <div
                onClick={() => setShowPreview(!showPreview)}
                className="flex cursor-pointer items-center justify-between hover:opacity-80"
              >
                <TextComponent as="h4">Business Card Preview (when downloaded)</TextComponent>
                <Icon icon={!showPreview ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'} width="20" height="20" />
              </div>
              {showPreview && (
                <div className="mt-4 flex flex-col gap-6">
                  <div className="mx-auto w-full md:w-[370px]">
                    <BusinessCard
                      isFormCard={true}
                      defaultLogo={`${process.env.imageBaseUrl}/${values?.business_logo_url}` || defaultLogo}
                      activeColor={activeColor}
                      downloadAsImage={() => {}}
                      elementRef={() => {}}
                      isDownloading={false}
                      setIsLoadingImage={() => {}}
                      setModalOpen={() => {}}
                      formCardImage={uploadedFile}
                      business={values}
                      hideBtn={true}
                    />
                    {/* <div className="mx-auto mt-3 flex w-fit items-center justify-center gap-5 rounded-[8px] bg-white p-3 shadow-f1">
                      {colorCards.map(color => (
                        <div
                          onClick={() => setActiveColor(color)}
                          key={color}
                          className={`cursor-pointer rounded-full ${
                            activeColor === color
                              ? 'h-[20.92px] w-[20.92px] border-4 border-gray-300'
                              : 'h-[20.92px] w-[20.92px]'
                          }`}
                          style={{backgroundColor: color}}
                        ></div>
                      ))}
                    </div> */}
                  </div>
                </div>
              )}
            </div>
            <CustomButton
              onClick={() => {
                handleSubmit()
              }}
              disabled={isLoading}
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
