import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Button, Form} from 'antd'
import {useFormik} from 'formik'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {VendorLoginType} from './utils'
import {loginValidationSchema} from './utils/schema'
import useLoginQuery from './hooks/useLogin'
import Spinner from '@/components/SharedUI/Spinner'
import Image from 'next/image'
import useGoogleAuthVerifyQuery from './hooks/useGoogleAuthVerify'
import {useGoogleLogin} from '@react-oauth/google'

const initialValues = {
  email: '',
  password: ''
}

const LoginComponent = () => {
  const {isLoading, handleLoginUser} = useLoginQuery()

  const router = useRouter()

  const {redirect} = router.query

  const {isLoading: googleAuthIsLoading, handleGoogleAuthUser} = useGoogleAuthVerifyQuery()
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<VendorLoginType>({
      initialValues: initialValues,
      validationSchema: loginValidationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        handleLoginUser({payload: val, setFieldError})
      }
    })

  const [showConfirm, setShowConfirm] = useState(false)

  const login = useGoogleLogin({
    onSuccess: tokenResponse => handleCredentialResponse(tokenResponse)
  })

  // useEffect(() => {
  //   // Ensure the Google API is available

  //   if (window?.google?.accounts) {
  //     // Initialize the Google Sign-In client
  //     // window.google.accounts.id.initialize({
  //     //   client_id: process.env.googleClientID,
  //     //   callback: handleCredentialResponse
  //     // })

  //     // Render the button
  //     const googleSignInButton = document.getElementById('google-exist-myeki-button')
  //     if (googleSignInButton) {
  //       window.google.accounts.id.renderButton(googleSignInButton, {
  //         theme: 'outline',
  //         size: 'large'
  //       })
  //     }
  //   }
  // }, [])

  const handleCredentialResponse = async (response: {access_token: string}) => {
    if (response.access_token) {
      await handleGoogleAuthUser({payload: {token: response.access_token}, setFieldError})
    }
  }

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <div className="flex flex-col">
        {/* <div className="flex items-center justify-center">
          <LogoHeader
            onClick={() => {
              router.back()
            }}
          />
        </div> */}
        <div className="my-[34px] flex flex-col items-center justify-center gap-2">
          <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
            Welcome Back! 👋{' '}
          </TextComponent>
        </div>
        <Form onFinish={handleSubmit} layout="vertical" size={'large'}>
          <div className="mb-[24px] flex flex-col gap-5">
            {' '}
            <TextInput
              placeholder="Email"
              errorMessage={errors.email ? errors.email : ''}
              onChange={handleChange}
              name={'email'}
              value={values.email}
              type={'email'}
            />
            <TextInput
              errorMessage={errors.password ? errors.password : ''}
              iconClick={() => {
                setShowConfirm(prev => !prev)
              }}
              iconName={!showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'}
              placeholder="Password"
              onChange={handleChange}
              type={showConfirm ? 'text' : 'password'}
              name={'password'}
              value={values.password}
            />
            <div className="w-full flex items-center justify-end gap-2">
              <span
                className="w-fit text-right"
                onClick={() => {
                  router.push('/auth/forgot-password')
                }}
              >
                <TextComponent as="span" className="cursor-pointer text-right text-[13px] leading-[19px] font-[500] underline hover:text-blue-500">
                  Forgot Password?
                </TextComponent>
              </span>
            </div>
          </div>

          <CustomButton
            disabled={isLoading || googleAuthIsLoading}
            type="submit"
            className="mt-[24px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
          >
            {isLoading || googleAuthIsLoading ? <Spinner /> : 'Login'}
          </CustomButton>
        </Form>
        <div className="mt-[24px] flex items-center justify-center gap-3">
          <div className="text-[14px] font-medium">
            <span className="font-medium text-[#6B7280]">I don't have an account? </span>
            <Link
              href={
                redirect
                  ? {
                      pathname: '/auth/sign-up',
                      query: {redirect: redirect}
                    }
                  : '/auth/sign-up'
              }
              className="!border-none !p-0 text-sm text-[#000] underline"
            >
              Register
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
    </div>
  )
}

export default LoginComponent
