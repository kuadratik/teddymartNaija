import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import OrderDetailsComponent from '@/components/Vendor/components/Order/OrderDetails'
import OrderLogisticsView from '@/components/Vendor/components/Order/OrderLogisticsView'
import React from 'react'

const OrderDetails = () => {
  return (
    <div>
      {' '}
      <DashboardHeader btnText="Back" title="Order Details" showInput={true} />
      <div className="mt-[47px] gap-6 md:flex">
        <div className="flex-[4]">
          {' '}
          <OrderDetailsComponent />
        </div>

        <div className="flex-shrink-0 md:w-[400px]">
          <OrderLogisticsView />
        </div>
      </div>
    </div>
  )
}

OrderDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default OrderDetails
