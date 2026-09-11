import BaseLayout from '@/components/Layout/BaseLayout'
import VendorProfileStoreInformation from '@/components/Profile/StoreInformation'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import React from 'react'

const EditStore = () => {
  return (
    <VendorLayout>
      <BaseLayout>
        <div className="flex w-full flex-col gap-8">
          <TopBar title="Edit Store Information" />
          <div className="mt-[60px]">
            <VendorProfileStoreInformation />
          </div>
        </div>
      </BaseLayout>
    </VendorLayout>
  )
}

export default EditStore
