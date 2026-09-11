import {useVerifyPaymentMutation} from '@/services/payment'
import {useRouter} from 'next/router'

const useVerifyPayment = () => {
  const [verifyPayment, {isLoading, error, isSuccess}] = useVerifyPaymentMutation()
  const router = useRouter()

  const verifyPaymentHandler = async ({
    token,
    gateway,
    setPaymentSuccessCheckoutData,
    adsRefetch
  }: {
    token: any
    gateway: string
    setPaymentSuccessCheckoutData?: any
    adsRefetch?: any
  }) => {
    try {
      const response = await verifyPayment({
        token,
        gateway
      }).unwrap()
      console.log('🚀 ~ useVerifyPayment ~ response:', response)
      if (typeof setPaymentSuccessCheckoutData === 'function') {
        setPaymentSuccessCheckoutData(response.data)
      }

      if (typeof adsRefetch === 'function') {
        adsRefetch()
      }
    } catch (err: any) {
      console.error('Payment verification failed:', err)
    }
  }

  return {isLoading, verifyPaymentHandler, error, isSuccess}
}

export default useVerifyPayment
