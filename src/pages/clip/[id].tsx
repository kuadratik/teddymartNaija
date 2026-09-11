import ClipDeliveryView from '@/components/Customer/Clip/ClipDeliveryView'
import CustomerLayout from '@/components/Layout/CustomerLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import {Layout} from 'antd'
import React from 'react'

const {Content} = Layout

const ClipDeliveryPage = () => {
  return (
    <div>
      {' '}
      <Content style={{marginTop: '6px'}} className="px-[10px] py-0 md:px-[85px]">
        <div className="p-[8px] md:p-[20px]">
          <DashboardHeader btnText="Back" titleHeader="Delivery Address" showInput={false} />

          <div className="mt-[50px]">
            <ClipDeliveryView />
          </div>
        </div>
      </Content>
    </div>
  )
}

ClipDeliveryPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default ClipDeliveryPage
