import {useDeleteProductFromClipMutation} from '@/services/auth/clips'

const useDeleteProduct = (closeModal: VoidFunction) => {
  const [deleteProduct, {isLoading}] = useDeleteProductFromClipMutation()

  const handleDeleteProduct = async (product: string, variant_id: number | undefined) => {
    console.log('product', product)
    try {
      await deleteProduct({product, variant_id}).unwrap()
      closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleDeleteProduct}
}

export default useDeleteProduct
