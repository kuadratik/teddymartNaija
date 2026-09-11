import CustomRouteTab from '@/components/SharedUI/CustomTab'
import {Layout} from 'antd'
import React, {useEffect} from 'react'
import OrderTable from './OrderTable'
import {CountWrapper, TabWrapper} from '../product/ProductContainer'
import useQueryParams from '@/hooks/useQueryParams'
import {ProductListingQuery} from '@/types/store'
import {useGetVendorOrderListingsQuery, useGetVendorProductListingsQuery} from '@/services/vendor/vendor'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useRouter} from 'next/router'
import {TabBodyWrapper} from '@/pages/customer'

const {Content} = Layout

interface OrderContainerProps {
  searchValue?: string
  setSearchValue?: () => void
}

const ProductContainer = ({setSearchValue, searchValue}: OrderContainerProps) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const router = useRouter()

  const {query} = router

  const {queryParams, updateQueryParams, clearAllFilters} = useQueryParams<ProductListingQuery>({
    current_page: 1,
    search: ''
  })

  console.log(queryParams)

  const {data, isLoading, isFetching} = useGetVendorOrderListingsQuery({
    params: {
      ...queryParams,
      order_status:
        query?.tab === 'all'
          ? ''
          : query?.tab === 'new'
            ? 'new'
            : query?.tab === 'shipped'
              ? 'shipped'
              : query?.tab === 'cancelled'
                ? 'cancelled'
                : 'delivered'
    },
    userStore: isActiveUser?.slug
  })

  const tabsData = [
    {
      tabTitle: (
        <TabWrapper
          onClick={() => {
            router.replace({
              pathname: '/vendor/orders',
              query: {tab: 'all'}
            })
          }}
        >
          <p className="font-semibold">All</p>
          {query?.tab === 'all' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabWrapper>
      ),
      tabBody: (
        <OrderTable
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'all'
    },
    {
      tabTitle: (
        <TabWrapper
          onClick={() => {
            router.replace({
              pathname: '/vendor/orders',
              query: {tab: 'new'}
            })
          }}
        >
          <p className="font-semibold">New</p>

          {query?.tab === 'new' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabWrapper>
      ),
      tabBody: (
        <OrderTable
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'new'
    },
    {
      tabTitle: (
        <TabWrapper
          onClick={() => {
            router.replace({
              pathname: '/vendor/orders',
              query: {tab: 'shipped'}
            })
          }}
        >
          <p className="font-semibold">Shipped</p>

          {query?.tab === 'shipped' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabWrapper>
      ),
      tabBody: (
        <OrderTable
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'shipped'
    },
    {
      tabTitle: (
        <TabWrapper
          onClick={() => {
            router.replace({
              pathname: '/vendor/orders',
              query: {tab: 'cancelled'}
            })
          }}
        >
          <p className="font-semibold">Cancelled</p>

          {/* <CountWrapper>6</CountWrapper> */}
        </TabWrapper>
      ),
      tabBody: (
        <OrderTable
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'cancelled'
    },
    {
      tabTitle: (
        <TabWrapper
          onClick={() => {
            router.replace({
              pathname: '/vendor/orders',
              query: {tab: 'delivered'}
            })
          }}
        >
          <p className="font-semibold">Delivered</p>

          {query?.tab === 'delivered' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabWrapper>
      ),
      tabBody: (
        <OrderTable
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'delivered'
    }
  ]

  return (
    <React.Fragment>
      <Content className="mt-[47px] rounded-md bg-white py-[6px] text-[#000]">
        {' '}
        <div className="">
          {' '}
          <CustomRouteTab elements={tabsData} className="custom-tab" />
        </div>
      </Content>
    </React.Fragment>
  )
}

export default ProductContainer
