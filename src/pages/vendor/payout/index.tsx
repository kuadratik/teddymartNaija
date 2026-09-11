// pages/dashboard.tsx

import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import TextComponent from '@/components/SharedUI/TextComponent'
// import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
// import OrderContainer from '@/components/Vendor/components/Order/OrderContainer'
// import PayoutContainer from '@/components/Vendor/components/payout/PayoutContainer'
// import OrderContainer from '@/components/Vendor/components/Order/OrderContainer'
import useQueryParams from '@/hooks/useQueryParams'
import debounce from '@/utils/debounce'
import {useRouter} from 'next/router'
import {useCallback, useEffect, useState} from 'react'

const PayoutPage = () => {
  // const router = useRouter()
  // const [tab, setTab] = useState<string | undefined>()

  // useEffect(() => {
  //   if (router.isReady) {
  //     setTab(router.query.tab as string)
  //   }
  // }, [router.isReady, router.query])

  // const {queryParams, updateQueryParams} = useQueryParams<any>({
  //   search: ''
  // })

  // const [queryString, setQueryString] = useState(queryParams?.search ?? '')

  // // * This debounce function update the search queryParams and delays executing the api request
  // const debouncedSearch = useCallback(
  //   debounce((value: string) => {
  //     updateQueryParams({
  //       search: value ?? ''
  //     })
  //   }, 1000),
  //   []
  // )

  return (
    <div>
      {/* <DashboardHeader
        showBtn={false}
        titleHeader="Payout"
        searchValue={queryString ?? ''}
        setSearchValue={e => {
          setQueryString(e)
          debouncedSearch(e as string)
        }}
        showInput={tab == 'request' || tab == 'complete'}
      /> */}

      <TextComponent as="h1" className="text-[24px] font-semibold leading-[30px] text-black">
        Payout
      </TextComponent>

      {/* <PayoutContainer /> */}
    </div>
  )
}

PayoutPage.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default PayoutPage
