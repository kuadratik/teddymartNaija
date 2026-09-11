import {useGetAdvertWishlistQuery} from '@/services/advertisement'
import Image from 'next/image'
import {useState} from 'react'
import InputSearch from '../SharedUI/Input/InputSearch'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '../SharedUI/TextComponent'
import AdsSingleComponent from './Advert/AdsSingleComponent'

const SavedClassifiedAds = () => {
  const [search, setSearch] = useState('')
  const {isLoading, data, refetch} = useGetAdvertWishlistQuery({
    currency: '',
    search: search
  })
  console.log('🚀 ~ SavedClassifiedAds ~ data:', data)
  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }
  return (
    <div className="mt-[20px]">
      <InputSearch debounceTimer={0.5} search={search} setSearch={setSearch} placeholder="Search" className="" />
      {data?.data?.length! > 0 ? (
        <div className="mt-[20px]">
          <AdsSingleComponent
            refetch={refetch}
            isHideDeleteSaveAds={true}
            className="grid gap-4 md:gap-5 lg:grid-cols-2"
            data={data?.data}
          />
        </div>
      ) : (
        <>
          {' '}
          <div className="flex w-full flex-col items-center justify-center gap-4 p-10">
            <Image src="/assets/new-empty-state.svg" alt="empty" width={157} height={157} />
            <TextComponent as="p" className="text-[14px] leading-[18px] text-[#6B7280]">
              Nothing to see here
            </TextComponent>
          </div>
        </>
      )}
    </div>
  )
}

export default SavedClassifiedAds
