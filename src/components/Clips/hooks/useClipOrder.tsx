import {useClipOrderMutation, useDeleteProductFromClipMutation} from '@/services/clips'

const useClipOrder = (closeModal?: VoidFunction) => {
  const [clipOrder, {isLoading}] = useClipOrderMutation()

  const handleOrderClip = async ({clip_id, body}: {clip_id: string; body: any}) => {
    try {
      await clipOrder({
        clip_id,
        body
      }).unwrap()
      closeModal && closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleOrderClip}
}

export default useClipOrder
