import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import InvoiceView from '@/components/Vendor/components/Order/Invoice/InvoiceView'
import React from 'react'

const InvoiceComponent = () => {
  return (
    <div>
      {' '}
      <DashboardHeader btnText="Back" titleHeader="Invoice" showInput={false} />
      <div className="mt-[47px]">
        <InvoiceView />
      </div>
    </div>
  )
}

InvoiceComponent.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default InvoiceComponent
