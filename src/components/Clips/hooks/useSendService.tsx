import {useDeleteProductFromClipMutation, useServiceOrderMutation} from '@/services/clips'

const useSendService = (closeModal: VoidFunction) => {
  const [sendService, {isLoading}] = useServiceOrderMutation()

  const handleSendService = async ({store_id, listing_id}: {store_id: any; listing_id: string | undefined}) => {
    try {
      await sendService({
        store_id,
        listing_id
      }).unwrap()
      closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleSendService}
}

export default useSendService
