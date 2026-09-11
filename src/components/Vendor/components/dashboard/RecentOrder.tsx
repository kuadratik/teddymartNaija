import TextComponent from '@/components/SharedUI/TextComponent'
import React, {useState} from 'react'

import Badge from '@/components/SharedUI/Badge'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Layout, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import tw from 'tailwind-styled-components'
import {TopSellingprops} from './TopSelling'

const {Content} = Layout

const RecentOrder = ({data}: TopSellingprops) => {
  // Filter out orders with pending_payment status
  const filteredData = React.useMemo(() => {
    return (
      data?.filter(
        (item: any) =>
          item.payment_status !== 'pending_payment' && item.payment_status !== 'pending'
      ) || []
    )
  }, [data])

  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const locale = {
    emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
  }

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'customer',
        title: 'Customer',
        dataIndex: 'customer',
        // @ts-ignore
        render: (text, record) => (
          <div className="flex items-center gap-1">
            <TextComponent as="p" className="font-normal !text-[#6b7280]">
              {record?.first_name} {record?.last_name}
            </TextComponent>
          </div>
        )
      },
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
  }, [isActiveUser?.currency])

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
          dataSource={filteredData}
          pagination={false}
        />
      </Content>
    </React.Fragment>
  )
}

export const StyledTable = tw(Table)`no-scrollbar overflow-scroll whitespace-nowrap lg:overflow-hidden`

export default RecentOrder
