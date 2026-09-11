import React, {useRef} from 'react'
import Image from 'next/image'
import TextComponent from '@/components/SharedUI/TextComponent'
import styled from '@emotion/styled'
import Badge from '@/components/SharedUI/Badge'

import tw from 'tailwind-styled-components'
import {StyledContentWrapper, StyledList} from './OrderLogisticsView'
import OrderDetailsTable from './OrderDetailsTable'
import {formatDate3} from '@/utils/fx'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Button} from 'antd'
import {Icon} from '@iconify/react'
import {useReactToPrint} from 'react-to-print'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const InvoiceView = ({data}: any) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  console.log(data)

  const downloadInvoice = async () => {
    const invoice = document.getElementById('invoice')
    const canvas = await html2canvas(invoice as any)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0)
    pdf.save('myeki order invoice.pdf')
  }

  return (
    <div>
      <StyledContentWrapper className="">
        <div id="invoice">
          <div className="flex justify-between border-b-[1.5px] border-dashed p-3 py-8 pb-10">
            <div>
              <Image src={'/assets/dark_logo.svg'} alt="logo" width={90} height={90} />
              <div className="mt-2 flex flex-col gap-2">
                {' '}
                <TextComponentContent as="p">Address</TextComponentContent>
                <TextComponentContent as="p">Ontario, Canada</TextComponentContent>
                {/* <TextComponentContent as="p">Zip-code: 90201</TextComponentContent> */}
              </div>
            </div>

            <div>
              <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
                Shipping Details{' '}
              </TextComponent>
              <div className="flex flex-col gap-3">
                {' '}
                <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Name: {data?.last_name} {data?.first_name}{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Phone: +{data?.phone}{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Address:{' '}
                </TextComponent>
                <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                  Country:{' '}
                </TextComponent>
                {/* <StyledList>
              <div className="text-[#6B7280]"> Phone: {data?.phone}</div>
              <div className="text-[#6B7280]"> Address: </div>
              <li className="text-[#6B7280]"> Country: </li>{' '}
            </StyledList> */}
              </div>
            </div>
          </div>
          <InvoiceDetailsWrapper>
            <div className="header">
              <TextComponentContent as="p">Invoice Number </TextComponentContent>
              <TextComponentContent as="p" className="!font-medium !text-black">
                #{data?.id}
              </TextComponentContent>
            </div>

            <div className="header">
              <TextComponentContent as="p">Date </TextComponentContent>
              <TextComponentContent as="p" className="!font-medium !text-black">
                {formatDate3(data?.created_at ?? '')}
              </TextComponentContent>
            </div>

            <div className="header">
              <TextComponentContent as="p">Payment Status</TextComponentContent>
              <Badge
                className="w-[55%]"
                status={data?.payment_status == 'completed_payment' ? 'Paid' : data?.payment_status}
              />
            </div>

            <div className="header">
              <TextComponentContent as="p">Total Amount</TextComponentContent>
              <TextComponentContent as="p" className="!font-medium !text-black">
                <FormatNumberCurrency value={+data?.total_amount} currency={isActiveUser?.currency} />
              </TextComponentContent>
            </div>
          </InvoiceDetailsWrapper>
          {/* <div className="flex justify-between border-b-[1.5px] border-dashed p-3 py-8 pb-10">
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
        </div> */}
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
                    Discount (VELZON15) :{' '}
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
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => {
              downloadInvoice()
            }}
            style={{
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
            htmlType="button"
            className="whitespace-nowrap rounded-lg bg-[#007AFF] px-7 py-[22px] text-white md:w-[140px]"
          >
            <Icon icon={'material-symbols-light:download'} className="text-[30px] text-white" />
            Download
          </Button>
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
