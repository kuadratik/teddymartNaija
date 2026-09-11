import TextComponent from '@/components/SharedUI/TextComponent'
import {Image} from 'antd'
import React from 'react'
import {StatusRenderer} from './OrderHistory'

const OrderDetails = () => {
  return (
    <div>
      <div className="flex h-[137px] items-center border-b border-b-[#EAECEF]">
        <div className="flex items-center gap-[13px]">
          <div className="h-[100px] w-[100px] overflow-hidden rounded-[9px]">
            <Image
              src={'/assets/shirt_1.png'}
              alt="product image"
              preview={false}
              // onLoadStart={() => {
              //   setIsLoadingImage(true)
              // }}
              // onLoad={() => {
              //   setIsLoadingImage(false)
              // }}
              onError={error => {
                error.currentTarget.src = '/assets/default_banner.jpg'
                //   setIsLoadingImage(false)
              }}
              // className={`${isLoadingImage ? 'blur-sm' : ''}`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <StatusRenderer text="New" />

            <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#6b7280]">
              {`Order ID: 123456`}
            </TextComponent>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
