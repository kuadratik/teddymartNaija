import CustomRouteTab from '@/components/SharedUI/CustomTab'
import {useAppSelector} from '@/hooks/reduxHooks'
import useQueryParams from '@/hooks/useQueryParams'
import {TabBodyWrapper} from '@/pages/customer'
import {useGetVendorProductListingsQuery} from '@/services/vendor/vendor'
import {ProductListingQuery} from '@/types/store'
import {Icon} from '@iconify/react'
import {Button, Dropdown, Layout, MenuProps} from 'antd'
import {useRouter} from 'next/router'
import React from 'react'
import tw from 'tailwind-styled-components'
import ProductTable from './ProductTable'

const {Content} = Layout

interface ProductContainerProps {
  searchValue?: string
  setSearchValue?: () => void
  isActiveUserShippingMethods: any
  setShowShipping: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductContainer = ({
  setSearchValue,
  searchValue,
  isActiveUserShippingMethods,
  setShowShipping
}: ProductContainerProps) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const router = useRouter()

  const {query} = router

  // console.log(query?.tab)
  const {queryParams, updateQueryParams} = useQueryParams<ProductListingQuery>({
    page: 1,
    search: '',
    sort_date: 'newest'
  })

  const {data, isLoading, isFetching} = useGetVendorProductListingsQuery({
    params: {
      ...queryParams,
      listingType: isActiveUser?.type,
      is_draft:
        query?.tab === 'published' ? false : query?.tab === 'draft' ? true : query?.tab === 'unavailable' ? false : '',
      availability: query?.tab === 'unavailable' ? false : query?.tab === 'published' ? true : '',
      status:
        query?.tab === 'all'
          ? ''
          : query?.tab === 'published'
            ? 'published'
            : query?.tab === 'draft'
              ? 'draft'
              : 'unavailable'
    },
    userStore: isActiveUser?.slug
  })

  // console.log(data?.data)

  const tabsData = [
    {
      tabTitle: (
        <TabWrapper
          className=""
          onClick={() => {
            router.replace({
              pathname: '/vendor/products',
              query: {tab: 'all'}
            })
          }}
        >
          <p className="font-semibold">All</p>
          {query?.tab === 'all' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabWrapper>
      ),
      tabBody: (
        <ProductTable
          isActiveUser={isActiveUserShippingMethods}
          setShowShipping={setShowShipping}
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
              pathname: '/vendor/products',
              query: {tab: 'published'}
            })
          }}
          className=""
        >
          <p className="font-semibold">Published</p>

          {query?.tab === 'published' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabWrapper>
      ),
      tabBody: (
        <ProductTable
          isActiveUser={isActiveUserShippingMethods}
          setShowShipping={setShowShipping}
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'published'
    },
    {
      tabTitle: (
        <TabWrapper
          className=""
          onClick={() => {
            router.replace({
              pathname: '/vendor/products',
              query: {tab: 'draft'}
            })
          }}
        >
          <p className="font-semibold">Draft</p>

          {query?.tab === 'draft' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabWrapper>
      ),
      tabBody: (
        <ProductTable
          isActiveUser={isActiveUserShippingMethods}
          setShowShipping={setShowShipping}
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'draft'
    },
    {
      tabTitle: (
        <TabBodyWrapper
          className=""
          onClick={() => {
            router.replace({
              pathname: '/vendor/products',
              query: {tab: 'unavailable'}
            })
          }}
        >
          <p className="font-semibold">Unavailable</p>

          {query?.tab === 'unavailable' && <CountWrapper>{data?.data?.total}</CountWrapper>}
        </TabBodyWrapper>
      ),
      tabBody: (
        <ProductTable
          isActiveUser={isActiveUserShippingMethods}
          setShowShipping={setShowShipping}
          updateQueryParams={updateQueryParams}
          queryParams={queryParams}
          isFetching={isFetching}
          loading={isLoading}
          data={data?.data}
        />
      ),
      path: 'unavailable'
    }
  ]

  const filterMenu: MenuProps = {
    items: [
      {
        label: 'Price',
        key: '1',
        children: [
          {
            label: 'Highest',
            key: '1-1',
            onClick: () => {
              if (queryParams?.sort_price == 'highest') {
                updateQueryParams({
                  sort_price: ''
                })
              } else {
                updateQueryParams({
                  sort_price: 'highest'
                })
              }
            }
          },
          {
            label: 'Lowest',
            key: '1-2',
            onClick: () => {
              if (queryParams?.sort_price == 'lowest') {
                updateQueryParams({
                  sort_price: ''
                })
              } else {
                updateQueryParams({
                  sort_price: 'lowest'
                })
              }
            }
          }
        ]
      },
      {
        label: 'Date',
        key: '2',
        children: [
          {
            label: 'Oldest',
            key: '2-1',
            onClick: () => {
              if (queryParams?.sort_date == 'oldest') {
                updateQueryParams({
                  sort_date: ''
                })
              } else {
                updateQueryParams({
                  sort_date: 'oldest'
                })
              }
            }
          },
          {
            label: 'Newest',
            key: '2-2',
            onClick: () => {
              if (queryParams?.sort_date == 'newest') {
                updateQueryParams({
                  sort_date: ''
                })
              } else {
                updateQueryParams({
                  sort_date: 'newest'
                })
              }
            }
          }
        ]
      }
    ]
  }

  return (
    <React.Fragment>
      <Content className="mt-[47px] rounded-md bg-white py-[2px] text-[#000]">
        {' '}
        <div className="">
          {' '}
          <CustomRouteTab
            extra={
              <div className="hidden lg:block">
                {' '}
                <Dropdown trigger={['click']} menu={filterMenu}>
                  {/* <Button className="flex justify-between">
              <span>Filter</span>
              <Icon icon="tabler:dots" className="text-2xl" />{' '}
            </Button> */}
                  <Button
                    onClick={() => {}}
                    style={{
                      backgroundColor: '#fff',
                      color: 'black',
                      border: '1px solid black',
                      // Force the styles to remain the same on hover
                      transition: 'none' // Disable any transitions
                    }}
                    htmlType="button"
                    className="flex justify-between gap-3 whitespace-nowrap rounded-lg bg-[#fff] py-[20px] font-bold"
                  >
                    Filter
                    <Icon icon="mi:filter-1" className="text-2xl" />
                    {/* <Icon icon="tabler:dots" />{' '} */}
                  </Button>
                </Dropdown>
              </div>
            }
            elements={tabsData}
            className="custom-tab"
          />
        </div>
      </Content>
    </React.Fragment>
  )
}

export const TabWrapper = tw.div`flex w-full items-center justify-center gap-3 text-[13px]`

export const CountWrapper = tw.div`rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black`

export default ProductContainer
