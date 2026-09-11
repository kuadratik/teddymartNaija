import CustomButton from '@/components/SharedUI/Buttons/Button'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {Form} from 'antd'
import {useFormik} from 'formik'
import Spinner from '@/components/SharedUI/Spinner'
import {useAppSelector} from '@/hooks/reduxHooks'
import {FormContainer} from '@/components/Auth/Signup/Onboarding'
import useHandleUploadQuery from '@/components/Auth/Signup/hooks/useHandleUpload'
import {OnboardingType} from '@/components/Auth/Signup/utils'
import {OnboardingSchema} from '@/components/Auth/Signup/utils/schema'
import useCreateStoreQuery from '@/components/Auth/Signup/hooks/useCreateStore'
import StoreInformation from '@/components/Auth/Signup/components/StoreInformation'
import UploadInformation from '@/components/Auth/Signup/components/UploadInformation'
import TopBar from '@/components/Vendor/TopBar'
import {useSelector} from 'react-redux'
import VendorTypeComponent from '@/components/Auth/Signup/components/VendorType'

const NewStoreComponent = () => {
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const {type} = useSelector((state: any) => state.vendor)

  const router = useRouter()
  const initialValues = {
    offers_service: type === 'service',
    offers_product: type === 'product',
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

  const isAuthenticated = isAuthenticatedToken

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
      <div className="my-6 flex flex-col">
        <Form size="large" onFinish={handleSubmit} layout="vertical" id="newForm">
          <div>
            <div className="flex items-center justify-center">
              <TopBar title="New Store" />
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
          {currentForm > 0 ? (
            <div className="mt-3 flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  navigateToPreviousForm()
                }}
                type="button"
                className="w-[140px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
              >
                Back
              </CustomButton>

              <CustomButton
                type="submit"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {isLoading || createStoreIsLoading ? <Spinner /> : currentForm === 1 ? 'Continue' : 'Create'}
              </CustomButton>
            </div>
          ) : (
            <CustomButton
              disabled={!values.offers_service && !values.offers_product && currentForm === 0}
              type={'submit'}
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              {isLoading || createStoreIsLoading ? <Spinner /> : 'Continue'}
            </CustomButton>
          )}
        </Form>
      </div>
    </React.Fragment>
  )
}

export default NewStoreComponent
