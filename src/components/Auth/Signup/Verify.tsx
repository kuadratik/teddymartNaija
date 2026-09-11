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

const VerifyVendorComponent = () => {
  const {isLoading, handleVerifyUser} = useVerifyQuery()
  const {isLoading: resendOtpIsLoading, handleResendOtp} = useResendOtpQuery()

  const [signUpUserCred, setSignUpUserCred] = useLocalStorage<SignUpRequestModel | null>('signUpUser', null)

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
    <div className="flex flex-col">
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
            <p className="flex flex-col gap-1 text-xs text-red-600">{errMessage ?? ''}</p>
          </div>
          <div className="mt-[46px]">
            <CustomButton
              className="w-full bg-white text-[14px] font-bold text-[#141414]"
              onClick={() => handleResendOtp({payload: {email: signUpUserCred?.email}})}
            >
              {'Resend Code'}
            </CustomButton>
          </div>
        </div>
        <CustomButton
          type="submit"
          className="mt-[270px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading || resendOtpIsLoading ? <Spinner /> : 'Continue'}
        </CustomButton>
      </Form>
    </div>
  )
}

export default VerifyVendorComponent
