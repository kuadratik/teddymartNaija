import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import Reviewtable from '@/components/Vendor/components/Reviews/Reviewtable'
import useQueryParams from '@/hooks/useQueryParams'
import debounce from '@/utils/debounce'
import React, {useCallback, useState} from 'react'

const ReviewsPage = () => {
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
        showBtn={true}
        btnText="Start Conversation"
        titleHeader="Reviews"
        searchValue={queryString ?? ''}
        setSearchValue={e => {
          setQueryString(e)
          debouncedSearch(e as string)
        }}
      />

      <Reviewtable />
    </div>
  )
}

ReviewsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default ReviewsPage
