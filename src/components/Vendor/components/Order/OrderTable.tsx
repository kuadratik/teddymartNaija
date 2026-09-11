import {Button, Dropdown, Space, Table} from 'antd'
import React, {useState} from 'react'

import {Image} from 'antd'
import {ColumnsType} from 'antd/es/table'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Status} from '@/types/types'
import Badge from '@/components/SharedUI/Badge'
import {StyledTable} from './OrderDetailsTable'

const order = [
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    stock: '04',
    payment_status: 'Paid',
    date: '09/24/2024',
    order_status: 'New'
  },
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    stock: '04',
    payment_status: 'Paid',
    date: '09/24/2024',
    order_status: 'Shipped'
  },
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    payment_status: 'Paid',
    rating: '4.8',
    date: '09/24/2024',
    order_status: 'Cancelled'
  },
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    payment_status: 'Paid',
    rating: '4.8',
    date: '09/24/2024',
    order_status: 'Delivered'
  }
]

const OrderTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  const onSelectChange = (newSelectedRowKeys: React.SetStateAction<any>) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product',
        title: 'Product',
        dataIndex: 'product',
        render: (text, record) => (
          <div className="flex gap-1">
            <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
              <Image
                src={`/assets/shirt.jpg`}
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
                }}
                // className={`${isLoadingImage ? 'blur-sm' : ''}`}
              />
            </div>
            <div className="flex flex-col">
              <TextComponent as="p" className="font-normal !text-[#6b7280]">
                {record?.product}
              </TextComponent>
              <TextComponent as="p" className="!text-[#6b7280]">
                {record?.date}
              </TextComponent>
            </div>
          </div>
        )
      },
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'price'
      },
      {
        key: 'payment_status',
        title: 'Payment Type',
        dataIndex: 'payment_status',
        render: text => (
          <TextComponent as="p" className="w-[40%] text-center !text-[#6b7280]">
            {text}
          </TextComponent>
        )
      },

      {
        key: 'order_status',
        title: (
          <span style={{textAlign: 'center'}} className="ml-4">
            Order Satus{' '}
          </span>
        ),
        dataIndex: 'order_status',
        render: (text: Status) => (
          <div className="w-[40%]">
            <Badge className="" status={text} />
          </div>
        )
      },

      {
        key: 'date',
        title: 'Date',
        dataIndex: 'date'
      }
    ]
  }, [])

  return (
    <div className="">
      {' '}
      <div className="flex flex-col">
        <StyledTable
          rowClassName={'no-selected-row'}
          // loading={isPending || isFetching}
          className=""
          columns={columns}
          rowSelection={rowSelection}
          dataSource={order}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default OrderTable
