import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAddToClipsMutation, useAddToWishlistCartMutation} from '@/services/clips'

const useAddToWishlistQuery = () => {
  const [addToWishlistCart, {isLoading, error, isError}] = useAddToWishlistCartMutation()

  const handleAddToWishListCart = async (payload: string) => {
    try {
      await addToWishlistCart({product: payload})
        .unwrap()
        .then(() => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={'Item added to wishlist!'}
                  textColor="#FFF"
                  message="You have successfully added this item to your wishlist."
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
        .catch((err: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{err?.data?.message || 'Error clipping item to cart!'}</>}
                  textColor="#FFF"
                  message={err?.data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
    } catch (err: any) {
      console.log(err)
    }
  }
  return {isLoading, handleAddToWishListCart, error, isError}
}

export default useAddToWishlistQuery
