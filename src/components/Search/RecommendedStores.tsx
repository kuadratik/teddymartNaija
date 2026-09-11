import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import TextComponent from '../SharedUI/TextComponent'
import {Image} from 'antd'
import CustomButton from '../SharedUI/Buttons/Button'
import {useSelector} from 'react-redux'
import {useGetRecommendedStoresQuery} from '@/services/general/general'
import StoreListItem from './StoreListItem'
import SkeletonLoaderForList from '../SharedUI/Loader/SkeletonLoaderForList'

interface IRecommendedStores {
  recommendedType?: 'category' | 'search'
  searchValue?: string
}

const RecommendedStores = ({recommendedType = 'search', searchValue}: IRecommendedStores) => {
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = JSON.parse(localStorage.getItem('Clip-Uid') || 'null')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  // remove string from uuid

  const {data: recommendedData, isLoading} = useGetRecommendedStoresQuery({
    uuid: clipUuid
  })
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex h-[64px] w-full items-center justify-center bg-[#f6f6f6]">
        <TextComponent as="span" className="text-[12px] leading-[16px] text-[#384860]">
          {recommendedType === 'search' ? (
            searchValue ? (
              <span>
                No Result found for <b>{searchValue}</b>
              </span>
            ) : (
              'No Result found'
            )
          ) : (
            'There are no list of stores within this category'
          )}
        </TextComponent>
      </div>

      {isLoading ? (
        <SkeletonLoaderForList length={2} />
      ) : recommendedData?.data?.data?.length ? (
        <div className="flex flex-col gap-3">
          <TextComponent as="h3" className="text-[14px] leading-[22px] text-[#6b7280]">
            Recommended Stores
          </TextComponent>

          {recommendedData?.data?.data?.map((item: any, index: number) => (
            <div key={index}>
              <StoreListItem item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default RecommendedStores
