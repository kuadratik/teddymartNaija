import {useDeleteProductFromClipMutation} from '@/services/clips'

const useDeleteProduct = (closeModal: VoidFunction) => {
  const [deleteProduct, {isLoading}] = useDeleteProductFromClipMutation()

  const handleDeleteProduct = async ({product_id, clip_id}: {product_id: string; clip_id: string | undefined}) => {
    try {
      await deleteProduct({
        clip_id,
        product_id
      }).unwrap()
      closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleDeleteProduct}
}

export default useDeleteProduct
