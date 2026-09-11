import {Dropdown, Pagination} from 'antd'
import React, {useState} from 'react'

import Badge from '@/components/SharedUI/Badge'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter, formattedDateString} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {ColumnsType} from 'antd/es/table'
import {useRouter} from 'next/router'
import {StyledTable} from '../dashboard/RecentOrder'
import {ProductTableProps} from '../product/ProductTable'
import useUpdateOrderStatus from './hooks/useUpdateOrderStatus'

// Check if shipping duration is still in progress
const isShippingInProgress = (record: any) => {
  if (!record?.shipped_at || !record?.shipping_method?.duration_number || !record?.shipping_method?.duration_type) {
    console.log('Missing shipping info, allowing delivery update by default')
    return false
  }

  // Parse the shipped_at timestamp - ensure proper date parsing
  const shippedDate = new Date(record.shipped_at.replace(' ', 'T') + 'Z')
  const currentDate = new Date()
  const durationNumber = parseInt(record.shipping_method.duration_number)
  const durationType = record.shipping_method.duration_type

  let deadlineDate = new Date(shippedDate)

  switch (durationType) {
    case 'minute':
      deadlineDate.setMinutes(shippedDate.getMinutes() + durationNumber)
      break
    case 'hour':
      deadlineDate.setHours(shippedDate.getHours() + durationNumber)
      break
    case 'day':
      deadlineDate.setDate(shippedDate.getDate() + durationNumber)
      break
    case 'week':
      deadlineDate.setDate(shippedDate.getDate() + durationNumber * 7)
      break
    default:
      console.log('Unknown duration type, allowing delivery update')
      return false
  }

  // Calculate remaining time in milliseconds for better debugging
  const remainingTime = deadlineDate.getTime() - currentDate.getTime()
  const remainingMinutes = Math.floor(remainingTime / (1000 * 60))
  const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000)

  console.log('Shipping duration details:', {
    shipped: shippedDate.toISOString(),
    current: currentDate.toISOString(),
    deadline: deadlineDate.toISOString(),
    duration: `${durationNumber} ${durationType}(s)`,
    remainingTime: `${remainingMinutes} minutes and ${remainingSeconds} seconds`,
    inProgress: deadlineDate.getTime() > currentDate.getTime()
  })

  // Use timestamp comparison for more accurate results
  return deadlineDate.getTime() > currentDate.getTime()
}

