import {useAddToClipsMutation} from '@/services/clips'

const useAddToClipsQuery = () => {
  const [addToClip, {isLoading, error, isError}] = useAddToClipsMutation()

  const handleAddToClip = async (payload: string) => {
    try {
      await addToClip({body: payload}).unwrap()
    } catch (err: any) {
      console.log(err)
    }
  }
  return {isLoading, handleAddToClip, error, isError}
}

export default useAddToClipsQuery
