import useChangeVendorPassword from '@/components/Profile/hooks/useChangePassword'
import {VendorPasswordType} from '@/components/Profile/utils'
import {vendorPasswordValidationSchema} from '@/components/Profile/utils/schema'
import TextInput from '@/components/SharedUI/Input/TextInput'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Button, Form} from 'antd'
import {useFormik} from 'formik'
import React, {useState} from 'react'

const UserChangePassword = () => {
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
        changeVendorPasswordHandler(val, resetForm)
      }
    })

  return (
    <div>
      {' '}
      <TextComponent as="p" className="border-b-2 border-gray-200 pb-2 text-[20px] font-semibold text-black">
        Change Password{' '}
      </TextComponent>
      <Form onFinish={handleSubmit} className="mt-[24px]">
        <div className="flex flex-col gap-5">
          <TextInput
            className={`border-[1px] ${errors.old_password ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            errorMessage={errors.old_password ? errors.old_password : ''}
            iconClick={() => {
              setShowConfirm(prev => !prev)
            }}
            labelClassName="!text-black"
            iconName={!showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'}
            placeholder="Old Password"
            onChange={handleChange}
            type={showConfirm ? 'text' : 'password'}
            name={'old_password'}
            value={values.old_password}
          />

          <div className="flex w-full flex-col gap-4 md:flex-row">
            {' '}
            <TextInput
              className={`border-[1px] ${errors.new_password ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
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
              className={`border-[1px] ${errors.new_password_confirmation ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
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
        </div>

        <div className="mt-[34px]">
          {' '}
          <Button htmlType="submit" type="primary" className="whitespace-nowrap bg-black px-7 py-[22px] text-white">
            {isLoading ? (
              <span className="!w-full px-7">
                {' '}
                <Spinner className="h-2 w-2" />
              </span>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default UserChangePassword
