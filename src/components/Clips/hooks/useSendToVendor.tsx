import {useSendToVendorMutation} from '@/services/clips'

const useSendToVendor = (closeModal?: VoidFunction) => {
  const [sendToVendor, {isLoading}] = useSendToVendorMutation()

  const handleOrderClip = async ({order_id}: {order_id: string}) => {
    try {
      await sendToVendor({
        order_id
      }).unwrap()
      closeModal && closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleOrderClip}
}

export default useSendToVendor
