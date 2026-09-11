import CustomButton from '@/components/SharedUI/Buttons/Button'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { OnboardingType, VendorType } from './utils'
import { AnimatePresence, motion } from 'framer-motion'
import VendorTypeComponent from './components/VendorType'
import { Form } from 'antd'
import { useFormik } from 'formik'
import StoreInformation from './components/StoreInformation'
import StoreActivation from './components/StoreActivation'
import UploadInformation from './components/UploadInformation'
import { OnboardingSchema } from './utils/schema'
import useHandleUploadQuery from './hooks/useHandleUpload'
import Spinner from '@/components/SharedUI/Spinner'
import useCreateStoreQuery from './hooks/useCreateStore'
import { useAppSelector } from '@/hooks/reduxHooks'

const initialValues = {
  offers_service: false,
  offers_product: false,
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

const Onboarding = () => {
  const router = useRouter()

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuthenticated = isAuthenticatedToken

  useEffect(() => {
    if (!isAuthenticated) {
      // Save the current  URL as a query parameter
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null // Prevent rendering until authentication is verified

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
          handleUploadQuery({ payload: val, successFunction: handleCreateStore })
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
    values: values,
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
      {isAuthenticated ? (
        <div className="my-6 flex flex-col">
          <Form size="large" onFinish={() => handleSubmit()} layout="vertical" id="onboardingForm">
            <div>
              <div className="flex items-center justify-center">
                <LogoHeader onClick={() => (currentForm === 0 ? router.back() : navigateToPreviousForm())} />
              </div>{' '}
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
      ) : null}
    </React.Fragment>
  )
}

/**Renders the children when isActive is true */
export const FormContainer: React.FC<React.PropsWithChildren<{ isActive: boolean; id: string | undefined }>> = ({
  isActive,
  id,
  children
}) => {
  return (
    <>
      {isActive ? (
        <motion.div
          key={id}
          className="mx-auto"
          layoutId={id}
          layout="position"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      ) : null}
    </>
  )
}

export default Onboarding
