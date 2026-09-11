import BusinessCalender from '@/components/Business/BusinessCalender'
import BusinessTime from '@/components/Business/BusinessTime'
import CreateYourBusiness from '@/components/Business/CreateYourBusiness'
import CustomerLayout from '@/components/Layout/Customerlayout'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import SEOHead from '@/components/SharedUI/SEOHead'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {fileToBase64} from '@/components/Vendor/utils'
import {useUploadImageFileWithoutAuthMutation} from '@/services/general/general'
import {useCreateBusinessListingMutation} from '@/services/myBussiness'
import {format, parseISO} from 'date-fns'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import * as Yup from 'yup'

const GetList = () => {
  const [createBusinessListing, {isLoading}] = useCreateBusinessListingMutation()
  const [activeColor, setActiveColor] = useState('#000000')
  const router = useRouter()
  const [uploadFile, {isLoading: fileUpLoading}] = useUploadImageFileWithoutAuthMutation()
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [businessServiceList, setBusinessServiceList] = useState<any[]>([])
  console.log('🚀 ~ GetList ~ businessServiceList:', businessServiceList)
  const [currentEditingService, setCurrentEditingService] = useState<any>(null)
  const [showServiceTime, setShowServiceTime] = useState<boolean>(false)
  const [showCalender, setShowCalender] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDates, setSelectedDates] = useState<any[]>([])

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
            if (!value) return true

            const urlToTest = value.startsWith('www.') ? `https://${value}` : value

            try {
              new URL(urlToTest)
              return true
            } catch (error) {
              return false
            }
          })
          .nullable()
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async () => {
        await handleUpload()
      },
      validate: values => {
        window.scrollTo({top: 0, behavior: 'smooth'})

        const errors = {}

        return errors
      }
    }
  )

  useEffect(() => {
    if (businessServiceList && businessServiceList.length > 0) {
      setFieldValue('services', [...businessServiceList])
    }
  }, [businessServiceList, setFieldValue])

  useEffect(() => {
    if (values.services && values.services.length > 0 && businessServiceList.length === 0) {
      setBusinessServiceList([...values.services])
    }
  }, [values.services])

  const handleSaveService = (updatedService: any) => {
    if (!updatedService.id) {
      updatedService.id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()
    }

    let updatedServiceList = [...businessServiceList]
    const existingServiceIndex = updatedServiceList.findIndex(service => service.id === updatedService.id)

    if (existingServiceIndex >= 0) {
      updatedServiceList[existingServiceIndex] = updatedService
    } else {
      updatedServiceList.push(updatedService)
    }

    setBusinessServiceList(updatedServiceList)
    setShowServiceTime(false)
    setCurrentEditingService(null)
  }

  const handleEditService = (service: any) => {
    if (!service || !service.id) {
      console.warn('Attempted to edit service without ID:', service)
      return
    }

    // Close all modals first to avoid interference
    setShowCalender(false)
    setShowTime(false)
    setShowServiceTime(false)

    // Reset current editing service
    setCurrentEditingService(null)

    // Check if it's a frame-type service (using day_of_week instead of date)
    if (service.availability_type === 'frame') {
      console.log('Editing frame-type service', service)
      setCurrentEditingService({...service})

      // For frame-type services, don't try to parse dates since they use day_of_week
      // Instead, forward to the parent component to handle it
      if (service.time_slots && Array.isArray(service.time_slots)) {
        setSelectedDates([])
      }
    } else {
      // For flex-type services with dates
      // Build array of unique full dates with metadata
      if (service.time_slots && Array.isArray(service.time_slots)) {
        const validDates = service.time_slots.filter((slot: any) => slot.date !== null).map((slot: any) => slot.date)

        const uniqueDates = Array.from(new Set(validDates))

        const formattedDatesWithData = uniqueDates.map(dateStr => ({
          fullDate: dateStr,
          display: format(parseISO(dateStr as string), 'dddd Do'),
          originalDate: parseISO(dateStr as string)
        }))

        // Set dates
        setSelectedDates(formattedDatesWithData)
      }
    }

    // Set service and open appropriate modal after a short delay to ensure state is updated
    setTimeout(() => {
      setCurrentEditingService({...service})

      // Open the appropriate modal based on service type
      if (service.availability_type === 'frame') {
        // For frame services, we should handle in parent CreateYourBusiness
      } else {
        setShowServiceTime(true)
      }
    }, 50)
  }

  const handleDuplicateService = (service: any) => {
    if (!service || !service.id) {
      console.warn('Attempted to duplicate service without ID:', service)
      return
    }

    const newId = crypto.randomUUID ? crypto.randomUUID() : uuidv4()

    const duplicatedService = {
      ...JSON.parse(JSON.stringify(service)),
      id: newId,
      service_name: `${service.service_name} (Copy)`
    }

    const updatedServiceList = [...businessServiceList, duplicatedService]
    setBusinessServiceList(updatedServiceList)
    // keep Formik in sync
    setFieldValue('services', updatedServiceList)
  }

  const handleDeleteService = (serviceToDelete: any) => {
    if (!serviceToDelete || !serviceToDelete.id) {
      console.warn('Attempted to delete service without ID:', serviceToDelete)
      return
    }

    const updatedServiceList = businessServiceList.filter(service => service.id !== serviceToDelete.id)
    setBusinessServiceList(updatedServiceList)
    setFieldValue('services', updatedServiceList)
  }

  const handleUpload = async () => {
    let newFile = null

    const payload = {
      ...values,
      color: activeColor
    }

    // remove id from services before submitting to server
    if (payload.services && Array.isArray(payload.services)) {
      payload.services = payload.services.map((service: {id: string; [key: string]: any}) => {
        const {id, ...rest} = service
        return rest
      })
    }

    try {
      if (uploadedDetails) {
        newFile = await fileToBase64(uploadedDetails as File)
        const uploadResponse = await uploadFile({body: {images: newFile}}).unwrap()
        payload.business_logo_url = uploadResponse?.data[0]
      }
      await createBusinessListing({body: payload})
        .unwrap()
        .then(res => {
          setBusinessServiceList([])

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
      router.back()
    } catch (err) {
      console.log('Error in handleUpload:', err)
      window.scrollTo({top: 0, behavior: 'smooth'})

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
        <div className="flex w-full flex-col"></div>
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
          onEditService={handleEditService}
          onDuplicateService={handleDuplicateService}
          onDeleteService={handleDeleteService}
          setShowCalender={setShowCalender}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
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
            setModalOpen={setShowCalender}
            onCloseModal={() => setShowCalender(false)}
          >
            <BusinessCalender
              selectedDates={selectedDates}
              onSelectMultipleDates={dates => {
                const datesWithData = dates.map(date => ({
                  fullDate: date.format('YYYY-MM-DD'),
                  display: date.format('dddd Do'),
                  originalDate: date
                }))
                setSelectedDates(datesWithData)
              }}
              setShowCalender={setShowCalender}
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
            onCloseModal={() => setShowTime(false)}
          >
            <BusinessTime
              setShowCalender={setShowCalender}
              setShowTime={setShowTime}
              selectedDates={selectedDates}
              onSaveService={handleSaveService}
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
            modalOpen={showServiceTime}
            setModalOpen={setShowServiceTime}
            onCloseModal={() => {
              setShowServiceTime(false)
              // Important: Don't reset currentEditingService immediately
              // This prevents state changes during render
            }}
          >
            {showServiceTime && currentEditingService && (
              <BusinessTime
                setShowCalender={setShowCalender}
                setShowTime={setShowServiceTime}
                selectedDates={selectedDates}
                currentService={currentEditingService}
                onSaveService={handleSaveService}
              />
            )}
          </PlannerModal>
        </>
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
