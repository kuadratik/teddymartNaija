import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {Form} from 'antd'
import {useFormik} from 'formik'
import Link from 'next/link'
import React, {useState} from 'react'
import {SignUpType} from '../utils'
import {signUpValidationSchema} from '../utils/schema'
import useSignUpQuery from '../hooks/useSignUp'
import Spinner from '@/components/SharedUI/Spinner'
import {useRouter} from 'next/router'

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: ''
}

const VendorSignupForm = () => {
  const router = useRouter()
  const {redirect} = router.query

  const {isLoading, handleSignUpUser} = useSignUpQuery()

  const [showConfirm, setShowConfirm] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<SignUpType>({
      initialValues: initialValues,
      validationSchema: signUpValidationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        handleSignUpUser({payload: val, setFieldError})
      }
    })

  return (
    <div>
      <Form onFinish={handleSubmit} layout="vertical">
        <div className="flex flex-col gap-5">
          {' '}
          <div className="flex w-full gap-4">
            <TextInput
              placeholder="First Name"
              onChange={handleChange}
              name={'first_name'}
              type={'text'}
              value={values.first_name}
              errorMessage={errors.first_name ? errors.first_name : ''}
            />
            <TextInput
              errorMessage={errors.last_name ? errors.last_name : ''}
              value={values.last_name}
              placeholder="Last Name"
              onChange={handleChange}
              name={'last_name'}
              type={'text'}
            />
          </div>
          <TextInput
            value={values.email}
            errorMessage={errors.email ? errors.email : ''}
            placeholder="Email"
            onChange={handleChange}
            name={'email'}
            type={'email'}
          />
          <TextInput
            value={values.password}
            errorMessage={errors.password ? errors.password : ''}
            iconClick={() => {
              setShowConfirm(prev => !prev)
            }}
            iconName={!showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'}
            placeholder="Password"
            onChange={handleChange}
            type={showConfirm ? 'text' : 'password'}
            name={'password'}
          />
          <TextInput
            iconClick={() => {
              setShowConfirmPassword(prev => !prev)
            }}
            iconName={!showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'}
            placeholder="Confirm Password"
            onChange={handleChange}
            type={showConfirmPassword ? 'text' : 'password'}
            name={'password_confirmation'}
            value={values.password_confirmation}
            errorMessage={
              touched.password_confirmation && errors.password_confirmation ? errors.password_confirmation : ''
            }
          />
        </div>
        <CustomButton
          type="submit"
          className="mt-[24px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading ? <Spinner /> : 'Continue'}
        </CustomButton>
      </Form>

      <div className="mt-[29px] flex items-center justify-center gap-3">
        <div className="text-[14px] font-medium">
          <span className="font-medium text-[#6B7280]">I have an account? </span>
          <Link
            href={
              redirect
                ? {
                    pathname: '/auth/login',
                    query: {redirect: redirect}
                  }
                : '/auth/login'
            }
            className="!border-none !p-0 text-sm text-[#000] underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VendorSignupForm
