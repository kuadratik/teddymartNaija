import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import InvoiceView from '@/components/Vendor/components/Order/InvoiceView'
import OrderDetailsComponent from '@/components/Vendor/components/Order/OrderDetailsComponent'
import OrderLogisticsView from '@/components/Vendor/components/Order/OrderLogisticsView'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetVendorOrderDetailsQuery} from '@/services/vendor/vendor'
import {useRouter} from 'next/router'
import React, {useState} from 'react'

const OrdersPage = () => {
  const router = useRouter()

  const [current, setCurrent] = useState(1)

  const {id} = router.query

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const {data: orderData, isLoading} = useGetVendorOrderDetailsQuery({
    userStore: isActiveUser?.slug!,
    listing: id as string
  })

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  const data = orderData?.data

  return (
    <div>
      {' '}
      <DashboardHeader
        btnText="Back"
        titleHeader="Invoice"
        onClick={() => {
          current == 1 ? router.back() : setCurrent(1)
        }}
        showInput={false}
      />
      {current == 1 ? (
        <div className="mt-[47px] gap-6 md:flex">
          <div className="flex-[4]">
            {' '}
            <OrderDetailsComponent data={data} setCurrent={setCurrent} current={current} />
          </div>

          <div className="flex-shrink-0 md:w-[400px]">
            <OrderLogisticsView data={data} />
          </div>
        </div>
      ) : (
        <div className="mt-[47px]">
          <InvoiceView data={data} />
        </div>
      )}
    </div>
  )
}

OrdersPage.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default OrdersPage
