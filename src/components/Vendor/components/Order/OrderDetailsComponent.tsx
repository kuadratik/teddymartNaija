import TextComponent from '@/components/SharedUI/TextComponent'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Button, Layout} from 'antd'
import React from 'react'
import OrderDetailsTable from './OrderDetailsTable'
import OrderStatus from './OrderStatus'
import {useAppSelector} from '@/hooks/reduxHooks'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'

const {Content} = Layout

const OrderDetailsComponent = ({data, setCurrent}: any) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  return (
    <div>
      <StyledContentWrapper className="">
        <div className="flex justify-between border-b-[1.5px]">
          {' '}
          <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-black">
            Order #{data?.id}
          </TextComponent>
          <Button
            onClick={() => {
              setCurrent(2)
            }}
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
          <OrderDetailsTable data={data} />

          <div className="mt-[30px] flex flex-col justify-end gap-3 border-b-[1.5px] border-dashed py-4">
            <div className="flex justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Sub Total :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  <FormatNumberCurrency value={+data?.subtotal} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Discount:{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  <FormatNumberCurrency value={0} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div>{' '}
            <div className="flex justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Shipping Charge :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  <FormatNumberCurrency value={+data?.shipping_cost} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div>{' '}
            {/* <div className="flex justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Estimated Tax :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  <FormatNumberCurrency value={0} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div> */}
          </div>
          <div className="mt-[10px] flex flex-col justify-end gap-3 py-4">
            {' '}
            <div className="flex justify-end">
              <div className="flex w-[35%] justify-between">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Total ({isActiveUser?.currency}) :{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-black">
                  <FormatNumberCurrency value={+data?.total_amount} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div>
          </div>
        </div>
      </StyledContentWrapper>

      {/* <div className="mt-[33px]">
        <OrderStatus />
      </div> */}
    </div>
  )
}

export const StyledContentWrapper = styled(Content)`
  border-radius: 0.375rem;
  background-color: white;
  padding: 12px;
  color: #000;
`

export default OrderDetailsComponent
