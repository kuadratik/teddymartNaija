import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllIndustriesQuery} from '@/services/category/category'
import {cleanupServices} from '@/utils/serviceHelpers'
import {Icon} from '@iconify/react'
import {Checkbox, Form, Image} from 'antd'
import {format, parseISO} from 'date-fns'
import {useRouter} from 'next/router'
import {useCallback, useEffect, useState} from 'react'
import {useQuill} from 'react-quilljs'
import {v4 as uuidv4} from 'uuid'
import defaultLogo from '../../../public/assets/default_banner.jpg'
import CustomButton from '../SharedUI/Buttons/Button'
import DragDropFile from '../SharedUI/DragDropFile'
import CountryInput from '../SharedUI/Input/CountryInput'
import SelectInput from '../SharedUI/Input/SelectInput'
import StateInput from '../SharedUI/Input/StateInput'
import TextAreaInput from '../SharedUI/Input/TextAreaInput'
import TextInput from '../SharedUI/Input/TextInput'
import PlannerModal from '../SharedUI/ModalComponent'
import PhoneInputWithCountry from '../SharedUI/PhoneInputWithCountry'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import BusinessAvailabilityCard from './BusinessAvailabilityCard'
import BusinessCalender from './BusinessCalender'
import BusinessCard from './BusinessCard'
import BusinessServiceFrame from './BusinessServiceFrame'
import BusinessTime from './BusinessTime'

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
  onEditService?: (service: any) => void
  onDuplicateService?: (service: any) => void
  onDeleteService?: (service: any) => void
  setShowCalender?: React.Dispatch<React.SetStateAction<boolean>>
  selectedDates?: string[]
  setSelectedDates?: React.Dispatch<React.SetStateAction<string[]>>
  buttonText?: string
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
  activeColor,
  onEditService,
  onDuplicateService,
  onDeleteService,
  setShowCalender,
  selectedDates,
  buttonText,
  setSelectedDates
}: Props) => {
  console.log('🚀 ~ selectedDates:123', selectedDates)
  console.log('🚀 ~ values:', values?.services)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [replacingImage, setReplacingImage] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const router = useRouter()
  const [externalError, setExternalError] = useState(false)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const [showCalender, setShowCalenderState] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDatesState, setSelectedDatesState] = useState<string[]>([])
  console.log('🚀 ~ selectedDatesState:', selectedDatesState)
  const [currentEditingService, setCurrentEditingService] = useState<any>(null)
  const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})
  const [showFrameModal, setShowFrameModal] = useState(false)
  const [tempServiceName, setTempServiceName] = useState('')
  console.log('🚀 ~ showFrameModal:', showFrameModal)
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

  // Handle multiple dates selection
  const handleMultipleDatesSelect = (dates: any[]) => {
    console.log('🚀 ~ handleMultipleDatesSelect ~ dates:', dates)
    if (!Array.isArray(dates)) return

    // Make sure we're getting the full date info from the calendar

    // Store the exact dates selected in the calendar
    const formattedDatesWithData = dates.map(date => {
      console.log('🚀 ~ handleMultipleDatesSelect ~ dates:', dates)
      // Ensure we're preserving the exact date (year, month, day)
      return {
        display: date.format('dddd Do'),
        fullDate: date.format('YYYY-MM-DD'),
        // Store the original date object for reference
        originalDate: date
      }
    })

    console.log('Raw calendar dates:', dates)
    console.log('Formatted dates with exact data:', formattedDatesWithData)

    if (setSelectedDates) {
      setSelectedDates(formattedDatesWithData as any)
    } else {
      setSelectedDatesState(formattedDatesWithData as any)
    }
  }

  const handleEditService = (service: any) => {
    if (!service?.id) return

    if (service.availability_type === 'frame') {
      setCurrentEditingService(service)
      setShowFrameModal(true)
      return
    }

    // FLEX: prefill local dates and open calendar
    setCurrentEditingService(service)
    const dates = (service.time_slots || [])
      .filter((s: any) => s.date)
      .map((s: any) => ({
        fullDate: s.date,
        display: s.day_of_week || format(parseISO(s.date), 'EEEE do'),
        originalDate: parseISO(s.date)
      }))
    setSelectedDatesState(dates)
    setShowCalenderState(true)
  }

  const handleDuplicateService = (service: any) => {
    if (!service || !service.id) {
      console.warn('Cannot duplicate service without ID:', service)
      return
    }

    // Call parent handler if it exists
    if (onDuplicateService) {
      onDuplicateService(service)
      return
    }

    // Create a deep copy of the service object to avoid reference issues
    const serviceCopy = JSON.parse(JSON.stringify(service))

    // Generate a new ID for the duplicated service
    serviceCopy.id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()

    // Add " (Copy)" to the service name to differentiate it
    const newName = `${serviceCopy.service_name} (Copy)`

    // Check if the name with (Copy) already exists, if so add a number
    const existingServices = values.services || []
    let nameCounter = 1
    let finalName = newName

    while (existingServices.some((s: any) => s.service_name === finalName)) {
      finalName = `${serviceCopy.service_name} (Copy ${nameCounter})`
      nameCounter++
    }

    serviceCopy.service_name = finalName

    // Create a new services array with the duplicate added
    const updatedServices = [...(values.services || []), serviceCopy]

    // Update form state
    setFieldValue('services', updatedServices)

    // Update localStorage
    updateLocalStorage(updatedServices)

    // Show success toast
    showPlannerToast({
      options: {
        customToast: (
          <CustomToast
            altText=""
            title={<>Service duplicated successfully</>}
            message={`Created "${finalName}"`}
            textColor="#FFF"
            backgroundColor="#000"
          />
        )
      },
      message: 'Service duplicated'
    })
  }

  const handleDeleteService = (serviceToDelete: any) => {
    if (!serviceToDelete || !serviceToDelete.id) {
      console.warn('Cannot delete service without ID:', serviceToDelete)
      return
    }

    // Call parent handler if it exists
    if (onDeleteService) {
      onDeleteService(serviceToDelete)
    } else {
      // Fallback in case parent handler is not provided
      const updatedServices = values.services.filter((service: any) => service.id !== serviceToDelete.id)
      setFieldValue('services', updatedServices)

      // Update localStorage
      updateLocalStorage(updatedServices)
    }
  }

  // Add function to handle saving of edited service
  const handleSaveEditedService = (updatedService: any) => {
    console.log('Saving service:', updatedService)
    // Check if this is saving an edited service or creating a new one
    const isNewService = !updatedService.id || !values.services?.some((s: any) => s.id === updatedService.id)
    console.log('Is new service:', isNewService)

    // Ensure the service being saved has an ID
    if (!updatedService.id) {
      updatedService.id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()
    }

    // Add service name from temp field if not set yet and it's a new service
    if (isNewService && !updatedService.service_name && tempServiceName) {
      updatedService.service_name = tempServiceName.trim()
    }

    // Check for duplicates in the services array (only for new services or name changes)
    const servicesArray = [...(values.services || [])]
    const isDuplicate =
      isNewService &&
      servicesArray.some(
        (service: any) => service.service_name.toLowerCase() === updatedService.service_name.toLowerCase()
      )

    if (isDuplicate) {
      // Already checked in the modal components, but double-check here for safety
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Service name already exists.Please use a different service name.</>}
              message="Please use a different service name."
              textColor="#FFF"
              backgroundColor="#000"
            />
          )
        },
        message: 'Duplicate service name'
      })
      return
    }

    // Use a stable reference when comparing and updating services
    let updatedServicesArray = [...servicesArray]

    if (isNewService) {
      // This is a new service, so add it to the array
      console.log('Adding new service')
      updatedServicesArray.push(updatedService)
    } else {
      // This is an existing service, so update it
      console.log('Updating existing service')
      updatedServicesArray = updatedServicesArray.map((service: any) =>
        service.id === updatedService.id ? updatedService : service
      )
    }

    // Update field value with the new services array
    setFieldValue('services', updatedServicesArray)

    // Clear temp service name after successfully adding the service
    if (tempServiceName) {
      setTempServiceName('')
    }

    // Update localStorage and clear current editing service
    updateLocalStorage(updatedServicesArray)
    setCurrentEditingService(null)
  }

  // Helper function to update localStorage
  const updateLocalStorage = (updatedServices: any[]) => {
    try {
      // Clean up services to remove empty ones
      const cleanedServices = cleanupServices(updatedServices)

      // Get existing data from localStorage
      const businessDataStr = localStorage.getItem('businessData')
      const businessData = businessDataStr ? JSON.parse(businessDataStr) : {}

      // Update services in the business data
      businessData.services = cleanedServices

      // Save back to localStorage
      localStorage.setItem('businessData', JSON.stringify(businessData))

      // Also update form values with cleaned services
      setFieldValue('services', cleanedServices)
    } catch (error) {
      console.error('Error updating localStorage:', error)
    }
  }

  if (!isAuthenticatedToken) {
    return null // or a loading spinner, or redirect to login, etc.
  }
  return (
    <div className="flex w-full flex-col gap-8 lg:items-center lg:justify-center">
      <div
        className={`flex w-full max-w-7xl justify-center bg-white p-4 text-[#141414] md:p-10 lg:mx-auto ${showFrameModal ? 'hidden' : ''}`}
      >
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
                      setFieldValue('show_business_description', e.target.checked)
                    }}
                    checked={values.show_business_description}
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
                      setFieldValue('show_business_address', e.target.checked)
                    }}
                    checked={values.show_business_address}
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
                      setFieldValue('show_business_email', e.target.checked)
                    }}
                    checked={values.show_business_email}
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
                      setFieldValue('show_secondary_email', e.target.checked)
                    }}
                    checked={values.show_secondary_email}
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
                      setFieldValue('show_secondary_contact', e.target.checked)
                    }}
                    checked={values.show_secondary_contact}
                  >
                    Show
                  </Checkbox>
                </div>
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
            <div className="">
              <TextComponent as="h4" className="pb-2 lg:pb-0">
                Indicate your services and availability.
              </TextComponent>
              <div className="flex flex-col items-center gap-4 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <SelectInput
                    suffixIcon={
                      <Icon icon="iconamoon:arrow-down-2" width="24" height="24" className="text-black lg:top-3" />
                    }
                    data={[
                      {label: 'Flex (flexible schedule)', value: 'flex'},
                      {label: 'Frame (recurring schedule)', value: 'frame'}
                    ]}
                    value={undefined} // Don't bind to services array here
                    errorMessage={''}
                    onChange={value => {
                      // Set current availability type without creating a new service
                      if (value === 'flex') {
                        setCurrentEditingService(null)
                        setShowCalender ? setShowCalender(true) : setShowCalenderState(true)
                        return
                      } else if (value === 'frame') {
                        setCurrentEditingService(null)
                        setShowFrameModal(true)
                        return
                      }
                    }}
                    backgroundColor="transparent"
                    className="w-full border border-gray-400 py-1 placeholder:text-white"
                    placeholder="Set Availability"
                    disabled={false}
                    notFoundContent={'Status not found'}
                  />
                </div>
                <div className="relative top-3 hidden w-full lg:block lg:w-1/2">
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
                        setFieldValue('show_website_link', e.target.checked)
                      }}
                      checked={values.show_website_link}
                    >
                      Show
                    </Checkbox>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {values?.services?.map((service: any) => {
                  // Safeguard: Ensure service has an ID before rendering
                  const safeService = service.id
                    ? service
                    : {...service, id: crypto.randomUUID ? crypto.randomUUID() : uuidv4()}

                  // Skip invalid services
                  if (!safeService.service_name || !safeService.service_name.trim()) {
                    return null
                  }

                  return (
                    <BusinessAvailabilityCard
                      key={safeService.id}
                      service={safeService}
                      setShowFrameModal={setShowFrameModal}
                      onEditService={handleEditService}
                      onDuplicateService={handleDuplicateService}
                      onDeleteService={handleDeleteService}
                    />
                  )
                }) ?? null}
              </div>
              <div className="relative top-3 w-full lg:hidden">
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
                      setFieldValue('show_website_link', e.target.checked)
                    }}
                    checked={values.show_website_link}
                  >
                    Show
                  </Checkbox>
                </div>
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
                  </div>
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
              {isLoading ? <Spinner /> : buttonText ? buttonText : 'Get Listed'}
            </CustomButton>
          </Form>
        </div>
      </div>
      <div
        className={`flex w-full max-w-7xl justify-center bg-white p-4 text-[#141414] md:p-10 lg:mx-auto ${showFrameModal ? 'block' : 'hidden'}`}
      >
        <BusinessServiceFrame
          setShowFrameModal={setShowFrameModal}
          showFrameModal={showFrameModal}
          onSaveService={handleSaveEditedService}
          currentService={currentEditingService}
        />
      </div>
      <>
        <PlannerModal
          className="flex justify-center rounded-lg"
          width={400}
          modalStyles={{
            body: {
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex'
            }
          }}
          modalOpen={showCalender}
          setModalOpen={setShowCalenderState}
          onCloseModal={() => setShowCalenderState(false)}
        >
          <BusinessCalender
            selectedDates={selectedDatesState} // ← use local state
            onSelectMultipleDates={handleMultipleDatesSelect}
            setShowCalender={setShowCalenderState}
            setShowTime={setShowTime}
          />
        </PlannerModal>
      </>
      <>
        <PlannerModal
          className="flex justify-center rounded-lg"
          width={400}
          maxHeight={600}
          modalStyles={{
            body: {
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex'
            }
          }}
          modalOpen={showTime}
          setModalOpen={setShowTime}
          onCloseModal={() => {
            setShowTime(false)
            setCurrentEditingService(null) // Clear current editing service when modal is closed
            if (!setSelectedDates) {
              setSelectedDatesState([])
            }
          }}
        >
          <BusinessTime
            setShowCalender={setShowCalender || setShowCalenderState}
            setShowTime={setShowTime}
            selectedDates={selectedDates || selectedDatesState}
            currentService={currentEditingService}
            onSaveService={handleSaveEditedService}
          />
        </PlannerModal>
      </>
    </div>
  )
}
// const SelectWrapper = styled(tw.div`
//   bg-black `)`
//   /* Select input styling for dark background */
//   .dark-select.ant-select .ant-select-selection-search-input,
//   .dark-select.ant-select input,
//   .dark-select.ant-select .ant-select-selection-placeholder,
//   .dark-select.ant-select .ant-select-selection-item {
//     color: white !important;
//   }

//   .dark-select.ant-select-focused .ant-select-selection-search-input,
//   .dark-select.ant-select-focused input,
//   .ant-select-selection--focused input,
//   .ant-select-selection--focused .ant-select-selection-search-input {
//     color: white !important;
//   }

//   /* Target input specifically */
//   .dark-select .ant-select-selection-search input {
//     color: white !important;
//   }
// `
export default CreateYourBusiness
