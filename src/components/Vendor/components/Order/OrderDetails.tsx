import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Button, Layout} from 'antd'
import React from 'react'
import OrderDetailsTable from './OrderDetailsTable'
import OrderStatus from './OrderStatus'
import {StyledContentWrapper} from './OrderLogisticsView'

const {Content} = Layout

const OrderDetailsComponent = () => {
  return (
    <div>
      <StyledContentWrapper className="">
        <div className="flex justify-between border-b-[1.5px]">
          {' '}
          <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-black">
            Order #VL2667
          </TextComponent>
          <Button
            style={{
              backgroundColor: '#34C759',
              color: 'white',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
            htmlType="button"
            className="bg-[#34C759]rounded-lg whitespace-nowrap px-7 py-[22px] text-white md:w-[140px]"
          >
            <Icon icon={'material-symbols-light:download'} className="text-[30px] text-white" />
            Invoice
          </Button>
        </div>

        <div className="mt-[50px]">
          <OrderDetailsTable />

          <div className="mt-[30px] flex flex-col justify-end gap-3 border-b-[1.5px] border-dashed py-4">
            <div className="flex w-[93%] justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Sub Total :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  $359.96{' '}
                </TextComponent>
              </div>
            </div>
            <div className="flex w-[93%] justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Discount (VELZON15) :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  -$53.99{' '}
                </TextComponent>
              </div>
            </div>{' '}
            <div className="flex w-[93%] justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Shipping Charge :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  $65.00{' '}
                </TextComponent>
              </div>
            </div>{' '}
            <div className="flex w-[93%] justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Estimated Tax :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  $44.99{' '}
                </TextComponent>
              </div>
            </div>
          </div>
          <div className="mt-[10px] flex flex-col justify-end gap-3 py-4">
            {' '}
            <div className="flex w-[93%] justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Total (USD) :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  $415.96{' '}
                </TextComponent>
              </div>
            </div>
          </div>
        </div>
      </StyledContentWrapper>

      <div className="mt-[33px]">
        <OrderStatus />
      </div>
    </div>
  )
}

export default OrderDetailsComponent
