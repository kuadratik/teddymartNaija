import React from 'react'
import Image from 'next/image'
import TextComponent from '@/components/SharedUI/TextComponent'
import DetailsCard from './components/DetailsCard'
import {useGetSpecifiedStoreListingQuery} from '@/services/store'
import {useDispatch, useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import {Listing} from '@/types/store'
import SkeletonLoaderForList from '../SharedUI/Loader/SkeletonLoaderForList'
import PageLoader from '../SharedUI/Loader/PageLoader'
import SkeletonLoader from '../SharedUI/Loader/SkeletonLoader'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'

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
        <div className="w-full">
          {' '}
          <Image
            src={`${process.env.imageBaseUrl}/${storeInfo?.banner_path}`}
            alt="Banner image"
            layout="responsive" // Makes the image responsive
            width={100} // Percentage of the parent width
            height={195}
            style={{
              borderRadius: '26px' // Set the border radius
            }}
          />
        </div>
        <div className="relative flex h-[35px] w-[79px] -translate-y-10 items-center justify-center rounded-[22px] border-[0.47px] border-[#EAECEF] bg-white shadow-f2">
          <Image
            src={`${process.env.imageBaseUrl}/${storeInfo?.profile_picture_path}`}
            width={79}
            height={79}
            alt="profile"
            className="object-contain"
            quality={100}
            style={{
              borderRadius: '22px' // Set the border radius
            }}
          />
        </div>
        <div>
          <TextComponent as="h1" className="text-center text-[24px] font-bold leading-[32px] text-[#1D1D1D]">
            {storeInfo?.name}{' '}
          </TextComponent>
          {/* <TextComponent as="p" className="text-center text-[14px] font-normal text-[#9796A1]">
            {storeInfo?.description}{' '}
          </TextComponent> */}
        </div>
      </div>
      <div className="mt-[29px] flex flex-col gap-8">
        {storeInfo?.listings.map((listing: Listing, id: number) => {
          return (
            <div key={id}>
              <DetailsCard listing={listing} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VendorStore
