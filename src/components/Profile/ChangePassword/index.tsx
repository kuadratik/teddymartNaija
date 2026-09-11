import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {Form} from 'antd'
import {useFormik} from 'formik'
import React, {useState} from 'react'
import {VendorPasswordType} from '../utils'
import {vendorPasswordValidationSchema} from '../utils/schema'
import useChangeVendorPassword from '../hooks/useChangePassword'
import Spinner from '@/components/SharedUI/Spinner'

const ChangePasswordComponent = () => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const initialValues = {
    old_password: '',
    new_password: '',
    new_password_confirmation: ''
  }

  // * mutation
  const {changeVendorPasswordHandler, isLoading} = useChangeVendorPassword()
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<VendorPasswordType>({
      initialValues: initialValues,
      validationSchema: vendorPasswordValidationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        changeVendorPasswordHandler(val)
      }
    })

  return (
    <div>
      <Form onFinish={handleSubmit} layout="vertical">
        <div className="flex flex-col gap-5">
          {' '}
          <TextInput
            errorMessage={errors.old_password ? errors.old_password : ''}
            iconClick={() => {
              setShowConfirm(prev => !prev)
            }}
            iconName={!showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'}
            placeholder="Old Password"
            onChange={handleChange}
            type={showConfirm ? 'text' : 'password'}
            name={'old_password'}
            value={values.old_password}
          />
          <TextInput
            errorMessage={errors.new_password ? errors.new_password : ''}
            iconClick={() => {
              setShowNewPassword(prev => !prev)
            }}
            iconName={!showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'}
            placeholder="New Password"
            onChange={handleChange}
            type={showNewPassword ? 'text' : 'password'}
            name={'new_password'}
            value={values.new_password}
          />{' '}
          <TextInput
            errorMessage={errors.new_password_confirmation ? errors.new_password_confirmation : ''}
            iconClick={() => {
              setShowConfirmNewPassword(prev => !prev)
            }}
            iconName={!showConfirmNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'}
            placeholder="Confirm New Password"
            onChange={handleChange}
            type={showConfirmNewPassword ? 'text' : 'password'}
            name={'new_password_confirmation'}
            value={values.new_password_confirmation}
          />
        </div>
        <CustomButton
          type="submit"
          className="mt-[44px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading ? <Spinner /> : 'Save'}
        </CustomButton>
      </Form>
    </div>
  )
}

export default ChangePasswordComponent
