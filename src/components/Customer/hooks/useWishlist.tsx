import {useChangePasswordMutation} from '@/services/Profile'
import {useRouter} from 'next/router'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {
  useGetAllWishlistsQuery,
  useAddToWishlistMutation,
  useDeleteWishlistClipMutation,
  useAddToClipsWishlistMutation
} from '@/services/clips'

const useWishlist = () => {
  const router = useRouter()

  const {data: wishListData, isLoading: isWishListLoading} = useGetAllWishlistsQuery({})
  const [addToWishlist, {isLoading: addToWishListLoading}] = useAddToWishlistMutation()
  const [deleteWishlistClip, {isLoading: deleteWishlistClipLoading}] = useDeleteWishlistClipMutation()
  const [addToClipsWishlist, {isLoading: addToClipsWishlistLoading}] = useAddToClipsWishlistMutation()

  const handleAddToWishList = async (payload: string) => {
    try {
      await addToWishlist({product: payload})
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

  const handleDeleteWishlistClip = async (payload: string) => {
    try {
      await deleteWishlistClip({product: payload})
        .unwrap()
        .then(() => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={'Item removed from wishlist!'}
                  textColor="#FFF"
                  message="You have successfully removed this item from your wishlist."
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

  const handleAddToClipsFromWishlist = async (payload: string) => {
    try {
      await addToClipsWishlist({product: payload})
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

  return {
    wishListData,
    isWishListLoading,
    handleAddToWishList,
    addToWishListLoading,
    handleDeleteWishlistClip,
    deleteWishlistClipLoading,
    handleAddToClipsFromWishlist,
    addToClipsWishlistLoading
  }
}

export default useWishlist
