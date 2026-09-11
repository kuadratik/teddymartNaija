import CreateYourBusiness from '@/components/Business/CreateYourBusiness'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {fileToBase64} from '@/components/Vendor/utils'
import {useUploadImageFileWithoutAuthMutation} from '@/services/general/general'
import {useSingleBusinessListingsQuery, useUpdateBusinessListingMutation} from '@/services/myBussiness'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import * as Yup from 'yup'

// Initialize dayjs with UTC plugin
dayjs.extend(utc)
interface FormatTime {
  (isoTimeString: string | null | undefined): string
}

interface FormatDate {
  (isoDateString: string | null | undefined): string | null
}
const EditMekDirectory = () => {
  const [updateBusinessListing, {isLoading}] = useUpdateBusinessListingMutation()
  const router = useRouter()
  const [activeColor, setActiveColor] = useState('#000000')
  const [uploadFile, {isLoading: fileUpLoading}] = useUploadImageFileWithoutAuthMutation()
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const {data, isLoading: businessLoading} = useSingleBusinessListingsQuery({
    business_slug: router?.query?.business_slug as any
  })
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        business_name: '',
        business_description: '',
        industry_id: null,
        website_link: '',
        business_email: '',
        secondary_business_email: '',
        business_address: '',
        business_contact_number: '',
        secondary_contact_number: '',
        owner_name: '',
        country_id: null,
        state: '',
        owner_role: '',
        color: '',
        business_logo_url: null,
        show_business_description: true,
        show_business_email: true,
        show_business_address: true,
        show_secondary_email: true,
        show_secondary_contact: true,
        show_website_link: true,
        services: []
      },
      validationSchema: Yup.object().shape({
        industry_id: Yup.string().required('Industry is required'),
        business_name: Yup.string()
          .required('Business name is required')
          .max(75, 'Business name must not exceed 75 characters'),
        business_contact_number: Yup.string().required('Contact number is required'),
        // add validation for country,state name
        owner_name: Yup.string().required('Owner name is required').max(75, 'Owner name must not exceed 75 characters'),
        country_id: Yup.string().required('Country is required'),
        state: Yup.string().required('State is required'),
        website_link: Yup.string()
          .matches(
            /^(https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([\/?].*)?$/,
            'Please enter a valid URL starting with http://, https://, or www.'
          )
          .max(150, 'Website URL must not exceed 150 characters')
          .test('url-validation', 'Please enter a valid website URL', value => {
            if (!value) return true // Return true if empty (unless you want it required)

            // If it starts with www., prepend https:// for URL validation
            const urlToTest = value.startsWith('www.') ? `https://${value}` : value

            try {
              new URL(urlToTest)
              return true
            } catch (error) {
              return false
            }
          })
          .nullable() // If the field is optional
        // OR use .required('Website URL is required') if the field is mandatory
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async () => {
        await handleUpload()
      },
      validate: values => {
        // This will run after Yup validation
        window.scrollTo({top: 0, behavior: 'smooth'})

        const errors = {}
        // If there are any validation errors, scroll to top

        return errors
      }
    }
  )

  // Updated helper function to extract time from ISO string without timezone shifts

  const formatTime: FormatTime = isoTimeString => {
    if (!isoTimeString) return ''

    // If it's already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(isoTimeString)) return isoTimeString

    // Extract time directly from ISO string to avoid timezone issues
    if (isoTimeString.includes('T')) {
      return isoTimeString.split('T')[1].substring(0, 5)
    }

    // Fallback using dayjs UTC
    return dayjs.utc(isoTimeString).format('HH:mm')
  }

  const formatDate: FormatDate = isoDateString => {
    if (!isoDateString) return null

    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDateString) && !isoDateString.includes('T')) {
      return isoDateString
    }

    // Use dayjs to parse date in UTC to avoid timezone shifts
    return dayjs.utc(isoDateString).format('YYYY-MM-DD')
  }

  useEffect(() => {
    if (data) {
      setFieldValue('business_name', data?.data?.business_name)
      setFieldValue('business_description', data?.data?.business_description)
      setFieldValue('industry_id', data?.data?.industry_id)
      setFieldValue('website_link', data?.data?.website_link ?? '')
      setFieldValue('business_email', data?.data?.business_email ?? '')
      setFieldValue('secondary_business_email', data?.data?.secondary_business_email ?? '')
      setFieldValue('business_address', data?.data?.business_address ?? '')
      setFieldValue('business_contact_number', data?.data?.business_contact_number ?? '')
      setFieldValue('secondary_contact_number', data?.data?.secondary_contact_number ?? '')
      setFieldValue('owner_name', data?.data?.owner_name ?? '')
      setFieldValue('country_id', data?.data?.country_id)
      setFieldValue('state', data?.data?.state ?? '')
      setFieldValue('owner_role', data?.data?.owner_role ?? '')
      setFieldValue('color', data?.data?.color ?? '#000000')
      setFieldValue('business_logo_url', data?.data?.business_logo_url ?? null)
      setFieldValue('show_business_description', data?.data?.show_business_description ?? true)
      setFieldValue('show_business_email', data?.data?.show_business_email ?? true)
      setFieldValue('show_business_address', data?.data?.show_business_address ?? true)
      setFieldValue('show_secondary_email', data?.data?.show_secondary_email ?? true)
      setFieldValue('show_secondary_contact', data?.data?.show_secondary_contact ?? true)
      setFieldValue('show_website_link', data?.data?.show_website_link ?? true)

      // Format dates and times in service availabilities using UTC
      const formattedServices = (data as any).data.service_availabilities
        ? (data as any).data.service_availabilities.map((service: any) => ({
            ...service,
            time_slots: service.time_slots.map((slot: any) => ({
              ...slot,
              start_time: formatTime(slot.start_time),
              end_time: formatTime(slot.end_time),
              date: formatDate(slot.date)
            }))
          }))
        : []

      console.log('Formatted services with times:', formattedServices)
      setFieldValue('services', formattedServices)
      setActiveColor(data?.data?.color ?? '#000000')
    }
  }, [data])
  const handleUpload = async () => {
    let newFile = null

    const payload = {
      ...values,
      color: activeColor
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
      await updateBusinessListing({body: payload, id: router?.query?.id as string})
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>Business listing updated successfully</>}
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
      await router.back()
    } catch (err) {
      console.log('Error in handleUpload:', err)
      window.scrollTo({top: 0, behavior: 'smooth'})
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Error updating business listing</>}
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
    <div>
      <SEOHead
        title={`Get Listed | myEKI`}
        description="Get Listed on myEKI and start selling for free! Find products and services near you!!"
      />
      <main className="flex w-full flex-col gap-8">
        <div className="flex w-full flex-col">
          {/* <div className="flex w-full flex-col-reverse lg:flex-col">
            <NewNavigation />
          </div> */}
        </div>
        <CreateYourBusiness
          errors={errors}
          setActiveColor={setActiveColor}
          activeColor={activeColor}
          values={values}
          buttonText="Update Business"
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          uploadedDetails={uploadedDetails}
          setUploadedDetails={setUploadedDetails}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}

EditMekDirectory.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default EditMekDirectory
