import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useAddRateMutation, useGetOrderHistoryQuery, useReceiveOrderMutation} from '@/services/rating'
import {Icon} from '@iconify/react'
import {Button, Collapse, Image, Rate, Tooltip} from 'antd'
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

// Renamed function to better reflect its purpose and updated logic
const isWithinShippingDuration = (item: any) => {
  console.log('🚀 ~ isWithinShippingDuration ~ item:', item.shipping_method?.duration_number)

  // If shipping duration data is missing, don't use it to restrict the button
  if (!item.shipping_method?.duration_number || !item.shipping_method?.duration_type) {
    return true // Allow the action if only status is shipped
  }

  if (!item.shipped_at) {
    return false
  }

  const shippedDate = new Date(item.shipped_at)
  const currentDate = new Date()
  const durationNumber = item.shipping_method.duration_number
  const durationType = item.shipping_method.duration_type

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
    default:
      return false
  }

  // Return true if current date is before deadline (still within shipping period)
  return currentDate < deadlineDate
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

const OrderHistory: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)

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
    refetch
  } = useGetOrderHistoryQuery({
    currency: selectedLanguage.value
  })
  const [addRating, {isLoading}] = useAddRateMutation()
  const [receiveOrder, {isLoading: receiving}] = useReceiveOrderMutation()

  // console.log('orderHistory ', orderHistory)


  useEffect(() => {
    if (orderHistory?.data) {
      const groupedOrders = Object.entries(orderHistory.data)
        .filter(([_, orderArray]) => {
          const orders = orderArray as any[]
          return orders.some(
            order => order.payment_status === 'completed_payment' || order.payment_status === 'approved_payment'
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
            storeName: items[0]?.storeName || 'Unknown Store',
            totalAmount: items.reduce((sum, item) => sum + parseFloat(item.total_amount || '0'), 0).toFixed(2),
            status: items[0]?.status || 'unknown',
            created_at: items[0]?.created_at || new Date()
          }
        })

      setOrders(
        groupedOrders.map(order => ({
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
  }, [orderHistory])

  console.log('orders ', orders)

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
                        </div>
                      }
                    >
                      {record.items.map((item, idx) => {
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between bg-[#F6F6F6] px-3 pt-2">
                              <p>{item.storeName}</p>
                              <CustomButton
                                disabled={
                                  item.status !== 'shipped' ||
                                  ((item as any).shipping_method?.duration_number &&
                                    (item as any).shipping_method?.duration_type &&
                                    !isWithinShippingDuration(item))
                                }
                                type="button"
                                className="flex !h-[37px] !w-[110px] items-center justify-center bg-green-600 font-[500] text-white disabled:bg-[#12950061] disabled:text-white"
                                onClick={() => {
                                  if (
                                    item.status !== 'shipped' ||
                                    ((item as any).shipping_method?.duration_number &&
                                      (item as any).shipping_method?.duration_type &&
                                      !isWithinShippingDuration(item))
                                  ) {
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
                                    {subItem.price !== '-' && <></>}
                                    <FormatNumberCurrency value={+subItem.price} />
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
