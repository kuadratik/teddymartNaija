import {FormContainer} from '@/components/Auth/Signup/Onboarding'
import StoreInformation from '@/components/Auth/Signup/components/StoreInformation'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import {Form} from 'antd'
import {useFormik} from 'formik'
import {AnimatePresence} from 'framer-motion'
import React from 'react'
import {VendorStoreInformationType} from '../utils'
import {vendorStoreInfoValidationSchema} from '../utils/schema'
import {useAppSelector} from '@/hooks/reduxHooks'
import useUpdateStoreInformation from '../hooks/useUpdateStoreInformation'
import Spinner from '@/components/SharedUI/Spinner'
import {NewStoreSchema, OnboardingSchema, StoreInformationSchema} from '@/components/Auth/Signup/utils/schema'
import UploadInformation from '@/components/Auth/Signup/components/UploadInformation'
import useUpdateBannerPicture from '../hooks/useUpdateBannerProfile'

const VendorProfileStoreInformation = () => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  console.log(isActiveUser)
  const initialValues = {
    name: isActiveUser?.name ?? '',
    description: isActiveUser?.description ?? '',
    contact_number: isActiveUser?.contact_number ?? '',
    whatsapp_number: isActiveUser?.whatsapp_number ?? '',
    address1: isActiveUser?.address1 ?? '',
    address2: isActiveUser?.address2 ?? '',
    state: isActiveUser?.state ?? undefined,
    city: isActiveUser?.city ?? '',
    postal_code: isActiveUser?.postal_code ?? '',
    country: isActiveUser?.country_id ?? undefined,
    profile_picture_path: isActiveUser?.profile_picture_path ?? undefined
  }

  const [currentForm, setCurrentForm] = React.useState(0)

  const {isLoading: bannerIsloading, updateStoreIsLoading, handleUpdateBannerPicture} = useUpdateBannerPicture()

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    handleChange,
    resetForm,
    touched
    // setFieldError,
  } = useFormik<VendorStoreInformationType>({
    initialValues: initialValues,
    validationSchema: NewStoreSchema[currentForm],
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      // console.log(val)
      if (currentForm === 0) {
        setCurrentForm(prev => prev + 1)
      } else {
        // console.log({
        //   ...val,
        //   slug: isActiveUser?.slug,
        //   banner_path: val?.banner_path ?? isActiveUser?.banner_path
        // })
        handleUpdateBannerPicture({
          payload: {
            ...val,
            slug: isActiveUser?.slug,
            banner_path: val?.banner_path ?? isActiveUser?.banner_path
          }
        })
      }
    }
  })

  const navigateToPreviousForm = React.useCallback(() => {
    setCurrentForm(prev => prev - 1)
  }, [])

  const steps = [
    {
      title: 'Store Information',
      content: (
        <StoreInformation
          title_header={false}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
        />
      )
    },
    {
      title: 'Upload Information',
      content: (
        <UploadInformation
          showProfile={false}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    }
  ]

  return (
    <div className="">
      {/* Form */}

      <Form onFinish={handleSubmit} layout="vertical">
        {/* <AnimatePresence>
          {' '}
          <FormContainer isActive={true} id={'store-information'}> */}

        <div>
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

            <CustomButton type="submit" className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white">
              {bannerIsloading || updateStoreIsLoading ? <Spinner /> : 'Save'}
            </CustomButton>
          </div>
        ) : (
          <CustomButton
            onClick={() => {
              console.log('click')
            }}
            type={'submit'}
            className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
          >
            {bannerIsloading || updateStoreIsLoading ? <Spinner /> : 'Continue'}
          </CustomButton>
        )}

        {/* </FormContainer>
        </AnimatePresence> */}

        {/* <CustomButton
          type="submit"
          className="mt-[1px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading ? <Spinner /> : 'Save'}
        </CustomButton> */}
      </Form>
    </div>
  )
}

export default VendorProfileStoreInformation
