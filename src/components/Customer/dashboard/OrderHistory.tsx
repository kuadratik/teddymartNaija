import TextComponent from '@/components/SharedUI/TextComponent'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'
import {Image, Rate} from 'antd'

import {Layout, Space, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import Badge from '@/components/SharedUI/Badge'
import {Status} from '@/types/types'
import {StyledTable} from '@/components/Vendor/components/Order/OrderDetailsTable'
import {updateRouteParams} from '@/utils/fx'
import {useRouter} from 'next/router'

const {Content} = Layout

const RecentOrders = [
  {
    review: 'Nemo enim ipsam voluptatem, qui in ea voluptate veting ',
    customer: 'Branded T-Shirts',
    id: 474890,
    image: '/assets/shirt_1.png',
    rating: 5,
    time: '3 hours ago',
    type: 'Paid',
    status: 'New',
    price: 29,
    date: '09/30/2024 14:16'
  },
  {
    review: 'Nemo enim ipsam voluptatem, qui in ea voluptate veting ',
    customer: 'Branded T-Shirts',
    id: 474890,
    image: '/assets/shirt_2.png',
    rating: 5,
    time: '3 hours ago',
    type: 'Paid',
    status: 'Shipped',
    price: 29,
    date: '09/30/2024 14:16'
  },
  {
    review: 'Nemo enim ipsam voluptatem, qui in ea voluptate veting ',
    customer: 'Branded T-Shirts',
    id: 474890,
    image: '/assets/shirt_3.png',
    rating: 5,
    time: '3 hours ago',
    type: 'Paid',
    status: 'Canceled',
    price: 29,
    date: '09/30/2024 14:16'
  },
  {
    review: 'Nemo enim ipsam voluptatem, qui in ea voluptate veting ',
    customer: 'Marco Padberg',
    id: 474890,
    image: '/assets/shirt_1.png',
    rating: 5,
    time: '3 hours ago',
    type: 'Paid',
    status: 'Delivered',
    price: 29,
    date: '09/30/2024 14:16'
  }
]

export const StatusRenderer = ({text}: {text: string}) => {
  return (
    <TextComponent
      as="p"
      className={`rounded-md py-[12px] text-center font-normal md:ml-0 ${text === 'New' ? 'bg-[#FFFAEA] text-[#FF9500]' : text === 'Shipped' ? 'bg-[#E7F2FF] text-[#044BFD]' : text === 'Canceled' ? 'bg-[#FFE1E7] text-[#FF4E4E]' : text === 'Delivered' ? 'bg-[#E5FFEC] text-[#129500]' : ''}`}
    >
      {text}
    </TextComponent>
  )
}
const OrderHistory = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const router = useRouter()

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'name',
        title: 'Order ID',
        dataIndex: 'name',
        render: (text, record) => (
          <div
            className="flex cursor-pointer items-center gap-1"
            onClick={() => {
              updateRouteParams({details: record?.id}, router)
            }}
          >
            <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
              <Image
                src={record.image}
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
                  setIsLoadingImage(false)
                }}
                // className={`${isLoadingImage ? 'blur-sm' : ''}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#000]">
                {record?.customer}
              </TextComponent>

              <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#6b7280]">
                {record?.id}
              </TextComponent>
            </div>
          </div>
        )
      },
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        align: 'center',

        render: (text, record) => (
          <TextComponent as="p" className="whitespace-wrap font-normal !text-[#6b7280]">
            ${text}
          </TextComponent>
        )
      },
      {
        key: 'type',
        align: 'center',
        title: <span className="">Payment Type</span>,
        dataIndex: 'type',
        render: (text, record) => (
          <TextComponent as="p" className="whitespace-wrap text-center font-normal !text-[#6b7280]">
            {text}
          </TextComponent>
        )
      },

      {
        key: 'status',
        title: <span>Order Status</span>,
        dataIndex: 'status',
        align: 'center',
        render: (text: string, record) => <StatusRenderer text={text} />
      },

      {
        title: 'Date',
        key: 'date',
        align: 'center',
        dataIndex: 'date',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (text, record) => (
          <Space size="middle">
            <Link className="!text-[#000000E0] hover:underline" href={`/`}>
              {text}
            </Link>
          </Space>
        )
      }
    ]
  }, [])

  return (
    <React.Fragment>
      <Content className="rounded-md text-[#000]">
        <div className="flex flex-col">
          <StyledTable
            // loading={isPending || isFetching}
            className="mt-4"
            columns={columns}
            dataSource={RecentOrders}
            pagination={false}
          />
        </div>
      </Content>
    </React.Fragment>
  )
}

export default OrderHistory
