import CustomButton from '@/components/SharedUI/Buttons/Button'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {OnboardingType, VendorType} from './utils'
import {AnimatePresence, motion} from 'framer-motion'
import VendorTypeComponent from './components/VendorType'
import {Form} from 'antd'
import {useFormik} from 'formik'
import StoreInformation from './components/StoreInformation'
import UploadInformation from './components/UploadInformation'
import {OnboardingSchema} from './utils/schema'
import useHandleUploadQuery from './hooks/useHandleUpload'
import Spinner from '@/components/SharedUI/Spinner'
import useCreateStoreQuery from './hooks/useCreateStore'
import {useAppSelector} from '@/hooks/reduxHooks'

const initialValues = {
  offers_service: false,
  offers_product: false,
  name: '',
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

  const [currentForm, setCurrentForm] = React.useState(0)

  const {isLoading, handleUploadQuery} = useHandleUploadQuery()

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<OnboardingType>({
      initialValues: initialValues,
      validationSchema: OnboardingSchema[currentForm],
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        if (currentForm !== 2) {
          setCurrentForm(prev => prev + 1)
        } else {
          handleUploadQuery({payload: val, successFunction: handleCreateStore})
        }
      }
    })

  const {isLoading: createStoreIsLoading, handleCreateStore} = useCreateStoreQuery({
    setFieldError: setFieldError,
    setCurrentForm: setCurrentForm,
    values: values
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
        <UploadInformation setFieldValue={setFieldValue} values={values} errors={errors} handleChange={handleChange} />
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

            <CustomButton
              disabled={!values.offers_service && !values.offers_product && currentForm === 0}
              type={'submit'}
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              {isLoading || createStoreIsLoading ? <Spinner /> : 'Continue'}
            </CustomButton>
          </Form>
        </div>
      ) : null}
    </React.Fragment>
  )
}

/**Renders the children when isActive is true */
export const FormContainer: React.FC<React.PropsWithChildren<{isActive: boolean; id: string | undefined}>> = ({
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
          initial={{opacity: 0, x: -100}}
          animate={{opacity: 1, x: 0}}
          exit={{opacity: 0, x: 200}}
          transition={{duration: 0.25}}
        >
          {children}
        </motion.div>
      ) : null}
    </>
  )
}

export default Onboarding
