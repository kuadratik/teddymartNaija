import {useSendToVendorMutation} from '@/services/auth/clips'

const useSendToVendor = (modal?: VoidFunction) => {
  const [sendToVendor, {isLoading}] = useSendToVendorMutation()

  const handleSendToVendor = async ({order_id}: {order_id?: string}) => {
    try {
      await sendToVendor({
        order_id
      }).unwrap()
      modal && modal()
    } catch (err: any) {}
  }
  return {isLoading, handleSendToVendor}
}

export default useSendToVendor
