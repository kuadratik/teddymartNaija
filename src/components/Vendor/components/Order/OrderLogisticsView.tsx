import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {formatPhoneNumber} from '@/utils/fx'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Layout} from 'antd'
import Image from 'next/image'

const {Content} = Layout

const OrderLogisticsView = ({data}: any) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  console.log(data?.shipping_address?.country)

  return (
    <div className="">
      <div className="flex flex-col gap-[12px]">
        <StyledContentWrapper className="">
          <div className="flex items-center justify-between border-b-[1.5px]">
            {' '}
            <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Delivery Method
            </TextComponent>
            {/* <Button
              style={{
                backgroundColor: '#6B7280',
                color: 'white',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="whitespace-nowrap rounded-lg bg-[#6B7280] px-4 py-[22px] text-white md:w-[140px]"
            >
              Track Order
            </Button> */}
          </div>
          <div className="flex flex-col gap-3">
            {' '}
            {data?.shipping_method?.method_type == 'vendor-fulfilled shipping' ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8">
                <Icon icon="fxemoji:deliverytruck" className="text-[80px]" />

                <TextComponent as="p" className="text-[20px] font-bold leading-[15.23px] text-[#6B7280]">
                  Vendor Fulfilled Shipping{' '}
                </TextComponent>
                <TextComponent as="p" className="mt-4 text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
                  Selected Location: <span>{data?.shipping_method?.location}</span>
                </TextComponent>
                {/* <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                Payment Mode : Debit Card{' '}
              </TextComponent> */}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-8">
                <Icon icon="carbon:store" className="text-[80px]" />

                <TextComponent as="p" className="text-[20px] font-bold leading-[15.23px] text-[#6B7280]">
                  Store pickup
                </TextComponent>
                {/* <TextComponent as="p" className="mt-4 text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
                  Selected Location: <span>{data?.shipping_method?.location}</span>
                </TextComponent> */}
                {/* <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                Payment Mode : Debit Card{' '}
              </TextComponent> */}
              </div>
            )}
          </div>
        </StyledContentWrapper>

        <StyledContentWrapper>
          <div className="flex items-center justify-between border-b-[1.5px]">
            {' '}
            <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Customer Details{' '}
            </TextComponent>
          </div>
          <div className="flex flex-col gap-3">
            {' '}
            <div className="flex flex-col items-center justify-center gap-3 p-8">
              {/* <div className="rounded-md bg-[#C4C4C4] p-4" /> */}

              <Image src={'/assets/customer_avatar.svg'} alt="" width={40} height={40} />

              <TextComponent as="p" className="mt-4 text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
                Name: {data?.customer?.last_name} {data?.customer?.first_name}{' '}
              </TextComponent>
              <div className="flex items-center gap-2">
                {' '}
                <div className="rounded-md bg-[#FFDEDF] p-1">
                  <Icon icon={'mdi-light:email'} className="text-base text-[#FF2D55]" />
                </div>
                <TextComponent as="p" className="mt-2 text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
                  Email: {data?.customer?.email}
                </TextComponent>
              </div>
              {/* <div className="flex items-center gap-2">
                {' '}
                <div className="rounded-md bg-[#DBDBFF] p-1">
                  <Icon icon={'ic:sharp-phone'} className="text-basee text-[#5856D6]" />
                </div>
                <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Phone Number: {data?.phone}{' '}
                </TextComponent>
              </div> */}
            </div>
          </div>
        </StyledContentWrapper>

        {/* <StyledContentWrapper className="">
          <div className="flex items-center justify-between border-b-[1.5px]">
            {' '}
            <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Billing Address{' '}
            </TextComponent>
          </div>
          <div className="flex flex-col gap-3">
            {' '}
            <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
              Joseph Parkers{' '}
            </TextComponent>
            <StyledList>
              <li className="text-[#6B7280]">Phone: +(256) 245451 451 </li>
              <li className="text-[#6B7280]"> Address: 2186 Joyce Street Rocky Mount New York - 25645 </li>
              <li className="text-[#6B7280]"> Country: United States</li>{' '}
            </StyledList>
          </div>
        </StyledContentWrapper> */}

        <StyledContentWrapper className="">
          <div className="flex items-center justify-between border-b-[1.5px]">
            {' '}
            <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Shipping Details{' '}
            </TextComponent>
          </div>
          <div className="flex flex-col gap-3">
            {' '}
            <TextComponent as="p" className="mt-4 text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
              Name: {data?.first_name} {data?.last_name}
            </TextComponent>
            <TextComponent as="p" className="text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
              Phone: {formatPhoneNumber(data?.phone)}{' '}
            </TextComponent>
            <TextComponent as="p" className="text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
              Address: {data?.shipping_address?.address}, {data?.shipping_address?.city},{' '}
              {data?.shipping_address?.state}
            </TextComponent>
            <TextComponent as="p" className="text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
              Country: {data?.shipping_address?.country}
            </TextComponent>
            {/* <StyledList>
              <div className="text-[#6B7280]"> Phone: {data?.phone}</div>
              <div className="text-[#6B7280]"> Address: </div>
              <li className="text-[#6B7280]"> Country: </li>{' '}
            </StyledList> */}
          </div>
        </StyledContentWrapper>

        <StyledContentWrapper className="">
          <div className="flex items-center justify-between border-b-[1.5px]">
            {' '}
            <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Payment Details{' '}
            </TextComponent>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {' '}
            <TextComponent as="p" className="mt-4 text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
              Transactions ID: {data?.payments?.at(-1)?.reference}
            </TextComponent>
            <TextComponent as="p" className="text-[14px] font-medium leading-[15.23px] text-[#6B7280]">
              Total Amount: <FormatNumberCurrency value={+data?.total_amount || 0} currency={isActiveUser?.currency} />
            </TextComponent>
          </div>
        </StyledContentWrapper>
      </div>
    </div>
  )
}

export const StyledContentWrapper = styled(Content)`
  border-radius: 0.375rem;
  background-color: white;
  padding: 12px;
  color: #000;
`

export const StyledList = styled.ul`
  list-style: none; /* Remove default bullet */
  padding-left: 20px;

  li {
    position: relative;
    padding-left: 20px; /* Space for custom bullet */
    margin-bottom: 8px;

    &::before {
      content: '•'; /* Custom bullet symbol */
      position: absolute;
      left: 0;
      color: #6b7280; /* Custom bullet color */
      font-size: 16px; /* Custom bullet size */
    }
  }
`

export default OrderLogisticsView
