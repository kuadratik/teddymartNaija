import {useAdsGalleryMutation} from '@/services/Adsgallery'
import {GetAdsGalleryQuery} from '@/types/adsgallery'

const useAdsGallerylist = (closeModal?: VoidFunction) => {
  const [adsGalleryList, {isLoading, data, isError}] = useAdsGalleryMutation()

  const handleAllAdsGallery = async ({
    params,
    body,
    currency
  }: {
    params: GetAdsGalleryQuery
    body: any
    currency: any
  }) => {
    try {
      await adsGalleryList({
        body,
        params,
        currency
      }).unwrap()
      closeModal && closeModal()
    } catch (err: any) {}
  }
  return {isLoading, handleAllAdsGallery, data, isError}
}

export default useAdsGallerylist
