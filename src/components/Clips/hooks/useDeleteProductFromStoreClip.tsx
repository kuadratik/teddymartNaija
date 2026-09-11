import {useDeleteProductFromClipMutation} from '@/services/auth/clips'

const useDeleteProduct = (closeModal: VoidFunction) => {
  const [deleteProduct, {isLoading}] = useDeleteProductFromClipMutation()

  const handleDeleteProduct = async (product: string) => {
    console.log('product', product)
    try {
      await deleteProduct({product}).unwrap()
      closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleDeleteProduct}
}

export default useDeleteProduct
