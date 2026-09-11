import {useEditProductQuantityMutation} from '@/services/clips'

const useEditProductQuantity = () => {
  const [editProduct, {isLoading: isEditProductLoading}] = useEditProductQuantityMutation()

  const handleEditProduct = async ({product, body}: {product: string; body: any}) => {
    try {
      await editProduct({
        product,
        body
      }).unwrap()
      //   closeModal()
    } catch (err: any) {}
  }
  return {isEditProductLoading, handleEditProduct}
}

export default useEditProductQuantity
