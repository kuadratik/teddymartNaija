import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useDeleteProductFromClipMutation} from '@/services/clips'

const useDeleteProduct = (closeModal: VoidFunction) => {
  const [deleteProduct, {isLoading}] = useDeleteProductFromClipMutation()

  const handleDeleteProduct = async ({product}: {product: string}) => {
    try {
      await deleteProduct({
        product
      })
        .unwrap()
        .then(() => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Product was removed from clip</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
      closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleDeleteProduct}
}

export default useDeleteProduct
