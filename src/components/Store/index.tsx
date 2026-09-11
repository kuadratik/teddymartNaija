import TextComponent from '@/components/SharedUI/TextComponent'
import {useGetSpecifiedStoreListingQuery} from '@/services/store'
import {Listing} from '@/types/store'
import {Image as AntImage} from 'antd'
import NextImage from 'next/image'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useSelector} from 'react-redux'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import DetailsCard from './components/DetailsCard'

const VendorStore = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()
  const {id} = router.query
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const {data, isLoading} = useGetSpecifiedStoreListingQuery({params: {listingType: type, store: id}})

  const storeInfo = data?.data

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div className="mt-[2px]">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center rounded-[26px] md:w-[70%]">
          <NextImage
            width={50}
            src={
              storeInfo?.banner_path
                ? `${process.env.imageBaseUrl}/${storeInfo?.banner_path}`
                : '/assets/default_banner.jpg'
            }
            alt="Banner image"
            className={`${isLoadingImage ? 'blur-sm' : ''} !h-[195px] rounded-[26px] !object-cover`}
            onLoadStart={() => {
              setIsLoadingImage(true)
            }}
            onError={error => {
              error.currentTarget.src = '/assets/default_banner.jpg'
              setIsLoadingImage(false)
            }}
            onLoad={() => {
              setIsLoadingImage(false)
            }}
            height={167}
            layout="responsive" // Makes the image responsive // Percentage of the parent width
            objectFit="cover"
            quality={100}
          />
        </div>

        <div className="border-5 relative flex h-[79px] w-[79px] -translate-y-10 items-center justify-center overflow-hidden rounded-[22px] border-[#FFFFFF] bg-[#fff]">
          <AntImage
            src={
              storeInfo?.profile_picture_path
                ? `${process.env.imageBaseUrl}/${storeInfo?.profile_picture_path}`
                : '/assets/profile_img.jpg'
            }
            alt="profile"
            className={`${isLoadingImage ? 'blur-sm' : ''} rounded-[22px] object-cover`}
            onLoadStart={() => {
              setIsLoadingImage(true)
            }}
            onError={error => {
              error.currentTarget.src = '/assets/profile_img.jpg'
              setIsLoadingImage(false)
            }}
            onLoad={() => {
              setIsLoadingImage(false)
            }}
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
