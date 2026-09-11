import TextComponent from '@/components/SharedUI/TextComponent'
import {useGetAllShippingAddressQuery} from '@/services/shipping/iindex'
import {Icon} from '@iconify/react'
import {Button} from 'antd'
import React from 'react'

const ShippingAddress = () => {
  const {data: shippingAddress, isLoading: shippingAddressLoading} = useGetAllShippingAddressQuery({})

  console.log(shippingAddress)
  return (
    <div className="mt-[17px] w-[950px]">
      <div className="flex gap-2 overflow-x-auto">
        <div className="flex w-[300px] gap-5 overflow-x-auto md:w-full">
          <div
            role="button"
            className="w-[60%] flex-shrink-0 rounded-[9px] border-[1.5px] border-solid border-[#EDEDED] bg-white p-[14px] sm:w-[90%] md:w-[371px]"
          >
            <TextComponent as="p" className="text-[16px] font-semibold leading-[12px] text-[#6B7280]">
              Marcus Alfaro
            </TextComponent>

            <TextComponent as="p" className="mt-8 text-[12px] font-medium leading-[12px] text-[#6B7280]">
              996 Koby Station Apt. 667, Oklahoma City, South Dakota{' '}
            </TextComponent>

            <div className="mt-8 flex items-center justify-between gap-3">
              {' '}
              <Button
                //   onClick={() => {
                //     showComingSoon(true)
                //   }}
                style={{
                  backgroundColor: '#EEEEEE',
                  color: '#6B7280',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                htmlType="button"
                className="w-full whitespace-nowrap rounded-lg bg-[#EEEEEE] px-7 py-[22px] font-normal text-[#6B7280]"
              >
                Use Address
              </Button>
              <Button className="!border-none">
                <Icon icon="proicons:delete" className="text-2xl text-[#FF2D55]" />
              </Button>
            </div>
          </div>
          <div
            role="button"
            className="w-[60%] flex-shrink-0 rounded-[9px] border-[1.5px] border-solid border-[#EDEDED] bg-white p-[14px] sm:w-[90%] md:w-[371px]"
          >
            <TextComponent as="p" className="text-[16px] font-semibold leading-[12px] text-[#6B7280]">
              Marcus Alfaro
            </TextComponent>

            <TextComponent as="p" className="mt-8 text-[12px] font-medium leading-[12px] text-[#6B7280]">
              996 Koby Station Apt. 667, Oklahoma City, South Dakota{' '}
            </TextComponent>

            <div className="mt-8 flex items-center justify-between gap-3">
              {' '}
              <Button
                //   onClick={() => {
                //     showComingSoon(true)
                //   }}
                style={{
                  backgroundColor: '#EEEEEE',
                  color: '#6B7280',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                htmlType="button"
                className="w-full whitespace-nowrap rounded-lg bg-[#EEEEEE] px-7 py-[22px] font-normal text-[#6B7280]"
              >
                Use Address
              </Button>
              <Button className="!border-none">
                <Icon icon="proicons:delete" className="text-2xl text-[#FF2D55]" />
              </Button>
            </div>
          </div>
          <div
            role="button"
            className="w-[60%] flex-shrink-0 rounded-[9px] border-[1.5px] border-solid border-[#EDEDED] bg-white p-[14px] sm:w-[90%] md:w-[371px]"
          >
            <TextComponent as="p" className="text-[16px] font-semibold leading-[12px] text-[#6B7280]">
              Marcus Alfaro
            </TextComponent>

            <TextComponent as="p" className="mt-8 text-[12px] font-medium leading-[12px] text-[#6B7280]">
              996 Koby Station Apt. 667, Oklahoma City, South Dakota{' '}
            </TextComponent>

            <div className="mt-8 flex items-center justify-between gap-3">
              {' '}
              <Button
                //   onClick={() => {
                //     showComingSoon(true)
                //   }}
                style={{
                  backgroundColor: '#EEEEEE',
                  color: '#6B7280',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                htmlType="button"
                className="w-full whitespace-nowrap rounded-lg bg-[#EEEEEE] px-7 py-[22px] font-normal text-[#6B7280]"
              >
                Use Address
              </Button>
              <Button className="!border-none">
                <Icon icon="proicons:delete" className="text-2xl text-[#FF2D55]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingAddress
