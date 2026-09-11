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
          <div className="flex gap-2 items-center">
            {current === 1 && (
              <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                <Image
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                  }}
                  src={isLoadingInvoice ? '/assets/default_banner.jpg' : getProductImage(record)}
                  alt={record?.listing_name || 'Product Image'}
                  width={48}
                  preview={false}
                  height={48}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex flex-col">
              <TextComponent as="p" className="flex flex-col font-[500] !text-[#6b7280]">
                {record?.listing_name ?? ''}
              </TextComponent>
              <span className="text-xs">
                {record?.variant_name && (
                  <>
                    variant-<span className="font-semibold">{record?.variant_name}</span>
                  </>
                )}
              </span>
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

  // Helper function to get the correct product image (variant image or listing image)
  const getProductImage = (record: any) => {
    if (record?.variant_id) {
      // Find the matching variant from the listing's variants array
      const variant = record?.listing?.variants?.find(
        (v: any) => v.id === record.variant_id || v.name === record.variant_name
      )
      // Use variant image if available
      if (variant && variant.images && variant.images.length > 0) {
        return `${process.env.imageBaseUrl}/${variant.images[0]}`
      }
    }
    // Fallback to the main listing image
    return `${process.env.imageBaseUrl}/${record?.listing?.images[0]}`
  }

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
