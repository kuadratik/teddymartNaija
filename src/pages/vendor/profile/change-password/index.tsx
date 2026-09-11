import {FormContainer} from '@/components/Auth/Signup/Onboarding'
import BaseLayout from '@/components/Layout/BaseLayout'
import ChangePasswordComponent from '@/components/Profile/ChangePassword'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {AnimatePresence} from 'framer-motion'
import React from 'react'

const ChangePassword = () => {
  return (
    <VendorLayout>
      <BaseLayout>
        <div className="flex w-full flex-col gap-8">
          <TopBar title="Change Password" />
          {/* <AnimatePresence>
            <FormContainer isActive={true} id={'store-information'}> */}
          <div className="mt-[60px]">
            {' '}
            <ChangePasswordComponent />
          </div>
          {/* </FormContainer>
          </AnimatePresence> */}
        </div>
      </BaseLayout>
    </VendorLayout>
  )
}

export default ChangePassword
