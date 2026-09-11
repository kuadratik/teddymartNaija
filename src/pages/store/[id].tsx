import BaseLayout from '@/components/Layout/BaseLayout'
import VendorStore from '@/components/Store'
import TopBar from '@/components/Vendor/TopBar'
import {useRouter} from 'next/router'
import React from 'react'

const VendorStorePage = () => {
  const router = useRouter()

  return (
    <BaseLayout>
      <div className="md:my-8">
        <div className="mx-auto max-w-[900px]">
          {' '}
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
        </div>
      </div>
    </BaseLayout>
  )
}

export default VendorStorePage
