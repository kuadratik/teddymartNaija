// pages/dashboard.tsx

import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import OrderContainer from '@/components/Vendor/components/Order/OrderContainer'
import PoductContainer from '@/components/Vendor/components/Product/ProductContainer'
import useQueryParams from '@/hooks/useQueryParams'
import debounce from '@/utils/debounce'
import {useCallback, useState} from 'react'

const OrderPage = () => {
  const {queryParams, updateQueryParams} = useQueryParams<any>({
    search: ''
  })

  const [queryString, setQueryString] = useState(queryParams?.search ?? '')

  // * This debounce function update the search queryParams and delays executing the api request
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateQueryParams({
        search: value ?? ''
      })
    }, 1000),
    []
  )

  return (
    <div>
      <DashboardHeader
        showBtn={false}
        titleHeader="Order History"
        searchValue={queryString ?? ''}
        setSearchValue={e => {
          setQueryString(e)
          debouncedSearch(e as string)
        }}
      />

      <OrderContainer />
    </div>
  )
}

OrderPage.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default OrderPage
