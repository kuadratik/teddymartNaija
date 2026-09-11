import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAddToClipsMutation} from '@/services/auth/clips'

const useAddToClipsQuery = () => {
  const [addToClip, {isLoading, error, isError}] = useAddToClipsMutation()

  const handleAddToClip = async (
    productSlug: string,
    body: {
      quantity?: number
      variant_id?: number
    }
  ) => {
    try {
      const clipBody = {
        ...body,
        quantity: body.quantity ?? 1 // Provide a default value for quantity
      }

      if (body.variant_id !== undefined) {
        clipBody.variant_id = body.variant_id
      }

      await addToClip({
        productSlug: productSlug,
        body: clipBody
      })
        .unwrap()
        .then(() => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Product Clipped Successfully!</>}
                  textColor="#FFF"
                  message={''}
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
  return {isLoading, handleAddToClip, error, isError}
}

export default useAddToClipsQuery
