import {Button, Dropdown, Rate, Space, Table} from 'antd'
import React, {useState} from 'react'

import {Image} from 'antd'
import {ColumnsType} from 'antd/es/table'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {StyledTable} from '../Order/OrderDetailsTable'

const product = [
  {
    product: 'Branded T-Shirts',
    price: 100,
    stock: '04',
    rating: '4.8',
    date: '09/24/2024'
  },
  {
    product: 'Branded T-Shirts',
    price: 100,
    stock: '04',
    rating: '4.8',
    date: '09/24/2024'
  },
  {
    product: 'Branded T-Shirts',
    price: 100,
    stock: '04',
    rating: '4.8',
    date: '09/24/2024'
  },
  {
    product: 'Branded T-Shirts',
    price: 100,
    stock: '04',
    rating: '4.8',
    date: '09/24/2024'
  }
]

const ProductTable = () => {
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
        key: 'stock',
        title: 'Stock',
        dataIndex: 'stock'
      },

      {
        key: 'rating',
        title: 'Rating',
        dataIndex: 'rating',
        render: (text, record) => (
          <div className="flex items-center gap-1">
            <span>{text}</span>
            <Rate disabled className="text-base" value={1} count={1} />
          </div>
        )
      },

      {
        key: 'date',
        title: 'Date',
        dataIndex: 'date'
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

                {
                  label: 'Edit',
                  key: '2'
                }
              ]
            }}
          >
            <Button className="border-none">
              <Icon icon="tabler:dots" className="text-2xl" />{' '}
            </Button>
          </Dropdown>
        )
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
          dataSource={product}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default ProductTable
