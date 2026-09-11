import { FormContainer } from '@/components/Auth/Signup/Onboarding'
import StoreInformation from '@/components/Auth/Signup/components/StoreInformation'
import StoreActivation from '@/components/Auth/Signup/components/StoreActivation'
import UploadInformation from '@/components/Auth/Signup/components/UploadInformation'
import VendorTypeComponent from '@/components/Auth/Signup/components/VendorType'
import useCreateStoreQuery from '@/components/Auth/Signup/hooks/useCreateStore'
import useHandleUploadQuery from '@/components/Auth/Signup/hooks/useHandleUpload'
import { OnboardingType } from '@/components/Auth/Signup/utils'
import { OnboardingSchema } from '@/components/Auth/Signup/utils/schema'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import Spinner from '@/components/SharedUI/Spinner'
import { Form } from 'antd'
import { useFormik } from 'formik'
import { AnimatePresence } from 'framer-motion'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const NewStoreComponent = () => {
  const { type } = useSelector((state: any) => state.vendor)

  const initialValues = {
    offers_service: type === 'service',
    offers_product: type === 'product',
    name: '',
    category: [],
    description: '',
    contact_number: '',
    whatsapp_number: '',
    address1: '',
    address2: '',
    state: undefined,
    city: '',
    postal_code: '',
    country: undefined,
    profile_picture_path: undefined,
    banner_path: undefined
  }

  const [currentForm, setCurrentForm] = React.useState(1)

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentForm])

  const { isLoading, handleUploadQuery } = useHandleUploadQuery()

  const { errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError } =
    useFormik<OnboardingType>({
      initialValues: initialValues,
      validationSchema: OnboardingSchema[currentForm],
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        if (currentForm === 2) {
          // Upload step - upload images and create store
          handleUploadQuery({
            payload: { ...val, type: val.offers_product ? 'product' : 'service' },
            successFunction: handleCreateStore
          })
        } else if (currentForm === 3) {
          // Payment step - handle payment
          // TODO: Implement payment logic
          console.log('Payment step - implement payment logic')
        } else {
          // Move to next step
          setCurrentForm(prev => prev + 1)
        }
      }
    })

  const { isLoading: createStoreIsLoading, handleCreateStore } = useCreateStoreQuery({
    setFieldError: setFieldError,
    setCurrentForm: setCurrentForm,
    values: { ...values, type: values.offers_product ? 'product' : 'service' },
    redirectToDashboard: false
  })

  const steps = [
    {
      title: 'Service Type',
      content: (
        <VendorTypeComponent
          setFieldValue={setFieldValue}
          values={values}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
        />
      )
    },

    {
      title: 'Store Information',
      content: (
        <StoreInformation
          touched={touched}
          title_header={true}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    },
    {
      title: 'Upload Information',
      content: (
        <UploadInformation
          title_header={true}
          touched={touched}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    },
    {
      title: 'Store Activation',
      content: (
        <StoreActivation
          title_header={true}
          touched={touched}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    }
  ]

  const navigateToPreviousForm = React.useCallback(() => {
    setCurrentForm(prev => prev - 1)
  }, [])

  return (
    <React.Fragment>
      {' '}
      <div className="flex flex-col">
        <Form size="large" onFinish={handleSubmit} layout="vertical" id="newForm">
          <div>
            {/* <div className="hidden items-center justify-center lg:flex">
              <TopBar title="New Store" />
            </div>{' '} */}
            <AnimatePresence>
              {steps.map((step, index) => {
                return (
                  <FormContainer isActive={currentForm === index} id={step?.title}>
                    {step?.content}
                  </FormContainer>
                )
              })}
            </AnimatePresence>
          </div>

          {currentForm !== 3 && (
            <div className="flex w-full gap-4">
              {currentForm > 0 && (
                <CustomButton
                  type={'button'}
                  onClick={navigateToPreviousForm}
                  className="w-full rounded-[10px] border border-black bg-white px-1 py-4 text-[14px] text-black hover:bg-gray-50"
                >
                  Previous
                </CustomButton>
              )}
              <CustomButton
                disabled={!values.offers_service && !values.offers_product && currentForm === 0}
                type={'submit'}
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {isLoading || createStoreIsLoading ? <Spinner /> : currentForm === 1 ? 'Next' : 'Continue'}
              </CustomButton>
            </div>
          )}
        </Form>
      </div>
    </React.Fragment>
  )
}

export default NewStoreComponent
