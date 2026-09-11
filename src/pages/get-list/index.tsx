import CreateYourBusiness from '@/components/Business/CreateYourBusiness'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {fileToBase64} from '@/components/Vendor/utils'
import {useUploadImageFileWithoutAuthMutation} from '@/services/general/general'
import {useCreateBusinessListingMutation} from '@/services/myBussiness'
import {useFormik} from 'formik'
import {useState} from 'react'
import * as Yup from 'yup'

const GetList = () => {
  const [createBusinessListing, {isLoading}] = useCreateBusinessListingMutation()
  const [activeColor, setActiveColor] = useState('#000000')
  const [uploadFile, {isLoading: fileUpLoading}] = useUploadImageFileWithoutAuthMutation()
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
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
        show_website_link: true
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
        const errors = {}
        // If there are any validation errors, scroll to top
        if (Object.keys(errors).length > 0) {
          window.scrollTo({top: 0, behavior: 'smooth'})
        }
        return errors
      }
    }
  )

  console.log('🚀 ~ handleUpload ~ values:', values)
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

GetList.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default GetList
