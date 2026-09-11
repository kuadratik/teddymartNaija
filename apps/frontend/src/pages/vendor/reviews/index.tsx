import TextComponent from '@/components/SharedUI/TextComponent'
import {Pagination, Rate} from 'antd'
import React, {useCallback, useState} from 'react'

import {StyledTable} from '@/components/Customer/OrderHistoryServices'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {useAppSelector} from '@/hooks/reduxHooks'
import useQueryParams from '@/hooks/useQueryParams'
import {useGetAllRatingsQuery} from '@/services/rating'
import debounce from '@/utils/debounce'
import {Layout, Space} from 'antd'
import {ColumnsType} from 'antd/es/table'
import dayjs from 'dayjs'
import {useRouter} from 'next/router'

const {Content} = Layout

const Reviews = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const router = useRouter()
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const {queryParams, updateQueryParams} = useQueryParams<any>({
    search: ''
  })

  const [queryString, setQueryString] = useState(queryParams?.search ?? '')

  // Update queryString whenever queryParams.search changes (e.g., when navigating back)
  React.useEffect(() => {
    if (queryString !== queryParams?.search) {
      setQueryString(queryParams?.search ?? '')
    }
  }, [queryParams?.search])

  // * This debounce function update the search queryParams and delays executing the api request
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateQueryParams(
        {
          search: value ?? ''
        },
        true
      ) // Add a second parameter to replace state instead of pushing new history
    }, 1000),
    []
  )

  console.log('queryParams', queryParams)

  const {data: ratingData, isLoading} = useGetAllRatingsQuery({
    userStore: isActiveUser?.slug,
    product: queryParams?.search || ''
    // current_page: currentPage,
    // per_page: pageSize,
  })

  // console.log('isActiveUser', isActiveUser)
  console.log('ratingData', ratingData)

  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size) setPageSize(size)
  }

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'email',
        title: 'Email',
        dataIndex: 'email',
        // align: 'center',

        render: (text, record) => (
          <TextComponent as="p" className="whitespace-wrap font-normal !text-[#6b7280]">
            {record?.user.email}
          </TextComponent>
        )
      },
      {
        key: 'name',
        align: 'center',
        title: <span className="">Name</span>,
        dataIndex: 'name',
        render: (text, record) => (
          <TextComponent as="p" className="whitespace-wrap text-center font-normal !text-[#6b7280]">
            {`${record.user.first_name} ${record.user.last_name}`}
          </TextComponent>
        )
      },

      {
        key: 'product',
        align: 'center',
        title: <span className="">Product</span>,
        dataIndex: 'product',
        render: (text, record) => (
          <TextComponent as="p" className="whitespace-wrap text-center font-normal !text-[#6b7280]">
            {record?.listing?.name || '-'}
          </TextComponent>
        )
      },

      {
        key: 'rating',
        title: <span>Rating</span>,
        dataIndex: 'rating',
        align: 'center',
        render: (text: number, record) => <Rate allowHalf defaultValue={text} disabled className="text-[#FDBF5E]" />
      },

      {
        title: 'Date',
        key: 'date',
        align: 'center',
        dataIndex: 'date',

        render: (text, record) => <Space size="middle">{dayjs(text).format('MM/DD/YYYY HH:mm')}</Space>
      }
    ]
  }, [])

  if (isLoading) {
    return <SkeletonLoaderForPage />
  }

  const locale = {
    emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
  }

  return (
    <>
      <SEOHead
        title={`myEKI | Customer Reviews `}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. "
      />
      <VendorLayout>
        <div className="mx-auto w-full max-w-7xl">
          {/* <h1 className="mb-6 text-[24px] font-semibold">Reviews</h1> */}
          <DashboardHeader
            showBtn={false}
            titleHeader="Reviews"
            placeholder="Search by product name..."
            searchValue={queryString ?? ''}
            setSearchValue={e => {
              setQueryString(e)
              debouncedSearch(e as string)
            }}
          />
          <div className="mx-auto mt-10 w-full rounded-[12px] bg-white p-4">
            <StyledTable
              className="mt-2"
              columns={columns}
              dataSource={ratingData?.data?.data || []}
              // pagination={{pageSize: 20}}
              pagination={false}
              scroll={{x: 'max-content'}}
              locale={locale}
            />
          </div>
        </div>
        <div className="my-8 flex w-full">
          <div className="ml-auto">
            {ratingData?.data?.to! > 20 && !isLoading && (
              <Pagination
                current={currentPage}
                total={(ratingData as any)?.data?.total!}
                pageSize={pageSize}
                showSizeChanger={false}
                onChange={handlePaginationChange}
              />
            )}
          </div>
        </div>
      </VendorLayout>
    </>
  )
}

Reviews.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

// export const StyledTable = tw(Table)`no-scrollbar overflow-scroll whitespace-nowrap lg:overflow-hidden`

export default Reviews
