import TextComponent from '@/components/SharedUI/TextComponent'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Button, Layout, Timeline} from 'antd'
import React from 'react'

const {Content} = Layout

const OrderLogisticsView = () => {
  return (
    <div className="">
      <div className="flex flex-col gap-[12px]">
        <StyledContentWrapper className="">
          <div className="flex items-center justify-between border-b-[1.5px]">
            {' '}
            <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Logistics Details
            </TextComponent>
            <Button
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
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {' '}
            <div className="flex flex-col items-center justify-center gap-3 p-8">
              <Icon icon="fxemoji:deliverytruck" className="text-[80px]" />

              <TextComponent as="p" className="text-[20px] font-bold leading-[15.23px] text-[#6B7280]">
                RQK Logistics
              </TextComponent>
              <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                ID: MFDS1400457854
              </TextComponent>
              <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                Payment Mode : Debit Card{' '}
              </TextComponent>
            </div>
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
              <div className="rounded-md bg-[#C4C4C4] p-4" />
              <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                Name: Joseph Parkers{' '}
              </TextComponent>
              <div className="flex items-center gap-2">
                {' '}
                <div className="rounded-md bg-[#FFDEDF] p-1">
                  <Icon icon={'mdi-light:email'} className="text-base text-[#FF2D55]" />
                </div>
                <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Email: josephparker@gmail.com{' '}
                </TextComponent>
              </div>
              <div className="flex items-center gap-2">
                {' '}
                <div className="rounded-md bg-[#DBDBFF] p-1">
                  <Icon icon={'ic:sharp-phone'} className="text-basee text-[#5856D6]" />
                </div>
                <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Phone Number: +(256) 245451 441{' '}
                </TextComponent>
              </div>
            </div>
          </div>
        </StyledContentWrapper>

        <StyledContentWrapper className="">
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
        </StyledContentWrapper>

        <StyledContentWrapper className="">
          <div className="flex items-center justify-between border-b-[1.5px]">
            {' '}
            <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Shipping Details{' '}
            </TextComponent>
          </div>
          <div className="flex flex-col gap-3">
            {' '}
            <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
              Joseph Parkers{' '}
            </TextComponent>
            <StyledList>
              <li className="text-[#6B7280]"> Phone: +(256) 245451 451 </li>
              <li className="text-[#6B7280]"> Address: 2186 Joyce Street Rocky Mount New York - 25645 </li>
              <li className="text-[#6B7280]"> Country: United States</li>{' '}
            </StyledList>
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
            <StyledList>
              <li className="text-[#6B7280]"> Transactions: #VLZ124561278124 </li>
              <li className="text-[#6B7280]"> Payment Method: Credit/Debit Card </li>
              <li className="text-[#6B7280]"> Total Amount: $415.96</li>{' '}
            </StyledList>
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
