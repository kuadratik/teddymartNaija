import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useResendOtpMutation} from '@/services/auth'
import {maskEmail} from '../utils'

const useResendOtpQuery = ({email}: {email?: string}) => {
  const [resendOtp, {isLoading}] = useResendOtpMutation()

  const handleResendOtp = async ({payload, setFieldError}: {payload: {email?: string}; setFieldError?: any}) => {
    try {
      await resendOtp(payload)
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>A code has been sent {maskEmail(email ?? '')}</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          setFieldError()
        })
    } catch (err: any) {}
  }
  return {isLoading, handleResendOtp}
}

export default useResendOtpQuery
