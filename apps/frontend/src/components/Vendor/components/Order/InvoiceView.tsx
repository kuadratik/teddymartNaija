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

      // Create a clone of the invoice for preparation
      const invoiceClone = invoice.cloneNode(true) as HTMLElement
      document.body.appendChild(invoiceClone)
      invoiceClone.style.position = 'absolute'
      invoiceClone.style.left = '-9999px'
      invoiceClone.style.top = '-9999px'
      invoiceClone.id = 'invoice-clone'

      // Set fixed width for consistent rendering
      const fixedWidth = 850
      invoiceClone.style.width = `${fixedWidth}px`
      invoiceClone.style.backgroundColor = '#FFFFFF'
      invoiceClone.style.padding = '20px'
      invoiceClone.style.boxSizing = 'border-box'

      // Pre-load and process all images to avoid rendering issues
      const images = Array.from(invoiceClone.getElementsByTagName('img'))
      await Promise.all(
        images.map(
          img =>
            new Promise(resolve => {
              if (img.complete) {
                // Force image dimensions to be explicit
                img.style.width = `${img.width}px`
                img.style.height = `${img.height}px`
                resolve(null)
              } else {
                img.onload = () => {
                  img.style.width = `${img.width}px`
                  img.style.height = `${img.height}px`
                  resolve(null)
                }
                img.onerror = () => {
                  img.src = '/assets/default_banner.jpg'
                  resolve(null)
                }
              }
            })
        )
      )

      // Wait for rendering stabilization
      await new Promise(resolve => setTimeout(resolve, 500))

      // Create canvas with optimized settings for better print quality
      const canvas = await html2canvas(invoiceClone, {
        logging: false,
        useCORS: true,
        scale: 2, // Higher scale for better quality
        allowTaint: true,
        width: fixedWidth,
        windowWidth: fixedWidth,
        height: invoiceClone.scrollHeight,
        windowHeight: invoiceClone.scrollHeight,
        backgroundColor: '#FFFFFF',
        onclone: clonedDoc => {
          const clonedInvoice = clonedDoc.getElementById('invoice-clone')
          if (clonedInvoice) {
            clonedInvoice.style.height = 'auto'
            clonedInvoice.style.overflow = 'visible'
            clonedInvoice.style.position = 'relative'

            // Fix table cell widths for consistent layout
            const tableCells = clonedInvoice.querySelectorAll('td, th')
            tableCells.forEach(cell => {
              ;(cell as any).style.width = cell.clientWidth + 'px'
            })
          }
        }
      })

      // Remove the clone after capturing
      document.body.removeChild(invoiceClone)

      // Calculate PDF dimensions based on A4 format
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 287 // A4 height in mm (with margins)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF with proper configuration for better quality
      const pdf = new jsPDF({
        orientation: imgHeight > pageHeight ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        hotfixes: ['px_scaling']
      })

      // Add proper margins and optimize image quality
      const margin = 10 // mm
      const effectiveWidth = imgWidth - 2 * margin
      const effectiveHeight = (effectiveWidth * canvas.height) / canvas.width

      // Convert canvas to optimized image
      const imageData = canvas.toDataURL('image/jpeg', 0.95) // Higher quality JPEG

      // Calculate pages needed
      let heightLeft = effectiveHeight
      let position = 0

      // Add first page
      pdf.addImage(imageData, 'JPEG', margin, margin, effectiveWidth, effectiveHeight, undefined, 'FAST')
      heightLeft -= pageHeight - 2 * margin

      // Add new pages if needed with proper positioning
      while (heightLeft > 0) {
        position = -(
          ((pageHeight - 2 * margin) / effectiveHeight) * canvas.height -
          (heightLeft / effectiveHeight) * canvas.height
        )
        pdf.addPage()
        pdf.addImage(imageData, 'JPEG', margin, position + margin, effectiveWidth, effectiveHeight, undefined, 'FAST')
        heightLeft -= pageHeight - 2 * margin
      }

      // Save with unique identifier
      pdf.save(`myeki_invoice_${data?.id || ''}_${Date.now()}.pdf`)
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
                <Image src={'/assets/dark_logo.svg'} alt="logo" width={140} height={19} />
                <div className="mt-2 flex flex-col gap-2">
                  {' '}
                  <TextComponentContent as="p">Address</TextComponentContent>
                  <TextComponentContent as="p">
                    {data?.shipping_address?.address}, {data?.shipping_address?.city}, {data?.shipping_address?.country}
                  </TextComponentContent>
                </div>
              </div>

              <div>
                <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
                  Shipping Details{' '}
                </TextComponent>
                <div className="flex flex-col gap-3">
                  {' '}
                  <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                    Name: {data?.first_name} {data?.last_name}
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
                <p className="relative bottom-1 font-bold">
                  {data?.payment_status == 'completed_payment' ? 'Paid' : data?.payment_status}
                </p>
                {/* <Badge
                  textClassName={`${isLoadingInvoice ? 'relative -translate-y-2' : ''}`}
                  className="w-[55%]"
                  status={data?.payment_status == 'completed_payment' ? 'Paid' : data?.payment_status}
                /> */}
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

            {/* Order summary header */}
            <div className="mb-4 mt-8">
              <TextComponent as="h2" className="text-xl font-bold text-gray-800">
                Order Summary
              </TextComponent>
              <div className="mt-2 h-1 w-20 bg-gray-200"></div>
            </div>

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
          </div>
          {data !== null && (
            <div className="mt-6 flex justify-end px-4">
              <CustomButton
                onClick={() => {
                  downloadInvoice()
                }}
                disabled={isLoadingInvoice}
                style={{
                  backgroundColor: '#007AFF',
                  color: 'white',
                  border: 'none',
                  transition: 'none'
                }}
                type="button"
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#007AFF] px-7 py-2.5 text-white md:w-[140px]"
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
