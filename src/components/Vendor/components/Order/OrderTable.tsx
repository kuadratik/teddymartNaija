import {Button, Dropdown, Pagination, Space, Table} from 'antd'
import React, {useState} from 'react'

import {Image} from 'antd'
import {ColumnsType} from 'antd/es/table'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Status} from '@/types/types'
import Badge from '@/components/SharedUI/Badge'
import {StyledTable} from '../dashboard/RecentOrder'
import {ProductTableProps} from '../product/ProductTable'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter, formattedDateString} from '@/utils/fx'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import useUpdateOrderStatus from './hooks/useUpdateOrderStatus'
import {useRouter} from 'next/router'

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

const OrderTable = ({loading, data, isFetching, queryParams, updateQueryParams}: ProductTableProps) => {
  const router = useRouter()

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // console.log(data)

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  // const totalQuantity = order_details.reduce((total, item) => total + item.quantity, 0)

  // console.log(isActiveUser?.slug, 'shipped')

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

    updateQueryParams({current_page: page})
  }

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      // {
      //   key: 'product',
      //   title: 'Product',
      //   dataIndex: 'product',
      //   render: (text, record) => (
      //     <div className="flex gap-1">
      //       <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
      //         <Image
      //           src={`/assets/shirt.jpg`}
      //           alt="product image"
      //           preview={false}
      //           // onLoadStart={() => {
      //           //   setIsLoadingImage(true)
      //           // }}
      //           // onLoad={() => {
      //           //   setIsLoadingImage(false)
      //           // }}
      //           onError={error => {
      //             error.currentTarget.src = '/assets/default_banner.jpg'
      //           }}
      //           // className={`${isLoadingImage ? 'blur-sm' : ''}`}
      //         />
      //       </div>
      //       <div className="flex flex-col">
      //         <TextComponent as="p" className="font-normal !text-[#6b7280]">
      //           {record?.product}
      //         </TextComponent>
      //         <TextComponent as="p" className="!text-[#6b7280]">
      //           {record?.date}
      //         </TextComponent>
      //       </div>
      //     </div>
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
              {capitalizeOnlyFirstLetter(record?.last_name ?? '')} {capitalizeOnlyFirstLetter(record?.first_name)}
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
          <TextComponent as="p" className="w-[40%] text-center !text-[#6b7280]">
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
          <span style={{textAlign: 'center'}} className="ml-4">
            Order Satus{' '}
          </span>
        ),
        dataIndex: 'status',
        render: text => (
          <div className="w-[40%]">
            <Badge
              className=""
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
            // disabled={record?.status === 'delivered' ? true : false}
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
                      label: 'Delivered',
                      key: '3'
                    }
                  : null
                // {
                //   label: 'Message',
                //   key: '4'
                // }
              ],
              onClick: ({key}) => {
                if (key === '1') {
                  router.push(`/vendor/orders/${record?.id}`)
                } else if (key === '2') {
                  // console.log(record)

                  updateOrderStatusHandler({
                    userStore: isActiveUser?.slug,
                    status: 'shipped',
                    order_id: record?.id
                  })
                } else if (key === '3') {
                  updateOrderStatusHandler({
                    userStore: isActiveUser?.slug,
                    status: 'delivered',
                    order_id: record?.id
                  })
                } else if (key === '4') {
                } else if (key === '5') {
                  // setCurrentProduct(record)
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

  // ${record?.status === 'delivered' ? 'text-gray-400' : ''}

  const locale = {
    emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
  }

  return (
    <div className="">
      {' '}
      <div className="flex flex-col">
        <StyledTable
          rowClassName={'no-selected-row'}
          loading={loading || isLoading || isFetching}
          className=""
          columns={columns}
          locale={locale}
          // rowSelection={rowSelection}
          // dataSource={order}
          dataSource={data?.data}
          pagination={false}
        />
      </div>
      {data?.data?.length ? (
        <div className="my-4 flex justify-end">
          <Pagination
            current={queryParams.current_page ? queryParams.current_page : 1}
            showSizeChanger={false}
            onChange={page => {
              handlePagination(page)
            }}
            className="mx-auto my-[0] flex w-fit flex-row items-center justify-center self-center rounded-md bg-white p-2 text-white lg:mx-0"
            showLessItems={true}
            pageSize={queryParams.per_page ? queryParams.per_page : 15}
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
