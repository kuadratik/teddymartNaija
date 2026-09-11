import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import PayoutContainer from '@/components/Vendor/components/payout/PayoutContainer'

const PayoutPage = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-[24px] font-semibold">Payout</h1>

      {/* <DashboardHeader
        showBtn={false}
        titleHeader="Payout"
        searchValue={queryString ?? ''}
        setSearchValue={e => {
          setQueryString(e)
          debouncedSearch(e as string)
        }}
      /> */}

      <PayoutContainer />
    </div>
  )
}

PayoutPage.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default PayoutPage
