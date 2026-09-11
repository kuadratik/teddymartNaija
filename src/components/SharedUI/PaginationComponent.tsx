import type {PaginationProps} from 'antd'
import {Pagination} from 'antd'
import React from 'react'

interface IProps {
  current: number
  setCurrent: React.Dispatch<React.SetStateAction<number>>
  total: number
  refetch?: any
  next_page_url?: any
  pageSize: number
}
const PaginationComponent = ({current, setCurrent, total, refetch, next_page_url, pageSize}: IProps) => {
  //  const [current, setCurrent] = useState(3);
  const onChange: PaginationProps['onChange'] = page => {
    setCurrent(page)
    refetch()
  }

  return (
    <Pagination
      defaultCurrent={1}
      className="mx-[auto] my-[0] flex w-fit flex-row items-center justify-center self-center rounded-md bg-white p-2 text-white"
      current={current}
      showSizeChanger={false}
      onChange={onChange}
      showLessItems={true}
      pageSize={pageSize}
      total={total}
    />
  )
}

export default PaginationComponent
