import TextComponent from '@/components/SharedUI/TextComponent'
import styled from '@emotion/styled'
// import Image from 'next/image'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import Spinner from '@/components/SharedUI/Spinner'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import { useAppSelector } from '@/hooks/reduxHooks'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IPaymentSuccessCheckoutDataTopLevel } from '@/types/shippingResponse'
import { formatDate3 } from '@/utils/fx'
import { Icon } from '@iconify/react'
import { Layout, Tooltip } from 'antd'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import tw from 'tailwind-styled-components'

const {Content} = Layout

const InvoiceView = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)

  const router = useRouter()
  const [paymentSuccessCheckoutData, setPaymentSuccessCheckoutData] = useLocalStorage<any | null>(
    'paymentSuccessCheckoutData',
    null
  )
  const [selectedAddress, setSelectedAddress] = useLocalStorage<any>('selectedShippingAddress', null)

  const data = paymentSuccessCheckoutData[0]
  console.log('🚀 ~ InvoiceView ~ data:', data)

  // console.log('paymentSuccessCheckoutData', paymentSuccessCheckoutData)

  const combinedOrders = paymentSuccessCheckoutData?.reduce(
    (acc: {subtotal: number; shipping_cost: number}, order: IPaymentSuccessCheckoutDataTopLevel) => {
      acc.subtotal += parseFloat(order.subtotal)
      acc.shipping_cost += parseFloat(order.shipping_cost)
      return acc
    },
    {subtotal: 0, shipping_cost: 0}
  )
  const totalAmount = combinedOrders?.subtotal + combinedOrders?.shipping_cost

  useEffect(() => {
    if (!isAuthenticatedToken) {
      // Check if the user is logged in
      router.push('/')
    }
  }, [isAuthenticatedToken])
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
      const fixedWidth = 800
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
      <StyledContentWrapper className="">
        <div className="mx-auto max-w-5xl">
          <div id="invoice-order" className={isLoadingInvoice ? 'blur-md' : ''}>
            <div className="flex justify-between border-b-[1.5px] border-dashed p-3 py-8 pb-10">
              <div>
                <Image src={'/assets/dark_logo.svg'} className="object-contain" alt="logo" width={90} height={90} />
                <div className="mt-4 flex flex-col gap-2">
                  {' '}
                  <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
                    Address
                  </TextComponent>
                  <TextComponentContent as="p">
                    {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.country}
                  </TextComponentContent>
                </div>
              </div>

              <div>
                <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#6B7280]">
                  Shipping Details{' '}
                </TextComponent>
                <div className="mt-2 flex flex-col gap-3">
                  {' '}
                  <TextComponent as="p" className="mt-4 text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                    {data?.first_name} {data?.last_name}
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                    Phone: +{data?.phone}{' '}
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                    Address: {selectedAddress.address}
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-normal leading-[15.23px] text-[#6B7280]">
                    Country: {selectedAddress.country}
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
                <TextComponentContent as="p">Order Date</TextComponentContent>
                <TextComponentContent as="p" className="!font-medium !text-black">
                  {formatDate3(data?.created_at ?? '')}
                </TextComponentContent>
              </div>

              <div className="header">
                <TextComponentContent as="p">Payment Status</TextComponentContent>

                <p className="relative bottom-1 font-bold">
                  {data?.payment_status == 'completed_payment' ? 'Paid' : data?.payment_status}
                </p>
              </div>

              <div className="header">
                <TextComponentContent as="p">Total Amount</TextComponentContent>
                <TextComponentContent as="p" className="!font-medium !text-black">
                  <FormatNumberCurrency value={totalAmount} currency={isActiveUser?.currency} />
                </TextComponentContent>
              </div>
            </InvoiceDetailsWrapper>

            {/* Thank you message */}
            <div className="my-6 rounded-md bg-gray-50 p-4 text-center">
              <TextComponent as="p" className="text-[16px] font-medium text-gray-800">
                Thank you for your purchase!
              </TextComponent>
              <TextComponent as="p" className="mt-1 text-[14px] text-gray-600">
                Your order has been received and is being processed.
              </TextComponent>
            </div>

            {/* Order summary header */}
            <div className="mb-4 mt-8">
              <TextComponent as="h2" className="text-xl font-bold text-gray-800">
                Order Summary
              </TextComponent>
              <div className="mt-2 h-1 w-20 bg-gray-200"></div>
            </div>

            <div className="rounded-lg border border-gray-200">
              {/* <OrderTable /> */}

              {isDesktop && (
                <div className="container mx-auto py-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-[#F1F1F1] py-4 text-left">
                        <th className="p-4">Item(s) Ordered</th>
                        <th className="p-4 text-center">Item Price</th>
                        <th className="p-4 text-center">Quantity</th>
                        <th className="p-4 text-center">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentSuccessCheckoutData &&
                        paymentSuccessCheckoutData.map((product: IPaymentSuccessCheckoutDataTopLevel) => (
                          <>
                            {product.order_details.map((item: any) => {
                              return (
                                <tr key={item.id} className="border-b">
                                  <td className="px-4 py-4">
                                    <div className="flex items-center space-x-4 hover:opacity-90">
                                      {/* <div className="h-[60px] min-w-[60px] overflow-hidden rounded-[9px]">
                                        <Image
                                          src={
                                            isLoadingInvoice
                                              ? '/assets/default_banner.jpg'
                                              : `${process.env.imageBaseUrl}/${item?.listing.images[0]}`
                                          }
                                          alt="store-image"
                                          className={`${isLoadingImage ? 'blur-sm' : ''} !h-[60px] !w-[60px] rounded-[9px] object-cover`}
                                          onLoadStart={() => {
                                            setIsLoadingImage(true)
                                          }}
                                          onLoad={() => {
                                            setIsLoadingImage(false)
                                          }}
                                          onError={error => {
                                            error.currentTarget.src = '/assets/default_banner.jpg'
                                            setIsLoadingImage(false)
                                          }}
                                          width={60}
                                          height={60}
                                          preview={false}
                                        />
                                      </div> */}
                                      <div>
                                        <h3 className="font-semibold">{item?.listing_name}</h3>
                                        {item?.variant_id && (
                                          <TextComponent as="p" className="text-xs text-gray-500">
                                            Variant: <span className="font-bold">{item?.variant_name}</span>
                                          </TextComponent>
                                        )}
                                        <Tooltip placement="bottom" title="Order number">
                                          <TextComponent as="p" className="text-sm text-gray-500">
                                            {product?.store.name}
                                          </TextComponent>
                                        </Tooltip>
                                        {/* <p className="text-sm text-gray-500">{product?.}</p> */}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <TextComponent
                                      as="p"
                                      className="text-center text-[13px] leading-[16px] text-[#6B7280]"
                                    >
                                      <FormatNumberCurrency value={Number(item?.listing_price)} />
                                    </TextComponent>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex w-full items-center space-x-2 text-center">
                                      {/* <span className="w-8 text-center">{product.quantity}</span> */}
                                      <span className="mx-2 block w-full text-center text-[10px] leading-[12px]">
                                        {item?.quantity}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center justify-between">
                                      <TextComponent
                                        as="p"
                                        className="w-full text-center text-[13px] leading-[16px] text-[#6B7280]"
                                      >
                                        <FormatNumberCurrency
                                          value={Number(item?.listing_price ?? 0) * Number(item?.quantity ?? 0)}
                                        />
                                      </TextComponent>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center space-x-2"></div>
                                  </td>
                                </tr>
                              )
                            })}
                          </>
                        ))}
                    </tbody>
                  </table>
                  {/* total amount */}
                  <div className="mt-6 flex justify-end">
                    <div className="w-80">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2">
                          <TextComponent as="span" className="text-[13px] text-gray-600">
                            Subtotal
                          </TextComponent>
                          <TextComponent as="span" className="text-[13px] font-semibold leading-[16px] text-black">
                            <FormatNumberCurrency value={combinedOrders.subtotal} />
                          </TextComponent>
                        </div>
                        <div className="flex items-center justify-between p-2">
                          <TextComponent as="span" className="text-[13px] text-gray-600">
                            Shipping Cost
                          </TextComponent>
                          <TextComponent as="span" className="text-[14px] font-semibold leading-[16px] text-black">
                            <FormatNumberCurrency value={combinedOrders.shipping_cost} />
                          </TextComponent>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-[#F2F2F2] p-2">
                          <TextComponent as="span" className="text-[15px] font-semibold">
                            Total
                          </TextComponent>
                          <TextComponent as="span" className="text-[15px] font-semibold text-black">
                            <FormatNumberCurrency value={totalAmount} />
                          </TextComponent>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isDesktop && (
                <div className="w-full space-y-4">
                  <h4 className="mb-2 bg-[#F0F1F5] px-[20px] py-4 text-base font-[500] text-[#6B7280]">
                    Items Ordered
                  </h4>
                  {paymentSuccessCheckoutData &&
                    paymentSuccessCheckoutData.map((product: IPaymentSuccessCheckoutDataTopLevel) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4 border-b px-[20px] pb-4 lg:my-0 lg:px-0"
                      >
                        {product.order_details.map((item: any) => {
                          return (
                            <React.Fragment key={item.id}>
                              {/* <div className="h-[60px] min-w-[60px] overflow-hidden rounded-[9px] hover:opacity-90">
                                <Image
                                  src={
                                    isLoadingInvoice
                                      ? '/assets/default_banner.jpg'
                                      : `${process.env.imageBaseUrl}/${item?.listing.images[0]}`
                                  }
                                  alt="store-image"
                                  className={`${isLoadingImage ? 'blur-sm' : ''} !h-[60px] !w-[60px] rounded-[9px] object-cover`}
                                  onLoadStart={() => {
                                    setIsLoadingImage(true)
                                  }}
                                  onLoad={() => {
                                    setIsLoadingImage(false)
                                  }}
                                  onError={error => {
                                    error.currentTarget.src = '/assets/default_banner.jpg'
                                    setIsLoadingImage(false)
                                  }}
                                  width={60}
                                  height={60}
                                />
                              </div> */}
                              <div className="flex-1">
                                <TextComponent as="h3" className="font-semibold">
                                  {item?.listing_name}
                                </TextComponent>
                                {item?.variant_id && (
                                  <TextComponent as="p" className="text-xs text-gray-500">
                                    Variant: {item?.variant_name}
                                  </TextComponent>
                                )}
                                <TextComponent as="p" className="text-sm text-gray-500">
                                  {product?.store.name}
                                </TextComponent>
                                <div className="mt-2 flex items-center justify-between">
                                  <TextComponent as="p" className="font-bold">
                                    <FormatNumberCurrency value={Number(item?.listing_price)} />
                                  </TextComponent>
                                  <span className="mx-2 text-[13px] font-semibold leading-[12px]">
                                    <span className="pr-2 font-medium opacity-75"> Qty:</span> {item?.quantity}
                                  </span>
                                </div>
                              </div>
                            </React.Fragment>
                          )
                        })}
                      </div>
                    ))}
                  {/* total amount */}
                  <div className="mt-6 flex justify-end">
                    <div className="w-full">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2">
                          <TextComponent as="span" className="text-[13px] text-gray-600">
                            Subtotal
                          </TextComponent>
                          <TextComponent as="span" className="text-[13px] font-semibold leading-[16px] text-black">
                            <FormatNumberCurrency value={combinedOrders.subtotal} />
                          </TextComponent>
                        </div>
                        <div className="flex items-center justify-between p-2">
                          <TextComponent as="span" className="text-[13px] text-gray-600">
                            Shipping Cost
                          </TextComponent>
                          <TextComponent as="span" className="text-[14px] font-semibold leading-[16px] text-black">
                            <FormatNumberCurrency value={combinedOrders.shipping_cost} />
                          </TextComponent>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-[#F2F2F2] p-2">
                          <TextComponent as="span" className="text-[15px] font-semibold">
                            Total
                          </TextComponent>
                          <TextComponent as="span" className="text-[15px] font-semibold text-black">
                            <FormatNumberCurrency value={totalAmount} />
                          </TextComponent>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {data !== null && (
            <div className="mt-6 px-4  flex justify-end">
              <CustomButton
                onClick={() => {
                  downloadInvoice()
                }}
                disabled={isLoadingInvoice}
                style={{
                  backgroundColor: '#007AFF',
                  color: 'white',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
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

export const StyledContentWrapper = styled(Content)`
  border-radius: 0.375rem;
  padding: 12px;
  color: #000;
  width: 100%;
  margin: 0 auto;
`

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
InvoiceView.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}
export default InvoiceView
