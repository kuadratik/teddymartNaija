// import CustomToast from '@/components/SharedUI/Toast/CustomToast'
// import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
// import {useCreateStartConversationMutation} from '@/services/messaging'
import {useVerifyPaymentMutation} from '@/services/payment'
import {useRouter} from 'next/router'

const useVerifyPayment = () => {
  const [verifyPayment, {isLoading, error}] = useVerifyPaymentMutation()
  const router = useRouter()
  const verifyPaymentHandler = async ({token, gateway}: {token: any; gateway: string}) => {
    try {
      await verifyPayment({
        token,
        gateway
      }).unwrap()
      //   showPlannerToast({
      //     options: {
      //       customToast: (
      //         <CustomToast
      //           altText={''}
      //           title={'Payment Successful!'}
      //           textColor="#FFF"
      //           message="Payment Successful"
      //           backgroundColor="#000"
      //         />
      //       )
      //     },
      //     message: 'message'
      //   })
    } catch (err: any) {
      //   showPlannerToast({
      //     options: {
      //       customToast: (
      //         <CustomToast
      //           altText=""
      //           title={<>Error starting a conversation</>}
      //           textColor="#FFF"
      //           message=""
      //           backgroundColor="#000"
      //         />
      //       )
      //     },
      //     message: 'message'
      //   })
    }
  }
  return {isLoading, verifyPaymentHandler, error}
}

export default useVerifyPayment
