import MayAlsoLikeProduct from '@/components/Auth/Products/components/MayAlsoLikeProducts'
import useVerifyPayment from '@/components/Customer/hooks/useVerifyPayment'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import EmptyClip from '@/components/SharedUI/EmptyClip'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {IPaymentSuccessCheckoutDataTopLevel} from '@/types/shippingResponse'
import {Image, Tooltip} from 'antd'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useLocalStorage} from 'react-use'

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
}

const SuccessCheckoutPage = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const router = useRouter()
  const query = router.query
  const [clipId, setClipId] = useState<any>()
  const {isLoading: isVerifyPaymentLoading, verifyPaymentHandler} = useVerifyPayment()

  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })

  const [clipUuid, setClipUuid] = useState<any>(null)

  const clipProductInfo = data?.data?.products
  const [paymentSuccessCheckoutData, setPaymentSuccessCheckoutData] = useLocalStorage<
    IPaymentSuccessCheckoutDataTopLevel[]
  >('paymentSuccessCheckoutData', [])

  // Get stored weight data from localStorage (saved before payment)
  const getStoredWeightData = () => {
    try {
      const stored = localStorage.getItem('clipWeightData')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error retrieving stored weight data:', error)
      return []
    }
  }

  // Function to merge weight data from stored clips with payment success data
  const getOrderDetailsWithWeight = (orders: IPaymentSuccessCheckoutDataTopLevel[]) => {
    const storedWeightData = getStoredWeightData()

    // If no stored weight data, return orders as is
    if (!storedWeightData || storedWeightData.length === 0) {
      console.log('No stored weight data available - weights may not display correctly')
      return orders
    }

    return orders.map(order => ({
      ...order,
      order_details: order.order_details.map(item => {
        // First check if weight is already in the API response
        if (item?.listing?.weight) {
          return item
        }

        // Find matching item in stored weight data by listing_id (most reliable)
        const weightData = storedWeightData.find((stored: any) => stored.listing_id === item.listing_id)

        if (weightData?.weight) {
          return {
            ...item,
            listing: {
              ...item.listing,
              weight: weightData.weight
            }
          }
        }

        // No weight found
        return item
      })
    }))
  }

  const combinedOrders = Array.isArray(paymentSuccessCheckoutData)
    ? paymentSuccessCheckoutData.reduce(
        (acc: {subtotal: number; shipping_cost: number}, order: IPaymentSuccessCheckoutDataTopLevel) => {
          acc.subtotal += parseFloat(order.subtotal) || 0
          acc.shipping_cost += parseFloat(order.shipping_cost) || 0
          return acc
        },
        {subtotal: 0, shipping_cost: 0}
      )
    : {subtotal: 0, shipping_cost: 0}

  const totalAmount = combinedOrders?.subtotal + combinedOrders?.shipping_cost

  useEffect(() => {
    if (!isAuthenticatedToken) {
      // Check if the user is logged in
      router.push('/')
    }
  }, [isAuthenticatedToken])

  // Clean up stored weight data after payment success data is loaded
  useEffect(() => {
    if (paymentSuccessCheckoutData && paymentSuccessCheckoutData.length > 0) {
      // Optional: Clean up the stored weight data after a delay to ensure it's been used
      const cleanupTimer = setTimeout(() => {
        console.log('Cleaning up stored weight data')
        // We don't remove it immediately to allow for page refreshes
        // localStorage.removeItem('clipWeightData')
      }, 5000)

      return () => clearTimeout(cleanupTimer)
    }
  }, [paymentSuccessCheckoutData])

  useEffect(() => {
    if (query?.reference) {
      try {
        verifyPaymentHandler({
          token: query?.reference ?? '',
          gateway: 'paystack',
          setPaymentSuccessCheckoutData: setPaymentSuccessCheckoutData
        })
      } catch (error) {
        console.error('Payment verification failed:', error)
        // Handle the error gracefully, maybe set some error state
      }
    }
    // if (query?.token) {
    //   try {
    //     verifyPaymentHandler({
    //       token: query?.token ?? '',
    //       gateway: 'paypal',
    //       setPaymentSuccessCheckoutData: setPaymentSuccessCheckoutData
    //     })
    //   } catch (error) {
    //     console.error('Payment verification failed:', error)
    //     // The ORDER_ALREADY_CAPTURED error might occur here
    //   }
    // }
  }, [query])

  return (
    <div className="px-[20px] lg:px-0">
      {isVerifyPaymentLoading ? (
        <SkeletonLoaderForPage />
      ) : (
        <React.Fragment>
          {!Array.isArray(paymentSuccessCheckoutData) || !paymentSuccessCheckoutData.length ? (
            <EmptyClip />
          ) : (
            <div className="flex flex-col justify-between gap-4 md:justify-normal lg:mx-auto lg:w-full lg:max-w-7xl">
              <div className="mx-auto mt-[60px] w-full text-center lg:w-[60%] lg:px-5">
                <h3 className="text-[32px] font-bold leading-[31px] text-[#1D1d1d]">
                  {paymentSuccessCheckoutData[0]?.payment_status === 'pending_payment' ||
                  paymentSuccessCheckoutData[0]?.payment_status === 'pending'
                    ? 'Pending'
                    : paymentSuccessCheckoutData[0]?.payment_status === 'failed_payment'
                      ? 'Failed Payment'
                      : paymentSuccessCheckoutData[0]?.payment_status === 'completed_payment' ||
                          paymentSuccessCheckoutData[0]?.payment_status === 'approved_payment'
                        ? ' Congratulations !!!'
                        : ''}
                </h3>
                <p className="pt-8 text-[16px] leading-[20px] text-[#6B7280]">
                  {paymentSuccessCheckoutData[0]?.payment_status === 'pending_payment' ||
                  paymentSuccessCheckoutData[0]?.payment_status === 'pending' ? (
                    'Your payment is currently pending. Please click the button below for further details.'
                  ) : paymentSuccessCheckoutData[0]?.payment_status === 'failed_payment' ? (
                    'Your payment failed. Please click the button below for further details.'
                  ) : paymentSuccessCheckoutData[0]?.payment_status === 'completed_payment' ||
                    paymentSuccessCheckoutData[0]?.payment_status === 'approved_payment' ? (
                    <span className="">
                      Order was successfully placed. <br />
                      You should receive a confirmation email with your order details shortly.
                    </span>
                  ) : (
                    ''
                  )}
                </p>
              </div>

              <div className="mt-[30px] w-full space-y-4 lg:flex lg:gap-4 lg:px-[10%]">
                {isDesktop && (
                  <div className="container mx-auto py-4">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-[#F1F1F1] py-4 text-left">
                          <th className="p-4">Item(s) Ordered</th>
                          <th className="p-4 text-center">Item Price</th>
                          <th className="p-4 text-center">Quantity</th>
                          <th className="p-4 text-center">Weight</th>
                          <th className="p-4 text-center">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getOrderDetailsWithWeight(paymentSuccessCheckoutData) &&
                          getOrderDetailsWithWeight(paymentSuccessCheckoutData).map(
                            (product: IPaymentSuccessCheckoutDataTopLevel) => (
                              <>
                                {product.order_details.map((item: any) => {
                                  const getImageUrl = () => {
                                    const baseUrl = process.env.imageBaseUrl || ''
                                    try {
                                      if (
                                        item?.variant_id &&
                                        Array.isArray(item?.listing?.variants) &&
                                        item.listing.variants.length > 0
                                      ) {
                                        const variant = item.listing.variants.find((v: any) => v.id === item.variant_id)
                                        if (variant && Array.isArray(variant.images) && variant.images.length > 0) {
                                          return `${baseUrl}/${variant.images[0]}`
                                        }
                                      }
                                      if (item?.listing) {
                                        if (Array.isArray(item.listing.images) && item.listing.images.length > 0) {
                                          return `${baseUrl}/${item.listing.images[0]}`
                                        }
                                        if (item.listing.image && typeof item.listing.image === 'string') {
                                          return `${baseUrl}/${item.listing.image}`
                                        }
                                        if (item.listing.attributes?.image) {
                                          return `${baseUrl}/${item.listing.attributes.image}`
                                        }
                                        if (item.listing.thumbnail) {
                                          return `${baseUrl}/${item.listing.thumbnail}`
                                        }
                                      }
                                      return '/assets/default_banner.jpg'
                                    } catch (error) {
                                      return '/assets/default_banner.jpg'
                                    }
                                  }
                                  return (
                                    <tr key={item.id} className="border-b">
                                      <td className="px-4 py-4">
                                        <div className="flex items-center space-x-4 hover:opacity-90">
                                          <div className="h-[60px] min-w-[60px] overflow-hidden rounded-[9px]">
                                            <Image
                                              src={getImageUrl()}
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
                                          </div>
                                          <div>
                                            <h3 className="font-semibold">{item?.listing_name}</h3>
                                            {item?.variant_id && item?.variant_name && (
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
                                        <TextComponent
                                          as="p"
                                          className="w-full text-center text-[13px] leading-[16px] text-[#6B7280]"
                                        >
                                          {item?.listing?.weight ? `${item.listing.weight}g` : '-'}
                                        </TextComponent>
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
                            )
                          )}
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
                    {paymentSuccessCheckoutData[0]?.payment_status === 'completed_payment' ||
                    paymentSuccessCheckoutData[0]?.payment_status === 'approved_payment' ? (
                      <div className="mx-auto mt-10 flex w-[70%] justify-between">
                        <CustomButton
                          onClick={() => router.push('/')}
                          className="w-fit rounded-[8px] border-2 border-black bg-transparent px-6 py-2 text-center text-base font-semibold text-black"
                        >
                          Continue Shopping
                        </CustomButton>
                        <CustomButton
                          onClick={() => router.push('/clips/receipt')}
                          className="w-fit rounded-[8px] border-2 border-black bg-black px-6 py-2 text-center text-base font-semibold text-white"
                        >
                          View Receipt
                        </CustomButton>
                      </div>
                    ) : (
                      <div className="mx-auto mt-10 flex w-[70%] justify-center">
                        <CustomButton
                          onClick={() => router.push('/customer?tab=transaction-history')}
                          className="w-fit rounded-[8px] border-2 border-black bg-black px-6 py-2 text-center text-base font-semibold text-white"
                        >
                          Transaction History
                        </CustomButton>
                      </div>
                    )}
                  </div>
                )}
                {!isDesktop && (
                  <div className="w-full space-y-4">
                    <h4 className="mb-2 bg-[#F0F1F5] px-[20px] py-4 text-base font-[500] text-[#6B7280]">
                      Items Ordered
                    </h4>
                    {getOrderDetailsWithWeight(paymentSuccessCheckoutData) &&
                      getOrderDetailsWithWeight(paymentSuccessCheckoutData).map(
                        (product: IPaymentSuccessCheckoutDataTopLevel) => (
                          <div
                            key={product.id}
                            className="flex items-center space-x-4 border-b px-[20px] pb-4 lg:my-0 lg:px-0"
                          >
                            {product.order_details.map((item: any) => {
                              console.log('🚀 ~ SuccessCheckoutPage ~ item:', item)

                              // Safely get the image URL
                              const getImageUrl = () => {
                                const baseUrl = process.env.imageBaseUrl || ''

                                try {
                                  // Check if we have a variant_id and variants array
                                  if (
                                    item?.variant_id &&
                                    Array.isArray(item?.listing?.variants) &&
                                    item.listing.variants.length > 0
                                  ) {
                                    const variant = item.listing.variants.find((v: any) => v.id === item.variant_id)
                                    // Check if variant has images array with at least one item
                                    if (variant && Array.isArray(variant.images) && variant.images.length > 0) {
                                      return `${baseUrl}/${variant.images[0]}`
                                    }
                                  }

                                  // Check for listing images
                                  if (item?.listing) {
                                    // Check if images property exists and is an array
                                    if (Array.isArray(item.listing.images) && item.listing.images.length > 0) {
                                      return `${baseUrl}/${item.listing.images[0]}`
                                    }

                                    // Check for image property (singular)
                                    if (item.listing.image && typeof item.listing.image === 'string') {
                                      return `${baseUrl}/${item.listing.image}`
                                    }

                                    // Check in attributes
                                    if (item.listing.attributes?.image) {
                                      return `${baseUrl}/${item.listing.attributes.image}`
                                    }

                                    // Check for thumbnail
                                    if (item.listing.thumbnail) {
                                      return `${baseUrl}/${item.listing.thumbnail}`
                                    }
                                  }

                                  // Final fallback
                                  return '/assets/default_banner.jpg'
                                } catch (error) {
                                  console.error('Error getting image URL for item:', item.id, error)
                                  return '/assets/default_banner.jpg'
                                }
                              }

                              return (
                                <React.Fragment key={item.id}>
                                  <div className="h-[60px] min-w-[60px] overflow-hidden rounded-[9px] hover:opacity-90">
                                    <Image
                                      src={getImageUrl()}
                                      alt={item?.listing_name || 'Product image'}
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
                                      fallback="/assets/default_banner.jpg"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <TextComponent as="h3" className="font-semibold">
                                      {item?.listing_name || 'Unknown Item'}
                                    </TextComponent>
                                    {item?.variant_id && item?.variant_name && (
                                      <TextComponent as="p" className="text-xs text-gray-500">
                                        Variant: {item?.variant_name}
                                      </TextComponent>
                                    )}
                                    <TextComponent as="p" className="text-sm text-gray-500">
                                      {product?.store?.name || 'Store'}
                                    </TextComponent>
                                    <div className="mt-2 flex items-center justify-between">
                                      <TextComponent as="p" className="font-bold">
                                        <FormatNumberCurrency value={Number(item?.listing_price) || 0} />
                                      </TextComponent>
                                      <div className="flex flex-col items-end">
                                        <span className="text-[13px] font-semibold leading-[12px]">
                                          <span className="pr-2 font-medium opacity-75">Qty:</span>{' '}
                                          {item?.quantity || 0}
                                        </span>
                                        <span className="text-[11px] leading-[14px] text-gray-600">
                                          <span className="font-medium">Weight:</span>{' '}
                                          {item?.listing?.weight ? `${item.listing.weight}g` : '-'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </React.Fragment>
                              )
                            })}
                          </div>
                        )
                      )}
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
                    {paymentSuccessCheckoutData[0]?.payment_status === 'completed_payment' ||
                    paymentSuccessCheckoutData[0]?.payment_status === 'approved_payment' ? (
                      <div className="mx-auto flex w-full flex-col justify-between gap-4 pt-10">
                        <CustomButton
                          onClick={() => router.push('/')}
                          className="w-full rounded-[8px] border-2 border-black bg-transparent px-6 py-3 text-center text-base font-semibold text-black"
                        >
                          Continue Shopping
                        </CustomButton>
                        <CustomButton
                          onClick={() => router.push('/clips/receipt')}
                          className="w-full rounded-[8px] border-2 border-black bg-black px-6 py-3 text-center text-base font-semibold text-white"
                        >
                          View Receipt
                        </CustomButton>
                      </div>
                    ) : (
                      <div className="mx-auto flex w-[70%] justify-center pt-10">
                        <CustomButton
                          onClick={() => router.push('/customer?tab=transaction-history')}
                          className="w-fit rounded-[8px] border-2 border-black bg-black px-6 py-2 text-center text-base font-semibold text-white"
                        >
                          Transaction History
                        </CustomButton>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-10">
                <MayAlsoLikeProduct />
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  )
}
SuccessCheckoutPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}
export default SuccessCheckoutPage
