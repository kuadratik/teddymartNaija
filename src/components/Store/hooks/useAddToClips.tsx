import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAddToClipsMutation} from '@/services/clips'

const useAddToClipsQuery = () => {
  const [addToClip, {isLoading, error, isError}] = useAddToClipsMutation()

  const handleAddToClip = async (payload: string) => {
    try {
      await addToClip({body: payload})
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
