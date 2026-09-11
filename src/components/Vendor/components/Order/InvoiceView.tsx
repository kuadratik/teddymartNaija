import Badge from '@/components/SharedUI/Badge'
import TextComponent from '@/components/SharedUI/TextComponent'
import styled from '@emotion/styled'
import Image from 'next/image'

import CustomButton from '@/components/SharedUI/Buttons/Button'
import Spinner from '@/components/SharedUI/Spinner'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {formatDate3} from '@/utils/fx'
import {Icon} from '@iconify/react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {useState} from 'react'
import tw from 'tailwind-styled-components'
import OrderDetailsTable from './OrderDetailsTable'
import {StyledContentWrapper} from './OrderLogisticsView'

const InvoiceView = ({data}: any) => {
  console.log('🚀 ~ InvoiceView ~ data:', data)
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  const downloadInvoice = async () => {
    try {
      setIsLoadingInvoice(true)
      const invoice = document.getElementById('invoice-order')
      if (!invoice) return

      // Pre-load images to avoid rendering issues
      const images = Array.from(invoice.getElementsByTagName('img'))
      await Promise.all(
        images.map(
          img =>
            new Promise(resolve => {
              if (img.complete) resolve(null)
              else {
                img.onload = () => resolve(null)
                img.onerror = () => resolve(null)
              }
            })
        )
      )

      // Wait for any potential rendering
      await new Promise(resolve => setTimeout(resolve, 300))

      const fixedWidth = 900
      const originalStyle = invoice.style.width
      invoice.style.width = `${fixedWidth}px`

      // Create canvas with optimized settings
      const canvas = await html2canvas(invoice, {
        logging: false,
        useCORS: true,
        scale: 1.5, // Reduced from 1.5 for better file size
        width: fixedWidth,
        windowWidth: fixedWidth,
        height: invoice.scrollHeight,
        windowHeight: invoice.scrollHeight,
        scrollY: -window.scrollY,
        imageTimeout: 2000,
        backgroundColor: '#FFFFFF', // Explicit white background
        onclone: clonedDoc => {
          const clonedInvoice = clonedDoc.getElementById('invoice-order')
          if (clonedInvoice) {
            clonedInvoice.style.height = 'auto'
            clonedInvoice.style.overflow = 'visible'
            clonedInvoice.style.position = 'relative'
          }
        }
      })

      // Restore original style
      invoice.style.width = originalStyle

      // Get dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF with compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      // Convert canvas to compressed JPEG once
      const imageData = canvas.toDataURL('image/jpeg', 0.7) // Using JPEG with 70% quality

      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight

      // Add new pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeight
      }

      pdf.save('myeki_order_invoice_' + Date.now() + '.pdf')
      setIsLoadingInvoice(false)
    } catch (error) {
      console.error('Error generating PDF:', error)
      setIsLoadingInvoice(false)
    }
  }

  return (
    <div>
      <StyledContentWrapper>
        <div className="mx-auto max-w-5xl">
          <div id="invoice-order" className={isLoadingInvoice ? 'blur-md' : ''}>
            <div className="flex justify-between gap-4 border-b-[1.5px] border-dashed py-8 pb-10 md:p-3">
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
                    Address: {data?.shipping_address?.address}
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                    Country: {data?.shipping_address?.country}
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
                  textClassName={`${isLoadingInvoice ? 'relative -translate-y-2' : ''}`}
                  className="w-[55%]"
                  status={data?.payment_status == 'completed_payment' ? 'Paid' : data?.payment_status}
                />
              </div>

              <div className="header">
                <TextComponentContent as="p">Total Amount</TextComponentContent>
                <TextComponentContent as="p" className="!font-medium !text-black">
                  <FormatNumberCurrency value={+data?.total_amount || 0} currency={isActiveUser?.currency} />
                </TextComponentContent>
              </div>
              <div className="header">
                <TextComponentContent as="p">Delivery Method</TextComponentContent>
                <TextComponentContent as="p" className="!font-medium !text-black">
                  {data?.shipping_method?.method_type}
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
              <OrderDetailsTable data={data} isLoadingInvoice={isLoadingInvoice} />

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
                      Discount (VELZON15) :{' '}
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
                </div>{' '}
                {/* <div className="flex justify-end">
               <div className="grid w-[70%] grid-cols-2 justify-between sm:w-[60%] md:flex md:w-[35%]">
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
                    <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                      Total ({isActiveUser?.currency}) :{' '}
                    </TextComponent>
                    <TextComponent
                      as="p"
                      className="text-right text-[14px] font-normal leading-[15.23px] text-black md:text-left"
                    >
                      <FormatNumberCurrency value={+data?.total_amount || 0} currency={isActiveUser?.currency} />
                    </TextComponent>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {data !== null && (
            <div className="mt-6 flex justify-end">
              <CustomButton
                onClick={() => {
                  downloadInvoice()
                }}
                style={{
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                type="button"
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#007AFF] px-5 py-2.5 text-base text-white md:w-[140px]"
              >
                {isLoadingInvoice ? (
                  <Spinner />
                ) : (
                  <Icon icon={'material-symbols-light:download'} className="text-[30px] text-white" />
                )}
                Download
              </CustomButton>
            </div>
          )}
        </div>
      </StyledContentWrapper>
    </div>
  )
}

const InvoiceDetailsWrapper = styled(tw.div`
mt-[33px] grid grid-cols-2 gap-12 border-b-[1.5px] border-dashed md:p-3 py-8 pb-10 md:flex`)`
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
