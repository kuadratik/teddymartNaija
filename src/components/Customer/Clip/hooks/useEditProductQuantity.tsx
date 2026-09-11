import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useEditProductQuantityMutation} from '@/services/clips'

const useEditProductQuantity = () => {
  const [editProduct, {isLoading: isEditProductLoading}] = useEditProductQuantityMutation()

  const handleEditProduct = async ({
    product,
    body,
    editType
  }: {
    product: string
    body: any
    editType?: 'add' | 'remove'
  }) => {
    try {
      await editProduct({
        product,
        body
      })
        .unwrap()
        .then(() => {
          if (editType === 'add') {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>Product added successfully</>}
                    textColor="#FFF"
                    message={''}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'message'
            })
          } else {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>Item quantity has been updated</>}
                    textColor="#FFF"
                    message={''}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'message'
            })
          }
        })
    } catch (err: any) {}
  }
  return {isEditProductLoading, handleEditProduct}
}

export default useEditProductQuantity
