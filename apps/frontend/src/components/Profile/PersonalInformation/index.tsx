import {SignUpType} from '@/components/Auth/Signup/utils'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Form} from 'antd'
import {useFormik} from 'formik'
import React from 'react'
import {VendorPersonalType} from '../utils'
import {vendorPersonalInfoValidationSchema} from '../utils/schema'
import useUpdateProfile from '../hooks/useUpdateProfile'
import Spinner from '@/components/SharedUI/Spinner'

const PersonalInformation = () => {
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user

  const initialValues = {
    first_name: isAuthenticatedUser?.first_name ?? '',
    last_name: isAuthenticatedUser?.last_name ?? '',
    email: isAuthenticatedUser?.email ?? ''
  }
  // * mutation
  const {updateVendorProfileHandler, isLoading} = useUpdateProfile()
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<VendorPersonalType>({
      initialValues: initialValues,
      validationSchema: vendorPersonalInfoValidationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        updateVendorProfileHandler(val)
      }
    })

  return (
    <div className="">
      <Form onFinish={handleSubmit} layout="vertical">
        <div className="flex flex-col gap-5">
          {' '}
          <TextInput
            errorMessage={errors.first_name ? errors.first_name : ''}
            placeholder=""
            value={values.first_name}
            onChange={handleChange}
            name={'first_name'}
            type={'text'}
          />
          <TextInput
            errorMessage={errors.last_name ? errors.last_name : ''}
            placeholder=""
            value={values.last_name}
            onChange={handleChange}
            name={'last_name'}
            type={'text'}
          />
          <TextInput
            errorMessage={errors.email ? errors.email : ''}
            placeholder=""
            value={values.email}
            name={'email'}
            onChange={handleChange}
            type={'email'}
          />
        </div>
        <CustomButton
          type="submit"
          className="mt-[28px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading ? <Spinner /> : 'Save'}
        </CustomButton>
      </Form>
    </div>
  )
}

export default PersonalInformation
