import {useDeleteClipMutation} from '@/services/auth/clips'

const useDeleteClip = (closeModal: VoidFunction) => {
  const [deleteClip, {isLoading}] = useDeleteClipMutation()

  const handleDeleteClip = async ({clip_id}: {clip_id: string | undefined}) => {
    try {
      await deleteClip({
        clip_id
      }).unwrap()
      closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleDeleteClip}
}

export default useDeleteClip
