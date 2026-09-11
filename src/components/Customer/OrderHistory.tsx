import React, {useEffect, useState} from 'react'
import {Button, Image, Rate, Collapse, Tag, Layout} from 'antd'
import {useRouter} from 'next/router'
import {Icon} from '@iconify/react'
import {useMediaQuery} from '@/hooks/use-media-query'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import CustomToast from '../SharedUI/Toast/CustomToast'
import Spinner from '../SharedUI/Spinner'
import DrawerContainer from '../SharedUI/DrawerContainer'
import NavTabs from '../SharedUI/NavTabs'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '../SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import OrderHistoryServices from './OrderHistoryServices'
import {useAddRateMutation, useGetOrderHistoryQuery} from '@/services/rating'

// Ant Design Layout
const {Content} = Layout
const {Panel} = Collapse

type yourDataType = {
  orderId: number
  uid: string
  store_id: number
  type: string
  storeName: string
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  store_shipping_method_id: null
  shipping_cost: string
  subtotal: string
  total_amount: string
  currency: string
  status: string
  paymentStatus: string
  created_at: Date
  updated_at: Date
  user_id: number
  store: any
  items: any[]
}

export const StatusRenderer = ({text}: {text: string}) => {
  return (
    <TextComponent
      as="p"
      className={`rounded-md py-[12px] text-center font-normal capitalize md:ml-0 ${text === 'New' || text === 'incart' || text === 'pending' ? 'bg-[#FFFAEA] text-[#FF9500]' : text === 'shipped' ? 'bg-[#E7F2FF] text-[#044BFD]' : text === 'canceled' ? 'bg-[#FFE1E7] text-[#FF4E4E]' : text === 'delivered' ? 'bg-[#E5FFEC] text-[#129500]' : 'bg-[#E5FFEC] text-[#129500]'}`}
    >
      {text}
    </TextComponent>
  )
}

