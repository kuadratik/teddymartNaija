import {Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import React from 'react'
import {Image} from 'antd'
import TextComponent from '@/components/SharedUI/TextComponent'
import tw from 'tailwind-styled-components'
import {capitalizeOnlyFirstLetter, formatQuantity, formattedDateString} from '@/utils/fx'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import Badge from '@/components/SharedUI/Badge'

const OrderTable = ({data}: any) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

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
                onError={error => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                }}
                src={`${process.env.imageBaseUrl}/${record?.listing?.images[0]}`}
                alt={'img'}
                width={48}
                preview={false}
                height={48}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col">
              <TextComponent as="p" className="font-normal !text-[#6b7280]">
                {capitalizeOnlyFirstLetter(record?.listing_name ?? '')}
              </TextComponent>
              <TextComponent as="p" className="!text-[#6b7280]">
                {formattedDateString(record?.created_at)}
              </TextComponent>
            </div>
          </div>
        )
      },
      {
        key: 'price',
        title: 'Item Price',
        dataIndex: 'price',
        render: (text, record) => (
          <FormatNumberCurrency value={+record?.listing_price} currency={isActiveUser?.currency} />
        )
      },
      {
        key: 'available',
        title: (
          <span style={{textAlign: 'center'}} className="">
            Available Quantity
          </span>
        ),

        dataIndex: 'available',
        render: (text, record) => (
          <>
            {record?.quantity == 0 ? (
              //   <Badge className="" status={'Outofstock'} />
              <p>hel</p>
            ) : (
              <TextComponent as="p" className="font-normal !text-[#6b7280] md:ml-8">
                {formatQuantity(record?.quantity)}
              </TextComponent>
            )}
          </>
        )
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

export const StyledTable = tw(Table)`no-scrollbar overflow-scroll whitespace-nowrap lg:overflow-hidden`

export default OrderTable
