import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useAddRateMutation, useGetOrderHistoryQuery, useReceiveOrderMutation} from '@/services/rating'
import {Icon} from '@iconify/react'
import {Button, Collapse, Image, Rate, Tooltip} from 'antd'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
import DrawerContainer from '../SharedUI/DrawerContainer'
import ImageComponent from '../SharedUI/Image/ImageComponent'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '../SharedUI/ModalComponent'
import NavTabs from '../SharedUI/NavTabs'
import Spinner from '../SharedUI/Spinner'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import OrderHistoryServices from './OrderHistoryServices'
import useVerifyPayment from './hooks/useVerifyPayment'

// Ant Design Layout
const {Panel} = Collapse

interface Order {
  uid: number
  store_id: {
    id: number
    name: string
    user: null | any // Adjust `any` if user has a defined structure
  }
  type: string
  order_number: string
  created_at: string // Use `Date` if you parse it as a Date object
  totalAmount: string
  status: string
  items: OrderItem[]
}

interface OrderItem {
  id: number
  storeName: string
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  shipping_cost?: string // Optional
  subtotal?: string // Optional
  total_amount?: string // Optional
  currency?: string | null // Nullable
  status: string
  paymentStatus?: string | null // Nullable
  created_at: string
  updated_at: string
  store?: {
    id: number
    name: string
    user?: any
  }
  items: ItemDetails[]
}

interface ItemDetails {
  id: number
  name: string
  price: string
  image: string
  status: string
  paymentStatus: null | string
  date: string
  storeId: number
  listingId: number
  userRated: any
}

// Check if button should be disabled based on shipping status
const isWithinShippingDuration = (item: any) => {
  // If not shipped, disable the button
  if (item.status !== 'shipped') {
    return true // Disable button
  }

  // If no shipping info, we can't check duration, so enable the button
  if (!item?.shipped_at || !item?.shipping_method?.duration_number || !item?.shipping_method?.duration_type) {
    console.log('Missing shipping info, allowing order reception')
    return false // Enable button
  }

  // Parse the shipped_at timestamp - ensure proper date parsing
  const shippedDate = new Date(item.shipped_at.replace(' ', 'T') + 'Z')
  const currentDate = new Date()
  const durationNumber = parseInt(item.shipping_method.duration_number)
  const durationType = item.shipping_method.duration_type

  let deadlineDate = new Date(shippedDate)

  switch (durationType) {
    case 'minute':
      deadlineDate.setMinutes(shippedDate.getMinutes() + durationNumber)
      break
    case 'hour':
      deadlineDate.setHours(shippedDate.getHours() + durationNumber)
      break
    case 'day':
      deadlineDate.setDate(shippedDate.getDate() + durationNumber)
      break
    case 'week':
      deadlineDate.setDate(shippedDate.getDate() + durationNumber * 7)
      break
    default:
      return false // Enable button
  }

  // Calculate remaining time in milliseconds for better debugging
  const remainingTime = deadlineDate.getTime() - currentDate.getTime()
  const remainingMinutes = Math.floor(remainingTime / (1000 * 60))
  const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000)
  const inProgress = deadlineDate.getTime() > currentDate.getTime()

  console.log('Shipping duration details for OrderHistory:', {
    shipped: shippedDate.toISOString(),
    current: currentDate.toISOString(),
    deadline: deadlineDate.toISOString(),
    duration: `${durationNumber} ${durationType}(s)`,
    remainingTime: `${remainingMinutes} minutes and ${remainingSeconds} seconds`,
    inProgress: inProgress
  })

  // UPDATED LOGIC:
  // If shipping period is still in progress (inProgress is true), enable the button
  // If shipping period is over (inProgress is false), disable the button
  return !inProgress // False = enable button, True = disable button
}

