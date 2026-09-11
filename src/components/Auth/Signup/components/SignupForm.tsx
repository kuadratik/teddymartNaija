import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import Spinner from '@/components/SharedUI/Spinner'
import {useGoogleLogin} from '@react-oauth/google'
import {Form} from 'antd'
import {useFormik} from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import useGoogleAuthVerifyQuery from '../../Login/hooks/useGoogleAuthVerify'
import useSignUpQuery from '../hooks/useSignUp'
import {SignUpType} from '../utils'
import {signUpValidationSchema} from '../utils/schema'

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  refferalType: 'customer',
  refferalCode: null,
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

  console.log('🚀 ~ VendorSignupForm ~ values:', values)
  const {isLoading: googleAuthIsLoading, handleGoogleAuthUser} = useGoogleAuthVerifyQuery()

  const login = useGoogleLogin({
    onSuccess: tokenResponse => handleCredentialResponse(tokenResponse)
  })

  const handleCredentialResponse = async (response: {access_token: string}) => {
    if (response.access_token) {
      await handleGoogleAuthUser({payload: {token: response.access_token}, setFieldError})
    }
  }

  useEffect(() => {
    // Get query parameters
    const {referral_code, referralType} = router.query

    // Check if query parameters exist and set form values
    if (referral_code) {
      setFieldValue('refferalCode', referral_code)
    }

    if (referralType) {
      setFieldValue('refferalType', referralType || 'customer')
    }
  }, [router.query, setFieldValue]) // Add setFieldValue to dependency array

  return (
    <div>
      <Form onFinish={handleSubmit} layout="vertical">
        <div className="flex flex-col gap-5">
          {' '}
          <div className="flex w-full flex-col gap-4 lg:flex-row">
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
            value={values.refferalCode || ''} // Changed from null to empty string
            errorMessage={errors.refferalCode ? errors.refferalCode : ''}
            placeholder="Referral Code"
            onChange={handleChange}
            disabled={!!router.query.referral_code} // Only disable if it comes from query params
            name={'refferalCode'}
            type={'text'}
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
          disabled={isLoading || googleAuthIsLoading}
          type="submit"
          className="mt-[24px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading || googleAuthIsLoading ? <Spinner /> : 'Continue'}
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

      <div className="mx-auto mt-[22px] flex w-[80%] items-center justify-center gap-2 pt-5 md:w-[60%]">
        <div className="h-[1px] w-full bg-[#E5E7EB]" />
        <p className="text-xs text-primary-40">OR</p>
        <div className="h-[1px] w-full bg-[#E5E7EB]" />
      </div>
      <div className="mt-3 flex w-full items-center justify-center">
        <div className="flex w-full items-center justify-center">
          <CustomButton
            onClick={() => {
              login()
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 !rounded-lg border-[1px] border-gray-200 bg-white p-2 text-gray-400 md:w-[40%]"
          >
            <Image src={'/assets/google.svg'} alt={'Google Icon'} width={20} height={20} />
            Sign In with Google
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default VendorSignupForm
