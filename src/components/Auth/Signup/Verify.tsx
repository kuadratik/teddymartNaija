import CustomButton from '@/components/SharedUI/Buttons/Button'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Form, Input} from 'antd'
import {OTPProps} from 'antd/es/input/OTP'
import {Field, useFormik} from 'formik'
import {useRouter} from 'next/router'
import React from 'react'
import {otpValidationSchema} from './utils/schema'
import useSignUpQuery from './hooks/useSignUp'
import useVerifyQuery from './hooks/useVerify'
import Spinner from '@/components/SharedUI/Spinner'
import {useLocalStorage} from 'react-use'
import {SignUpRequestModel} from '@/types/types'
import {useResendOtpMutation} from '@/services/auth'
import useResendOtpQuery from './hooks/useResendOtp'
import {maskEmail} from './utils'
import {CountdownTimer} from '@/hooks/useCounterHook'

const VerifyVendorComponent = () => {
  const {minutes, seconds, timerFinished, handleResendClick} = CountdownTimer({initialMinutes: 5})
  const {isLoading, handleVerifyUser} = useVerifyQuery()
  const [signUpUserCred, setSignUpUserCred] = useLocalStorage<SignUpRequestModel | null>('signUpUser', null)

  const {isLoading: resendOtpIsLoading, handleResendOtp} = useResendOtpQuery({email: signUpUserCred?.email})

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<{
    code: string
  }>({
    initialValues: {
      code: ''
    },
    validationSchema: otpValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      handleVerifyUser({payload: {...signUpUserCred, code: val.code}, setFieldError: setFieldError})
    }
  })

  const errMessage = errors.code ? errors.code : ''

  return (
    <div className="mx-auto max-w-[900px]">
      {' '}
      <div className="flex flex-col md:items-center">
        <Form onFinish={handleSubmit}>
          <div>
            {' '}
            <div className="flex items-center justify-center">
              <LogoHeader />
            </div>
            <div className="mt-[29px] flex flex-col gap-2">
              <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
                Verify it’s you{' '}
              </TextComponent>
              <p className="text-[14px] font-normal text-[#6B7280]">
                We sent a code to (
                <span className="font-medium text-[#000]"> {maskEmail(signUpUserCred?.email ?? '')} </span>). Enter it
                here to verify your identity.
              </p>
            </div>
            <div className="mt-[29px]">
              <Form.Item>
                {' '}
                <Input.OTP
                  disabled={isLoading}
                  value={values.code}
                  length={5}
                  formatter={str => str.toUpperCase()}
                  onChange={value => {
                    setFieldValue('code', value)

                    // Automatically submit the form when the OTP reaches the desired length
                    if (value.length === 5) {
                      setTimeout(() => {
                        handleSubmit()
                      }, 0)
                    }
                  }}
                />
              </Form.Item>
              <p className="flex flex-col gap-1 text-xs text-red-600">{errMessage ?? ''}</p>
              {!timerFinished && (
                <p className="text-center font-normal leading-[20px] text-[#1F1F1F]">
                  {` This OTP will expire in  ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}  minutes.`}
                </p>
              )}
            </div>
            {timerFinished && (
              <div className="mt-[30px]">
                <CustomButton
                  className="w-full bg-white text-[14px] font-bold text-[#141414]"
                  onClick={() => {
                    setFieldValue('code', '')
                    handleResendOtp({payload: {email: signUpUserCred?.email}, setFieldError: handleResendClick()})
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
          >
            {isLoading || resendOtpIsLoading ? <Spinner /> : 'Continue'}
          </CustomButton>
        </Form>
      </div>
    </div>
  )
}

export default VerifyVendorComponent
