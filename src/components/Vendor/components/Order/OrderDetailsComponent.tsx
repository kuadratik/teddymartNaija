import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Layout} from 'antd'
import OrderDetailsTable from './OrderDetailsTable'

const {Content} = Layout

const OrderDetailsComponent = ({data, setCurrent, current}: any) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  return (
    <div>
      <StyledContentWrapper className="">
        <div className="flex justify-between border-b-[1.5px] pb-1">
          {' '}
          <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-black">
            Order #{data?.id}
          </TextComponent>
          <div className="w-fit">
            <CustomButton
              onClick={() => {
                setCurrent(2)
              }}
              title="Download Invoice"
              style={{
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              type="button"
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#34C759] px-5 py-2.5 text-base text-white md:w-[140px]"
            >
              <Icon icon={'material-symbols-light:download'} className="text-[25px] text-white" />
              Invoice
            </CustomButton>
          </div>
        </div>

        <div className="mt-[50px]">
          <OrderDetailsTable data={data} current={current} />

          <div className="mt-[30px] flex flex-col justify-end gap-3 border-b-[1.5px] border-dashed py-4">
            <div className="flex justify-end">
              <div className="grid w-[70%] grid-cols-2 justify-between sm:w-[60%] md:flex md:w-[35%]">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Sub Total :{' '}
                </TextComponent>
                <TextComponent
                  as="p"
                  className="text-right text-[14px] font-normal leading-[15.23px] text-black md:text-left"
                >
                  <FormatNumberCurrency value={+data?.subtotal || 0} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div>
            {/* <div className="flex justify-end">
              <div className="grid w-[70%] grid-cols-2 justify-between sm:w-[60%] md:flex md:w-[35%]">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Discount:{' '}
                </TextComponent>
                <TextComponent
                  as="p"
                  className="text-right text-[14px] font-normal leading-[15.23px] text-black md:text-left"
                >
                  <FormatNumberCurrency value={0} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div>{' '} */}
            <div className="flex justify-end">
              <div className="grid w-[70%] grid-cols-2 justify-between sm:w-[60%] md:flex md:w-[35%]">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Shipping Charge :{' '}
                </TextComponent>
                <TextComponent
                  as="p"
                  className="text-right text-[14px] font-normal leading-[15.23px] text-black md:text-left"
                >
                  <FormatNumberCurrency value={+data?.shipping_cost || 0} currency={isActiveUser?.currency} />
                </TextComponent>
              </div>
            </div>
            {/* <div className="flex justify-end">
              <div className="grid w-[70%] grid-cols-2 justify-between sm:w-[60%] md:flex md:w-[35%]">
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Total Weight :{' '}
                </TextComponent>
                <TextComponent
                  as="p"
                  className="text-right text-[14px] font-normal leading-[15.23px] text-black md:text-left"
                >
                  {(() => {
                    const totalWeight = data?.order_details?.reduce(
                      (total: number, item: any) =>
                        total + (item.listing?.weight ? parseFloat(item.listing.weight) * item.quantity : 0),
                      0
                    )
                    return totalWeight > 0 ? `${totalWeight.toFixed(2)} g` : '-'
                  })()}
                </TextComponent>
              </div>
            </div>{' '} */}
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
              <div className="grid w-[70%] grid-cols-2 justify-between sm:w-[60%] md:flex md:w-[35%]">
                <TextComponent as="p" className="text-[14px] font-semibold leading-[15.23px] text-[#6B7280]">
                  Total ({isActiveUser?.currency}) :{' '}
                </TextComponent>
                <TextComponent
                  as="p"
                  className="text-right text-[14px] font-semibold leading-[15.23px] text-black md:text-left"
                >
                  <FormatNumberCurrency value={+data?.total_amount || 0} currency={isActiveUser?.currency} />
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
