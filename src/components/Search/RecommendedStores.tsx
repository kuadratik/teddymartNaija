import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetPopularNewQuery} from '@/services/general/general'
import {capitalizeFirstLetter} from '@/utils/fx'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import SkeletonLoaderForList from '../SharedUI/Loader/SkeletonLoaderForList'
import TextComponent from '../SharedUI/TextComponent'
import DetailsCard from '../Store/components/DetailsCard'
import { twMerge } from 'tailwind-merge'

interface IRecommendedStores {
  recommendedType?: 'category' | 'search'
  searchValue?: string
  recommendedClassName?: string
}

const RecommendedStores = ({recommendedType = 'search', searchValue, recommendedClassName}: IRecommendedStores) => {
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)
  const {selectedLanguage} = useAppSelector(state => state.country)

  const [clipUuid, setClipUuid] = useState<any>(null)

  const {data: recommendedData, isLoading} = useGetPopularNewQuery({
    listingType: type,
    currency: selectedLanguage.value
  })

  // console.log('recommendedData', recommendedData)


  // remove string from uuid

  // const {data: recommendedData, isLoading} = useGetRecommendedStoresQuery({
  //   uuid: clipUuid
  // })
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex h-[64px] w-full items-center justify-center bg-[#f6f6f6]">
        <TextComponent as="span" className="text-[12px] font-[500] leading-[16px] text-[#384860]">
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
      ) : recommendedData?.data?.length ? (
        <div className="flex flex-col gap-3">
          <TextComponent as="h3" className="text-[14px] leading-[22px] text-[#6b7280]">
            Recommended {capitalizeFirstLetter(type)}
          </TextComponent>

            <div
            className={twMerge(
              'flex w-full flex-col gap-3',
              recommendedData?.data?.length
              ? `md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3`
              : '',
              recommendedClassName
            )}
            >
            {recommendedData?.data?.map((item: any, index: number) => (
              <div key={item?.id || index}>
              {/* <StoreListItem item={item} /> */}
              <DetailsCard index={index} listing={item} />
              </div>
            ))}
            </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default RecommendedStores