const OrderTable = ({loading, data, isFetching, queryParams, updateQueryParams}: ProductTableProps) => {
  console.log('🚀 ~ OrderTable ~ data:', data?.per_page)
  const router = useRouter()

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const {isLoading, updateOrderStatusHandler} = useUpdateOrderStatus()

  const onSelectChange = (newSelectedRowKeys: React.SetStateAction<any>) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const handlePagination = (page: number) => {
    if (!data?.data) return

    updateQueryParams({page: page})
  }

  // Add this function to show shipping duration toast
  const handleShippingDurationToast = (record: any) => {
    if (!record?.shipped_at || !record?.shipping_method?.duration_number || !record?.shipping_method?.duration_type) {
      return
    }

    // Parse the shipped_at timestamp - ensure proper date parsing
    const shippedDate = new Date(record.shipped_at.replace(' ', 'T') + 'Z')
    const currentDate = new Date()
    const durationNumber = parseInt(record.shipping_method.duration_number)
    const durationType = record.shipping_method.duration_type

    let deadlineDate = new Date(shippedDate)

    switch (durationType) {
      case 'minute':
        deadlineDate.setMinutes(shippedDate.getMinutes() + durationNumber)
        break
      case 'hour':
        deadlineDate.setHours(shippedDate.getHours() + durationNumber)
        break
      case 'day':
        deadlineDate.setDate(shippedDate.getDate() + durationNumber)
        break
      case 'week':
        deadlineDate.setDate(shippedDate.getDate() + durationNumber * 7)
        break
    }

    // Calculate remaining time in milliseconds
    const remainingTimeMs = deadlineDate.getTime() - currentDate.getTime()

    // Convert to appropriate units
    let remainingTimeText = ''
    let remainingValue = 0

    if (remainingTimeMs >= 7 * 24 * 60 * 60 * 1000) {
      // More than a week remaining
      remainingValue = Math.ceil(remainingTimeMs / (7 * 24 * 60 * 60 * 1000))
      remainingTimeText = `${remainingValue} week${remainingValue > 1 ? 's' : ''}`
    } else if (remainingTimeMs >= 24 * 60 * 60 * 1000) {
      // More than a day remaining
      remainingValue = Math.ceil(remainingTimeMs / (24 * 60 * 60 * 1000))
      remainingTimeText = `${remainingValue} day${remainingValue > 1 ? 's' : ''}`
    } else if (remainingTimeMs >= 60 * 60 * 1000) {
      // More than an hour remaining
      remainingValue = Math.ceil(remainingTimeMs / (60 * 60 * 1000))
      remainingTimeText = `${remainingValue} hour${remainingValue > 1 ? 's' : ''}`
    } else {
      // Minutes remaining
      remainingValue = Math.max(1, Math.ceil(remainingTimeMs / (60 * 1000)))
      remainingTimeText = `${remainingValue} minute${remainingValue > 1 ? 's' : ''}`
    }

    const formattedDate = deadlineDate.toLocaleDateString()
    const formattedTime = deadlineDate.toLocaleTimeString()

    const message = `The shipping period is still active for ${remainingTimeText}. You can update to delivered status after ${formattedDate} at ${formattedTime}.`

    showPlannerToast({
      options: {
        customToast: (
          <CustomToast
            altText={''}
            title={<>Delivery will be available to update in {remainingTimeText}</>}
            textColor="#FFF"
            message={message}
            backgroundColor="#000"
          />
        )
      },
      message: 'message'
    })
  }

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'customer',
        title: 'Customer',
        render: (text, record) => (
          <div className="flex items-center gap-1">
            <TextComponent as="p" className="font-normal !text-[#6b7280]">
              {capitalizeOnlyFirstLetter(record?.first_name)} {capitalizeOnlyFirstLetter(record?.last_name ?? '')}
            </TextComponent>
          </div>
        ),
        sorter: (a, b) => a.last_name.localeCompare(b.last_name)
      },

      {
        key: 'amount',
        title: 'Price',
        dataIndex: 'amount',
        render: (text, record) => (
          <FormatNumberCurrency value={+record?.total_amount} currency={isActiveUser?.currency} />
        ),
        sorter: (a, b) => a.total_amount - b.total_amount
      },
      {
        key: 'items_ordered',
        title: 'Items Ordered',
        dataIndex: 'items_ordered',
        render: (text, record) => (
          <TextComponent as="p" className="text-center !text-[#6b7280] lg:w-[40%]">
            {record?.order_details.reduce((total: any, item: {quantity: any}) => total + item.quantity, 0)}
          </TextComponent>
        ),

        sorter: (a, b) => {
          const aTotal = a.order_details.reduce((total: number, item: {quantity: number}) => total + item.quantity, 0)
          const bTotal = b.order_details.reduce((total: number, item: {quantity: number}) => total + item.quantity, 0)
          return aTotal - bTotal
        }
      },

      {
        key: 'weight',
        title: 'Weight',
        dataIndex: 'weight',
        render: (text, record) => {
          const totalWeight = record?.order_details.reduce(
            (total: number, item: any) =>
              total + (item.listing?.weight ? parseFloat(item.listing.weight) * item.quantity : 0),
            0
          )

          return (
            <TextComponent as="p" className="text-center !text-[#6b7280] lg:w-[40%]">
              {totalWeight > 0 ? `${totalWeight.toFixed(2)} g` : '-'}
            </TextComponent>
          )
        },

        sorter: (a, b) => {
          const aTotal = a.order_details.reduce(
            (total: number, item: any) =>
              total + (item.listing?.weight ? parseFloat(item.listing.weight) * item.quantity : 0),
            0
          )
          const bTotal = b.order_details.reduce(
            (total: number, item: any) =>
              total + (item.listing?.weight ? parseFloat(item.listing.weight) * item.quantity : 0),
            0
          )
          return aTotal - bTotal
        }
      },

      {
        key: 'payment_status',
        title: 'Payment Type',
        dataIndex: 'payment_status',
        render: (text: string) => (
          <TextComponent as="p" className="text-center !text-[#6b7280] lg:w-[40%]">
            {text.toLowerCase() === 'completed_payment'
              ? 'Paid'
              : text.toLowerCase() === 'approved_payment'
                ? 'Approved'
                : text}
          </TextComponent>
        )
      },

      {
        key: 'status',
        title: (
          <span style={{textAlign: 'center'}} className="ml-4">
            Order Satus{' '}
          </span>
        ),
        dataIndex: 'status',
        render: text => (
          <div className="w-[40%]">
            <Badge
              className="capitalize"
              status={
                text === 'new' ? 'New' : text === 'shipped' ? 'Shipped' : text === 'delivered' ? 'Delivered' : text
              }
            />
          </div>
        )
      },

      {
        key: 'date',
        title: (
          <span style={{textAlign: 'center'}} className="ml-4 lg:ml-8">
            Date{' '}
          </span>
        ),
        dataIndex: 'date',
        render: (text, record) => (
          <TextComponent as="p" className="font-normal !text-[#6b7280] lg:ml-4">
            {formattedDateString(record?.updated_at)}
          </TextComponent>
        )
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (record: any) => (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  label: 'View',
                  key: '1'
                },
                record?.status === 'new'
                  ? {
                      label: 'Shipped',
                      key: '2'
                    }
                  : null,
                record?.status === 'shipped'
                  ? {
                      label: <span className={isShippingInProgress(record) ? 'text-gray-400' : ''}>Delivered</span>,
                      key: '3'
                    }
                  : null
              ],
              onClick: ({key}) => {
                if (key === '1') {
                  router.push(`/vendor/orders/${record?.id}`)
                } else if (key === '2') {
                  updateOrderStatusHandler({
                    userStore: isActiveUser?.slug,
                    status: 'shipped',
                    order_id: record?.id
                  })
                } else if (key === '3') {
                  if (isShippingInProgress(record)) {
                    handleShippingDurationToast(record)
                  } else {
                    updateOrderStatusHandler({
                      userStore: isActiveUser?.slug,
                      status: 'delivered',
                      order_id: record?.id
                    })
                  }
                }
              }
            }}
          >
            <button
              style={{
                width: 'auto',
                height: 'auto'
              }}
              className={`border-none text-gray-400`}
            >
              <Icon style={{width: 'auto', height: 'auto'}} icon="tabler:dots" className="text-2xl" />{' '}
            </button>
          </Dropdown>
        )
      }
    ]
  }, [])

  const locale = {
    emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
  }

  return (
    <div className="">
      {' '}
      <div className="flex flex-col px-3">
        <StyledTable
          rowClassName={'no-selected-row'}
          loading={loading || isLoading || isFetching}
          className=""
          columns={columns}
          locale={locale}
          dataSource={data?.data}
          pagination={false}
        />
      </div>
      {data?.data?.length ? (
        <div className="my-4 flex justify-end">
          <Pagination
            current={queryParams.page ? queryParams.page : 1}
            showSizeChanger={false}
            onChange={page => {
              handlePagination(page)
            }}
            className="mx-auto my-[0] flex w-fit flex-row items-center justify-center self-center rounded-md bg-white p-2 text-white lg:mx-0"
            showLessItems={true}
            pageSize={data?.per_page || 20}
            total={data?.total}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default OrderTable
