import LoginComponent from '@/components/Auth/Login'
import useForgetPasswordQuery from '@/components/Auth/Login/hooks/useForgetPassword'
import {maskEmail} from '@/components/Auth/Signup/utils'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import SEOHead from '@/components/SharedUI/SEOHead'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {CountdownTimer} from '@/hooks/useCounterHook'
import {Form, Input} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React from 'react'

const ForgotPassword = () => {
  const router = useRouter()
  const {minutes, seconds, timerFinished, handleResendClick} = CountdownTimer({initialMinutes: 5})
  const {
    isLoading,
    handleEmailSending,
    showOtp,
    setShowOtp,
    showNextStep,
    setShowNextStep,
    showChangePassword,
    setShowChangePassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmNewPassword,
    setShowConfirmNewPassword,
    handlePasswordReset,
    resetPassLoading
  } = useForgetPasswordQuery()
  const {values, handleChange, handleSubmit, errors, setFieldValue} = useFormik({
    initialValues: {
      email: '',
      otp: '',
      new_password_confirmation: '',
      new_password: ''
    },
    onSubmit: values => {
      if (showNextStep && showOtp && !showChangePassword) {
        setTimeout(() => {
          setShowChangePassword(true)
          setShowOtp(false)
        }, 2000)
      } else if (showChangePassword) {
        handlePasswordReset({payload: values})
      } else {
        handleEmailSending({payload: {email: values.email}})
      }
    }
  })

  const errMessage = errors.otp ? errors.otp : ''

  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | Forgot Password`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="md:my-8">
          {' '}
          <div className="mx-auto max-w-[900px]">
            <div className="flex flex-col">
              <div className="flex items-center justify-center">
                <LogoHeader
                  onClick={() => {
                    router.back()
                  }}
                />
              </div>
              <div className="my-[34px] flex flex-col items-center justify-center gap-2">
                <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
                  {showNextStep
                    ? showOtp
                      ? 'Reset Code Sent'
                      : showChangePassword
                        ? 'Change Password'
                        : 'Forgot Password'
                    : 'Forgot Password'}
                </TextComponent>
                {showOtp && (
                  <p className="text-[14px] font-normal text-[#6B7280]">
                    We sent a code to (
                    <span className="font-medium text-[#000]"> {maskEmail(values?.email ?? '')} </span>). Enter it here
                    to verify your identity.
                  </p>
                )}
              </div>
              {showNextStep ? (
                <Form onFinish={handleSubmit}>
                  <div>
                    <div className="mt-[29px] flex flex-col items-center justify-center gap-2">
                      {showOtp && (
                        <Form.Item>
                          {' '}
                          <Input.OTP
                            disabled={isLoading}
                            value={values.otp}
                            length={5}
                            formatter={str => str.toUpperCase()}
                            onChange={value => {
                              setFieldValue('otp', value)

                              // Automatically submit the form when the OTP reaches the desired length
                              if (value.length === 5) {
                                setTimeout(() => {
                                  handleSubmit()
                                }, 0)
                              }
                            }}
                          />
                        </Form.Item>
                      )}

                      {showChangePassword && (
                        <div className="flex w-full flex-col items-center gap-4">
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
                      )}
                      {showOtp && <p className="flex flex-col gap-1 text-xs text-red-600">{errMessage ?? ''}</p>}
                      {showOtp && !timerFinished && (
                        <p className="text-center font-normal leading-[20px] text-[#1F1F1F]">
                          {` This OTP will expire in  ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}  minutes.`}
                        </p>
                      )}
                    </div>
                    {showOtp && timerFinished && (
                      <div className="mt-[30px]">
                        <CustomButton
                          className="w-full bg-white text-[14px] font-bold text-[#141414]"
                          onClick={() => {
                            setFieldValue('otp', '')
                            handleEmailSending({payload: {email: values.email}})

                            // handleResendOtp({
                            //   payload: {email: values?.email},
                            //   setFieldError: handleResendClick()
                            // })
                          }}
                        >
                          {'Resend Code'}
                        </CustomButton>
                      </div>
                    )}
                  </div>
                  <CustomButton
                    type="submit"
                    className="mt-[100px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
                    disabled={
                      showOtp
                        ? values.otp.length !== 5
                        : values.new_password.length === 0 || values.new_password_confirmation.length === 0
                    }
                  >
                    {resetPassLoading || isLoading ? (
                      <Spinner />
                    ) : showOtp ? (
                      'Continue'
                    ) : showChangePassword ? (
                      'Save'
                    ) : (
                      'Continue'
                    )}
                  </CustomButton>
                </Form>
              ) : (
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
                  </div>

                  <CustomButton
                    disabled={isLoading}
                    type="submit"
                    className="mt-[24px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
                  >
                    {isLoading ? <Spinner /> : 'Send Reset Code'}
                  </CustomButton>
                </Form>
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default ForgotPassword
