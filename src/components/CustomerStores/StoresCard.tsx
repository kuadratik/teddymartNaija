import {IStoreListingDatum} from '@/types/newstore'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import ImageComponent from '../SharedUI/Image/ImageComponent'

interface IProps {
  item: IStoreListingDatum
}
const StoresCard = ({item}: IProps) => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/store/${item.slug}`)}
      className="cursor-pointer rounded-[16px] border border-gray-100 bg-white p-2 shadow-f2 transition-all hover:opacity-80"
    >
      <div className="relative">
        <div className="md:h-[150px] h-[170px] w-full overflow-hidden rounded-[12px]">
          <ImageComponent
            isLoadingImage={false}
            setIsLoadingImage={() => {}}
            src={item.banner_path ? `${process.env.imageBaseUrl}/${item.banner_path}` : '/assets/default_banner.jpg'}
            alt="Store Image"
            objectFit="cover"
            width={300}
            height={139}
            className="h-[138px] w-full rounded-[12px] object-cover"
          />
        </div>
        <div className="absolute -bottom-7 left-1/2 h-[64px] w-[64px] -translate-x-1/2 rounded-full object-fill">
          <ImageComponent
            isLoadingImage={false}
            setIsLoadingImage={() => {}}
            src={
              item.profile_picture_path
                ? `${process.env.imageBaseUrl}/${item.profile_picture_path}`
                : 'https://dummyimage.com/600x400/ebe6eb/ffffff'
            }
            alt="Verified Badge"
            width={100}
            height={100}
            className="rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>
      <div className="text-center text-[#2A2A2A]">
        <h3 className="pt-10 text-base font-semibold">{item.name}</h3>
        <p className="mx-auto mt-2 w-[90%] text-sm">
          {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}
        </p>

        <div className="">
          <Link
            href={`/store/${item.slug}`}
            className="mb-2 mt-4 flex items-center justify-between rounded-[9px] bg-[#F9F9F9] px-4 py-1.5 text-sm font-medium transition-all hover:opacity-50"
          >
            <p className="text-left text-sm font-medium text-[#2A2A2A]">Go to storefront</p>
            <p className="flex h-[38px] w-[36px] items-center justify-center rounded-lg border border-[#FEFEFE] bg-white text-left text-sm font-medium text-[#FEFEFE]">
              <Icon icon="lets-icons:send-duotone" width="20" height="20" className="text-black" />
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StoresCard
