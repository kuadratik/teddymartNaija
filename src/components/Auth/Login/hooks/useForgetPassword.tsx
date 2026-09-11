import {useForgetPasswordOtpMutation, useLoginMutation, useResetPasswordMutation} from '@/services/auth'
import {ForgetPasswordType, ResetPasswordType, VendorLoginType} from '../utils'
import {useDispatch} from 'react-redux'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useLocalStorage} from 'react-use'
import {useRouter} from 'next/router'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useState} from 'react'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'

const useForgetPasswordQuery = () => {
  const [forgetPasswordOtp, {isLoading, isError, error}] = useForgetPasswordOtpMutation()
  const [resetPasswordOtp, {isLoading: resetPassLoading}] = useResetPasswordMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const {redirect} = router.query

  const [showNextStep, setShowNextStep] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const handleEmailSending = async ({payload, setFieldError}: {payload: ForgetPasswordType; setFieldError?: any}) => {
    try {
      const response = await forgetPasswordOtp(payload)
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Email sent successfully!</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          setShowNextStep(true)
          setShowOtp(true)
        })
        .catch((error: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>An Error occurred!</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'Please try again'
          })
        })

      // Optionally, update local storage
    } catch (err: any) {
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The provided credentials are invalid.')) {
        setFieldError('password', 'Password is invalid')
      }
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The selected email is invalid.')) {
        setFieldError('email', 'Email is invalid')
      }
    }
  }

  const handlePasswordReset = async ({payload, setFieldError}: {payload: ResetPasswordType; setFieldError?: any}) => {
    try {
      const response = await resetPasswordOtp(payload)
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Password changed successfully!</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          router.push('/auth/login')
        })
        .catch((error: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{error.data.message}!</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: `${error.data.message}`
          })

          setShowChangePassword(false)
          setShowOtp(true)
        })

      // Optionally, update local storage
    } catch (err: any) {
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The provided credentials are invalid.')) {
        setFieldError('password', 'Password is invalid')
      }
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The selected email is invalid.')) {
        setFieldError('email', 'Email is invalid')
      }

      setShowChangePassword(false)
      setShowOtp(true)
      // showPlannerToast({
      //   options: {
      //     customToast: (
      //       <CustomToast
      //         altText={''}
      //         title={<>An Error occurred!</>}
      //         textColor="#FFF"
      //         message={''}
      //         backgroundColor="#000"
      //       />
      //     )
      //   },
      //   message: 'Please try again'
      // })
    }
  }
  return {
    isLoading,
    handleEmailSending,
    error,
    isError,
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
  }
}

export default useForgetPasswordQuery
