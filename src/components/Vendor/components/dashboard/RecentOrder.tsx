import TextComponent from '@/components/SharedUI/TextComponent'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'
import {Image} from 'antd'

import {Layout, Space, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import Badge from '@/components/SharedUI/Badge'
import {Status} from '@/types/types'
import {StyledTable} from '../Order/OrderDetailsTable'

const {Content} = Layout

const RecentOrders = [
  {
    order_id: '1551478009',
    customer: 'Marco Padberg',
    product: 'Item Name',
    amount: '$29.00',
    status: 'New'
  },
  {
    order_id: '1551478009',
    customer: 'Marco Padberg',
    product: 'Item Name',
    amount: '$29.00',
    status: 'Shipped'
  },
  {
    order_id: '1551478009',
    customer: 'Marco Padberg',
    product: 'Item Name',
    amount: '$29.00',
    status: 'Cancelled'
  },
  {
    order_id: '1551478009',
    customer: 'Marco Padberg',
    product: 'Item Name',
    amount: '$29.00',
    status: 'Delivered'
  }
]
const RecentOrder = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'order_id',
        title: 'Order ID',
        dataIndex: 'order_id',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (record: any) => (
          <Space size="middle">
            <Link className="!text-[#000000E0] hover:underline" href={`/`}>
              {record}
            </Link>
          </Space>
        )
      },
      {
        key: 'customer',
        title: 'Customer',
        dataIndex: 'customer',
        // @ts-ignore
        render: (text, record) => (
          <div className="flex items-center gap-1">
            <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
              <Image
                src={`/assets/customer.jpg`}
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
            <TextComponent as="p" className="font-normal !text-[#6b7280]">
              {record?.customer}
            </TextComponent>
          </div>
        )
      },
      {
        key: 'product',
        title: 'Product',
        dataIndex: 'product'
      },

      {
        key: 'amount',
        title: 'Amount',
        dataIndex: 'amount'
      },

      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        render: (text: Status) => (
          <div className="w-[90%]">
            <Badge className="" status={text} />
          </div>
        )
      }
    ]
  }, [])

  return (
    <React.Fragment>
      <Content className="mt-8 rounded-md bg-white py-[10px] text-[#000]">
        <TextComponent
          as="p"
          className="px-4 text-center text-[16px] font-normal leading-[19px] text-[#000000] md:text-left"
        >
          Recent Orders
        </TextComponent>

        <StyledTable
          // loading={isPending || isFetching}
          className="mt-4"
          columns={columns}
          dataSource={RecentOrders}
          pagination={false}
        />
      </Content>
    </React.Fragment>
  )
}

export default RecentOrder
