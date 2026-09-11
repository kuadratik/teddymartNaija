import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import BulkUpload from '@/components/Vendor/components/Product/AddProduct/BulkUpload'
import React from 'react'

const BulkUploadPage = () => {
  return (
    <div>
      <DashboardHeader btnText="Back" titleHeader="Add Product" showInput={false} />
      <BulkUpload />
    </div>
  )
}

BulkUploadPage.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default BulkUploadPage
