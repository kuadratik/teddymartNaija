import VerifyVendorComponent from '@/components/Auth/Signup/Verify'
import BaseLayout from '@/components/Layout/BaseLayout'
import React from 'react'

const VerifyVendorPage = () => {
  return (
    <React.Fragment>
      <BaseLayout className="">
        <div className="">
          <VerifyVendorComponent />{' '}
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default VerifyVendorPage
