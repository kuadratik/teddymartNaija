import React from 'react'
import TextComponent from '@/components/SharedUI/TextComponent'
import DetailsCard from './components/DetailsCard'
import {useGetSpecifiedStoreListingQuery} from '@/services/store'
import {useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import {Listing} from '@/types/store'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import {Image} from 'antd'

const VendorStore = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()
  const {id} = router.query

  const {data, isLoading} = useGetSpecifiedStoreListingQuery({params: {listingType: type, store: id}})

  const storeInfo = data?.data

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div className="mt-[2px]">
      <div className="relative flex flex-col items-center justify-center">
        <div className="h-[167px] min-w-[355px] overflow-hidden rounded-[26px]">
          <Image
            src={`${process.env.imageBaseUrl}/${storeInfo?.banner_path}`}
            alt="Banner image"
            className="rounded-[26px] object-cover"
            width={355}
            height={167}
            preview={false}
          />
        </div>

        <div className="border-5 relative flex h-[79px] w-[79px] -translate-y-10 items-center justify-center overflow-hidden rounded-[22px] border-[#FFFFFF] bg-[#fff]">
          <Image
            src={`${process.env.imageBaseUrl}/${storeInfo?.profile_picture_path}`}
            alt="profile"
            className="rounded-[22px] object-cover"
            width={65}
            height={65}
            preview={false}
          />
        </div>

        <div className="-mt-[20px]">
          <TextComponent as="h1" className="text-center text-[24px] font-bold leading-[32px] text-[#1D1D1D]">
            {storeInfo?.name}{' '}
          </TextComponent>
          {/* <TextComponent as="p" className="text-center text-[14px] font-normal text-[#9796A1]">
            {storeInfo?.description}{' '}
          </TextComponent> */}
        </div>
      </div>
      <div className="mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-6">
        {storeInfo?.listings.map((listing: Listing, id: number) => {
          return (
            <div key={id}>
              <DetailsCard listing={listing} store_name={storeInfo?.name} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VendorStore
