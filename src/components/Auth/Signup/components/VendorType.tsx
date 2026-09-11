import TextComponent from '@/components/SharedUI/TextComponent'
import React from 'react'
import {VendorOnboardingProps, VendorType} from '../utils'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import {Icon} from '@iconify/react'

const VendorTypeComponent = (props: VendorOnboardingProps) => {
  const {setFieldValue, values} = props
  return (
    <div className="mb-[270px]">
      <div className="mt-[29px]">
        <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
          Let’s get to know you{' '}
        </TextComponent>
      </div>

      <div className="mt-[26px] flex flex-col gap-6">
        <CustomButton
          className={`flex h-[73px] items-center justify-center rounded-[14px] bg-[#F9FAFB] p-[9px] ${values.offers_product ? 'border border-black' : 'border border-gray-100'}`}
          onClick={() => {
            setFieldValue('offers_product', !values.offers_product)
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center rounded-[14px] bg-[#FFFFFF] p-2 px-3">
              <Icon icon={'solar:shop-bold-duotone'} className="text-3xl" />
            </div>
            <div className="flex flex-col gap-1">
              <TextComponent as="p" className="text-left text-[14px] font-medium text-[#000000]">
                {'I sell items'}
              </TextComponent>
              <TextComponent as="p" className="text-left text-[12px] font-normal text-[#6B7280]">
                {'Add your products, customers are waiting'}
              </TextComponent>
            </div>
          </div>
        </CustomButton>

        <CustomButton
          className={`flex h-[73px] items-center justify-center rounded-[14px] bg-[#F9FAFB] p-[9px] ${values.offers_service ? 'border border-black' : 'border border-gray-100'}`}
          onClick={() => {
            setFieldValue('offers_service', !values.offers_service)
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center rounded-[14px] bg-[#FFFFFF] p-2 px-3">
              <Icon icon={'carbon:user-service'} className="text-3xl" />
            </div>
            <div className="flex flex-col gap-1">
              <TextComponent as="p" className="text-left text-[14px] font-medium text-[#000000]">
                {'I offer services'}
              </TextComponent>
              <TextComponent as="p" className="text-left text-[12px] font-normal text-[#6B7280]">
                {'Advertise your services, clients are waiting'}
              </TextComponent>
            </div>
          </div>
        </CustomButton>

        {/* {VendorType.map((type, id) => {
          return (
            <CustomButton
              key={id}
              className={`flex h-[73px] items-center justify-center rounded-[14px] bg-[#F9FAFB] p-[9px] ${values.vendor_type === type.value ? 'border border-black' : 'border border-gray-100'}`}
              onClick={() => {
                setFieldValue('vendor_type', type.value)
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center rounded-[14px] bg-[#FFFFFF] p-2 px-3">
                  <Icon icon={type.icon} className="text-3xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <TextComponent as="p" className="text-left text-[14px] font-medium text-[#000000]">
                    {type.title}
                  </TextComponent>
                  <TextComponent as="p" className="text-left text-[12px] font-normal text-[#6B7280]">
                    {type.desc}
                  </TextComponent>
                </div>
              </div>
            </CustomButton>
          )
        })} */}
      </div>
    </div>
  )
}

export default VendorTypeComponent
