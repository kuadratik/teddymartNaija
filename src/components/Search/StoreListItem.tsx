import {Image} from 'antd'
import React from 'react'
import TextComponent from '../SharedUI/TextComponent'
import CustomButton from '../SharedUI/Buttons/Button'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import Link from 'next/link'

const StoreListItem = ({item}: any) => {
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)

  return (
    <Link href={`/store/${item.slug}`} className="flex w-full items-center border-b border-[#E4E4E4] py-2">
      {/* <div className="flex h-[125px] min-w-[40%] overflow-hidden rounded-[22px]">
        <Image src={`${process.env.imageBaseUrl}/${item.banner_path}`} alt="image" preview={false} className="w-full" />
      </div> */}

      <div className="h-[121px] min-w-[130px] overflow-hidden rounded-[22px]">
        <Image
          src={`${process.env.imageBaseUrl}/${item.banner_path}`}
          alt="image"
          className="rounded-[22px] object-cover"
          width={100}
          height={100}
          preview={false}
        />
      </div>

      <div className="flex w-full flex-col gap-1">
        <TextComponent as="h5" className="leading-20px] text-[16px] font-bold">
          {item?.name}
        </TextComponent>
        <TextComponent as="p" className="text-[12px] leading-[18px] text-custom_grey">
          "{item?.description}"
        </TextComponent>
        <CustomButton
          className="flex items-start justify-start bg-white bg-none px-0 py-0"
          onClick={() => {
            router.push(`/store/${item.slug}`)
          }}
        >
          <TextComponent as="span" className="text-[12px] leading-[16px] underline">
            {type === 'product' ? 'Check store' : 'Check store'}
          </TextComponent>
        </CustomButton>
      </div>
    </Link>
  )
}

export default StoreListItem
