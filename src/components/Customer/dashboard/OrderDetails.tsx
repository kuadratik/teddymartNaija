import TextComponent from '@/components/SharedUI/TextComponent'
import {Image} from 'antd'
import React, {useState} from 'react'
import {StatusRenderer} from './OrderHistory'
import {Icon} from '@iconify/react'

const OrderDetails = () => {
  const [activeTab, setActiveTab] = useState('order-history')
  const orderStatuses = [
    {
      status: 'Order Placed',
      date: 'Wed, 15 Dec 2024',
      description: 'An order has been placed.',
      timestamp: 'Wed, 15 Dec 2021 - 05:34PM',
      completed: true
    },
    {
      status: 'Shipped',
      date: 'Thur, 16 Dec 2024',
      description: 'Your item has been shipped.',
      timestamp: 'Sat, 18 Dec 2021 - 4:54PM',
      completed: true
    },
    {
      status: 'Out For Delivery',
      date: 'Thur, 16 Dec 2024',
      description: 'Your item is out for delivery.',
      timestamp: 'Sat, 18 Dec 2021 - 4:54PM',
      completed: true
    },
    {
      status: 'Delivered',
      date: 'Thur, 16 Dec 2024',
      description: 'Your item has been delivered.',
      timestamp: 'Sat, 18 Dec 2021 - 4:54PM',
      completed: false
    }
  ]
  return (
    <div>
      <div className="flex h-[137px] items-center border-b border-b-[#EAECEF]">
        <div className="flex items-center gap-[13px]">
          <div className="h-[100px] w-[100px] overflow-hidden rounded-[9px]">
            <Image
              src={'/assets/shirt_1.png'}
              alt="product image"
              preview={false}
              // onLoadStart={() => {
              //   setIsLoadingImage(true)
              // }}
              // onLoad={() => {
              //   setIsLoadingImage(false)
              // }}
              onError={error => {
                error.currentTarget.src = '/assets/default_banner.jpg'
                //   setIsLoadingImage(false)
              }}
              // className={`${isLoadingImage ? 'blur-sm' : ''}`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <StatusRenderer text="New" />

            <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#6b7280]">
              {`Order ID: 123456`}
            </TextComponent>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mx-auto mb-6">
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
            <div>
              <h3 className="text-[13px] font-normal leading-[16px] text-gray-500">Item</h3>
              <p className="mt-1 text-[13px] font-semibold leading-[16px]">Ribbed modal T-shirt</p>
            </div>
            <div>
              <h3 className="text-[13px] font-normal leading-[16px] text-gray-500">Logistics</h3>
              <p className="mt-1 text-[13px] font-semibold leading-[16px]">ABC Transport</p>
            </div>
            <div>
              <h3 className="text-[13px] font-normal leading-[16px] text-gray-500">Address</h3>
              <p className="mt-1 text-[13px] font-semibold leading-[16px]">1234 Fashion Street, Suite 567, New York</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['Order History', 'Item Details', 'Receiver'].map(tab => (
                <button
                  key={tab.toLowerCase().replace(' ', '-')}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  className={`${
                    activeTab === tab.toLowerCase().replace(' ', '-')
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 px-1 py-4 text-[13px] font-medium leading-[16px]`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4">
            {activeTab === 'order-history' && (
              <div className="bg-white">
                <div className="">
                  <TextComponent
                    as="h2"
                    className="mb-[31px] border-b border-gray-200 p-6 text-[16px] font-semibold leading-[20px]"
                  >
                    Order Status
                  </TextComponent>
                  <div className="relative space-y-8 px-6">
                    {orderStatuses.map((status, index) => (
                      <div key={status.status} className="flex items-start">
                        <div className="relative">
                          <div
                            className={`h-5 w-5 rounded-full ${
                              status.completed ? 'bg-black' : 'bg-[#E7E7E7]'
                            } relative z-10 flex items-center justify-center`}
                          >
                            {index === 0 && (
                              <Icon icon="solar:cart-bold-duotone" className={`h-[10px] w-[10px] text-white`} />
                            )}

                            {index === 1 && (
                              <Icon
                                icon="material-symbols-light:package-2-sharp"
                                className={`h-[10px] w-[10px] ${status.completed ? 'text-white' : ''}`}
                              />
                            )}

                            {index === 2 && <Icon icon="flat-color-icons:shipped" className={`h-[10px] w-[10px]`} />}

                            {index === 3 && (
                              <Icon
                                icon="hugeicons:package-delivered"
                                className={`h-[10px] w-[10px] ${status.completed ? 'text-white' : ''}`}
                              />
                            )}
                          </div>
                          {index < orderStatuses.length - 1 && (
                            <div className="absolute left-1/2 top-4 z-0 h-20 w-px -translate-x-1/2 transform border-l-2 border-dashed bg-gray-300"></div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col gap-3">
                          <TextComponent as="h4" className="text-[14px] font-semibold leading-[16px] text-[#6B7280]">
                            {status.status} - {status.date}
                          </TextComponent>
                          <TextComponent as="p" className="text-[12px] leading-[14px] text-[#6B7280]">
                            {status.description}
                          </TextComponent>
                          <TextComponent as="p" className="text-[12px] leading-[14px] text-[#6B7280]">
                            {status.timestamp}
                          </TextComponent>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'item-details' && (
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Item Details</h2>
                  <p>Ribbed modal T-shirt</p>
                  <p>Color: Black</p>
                  <p>Size: Medium</p>
                  <p>Quantity: 1</p>
                  <p>Price: $29.99</p>
                </div>
              </div>
            )}
            {activeTab === 'receiver' && (
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Receiver Information</h2>
                  <p>Name: John Doe</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Email: john.doe@example.com</p>
                  <p>Address: 1234 Fashion Street, Suite 567, New York, NY 10001</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
