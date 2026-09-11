import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import TextComponent from '../SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Button} from 'antd'
import CustomButton from '../SharedUI/Buttons/Button'
import {useRouter} from 'next/router'
import {useGetSpecifiedStoreListingQuery, useGetStoreProductListingQuery} from '@/services/store'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import {useSelector} from 'react-redux'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {Uuid} from '@/utils/fx'
import {useLocalStorage} from 'react-use'
import useAddToClipsQuery from './hooks/useAddToClips'
import Spinner from '../SharedUI/Spinner'

const ProductInfo = () => {
  const [params, setParams] = useState<URLSearchParams | null>(null)
  const router = useRouter()

  const {id} = router.query

  useEffect(() => {
    // This code only runs on the client-side
    const searchParams = new URLSearchParams(window.location.search)
    setParams(searchParams)
  }, [])

  const product = params?.get('slug')

  const {data, isLoading, isFetching} = useGetStoreProductListingQuery({params: {listing: product, store: id}})

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const {type} = useSelector((state: any) => state.vendor)

  const {isLoading: addToClipIsLoading, handleAddToClip} = useAddToClipsQuery()

  const {
    data: storeInfo,
    isLoading: storeInfoIsLoading,
    isFetching: storeInfoIsFetching
  } = useGetSpecifiedStoreListingQuery({params: {listingType: type, store: id}})

  if (isLoading || storeInfoIsLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  const productInfo = data?.data

  console.log(productInfo)

  return (
    <div className="flex flex-col gap-6">
      <Image
        src={`${process.env.imageBaseUrl}/${productInfo?.images[0]}`}
        alt="Banner-image"
        layout="responsive" // Makes the image responsive
        width={100} // Percentage of the parent width
        height={195}
      />
      <div className="px-[20px] lg:px-20">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="items-center justify-center rounded-full border-[0.5px] border-[#E4E4E4] bg-white shadow-f2">
              <Image
                src={`${process.env.imageBaseUrl}/${storeInfo?.data?.profile_picture_path}`}
                width={47}
                height={45}
                alt="profile"
                className="object-contain"
                quality={100}
                style={{
                  borderRadius: '20px' // Set the border radius
                }}
              />
            </div>
            <div className="flex flex-col">
              <TextComponent as="h1" className="text-[14px] font-semibold text-[#1F1F1F]">
                {storeInfo?.data?.name}
              </TextComponent>
              {/* <div className="flex items-center gap-1">
                <TextComponent as="h1" className="text-[14px] font-normal text-[#1F1F1F]">
                  Official Store{' '}
                </TextComponent>
                <Icon icon="bitcoin-icons:verify-filled" className="text-[22px] text-[#1546A0]" />{' '}
              </div> */}
            </div>
          </div>
          {/* <Button className="!border-none">
            {' '}
            <Icon icon="weui:arrow-filled" className="text-2xl" />{' '}
          </Button> */}
        </div>
        {productInfo?.type === 'product' ? (
          <div>
            {' '}
            <TextComponent as="h1" className="mt-4 text-[24px] font-bold leading-[32px] text-[#1F1F1F]">
              {productInfo?.name}{' '}
            </TextComponent>
            <TextComponent as="h1" className="mt-1 text-[24px] font-bold text-[#1C1C1C]">
              <FormatNumberCurrency value={+productInfo?.price} />{' '}
            </TextComponent>
            <TextComponent as="h1" className="mt-2 text-[20px] font-bold text-[#1C1C1C]">
              Product Description{' '}
            </TextComponent>
            <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[22px] text-[#1F1F1F]">
              {productInfo?.description}
            </TextComponent>
            <TextComponent as="p" className="mt-3 text-[14px] font-normal leading-[22px] text-[#1F1F1F]">
              {productInfo?.additional_information}
            </TextComponent>
          </div>
        ) : (
          <div>
            {' '}
            <TextComponent as="h1" className="mt-2 text-[20px] font-bold text-[#1C1C1C]">
              Service Description{' '}
            </TextComponent>
            <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[22px] text-[#1F1F1F]">
              {productInfo?.description}
            </TextComponent>
          </div>
        )}

        <CustomButton
          disabled={!productInfo?.is_available}
          type="submit"
          onClick={() => {
            handleAddToClip(productInfo?.slug)
          }}
          className={` ${true ? 'bg-[#000000]' : 'bg-[#B9B9B9]'} mt-[50px] w-full rounded-[10px] px-1 py-4 text-[14px] text-white`}
        >
          {productInfo?.type === 'service' ? 'Send a message' : addToClipIsLoading ? <Spinner /> : 'Clip Item'}
        </CustomButton>
      </div>
    </div>
  )
}

export default ProductInfo
