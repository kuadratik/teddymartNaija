import {useVerifyPaymentMutation} from '@/services/payment'
import {useCallback} from 'react'

const useVerifyPayment = () => {
  const [verifyPayment, {isLoading, error, isSuccess}] = useVerifyPaymentMutation()
  const verifyPaymentHandler = useCallback(
    async ({
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
      console.log("🚀 ~ useVerifyPayment ~ token:", token)
      try {
        const response = await verifyPayment({
          token,
          gateway
        }).unwrap()
        console.log('🚀 ~ useVerifyPayment ~ response:', response.success)
        if (typeof setPaymentSuccessCheckoutData === 'function') {
          setPaymentSuccessCheckoutData(response.data)
        }

        if (typeof adsRefetch === 'function') {
          adsRefetch()
        }
      } catch (err: any) {
        console.error('Payment verification failed:', err)
      }
    },
    [verifyPayment]
  )

  return {isLoading, verifyPaymentHandler, error, isSuccess}
}

export default useVerifyPayment
