import BaseLayout from '@/components/Layout/BaseLayout'
import VendorStore from '@/components/Store'
import TopBar from '@/components/Vendor/TopBar'
import React from 'react'

const VendorStorePage = () => {
  return (
    <BaseLayout>
      <div className="flex w-full flex-col gap-8">
        <TopBar title="Store" showClip />
        <div className="mt-[60px]">
          <VendorStore />
        </div>
        {/* <AnimatePresence>
            <FormContainer isActive={true} id={'store-information'}> */}
        {/* <ChangePasswordComponent /> */}
        {/* </FormContainer>
          </AnimatePresence> */}
      </div>
    </BaseLayout>
  )
}

export default VendorStorePage
