import React from 'react'
import {StyledContentWrapper, StyledList} from '../OrderLogisticsView'
import Image from 'next/image'
import TextComponent from '@/components/SharedUI/TextComponent'
import styled from '@emotion/styled'
import Badge from '@/components/SharedUI/Badge'

import tw from 'tailwind-styled-components'
import InvoiceTable from './InvoiceTable'

const InvoiceView = () => {
  return (
    <div>
      <StyledContentWrapper className="">
        <div className="flex justify-between border-b-[1.5px] border-dashed p-3 py-8 pb-10">
          <div>
            <Image src={'/assets/dark_logo.svg'} alt="logo" width={90} height={90} />
            <div className="mt-2 flex flex-col gap-2">
              {' '}
              <TextComponentContent as="p">Address</TextComponentContent>
              <TextComponentContent as="p">California, United States </TextComponentContent>
              <TextComponentContent as="p">Zip-code: 90201</TextComponentContent>
            </div>
          </div>

          <div>
            <div className="mt-2 flex flex-col gap-2">
              {' '}
              <TextComponentContent as="p">Legal Registration No:987654 </TextComponentContent>
              <TextComponentContent as="p">Email:velzon@themesbrand.com </TextComponentContent>
              <TextComponentContent as="p">Website: www.themesbrand.com </TextComponentContent>
              <TextComponentContent as="p">Contact No: +(01) 234 6789 </TextComponentContent>
            </div>
          </div>
        </div>

        <InvoiceDetailsWrapper>
          <div className="header">
            <TextComponentContent as="p">Invoice Number </TextComponentContent>
            <TextComponentContent as="p" className="!font-medium !text-black">
              #VL25000355
            </TextComponentContent>
          </div>

          <div className="header">
            <TextComponentContent as="p">Date </TextComponentContent>
            <TextComponentContent as="p" className="!font-medium !text-black">
              23 Nov, 2021 02:36PM
            </TextComponentContent>
          </div>

          <div className="header">
            <TextComponentContent as="p">Payment Status</TextComponentContent>
            <Badge className="w-[55%]" status={'Paid'} />
          </div>

          <div className="header">
            <TextComponentContent as="p">Total Amount</TextComponentContent>
            <TextComponentContent as="p" className="!font-medium !text-black">
              $755.96
            </TextComponentContent>
          </div>
        </InvoiceDetailsWrapper>

        <div className="flex justify-between border-b-[1.5px] border-dashed p-3 py-8 pb-10">
          {' '}
          <div>
            <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Billing Details{' '}
            </TextComponent>
            <div className="mt-2 flex flex-col gap-3">
              {' '}
              <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                Joseph Parker{' '}
              </TextComponent>
              <StyledList>
                <li className="text-[#6B7280]"> Transactions: #VLZ124561278124 </li>
                <li className="text-[#6B7280]"> Payment Method: Credit/Debit Card </li>
                <li className="text-[#6B7280]"> Total Amount: $415.96</li>{' '}
              </StyledList>
            </div>
          </div>
          <div>
            <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
              Shipping Details{' '}
            </TextComponent>
            <div className="mt-2 flex flex-col gap-3">
              {' '}
              <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                Joseph Parker{' '}
              </TextComponent>
              <StyledList>
                <li className="text-[#6B7280]"> Transactions: #VLZ124561278124 </li>
                <li className="text-[#6B7280]"> Payment Method: Credit/Debit Card </li>
                <li className="text-[#6B7280]"> Total Amount: $415.96</li>{' '}
              </StyledList>
            </div>
          </div>
        </div>

        <div className="mt-[50px]">
          <InvoiceTable />
        </div>
      </StyledContentWrapper>
    </div>
  )
}

const InvoiceDetailsWrapper = styled(tw.div`
mt-[33px] grid grid-cols-2 gap-12 border-b-[1.5px] border-dashed p-3 py-8 pb-10 md:flex`)`
  .header {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`

const TextComponentContent = styled(TextComponent)`
  font-size: 14px;
  font-weight: 400;
  line-height: 15.23px;
  color: #6b7280;
`

export default InvoiceView
