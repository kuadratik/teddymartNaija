import TextComponent from '@/components/SharedUI/TextComponent'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'
import {Image, Rate} from 'antd'

import {Layout, Space, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import Badge from '@/components/SharedUI/Badge'
import {Status} from '@/types/types'
import {StyledTable} from '../Order/OrderDetailsTable'

const {Content} = Layout

const RecentOrders = [
  {
    review: 'Nemo enim ipsam voluptatem, qui in ea voluptate veting ',
    customer: 'Marco Padberg',
    rating: 5,
    time: '3 hours ago',
    status: 'Paid'
  },
  {
    review: 'Nemo enim ipsam voluptatem, qui in ea voluptate veting ',
    customer: 'Marco Padberg',
    rating: 5,
    time: '3 hours ago',
    status: 'Paid'
  },
  {
    review: 'Nemo enim ipsam voluptatem, qui in ea voluptate veting ',
    customer: 'Marco Padberg',
    rating: 5,
    time: '3 hours ago',
    status: 'Paid'
  }
]
const ProductReview = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        render: (text, record) => (
          <div className="flex items-center gap-1">
            <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
              <Image
                src={`/assets/customer.jpg`}
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
            <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#6b7280]">
              {record?.customer}
            </TextComponent>
          </div>
        )
      },
      {
        key: 'review',
        title: 'Review',
        dataIndex: 'review',

        render: (text, record) => (
          <TextComponent
            as="p"
            className="whitespace-wrap font-normal !text-[#6b7280] md:w-[400px] md:whitespace-normal"
          >
            {text}
          </TextComponent>
        )
      },
      {
        key: 'rating',
        title: (
          <span style={{textAlign: 'center'}} className="ml-6">
            Ratings
          </span>
        ),
        dataIndex: 'rating',
        render: (text, record) => <Rate disabled className="mr-32 text-base md:mr-10" value={text} />
      },

      {
        key: 'time',
        title: (
          <span style={{textAlign: 'center'}} className="ml-4">
            Time
          </span>
        ),
        dataIndex: 'time',
        render: (text, record) => (
          <TextComponent as="p" className="font-normal !text-[#6b7280] md:ml-0">
            {text}
          </TextComponent>
        )
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
      <Content className="mt-8 rounded-md bg-white py-[10px] text-[#000]">
        <TextComponent
          as="p"
          className="px-4 text-center text-[16px] font-normal leading-[19px] text-[#000000] md:text-left"
        >
          Product Reviews
        </TextComponent>
        <div className="flex flex-col">
          <StyledTable
            // loading={isPending || isFetching}
            className="mt-4"
            columns={columns}
            dataSource={RecentOrders}
            pagination={false}
          />
        </div>
      </Content>
    </React.Fragment>
  )
}

export default ProductReview
