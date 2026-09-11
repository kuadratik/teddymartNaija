import TextComponent from '@/components/SharedUI/TextComponent'
import React from 'react'
import {Image} from 'antd'
import {ColumnsType} from 'antd/es/table'
import {StyledTable} from '../OrderDetailsTable'

const order = [
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    payment_status: 'Paid',
    date: '09/24/2024',
    order_status: 'New',
    quantity: '02',
    amount: '$1,798'
  },
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    payment_status: 'Paid',
    date: '09/24/2024',
    order_status: 'Shipped',
    quantity: '04',
    amount: '$1,798'
  },
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    payment_status: 'Paid',
    rating: '4.8',
    date: '09/24/2024',
    order_status: 'Cancelled',
    quantity: '06',
    amount: '$1,798'
  },
  {
    product: 'Branded T-Shirts',
    price: '$29.00',
    payment_status: 'Paid',
    rating: '4.8',
    date: '09/24/2024',
    order_status: 'Delivered',
    quantity: '05',
    amount: '$1,798'
  }
]

const InvoiceTable = () => {
  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product',
        title: 'Product Details',
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
        title: 'Item Price',
        dataIndex: 'price'
      },
      {
        key: 'price',
        title: 'Item Price',
        dataIndex: 'price'
      },
      {
        key: 'quantity',
        title: 'Ouantity',
        dataIndex: 'quantity'
      },

      {
        key: 'amount',
        title: 'Amount',
        dataIndex: 'amount'
      }
    ]
  }, [])

  return (
    <div>
      {' '}
      <div className="flex flex-col">
        <StyledTable
          rowClassName={'no-selected-row'}
          // loading={isPending || isFetching}
          className=""
          columns={columns}
          dataSource={order}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default InvoiceTable
