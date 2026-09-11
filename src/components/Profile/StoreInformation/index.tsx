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
import {StoreInformationSchema} from '@/components/Auth/Signup/utils/schema'

const VendorProfileStoreInformation = () => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
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
    country: isActiveUser?.country_id ?? undefined
  }

  // * mutation
  const {updateVendorProfileHandler, isLoading} = useUpdateStoreInformation()

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
    validationSchema: StoreInformationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      updateVendorProfileHandler({
        ...val,
        slug: isActiveUser?.slug,
        banner_path: isActiveUser?.banner_path,
        profile_picture_path: isActiveUser?.profile_picture_path
      })
    }
  })

  return (
    <div className="">
      {/* Form */}

      <Form onFinish={handleSubmit} layout="vertical">
        {/* <AnimatePresence>
          {' '}
          <FormContainer isActive={true} id={'store-information'}> */}
        <StoreInformation
          title_header={false}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
        />

        {/* </FormContainer>
        </AnimatePresence> */}

        <CustomButton
          type="submit"
          className="mt-[1px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading ? <Spinner /> : 'Save'}
        </CustomButton>
      </Form>
    </div>
  )
}

export default VendorProfileStoreInformation
