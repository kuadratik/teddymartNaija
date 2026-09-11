import TextComponent from '@/components/SharedUI/TextComponent'
import {Rate, Space, Table, Image, Button} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import React, {useState} from 'react'
import {StyledTable} from '../dashboard/RecentOrder'
import {formattedDateString} from '@/utils/fx'

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

const ProductDetailsReview = ({data}: {data: any}) => {
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
            className="whitespace-wrap font-normal !text-[#6b7280] md:w-[200px] md:whitespace-normal"
          >
            {text}
          </TextComponent>
        )
      },
      {
        key: 'rating',
        title: 'Ratings',
        dataIndex: 'rating',
        render: (text, record) => <Rate disabled className="mr-32 text-base text-[#FDBF5E] md:mr-10" value={text} />
      },

      {
        key: 'time',
        title: 'Time',
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
    <div>
      {' '}
      <TextComponent as="p" className="text-[16px] font-semibold text-[#000]">
        Product Reviews
      </TextComponent>
      <div className="mt-[10px] flex w-full flex-wrap gap-6">
        {data?.map((val: any, id: any) => {
          return (
            <div className="flex justify-between gap-6 rounded-[11px] border-2 border-solid border-[#EAECEF] p-2">
              <div className="flex gap-3">
                {' '}
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
                    {val?.user?.last_name} {val?.user?.first_name}
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
      {/* <div className="flex flex-col">
        <StyledTable
          // loading={isPending || isFetching}
          className="mt-4"
          columns={columns}
          dataSource={RecentOrders}
          pagination={false}
        />
      </div> */}
      {/* <div className="w-full text-right">
        <Button className="!hover:text-[#8697A8] !border-none !bg-transparent !text-[#8697A8] hover:underline">
          View All
        </Button>
      </div> */}
    </div>
  )
}

export default ProductDetailsReview