const OrderHistory: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const router = useRouter()

  // State variables
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [currentOrder, setCurrentOrder] = useState<any>({})
  const [rateModal, setRateModal] = useState(false)
  const [rateNumber, setRateNumber] = useState(0)
  const [receivedModal, setReceivedModal] = useState(false)
  const [activeTab, setActiveTab] = useState(1)

  const [orders, setOrders] = useState<yourDataType[]>([])

  // API Calls
  const {data: orderHistory} = useGetOrderHistoryQuery({})
  const [addRating, {isLoading}] = useAddRateMutation()

  console.log('orderHistory ', orderHistory)

  useEffect(() => {
    if (orderHistory?.data) {
      const transformedData = Object.entries(orderHistory.data).map(([orderId, orderArray]) => {
        return (orderArray as any[]).map(order => ({
          orderId: Number(orderId),
          uid: order.uid,
          store_id: order.store_id,
          type: order.type,
          storeName: order.store.name,
          order_number: order.order_number,
          first_name: order.first_name,
          last_name: order.last_name,
          email: order.email,
          phone: order.phone,
          store_shipping_method_id: order.store_shipping_method_id,
          shipping_cost: order.shipping_cost,
          subtotal: order.subtotal,
          total_amount: order.total_amount,
          currency: order.currency,
          status: order.status,
          paymentStatus: order.payment_status,
          created_at: new Date(order.created_at),
          updated_at: new Date(order.updated_at),
          user_id: order.user_id,
          store: order.store,
          items: order.order_details.map(
            (detail: {id: any; listing_name: any; listing_price: string; listing: {images: any[]}}) => ({
              id: detail.id,
              name: detail.listing_name,
              price: detail.listing_price ? `$${parseFloat(detail.listing_price).toFixed(2)}` : '-',
              image: detail.listing.images
                ? `${process.env.imageBaseUrl}/${detail.listing.images[0]}`
                : '/assets/default_image.png',
              status: order.status.toLowerCase(),
              paymentStatus: order.payment_status,
              date: new Date(order.created_at).toLocaleDateString()
            })
          )
        }))
      })
      setOrders(transformedData.flat() as yourDataType[])
      console.log('Formatted Data ', transformedData)
    }
  }, [orderHistory])

  // // Filters
  // const productOrders = orderHistory?.data?.data?.filter(item => item.order.type === 'product')
  // const serviceOrders = orderHistory?.data?.data?.filter(item => item.order.type === 'service')

  const handleRating = async () => {
    const payload = {
      listing_id: currentOrder?.listing_id,
      store_id: currentOrder?.order?.store_id,
      rating: rateNumber
    }

    try {
      await addRating({body: payload}).unwrap()
      setRateModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast altText="" title={<>Thanks for the rating</>} textColor="#FFF" backgroundColor="#000" />
          )
        },
        message: ''
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

  return (
    <>
      {/* Navigation Tabs */}
      <NavTabs
        backgroundColor="#F1F1F1"
        active={activeTab}
        setActive={setActiveTab}
        naveItems={[
          {id: 1, title: 'Products', link: ''},
          {id: 2, title: 'Services', link: ''}
        ]}
      />

      {/* Content */}
      {isLoading ? (
        <SkeletonLoaderForPage length={2} />
      ) : (
        <>
          {/* {orderHistory?.data?.data && orderHistory.data.data.length > 0 ? ( */}
          {orders.length > 0 ? (
            activeTab === 1 ? (
              <div className="mt-5 w-full">
                {/* Table Header */}
                <div className="grid grid-cols-6 justify-between gap-5 bg-gray-100 p-2 font-medium">
                  <div>Order</div>
                  <div>Price</div>
                  <div>Payment Type</div>
                  <div>Order Status</div>
                  <div>Date</div>
                  <div>Action</div>
                </div>

                {/* Order List */}
                <Collapse accordion defaultActiveKey={['1']} expandIconPosition="end">
                  {orders.map((record, index) => (
                    <Panel
                      key={index}
                      header={
                        <div className="flex justify-between">
                          {/* <span>{record.storeName}</span> */}
                          <span className="text-sm text-black">{record.orderId}</span>
                        </div>
                      }
                    >
                      <div className="flex items-center justify-between">
                        <p>{record.storeName}</p>
                        <Button
                          type="primary"
                          className={`${record.status === 'Delivered' ? 'bg-black' : 'bg-green-600'} text-white`}
                        >
                          {record.status === 'Delivered' ? 'Rate Product' : 'Received'}
                        </Button>
                      </div>
                      {record.items.map(item => (
                        <div
                          key={item.id}
                          className="grid grid-cols-6 items-center gap-4 overflow-x-auto border-b py-4"
                        >
                          {/* Product Image and Name */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                              <Image
                                src={item?.image || '/assets/default_image.png'}
                                alt="product image"
                                preview={false}
                                onError={error => {
                                  error.currentTarget.src = '/assets/default_image.png'
                                  setIsLoadingImage(false)
                                }}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="truncate font-medium text-gray-900">{item?.name}</p>
                              <p className="truncate text-sm text-gray-500">{item?.id}</p>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="whitespace-nowrap font-normal text-gray-700">{item.price}</div>

                          {/* Payment Type */}
                          <div className="whitespace-nowrap font-normal text-gray-700">{item.paymentStatus}</div>

                          {/* Status */}
                          <div>
                            <StatusRenderer text={item.status} />
                          </div>

                          {/* Date */}
                          <div className="whitespace-nowrap text-sm text-gray-600">{item.date}</div>

                          {/* Action Button */}
                          <div>
                            <Button type="primary" className="bg-black text-white">
                              Rate Product
                            </Button>
                          </div>
                        </div>
                      ))}
                    </Panel>
                  ))}
                </Collapse>
              </div>
            ) : (
              <OrderHistoryServices />
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
                Rate {currentOrder?.listing_name}
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
                {currentOrder?.listing_name}
              </TextComponent>
              <TextComponent as="p" className="text-[10px] text-[#6B7280]">
                {currentOrder?.id}
              </TextComponent>
              <Rate
                allowHalf
                defaultValue={currentOrder?.rating}
                className="text-[35px] text-[#FDBF5E]"
                onChange={(value: any) => {
                  setRateNumber(value)
                }}
              />
            </div>

            <Button onClick={handleRating} className="h-[42px] cursor-pointer bg-black text-white">
              {isLoading ? <Spinner /> : 'Submit'}
            </Button>
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
                Rate {currentOrder?.listing_name}
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
                {currentOrder?.listing_name}
              </TextComponent>
              <TextComponent as="p" className="text-[10px] text-[#6B7280]">
                {currentOrder?.id}
              </TextComponent>
              <Rate
                allowHalf
                defaultValue={currentOrder?.rating}
                className="text-[35px] text-[#FDBF5E]"
                onChange={(value: any) => {
                  setRateNumber(value)
                }}
              />
            </div>

            <Button onClick={handleRating} className="h-[42px] cursor-pointer bg-black text-white">
              {isLoading ? <Spinner /> : 'Submit'}
            </Button>
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

            <p className="mx-auto my-4 w-[50%] text-center text-[20px] font-medium">
              I have received this {currentOrder?.listing_name}
            </p>

            <div className="flex justify-between">
              <Button
                onClick={() => setReceivedModal(false)}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg border border-[#000] text-black"
              >
                No, I haven’t
              </Button>

              <Button
                onClick={handleRating}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg bg-black text-white"
              >
                {isLoading ? <Spinner /> : 'Yes, I have'}
              </Button>
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
                onClick={handleRating}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg bg-black text-white"
              >
                {isLoading ? <Spinner /> : 'Yes, I have'}
              </Button>
            </div>
          </div>
        </DrawerContainer>
      )}
    </>
  )
}

export default OrderHistory
