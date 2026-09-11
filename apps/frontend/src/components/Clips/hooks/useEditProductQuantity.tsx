import {useEditProductQuantityMutation} from '@/services/auth/clips'

const useEditProductQuantity = () => {
  const [editProduct, {isLoading: isEditProductLoading}] = useEditProductQuantityMutation()

  const handleEditProduct = async ({
    product,
    body
  }: {
    product: string
    body: {
      quantity?: number
      variant_id?: number
    }
  }) => {
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
