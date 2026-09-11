import TextComponent from '@/components/SharedUI/TextComponent'
import {Progress, Rate, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import React from 'react'
import {StyledTable} from '../dashboard/RecentOrder'

const CustomerReviewData = [
  {
    review: '5 star',
    value: '2768',
    progress: 100
  },
  {
    review: '4 star',
    value: '1063',
    progress: 40
  },
  {
    review: '3 star',
    value: '997',
    progress: 30
  },
  {
    review: '2 star',
    value: '227',
    progress: 20
  },
  {
    review: '1 star',
    value: '408',
    progress: 20
  }
]

const CustomerReview = () => {
  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'review',
        title: <Rate value={5} />,
        dataIndex: 'review',
        render: (text, record) => (
          <TextComponent as="p" className="w-[130px] !text-[#000000] md:w-full">
            {text}
          </TextComponent>
        )
      },
      {
        key: 'progress',
        title: 'Total 5.50k reviews',
        dataIndex: 'progress',
        render: (text, record) => <Progress strokeColor={'#34C759'} percent={text} size={[400, 12]} showInfo={false} />
      },

      {
        key: 'value',
        title: '4.5 out of 5',
        dataIndex: 'value',
        render: (text, record) => (
          <TextComponent as="p" className="!text-[#000000]">
            {text}
          </TextComponent>
        )
      }
    ]
  }, [])

  return (
    <div className="mt-2">
      {' '}
      <TextComponent as="p" className="text-[16px] font-semibold text-[#000]">
        Customer Reviews
      </TextComponent>
      <div className="flex flex-col">
        <StyledTable
          // loading={isPending || isFetching}
          className="mt-4"
          columns={columns}
          dataSource={CustomerReviewData}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default CustomerReview
