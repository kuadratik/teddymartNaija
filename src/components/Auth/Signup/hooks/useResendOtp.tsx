import {useResendOtpMutation} from '@/services/auth'

const useResendOtpQuery = () => {
  const [resendOtp, {isLoading}] = useResendOtpMutation()

  const handleResendOtp = async ({payload, setFieldError}: {payload: {email?: string}; setFieldError?: any}) => {
    try {
      await resendOtp(payload)
        .unwrap()
        .then(res => {})
    } catch (err: any) {}
  }
  return {isLoading, handleResendOtp}
}

export default useResendOtpQuery
