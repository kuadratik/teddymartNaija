import React from 'react'
import tw from 'tailwind-styled-components'
import ClipTable from './ClipTable'
import {useGetAllClipsQuery} from '@/services/clips'
import ClipSideView from './ClipSideView'
import {useAppSelector} from '@/hooks/reduxHooks'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'

const ClipView = () => {
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {data, isLoading, isFetching} = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div>
      <ClipWrapper className="">
        <div className="flex-[4]">
          <ClipTable cartList={data?.data?.products} isLoading={isLoading} isFetching={isFetching} />
        </div>
        <ClipWrapper className="">
          <div className="flex-shrink-0 rounded-xl bg-[#F0F1F5] p-6 md:w-[400px]">
            <ClipSideView data={data?.data} />
          </div>
        </ClipWrapper>
      </ClipWrapper>
    </div>
  )
}

export const ClipWrapper = tw.div`gap-6 md:flex`

export default ClipView
