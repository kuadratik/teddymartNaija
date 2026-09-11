import TextComponent from '@/components/SharedUI/TextComponent'
import {Rate} from 'antd'
import React, {useState} from 'react'

import EmptyResult from '@/components/SharedUI/States/EmptyState'
import {formattedDateString} from '@/utils/fx'
import {Layout, Space} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import {TopSellingprops} from './TopSelling'

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

const ProductReview = ({data}: TopSellingprops) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  // console.log(data, 'data')

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
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
            <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#6b7280]">
              {record?.user?.last_name} {record?.user?.first_name}
            </TextComponent>
          </div>
        )
      },

      // {
      //   key: 'review',
      //   title: 'Review',
      //   dataIndex: 'review',

      //   render: (text, record) => (
      //     <TextComponent
      //       as="p"
      //       className="whitespace-wrap font-normal !text-[#6b7280] md:w-[400px] md:whitespace-normal"
      //     >
      //       {text}
      //     </TextComponent>
      //   )
      // },
      {
        key: 'rating',
        title: (
          <span style={{textAlign: 'center'}} className="ml-6">
            Ratings
          </span>
        ),
        dataIndex: 'rating',
        render: (text, record) => <Rate disabled className="mr-32 text-base text-[#FDBF5E] md:mr-10" value={text} />
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
      <Content className="mt-8 rounded-md bg-white px-4 py-[10px] text-[#000]">
        <TextComponent
          as="p"
          className="text-center text-[16px] font-normal leading-[19px] text-[#000000] md:text-left"
        >
          Product Reviews
        </TextComponent>

        {/* <div className="flex flex-col">
          <StyledTable
            // loading={isPending || isFetching}
            className="mt-4"
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div> */}
        {data?.length ? (
          <div className="mt-[10px] flex w-full flex-wrap gap-2">
            {data?.map((val: any, id: any): any => {
              return (
                <div
                  key={id}
                  className="flex w-full justify-between gap-6 rounded-[11px] border-[1.5px] border-solid border-[#EAECEF] p-2 lg:w-auto"
                >
                  <div className="flex gap-3">
                    {/* <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
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
                    <Image
                      preview={false}
                      onError={error => {
                        error.currentTarget.src = '/assets/default_banner.jpg'
                      }}
                      src={`/assets/customer.jpg`}
                      alt={'img'}
                      width={48}
                      height={48}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div> */}
                    <div className="flex flex-col justify-center gap-1">
                      <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#6b7280]">
                        {val?.user?.first_name} {val?.user?.last_name}
                      </TextComponent>
                      <Rate disabled value={val?.rating} className="text-base text-[#FDBF5E]" />
                    </div>
                  </div>

                  <TextComponent as="p" className="font-normal !text-[#6b7280]">
                    {formattedDateString(val?.created_at)}
                  </TextComponent>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
        )}
      </Content>
    </React.Fragment>
  )
}

export default ProductReview
