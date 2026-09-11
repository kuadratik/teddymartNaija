import Badge from '@/components/SharedUI/Badge'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter, formatQuantity} from '@/utils/fx'
import {Image, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import React from 'react'
import tw from 'tailwind-styled-components'

const OrderDetailsTable = ({data, isLoadingInvoice, current}: any) => {
  console.log(data)
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product',
        title: 'Product Details',
        dataIndex: 'product',
        render: (text, record) => (
          <div className="flex gap-1">
            {current === 1 && (
              <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                <Image
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                  }}
                  src={
                    isLoadingInvoice
                      ? '/assets/default_banner.jpg'
                      : `${process.env.imageBaseUrl}/${record?.listing?.images[0]}`
                  }
                  alt={'img'}
                  width={48}
                  preview={false}
                  height={48}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex flex-col items-center justify-center">
              <TextComponent as="p" className="font-normal !text-[#6b7280]">
                {capitalizeOnlyFirstLetter(record?.listing_name ?? '')}
              </TextComponent>
              {/* <TextComponent as="p" className="!text-[#6b7280]">
                {formattedDateString(record?.created_at)}
              </TextComponent> */}
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
              <Badge className="" status={'Outofstock'} />
            ) : (
              <TextComponent as="p" className="text-center font-normal !text-[#6b7280] md:ml-8 md:text-left">
                {formatQuantity(record?.quantity)}
              </TextComponent>
            )}
          </>
        )
      },

      {
        key: 'amount',
        title: 'Amount',
        dataIndex: 'amount',
        render: (text, record) => (
          <FormatNumberCurrency value={+record?.listing_price * record?.quantity} currency={isActiveUser?.currency} />
        ),
        align: 'right'
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
          dataSource={data?.order_details}
          pagination={false}
        />
      </div>
    </div>
  )
}

export const StyledTable = tw(Table)`no-scrollbar overflow-scroll whitespace-nowrap lg:overflow-hidden`

export default OrderDetailsTable
