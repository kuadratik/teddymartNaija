import CustomButton from '@/components/SharedUI/Buttons/Button'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {CountdownTimer} from '@/hooks/useCounterHook'
import {SignUpRequestModel} from '@/types/types'
import {Form, Input} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {useLocalStorage} from 'react-use'
import useResendOtpQuery from './hooks/useResendOtp'
import useVerifyQuery from './hooks/useVerify'
import {maskEmail} from './utils'
import {otpValidationSchema} from './utils/schema'

const VerifyVendorComponent = () => {
  const {minutes, seconds, timerFinished, handleResendClick} = CountdownTimer({initialMinutes: 5})
  const {isLoading, handleVerifyUser} = useVerifyQuery()
  const [signUpUserCred, setSignUpUserCred] = useLocalStorage<SignUpRequestModel | null>('signUpUser', null)
  const router = useRouter()
  const {isLoading: resendOtpIsLoading, handleResendOtp} = useResendOtpQuery({email: signUpUserCred?.email})

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<{
    code: string
    refferalType: string
    refferalCode: string
  }>({
    initialValues: {
      code: '',
      refferalType: '',
      refferalCode: ''
    },
    validationSchema: otpValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      handleVerifyUser({
        payload: {
          ...signUpUserCred,
          code: val.code,
          refferalType: val.refferalType || (router?.query?.referralType as string) || 'customer', // Changed from refferalType
          refferalCode: val.refferalCode || (router?.query?.referral_code as string) // Changed from refferalCode
        },
        setFieldError: setFieldError
      })
    }
  })
  useEffect(() => {
    // Get query parameters
    const referralCode = router.query.referral_code as string
    const referralType = (router.query.referralType as string) || 'customer'

    // Check if query parameters exist and set form values
    if (referralCode) {
      setFieldValue('refferalCode', referralCode)
    }

    if (referralType) {
      setFieldValue('refferalType', referralType)
    }
  }, [router.query, setFieldValue])

  const errMessage = errors.code ? errors.code : ''

  return (
    <div className="mx-auto max-w-[900px]">
      {' '}
      <div className="flex flex-col md:items-center">
        <Form onFinish={handleSubmit}>
          <div>
            {' '}
            {/* <div className="flex items-center justify-center">
              <LogoHeader />
            </div> */}
            <div className="mt-[29px] flex flex-col gap-2">
              <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414] lg:text-center">
                Verify it’s you{' '}
              </TextComponent>
              <p className="text-[14px] font-normal text-[#6B7280] lg:text-center">
                We sent a code to (
                <span className="font-medium text-[#000]"> {maskEmail(signUpUserCred?.email ?? '')} </span>). Enter it
                here to verify your identity.
              </p>
            </div>
            {signUpUserCred?.email && (
              <>
                {' '}
                <div className="mt-[29px] flex flex-col">
                  <Form.Item className="mx-auto">
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
                  <p className="flex flex-col gap-1 text-center relative -translate-y-2 text-xs text-red-600">{errMessage ?? ''}</p>
                  {!timerFinished && (
                    <p className="text-center font-normal leading-[20px] text-[#1F1F1F]">
                      {` This OTP will expire in  ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}  minutes.`}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <CustomButton
            type="submit"
            className="mt-[46px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
          >
            {isLoading || resendOtpIsLoading ? <Spinner /> : 'Continue'}
          </CustomButton>
          {signUpUserCred?.email && (
            <>
              {timerFinished && (
                <div className="mt-[20px]">
                  <CustomButton
                    className="w-full bg-transparent text-[16px] font-bold text-black"
                    onClick={() => {
                      setFieldValue('code', '')
                      handleResendOtp({payload: {email: signUpUserCred?.email}, setFieldError: handleResendClick()})
                    }}
                  >
                    {'Resend Code'}
                  </CustomButton>
                </div>
              )}
            </>
          )}
        </Form>
      </div>
    </div>
  )
}

export default VerifyVendorComponent
