import {useDeleteProductFromClipMutation} from '@/services/clips'

const useDeleteProduct = (closeModal: VoidFunction) => {
  const [deleteProduct, {isLoading}] = useDeleteProductFromClipMutation()

  const handleDeleteProduct = async ({product}: {product: string}) => {
    try {
      await deleteProduct({
        product
      }).unwrap()
      closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleDeleteProduct}
}

export default useDeleteProduct
