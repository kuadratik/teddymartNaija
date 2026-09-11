import TextComponent from '@/components/SharedUI/TextComponent'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'
import {Image, Rate} from 'antd'

import {Layout, Space, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import CustomButton from '@/components/SharedUI/Buttons/Button'

const {Content} = Layout

const SellingProduct = [
  {
    product_name: 'Branded T-Shirts',
    price: 100,
    available: 29.0,
    rating: 5,
    amount: '1,798',
    product_date: '09/24/2024'
  },
  {
    product_date: '09/24/2024',
    rating: 5,
    product_name: 'Branded T-Shirts',
    price: 100,
    available: 29.0,
    amount: '1,798'
  },
  {
    product_date: '09/24/2024',
    rating: 5,
    product_name: 'Branded T-Shirts',
    price: 100,
    available: 29.0,
    amount: '1,798'
  },
  {
    product_date: '09/24/2024',
    rating: 5,
    product_name: 'Branded T-Shirts',
    price: 100,
    available: 29.0,
    amount: '1,798'
  }
]
const TopSelling = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product_id',
        title: 'Product Name',
        dataIndex: 'product_id',
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
                  setIsLoadingImage(false)
                }}
                // className={`${isLoadingImage ? 'blur-sm' : ''}`}
              />
            </div>
            <div className="flex flex-col">
              <TextComponent as="p" className="font-normal !text-[#6b7280]">
                {record?.product_name}
              </TextComponent>
              <TextComponent as="p" className="!text-[#6b7280]">
                {record?.product_date}
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
        key: 'available',
        title: 'Available',
        dataIndex: 'available'
      },

      {
        key: 'rating',
        title: (
          <span style={{textAlign: 'center'}} className="ml-6">
            Ratings
          </span>
        ),
        dataIndex: 'rating',
        render: (text, record) => <Rate disabled className="text-base" value={text} />
      },

      {
        title: 'Action',
        key: 'action',
        align: 'center',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (record: any) => (
          <Space size="middle">
            <Link className="!text-[#000000E0] hover:underline" href={`/`}>
              View
            </Link>
          </Space>
        )
      }
    ]
  }, [])

  return (
    <React.Fragment>
      <Content className="mt-8 hidden rounded-md bg-white py-[10px] text-[#000] md:block">
        <TextComponent as="p" className="px-4 text-[16px] font-normal leading-[19px] text-[#000000]">
          Top 5 Selling Products
        </TextComponent>

        <Table
          // loading={isPending || isFetching}
          className="mt-4 whitespace-nowrap"
          columns={columns}
          dataSource={SellingProduct}
          pagination={false}
        />
      </Content>
      <div className="md:hidden">
        <Content className="rounded-md bg-white py-[10px] text-[#000]">
          <TextComponent as="p" className="px-4 text-center text-[16px] font-normal leading-[19px] text-[#000000]">
            Top 5 Selling Products
          </TextComponent>
        </Content>

        {[...Array(4)].map((_, i) => (
          <div className="mt-[19px]" key={i}>
            <Content className="flex flex-col gap-4 rounded-md bg-white px-2 py-[10px] text-[#000]">
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
                      setIsLoadingImage(false)
                    }}
                    // className={`${isLoadingImage ? 'blur-sm' : ''}`}
                  />
                </div>
                <div className="flex flex-col">
                  <TextComponent as="p" className="font-normal !text-[#6b7280]">
                    Branded T-Shirts
                  </TextComponent>
                  <TextComponent as="p" className="!text-[#6b7280]">
                    09/24/2024{' '}
                  </TextComponent>
                </div>
              </div>

              <div className="flex gap-10 px-1">
                <div className="flex flex-col">
                  <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                    $29.00
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                    Price{' '}
                  </TextComponent>
                </div>
                <div className="flex flex-col">
                  <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                    04
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                    Order{' '}
                  </TextComponent>
                </div>
                <div className="flex flex-col">
                  <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                    510
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                    Stock{' '}
                  </TextComponent>
                </div>
                <div className="flex flex-col">
                  <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                    $1,798{' '}
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                    Amount{' '}
                  </TextComponent>
                </div>
              </div>

              <CustomButton className="!hover:bg-[#6B7280] rounded-[6px] bg-[#6B7280] px-1 py-2 text-[14px] font-normal text-white underline">
                View
              </CustomButton>
            </Content>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

export default TopSelling