export const StatusRenderer = ({text}: {text: string}) => {
  return (
    <TextComponent
      as="p"
      className={`min-w-[80px] rounded-md py-[8px] text-center font-[500] capitalize md:ml-0 lg:py-[12px] ${text === 'New' || text === 'incart' || text === 'pending' ? 'bg-[#FFFAEA] text-[#FF9500]' : text === 'shipped' ? 'bg-[#E7F2FF] text-[#044BFD]' : text === 'canceled' ? 'bg-[#FFE1E7] text-[#FF4E4E]' : text === 'delivered' ? 'bg-[#E5FFEC] text-[#129500]' : 'bg-[#E5FFEC] text-[#129500]'}`}
    >
      {text}
    </TextComponent>
  )
}
const statusPaymentFilterList = [
  {id: 1, name: 'All'},
  {id: 3, name: 'Paid'},
  {id: 2, name: 'Pending'}
]

const OrderHistory: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const router = useRouter()
  const query = router.query
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [activePaymentFilterStatus, setActivePaymentFilterStatus] = useState<number>(statusPaymentFilterList[0].id)

  useEffect(() => {
    // Check if we're on the order-history tab based on query parameter
    const isOrderHistoryTab = router.query.tab === 'order-history'

    const {filterStatus} = router.query
    if (filterStatus && isOrderHistoryTab) {
      const fs = Array.isArray(filterStatus) ? filterStatus[0] : filterStatus
      const num = parseInt(fs as string, 10)
      if (!isNaN(num)) setActivePaymentFilterStatus(num)
    } else if (!isOrderHistoryTab) {
      // Reset to default filter when not on order history tab
      setActivePaymentFilterStatus(statusPaymentFilterList[0].id)
    }
  }, [router.query.filterStatus, router.pathname, router.query.tab])

  console.log('🚀 ~ activePaymentFilterStatus:', activePaymentFilterStatus)
  // State variables
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [currentOrder, setCurrentOrder] = useState<any>({})
  const [rateModal, setRateModal] = useState(false)
  const [rateNumber, setRateNumber] = useState(0)
  const [receivedModal, setReceivedModal] = useState(false)
  const [activeTab, setActiveTab] = useState(1)

  const [orders, setOrders] = useState<Order[]>([])
  const [servicesOrder, setServices] = useState<Order[]>([])

  // API Calls
  const {
    data: orderHistory,
    isLoading: listingData,
    isFetching: isFetchingOrderHistory,
    refetch
  } = useGetOrderHistoryQuery({
    currency: selectedLanguage.value
  })
  const [addRating, {isLoading}] = useAddRateMutation()
  const [receiveOrder, {isLoading: receiving}] = useReceiveOrderMutation()
  const {isLoading: isVerifyPaymentLoading, verifyPaymentHandler, isSuccess} = useVerifyPayment()
  // console.log('orderHistory ', orderHistory)

  useEffect(() => {
    if (orderHistory?.data) {
      const groupedOrders = Object.entries(orderHistory.data)
        .filter(([_, orderArray]) => {
          const ordersList = orderArray as any[]
          // show all when status=1, otherwise apply specific filters
          if (activePaymentFilterStatus === 1) {
            return true
          }
          return ordersList.some(order =>
            activePaymentFilterStatus === 2
              ? order.payment_status === 'pending_payment' || order.payment_status === 'pending'
              : order.payment_status === 'completed_payment' || order.payment_status === 'approved_payment'
          )
        })
        .map(([orderId, orderArray]) => {
          const items = (orderArray as any[]).map(order => ({
            id: order.id,
            storeName: order.store?.name || 'Unknown Store',
            order_number: order.order_number,
            first_name: order.first_name,
            last_name: order.last_name,
            email: order.email,
            phone: order.phone,
            shipping_cost: order.shipping_cost || '0',
            subtotal: order.subtotal || '0',
            total_amount: order.total_amount || '0',
            currency: order.currency || null,
            status: order.status?.toLowerCase() || 'unknown',
            paymentStatus: order.payment_status || null,
            created_at: new Date(order.created_at).toISOString(),
            shipped_at: order.shipped_at ? order.shipped_at : null,
            shipping_method: order.shipping_method || null,
            updated_at: new Date(order.updated_at).toISOString(),
            store: order.store || null,
            items: order.order_details.map((detail: any) => {
              let imageUrl = '/assets/default_image.png'

              // If there's a listing with images
              if (detail?.listing?.images?.length) {
                // First check if there's a variant
                if (detail.variant_id && detail.listing.variants) {
                  // Find the variant
                  const variant = detail.listing.variants.find((v: any) => v.id === detail.variant_id)
                  if (variant?.images?.length) {
                    // Use the variant image
                    imageUrl = `${process.env.imageBaseUrl}/${variant.images[0]}`
                  } else {
                    // Fall back to listing image
                    imageUrl = `${process.env.imageBaseUrl}/${detail.listing.images[0]}`
                  }
                } else {
                  // No variant, use listing image
                  imageUrl = `${process.env.imageBaseUrl}/${detail.listing.images[0]}`
                }
              }

              return {
                id: detail.id,
                name: detail.listing_name,
                price: detail.listing_price ? `${parseFloat(detail.listing_price).toFixed(2)}` : '-',
                total_price: detail.total_price ? `${parseFloat(detail.total_price).toFixed(2)}` : '-',
                image: imageUrl,
                status: order.status?.toLowerCase(),
                paymentStatus: order.payment_status,
                date: new Date(order.created_at).toLocaleDateString(),
                shipped_at: order.shipped_at ? order.shipped_at : null,
                shipping_method: order.shipping_method || null,
                storeId: order.store_id,
                listingId: detail.listing_id,
                variantId: detail.variant_id,
                variantName: detail.variant_name,
                userRated: detail.user_rating.find(
                  (rating: any) => rating.user_id === order.user_id && rating.listing_id === detail.listing_id
                )
              }
            })
          }))

          return {
            orderId,
            items,
            id: items[0]?.id || '',
            storeName: items[0]?.storeName || 'Unknown Store',
            totalAmount: items.reduce((sum, item) => sum + parseFloat(item.total_amount || '0'), 0).toFixed(2),
            status: items[0]?.status || 'unknown',
            created_at: items[0]?.created_at || new Date()
          }
        })

      setOrders(
        groupedOrders.map(order => ({
          id: order.id,
          uid: order.items[0]?.id || '',
          store_id: order.items[0]?.store?.id || '',
          type: 'product', // or determine based on your logic
          order_number: order.orderId,
          created_at: '',
          shipped_at: (order as any).shipped_at ? (order as any).shipped_at : null,
          shipping_method: (order as any).shipping_method || null,
          totalAmount: order.totalAmount,
          status: order.status,
          items: order.items
        }))
      )
    }
  }, [orderHistory, activePaymentFilterStatus])

  // Add this new useEffect to clean up URL when tab changes
  useEffect(() => {
    // Check if we have a tab parameter and it's not "order-history"
    if (router.query.tab !== undefined && router.query.tab !== 'order-history') {
      // If we have filterStatus or filterName in URL, remove them
      if (router.query.filterStatus || router.query.filterName) {
        const newQuery = {...router.query}
        delete newQuery.filterStatus
        delete newQuery.filterName

        // Update URL without adding to browser history
        router.replace(
          {
            pathname: router.pathname,
            query: newQuery
          },
          undefined,
          {shallow: true}
        )
      }
    }
  }, [router.query.tab])

  useEffect(() => {
    if (query?.token && process.env.NEXT_PUBLIC_BASEURL_STAGING_ENV === 'staging') {
      try {
        verifyPaymentHandler({
          token: query?.token ?? '',
          gateway: 'paypal'
          // setPaymentSuccessCheckoutData: setPaymentSuccessCheckoutData
        })
      } catch (error) {
        console.error('Payment verification failed:', error)
        // The ORDER_ALREADY_CAPTURED error might occur here
      }
    }
  }, [query])
  // console.log('orders ', orders)
  useEffect(() => {
    const isOrderHistoryTab = router.query.tab === 'order-history'
    if (activePaymentFilterStatus && isOrderHistoryTab) {
      refetch()
    }
  }, [activePaymentFilterStatus, router.pathname, router.query.tab])

  const handleReceiveOrder = async () => {
    // console.log('sss ', currentOrder.id)
    try {
      await receiveOrder({orderId: currentOrder.id}).unwrap()
      setReceivedModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast altText="" title={<>Thanks for your patronage</>} textColor="#FFF" backgroundColor="#000" />
          )
        },
        message: ''
      })
      refetch()
    } catch (err) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>{(err as any)?.data?.message}</>}
              textColor="#FFF"
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  const handleRating = async () => {
    const payload = {
      listing_id: currentOrder?.listingId,
      store_id: currentOrder?.storeId,
      rating: rateNumber
    }

    // console.log('payload ', payload)
    // console.log('payload ', currentOrder)

    try {
      await addRating({body: payload}).unwrap()
      setRateModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Thanks for the rating</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (err) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>{(err as any)?.data?.message}</>}
              textColor="#FFF"
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  // Add a new function to handle clicks on disabled buttons
  const handleDisabledButtonClick = (item: any) => {
    let message = ''

    if (item.status !== 'shipped') {
      message = "This order hasn't been shipped yet."
    } else if (
      item.shipping_method?.duration_number &&
      item.shipping_method?.duration_type &&
      !isWithinShippingDuration(item)
    ) {
      // Only calculate expired period if duration data exists
      const shippedDate = new Date(item.shipped_at)
      const durationType = item.shipping_method?.duration_type
      const durationNumber = item.shipping_method?.duration_number

      let deadlineDate = new Date(shippedDate)
      switch (durationType) {
        case 'minute':
          deadlineDate.setMinutes(deadlineDate.getMinutes() + durationNumber)
          break
        case 'hour':
          deadlineDate.setHours(deadlineDate.getHours() + durationNumber)
          break
        case 'day':
          deadlineDate.setDate(deadlineDate.getDate() + durationNumber)
          break
        case 'week':
          deadlineDate.setDate(deadlineDate.getDate() + durationNumber * 7)
          break
      }

      message = `The ${durationNumber} ${durationType}${durationNumber > 1 ? 's' : ''} shipping period has expired on ${deadlineDate.toLocaleDateString()} at ${deadlineDate.toLocaleTimeString()}.`
    }

    if (message) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Button Disabled</>}
              textColor="#FFF"
              message={message}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  return (
    <>
      {/* Navigation Tabs */}
      <div className="hidden">
        <NavTabs
          backgroundColor="#F1F1F1"
          active={activeTab}
          setActive={setActiveTab}
          naveItems={[
            {id: 1, title: 'Products', link: ''},
            {id: 2, title: 'Services', link: ''}
          ]}
        />
      </div>

      {/* Content */}
      {listingData ? (
        <SkeletonLoaderForPage length={2} />
      ) : (
        <>
          <div className="flex gap-4">
            {statusPaymentFilterList.map(item => (
              <div
                key={item.id}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 py-2 text-center text-[14px] text-sm font-[500] ${
                  activePaymentFilterStatus === item.id ? 'bg-black text-white' : 'bg-gray-200 text-[#000]'
                }`}
                onClick={() => {
                  setActivePaymentFilterStatus(item.id)

                  // Check if we're on the order-history tab
                  const isOrderHistoryTab = router.query.tab === 'order-history'

                  // Only update query params if we're on the order-history tab
                  if (isOrderHistoryTab) {
                    router.push(
                      {
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          filterStatus: item.id,
                          filterName: item.name
                        }
                      },
                      undefined,
                      {shallow: true}
                    )
                  }
                }}
              >
                <p>{item.name}</p>
              </div>
            ))}
          </div>
          {orders.length > 0 ? (
            activeTab === 1 ? (
              <div className="mt-5 w-full">
                {/* Table Header */}
                <div className="grid grid-cols-3 justify-between gap-5 gap-y-1 bg-gray-100 p-2 font-medium md:grid-cols-7">
                  <div className="md:col-span-2">Order</div>
                  <div>Price</div>
                  <div>Payment Status</div>
                  <div>Order Status</div>
                  <div>Date</div>
                  <div>Action</div>
                </div>

                {/* Order List */}
                <Collapse
                  defaultActiveKey={orders.map(panel => panel.order_number)}
                  expandIconPosition="end"
                  className="bg-white"
                >
                  {orders.map((record, index) => (
                    <Panel
                      key={record.order_number}
                      header={
                        <div className="flex justify-between">
                          <span className="text-sm text-black">{record.order_number}</span>
                          {/* show View Receipt only if the first item's paymentStatus is paid */}
                          {(record.items[0]?.paymentStatus === 'completed_payment' ||
                            record.items[0]?.paymentStatus === 'approved_payment') && (
                            <Link
                              className="text-sm font-[500] underline"
                              href={`/clips/receipt?order_id=${(record as any)?.id}`}
                            >
                              View Receipt
                            </Link>
                          )}
                        </div>
                      }
                    >
                      {record.items.map((item, idx) => {
                        console.log('🚀 ~ {record.items.map ~ item:', item)
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between bg-[#F6F6F6] px-3 pt-2">
                              <p>{item.storeName}</p>
                              <CustomButton
                                disabled={isWithinShippingDuration(item)}
                                type="button"
                                className="flex !h-[37px] !w-[110px] items-center justify-center bg-green-600 font-[500] text-white disabled:bg-[#12950061] disabled:text-white"
                                onClick={() => {
                                  if (isWithinShippingDuration(item)) {
                                    handleDisabledButtonClick(item)
                                    return
                                  }
                                  setCurrentOrder(item)
                                  setReceivedModal(true)
                                }}
                              >
                                Received
                              </CustomButton>
                            </div>

                            {item.items.map(subItem => {
                              console.log('item.items', item.items)
                              return (
                                <div
                                  key={subItem.id}
                                  className="grid grid-cols-2 flex-nowrap items-center gap-4 overflow-x-auto border-b bg-[#F6F6F6] py-4 pl-3 md:grid-cols-7"
                                >
                                  <div className="col-span-2 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                                      <ImageComponent
                                        src={subItem?.image || '/assets/default_image.png'}
                                        alt="product image"
                                        isLoadingImage={isLoadingImage}
                                        setIsLoadingImage={setIsLoadingImage}
                                        aspectRatio="1/1"
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="flex cursor-pointer flex-col truncate font-medium text-gray-900">
                                        <Tooltip placement="topLeft" color="#000" title={subItem?.name}>
                                          {subItem?.name && subItem.name.length > 20
                                            ? `${subItem.name.slice(0, 20)}...`
                                            : subItem?.name}
                                        </Tooltip>
                                        {(subItem as any)?.variantName && (
                                          <span className="relative bottom-0.5 text-xs font-normal text-gray-600">
                                            Variant -{' '}
                                            <Tooltip
                                              placement="topLeft"
                                              color="#000"
                                              title={(subItem as any).variantName}
                                            >
                                              <span className="font-bold">
                                                {(subItem as any)?.variantName &&
                                                (subItem as any)?.variantName.length > 20
                                                  ? `${(subItem as any)?.variantName.slice(0, 20)}...`
                                                  : (subItem as any)?.variantName}
                                              </span>
                                            </Tooltip>
                                          </span>
                                        )}
                                      </p>
                                      <p className="truncate text-sm text-gray-500">{subItem?.id}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center whitespace-nowrap font-normal text-gray-700">
                                    {(subItem as any).total_price !== '-' && <></>}
                                    <FormatNumberCurrency value={+(subItem as any).total_price} />
                                  </div>

                                  <div className="whitespace-nowrap font-normal text-gray-700">
                                    {subItem.paymentStatus === 'completed_payment' ||
                                    subItem.paymentStatus === 'approved_payment'
                                      ? 'Paid'
                                      : subItem.paymentStatus === 'pending_payment' ||
                                          subItem.paymentStatus === 'pending'
                                        ? 'Pending'
                                        : 'Failed'}
                                  </div>

                                  <div>
                                    <StatusRenderer text={subItem.status} />
                                  </div>

                                  <div className="whitespace-nowrap text-sm text-gray-600">{subItem.date}</div>

                                  <div>
                                    <Button
                                      disabled={item.status !== 'delivered' || subItem.userRated}
                                      onClick={() => {
                                        setCurrentOrder(subItem)
                                        setRateModal(true)
                                      }}
                                      type="primary"
                                      className="bg-black text-white"
                                    >
                                      Rate Product
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </Panel>
                  ))}
                </Collapse>
              </div>
            ) : (
              <OrderHistoryServices servicesOrder={servicesOrder} />
            )
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <Image src="/assets/new-empty-state.svg" alt="empty" width={157} height={157} />
              <TextComponent as="p" className="text-[14px] leading-[18px] text-[#6B7280]">
                Nothing to see here
              </TextComponent>
            </div>
          )}
        </>
      )}

      {isDesktop && rateModal && (
        <PlannerModal
          modalOpen={rateModal}
          setModalOpen={setRateModal}
          maskCloseable={true}
          onCloseModal={() => {
            setRateModal(false)
          }}
          width={400}
        >
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setRateModal(false)}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <TextComponent as="h2" className="mb-3 text-[20px] font-medium">
                Rate {currentOrder?.name}
              </TextComponent>
              <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                <Image
                  src={currentOrder.image || '/assets/default_banner.jpg'}
                  alt="product image"
                  preview={false}
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                    setIsLoadingImage(false)
                  }}
                />
              </div>
              <TextComponent as="p" className="text-[14px] capitalize text-[#000]">
                {currentOrder?.name}
              </TextComponent>
              <TextComponent as="p" className="text-[10px] text-[#6B7280]">
                Product ID: {currentOrder?.id}
              </TextComponent>
              <Rate
                // allowHalf
                defaultValue={currentOrder?.rating}
                className="text-[35px] text-[#FDBF5E]"
                onChange={(value: any) => {
                  setRateNumber(value)
                }}
              />
            </div>

            <CustomButton onClick={handleRating} type="button" className="h-[42px] cursor-pointer bg-black text-white">
              {isLoading ? <Spinner /> : 'Submit'}
            </CustomButton>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && rateModal && (
        <DrawerContainer open={rateModal} onClose={() => setRateModal(false)} height={300}>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setRateModal(false)}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <TextComponent as="h2" className="mb-3 text-[20px] font-medium">
                Rate {currentOrder?.name}
              </TextComponent>
              <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                <Image
                  src={currentOrder.image || '/assets/default_banner.jpg'}
                  alt="product image"
                  preview={false}
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                    setIsLoadingImage(false)
                  }}
                />
              </div>
              <TextComponent as="p" className="text-[14px] capitalize text-[#000]">
                {currentOrder?.name}
              </TextComponent>
              <TextComponent as="p" className="text-[10px] text-[#6B7280]">
                Product ID: {currentOrder?.id}
              </TextComponent>
              <Rate
                defaultValue={currentOrder?.rating}
                className="text-[35px] text-[#FDBF5E]"
                onChange={(value: any) => {
                  setRateNumber(value)
                }}
              />
            </div>

            <CustomButton onClick={handleRating} type="button" className="h-[42px] cursor-pointer bg-black text-white">
              {isLoading ? <Spinner /> : 'Submit'}
            </CustomButton>
          </div>
        </DrawerContainer>
      )}

      {/* Received Modal */}
      {isDesktop && receivedModal && (
        <PlannerModal
          modalOpen={receivedModal}
          setModalOpen={setReceivedModal}
          maskCloseable={true}
          onCloseModal={() => {
            setReceivedModal(false)
          }}
          width={400}
        >
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setReceivedModal(false)}
              />
            </div>

            <p className="mx-auto my-4 w-[50%] text-center text-[20px] font-medium">I have received this order</p>

            <div className="flex justify-between">
              <CustomButton
                onClick={() => setReceivedModal(false)}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg border border-[#000] bg-white text-black"
              >
                No, I haven’t
              </CustomButton>

              <CustomButton
                disabled={receiving}
                onClick={handleReceiveOrder}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg bg-black text-white"
              >
                {receiving ? <Spinner /> : 'Yes, I have'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && receivedModal && (
        <DrawerContainer open={receivedModal} onClose={() => setReceivedModal(false)} height={300}>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setReceivedModal(false)}
              />
            </div>
            <p className="mx-auto my-4 w-[50%] text-center text-[20px] font-medium">
              I have received this [product name]
            </p>

            <div className="flex justify-between">
              <Button
                onClick={() => setReceivedModal(false)}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg border border-[#000] text-black"
              >
                No, I haven’t
              </Button>

              <Button
                onClick={handleReceiveOrder}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg bg-black text-white"
              >
                {receiving ? <Spinner /> : 'Yes, I have'}
              </Button>
            </div>
          </div>
        </DrawerContainer>
      )}
    </>
  )
}

export default OrderHistory
