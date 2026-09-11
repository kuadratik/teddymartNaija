import ClipView from '@/components/Customer/Clip/ClipView'
import CustomerLayout from '@/components/Layout/CustomerLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import {Layout} from 'antd'
import React from 'react'

const {Header, Content, Footer} = Layout

const ClipPage = () => {
  return (
    <div>
      <Content style={{marginTop: '6px'}} className="px-[10px] py-0 md:px-[85px]">
        <div className="p-[8px] md:p-[20px]">
          <DashboardHeader btnText="Back" titleHeader="My Clips" showInput={false} />

          <div className="mt-[50px]">
            <ClipView />
          </div>
        </div>
      </Content>
    </div>
  )
}

ClipPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default ClipPage
