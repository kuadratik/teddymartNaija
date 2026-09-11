import TextComponent from '@/components/SharedUI/TextComponent'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'
import {Image} from 'antd'

import {Layout, Space, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import Badge from '@/components/SharedUI/Badge'
import {Status} from '@/types/types'
import tw from 'tailwind-styled-components'
import {TopSellingprops} from './TopSelling'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import EmptyResult from '@/components/SharedUI/States/EmptyState'

const {Content} = Layout

// const RecentOrders = [
//   {
//     order_id: '1551478009',
//     customer: 'Marco Padberg',
//     product: 'Item Name',
//     amount: '$29.00',
//     status: 'New'
//   },
//   {
//     order_id: '1551478009',
//     customer: 'Marco Padberg',
//     product: 'Item Name',
//     amount: '$29.00',
//     status: 'Shipped'
//   },
//   {
//     order_id: '1551478009',
//     customer: 'Marco Padberg',
//     product: 'Item Name',
//     amount: '$29.00',
//     status: 'Cancelled'
//   },
//   {
//     order_id: '1551478009',
//     customer: 'Marco Padberg',
//     product: 'Item Name',
//     amount: '$29.00',
//     status: 'Delivered'
//   }
// ]

const RecentOrder = ({data}: TopSellingprops) => {
  console.log(data)
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const locale = {
    emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
  }

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      // {
      //   key: 'order_id',
      //   title: 'Order ID',
      //   dataIndex: 'order_id',
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   render: (record: any) => (
      //     <Space size="middle">
      //       <Link className="!text-[#000000E0] hover:underline" href={`/`}>
      //         {record}
      //       </Link>
      //     </Space>
      //   )
      // },
      {
        key: 'customer',
        title: 'Customer',
        dataIndex: 'customer',
        // @ts-ignore
        render: (text, record) => (
          <div className="flex items-center gap-1">
            {/* <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
              <Image
                onError={error => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                }}
                src={`/assets/customer.jpg`}
                alt={'img'}
                width={48}
                height={48}
                preview={false}
                className="h-full w-full rounded-lg object-cover"
              />
            </div> */}

            <TextComponent as="p" className="font-normal !text-[#6b7280]">
              {record?.last_name} {record?.first_name}
            </TextComponent>
          </div>
        )
      },
      // {
      //   key: 'product',
      //   title: 'Product',
      //   dataIndex: 'product'
      // },

      {
        key: 'amount',
        title: 'Price',
        dataIndex: 'amount',
        render: (text, record) => (
          <FormatNumberCurrency value={+record?.total_amount} currency={isActiveUser?.currency} />
        )
      },
      {
        key: 'payment_status',
        title: 'Payment Type',
        dataIndex: 'payment_status',
        render: text => (
          <TextComponent as="p" className="w-[40%] text-center !text-[#6b7280]">
            {text === 'completed_payment' ? 'Paid' : text}
          </TextComponent>
        )
      },

      {
        key: 'status',
        title: (
          <span style={{textAlign: 'center'}} className="ml-6">
            Status
          </span>
        ),
        dataIndex: 'status',
        render: text => (
          <Badge
            className=""
            status={text === 'new' ? 'New' : text === 'shipped' ? 'Shipped' : text === 'delivered' ? 'Delivered' : text}
          />
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
          Top 5 Recent Orders
        </TextComponent>

        <StyledTable
          locale={locale}
          // loading={isPending || isFetching}
          className="mt-4"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Content>
    </React.Fragment>
  )
}

export const StyledTable = tw(Table)`no-scrollbar overflow-scroll whitespace-nowrap lg:overflow-hidden`

export default RecentOrder
