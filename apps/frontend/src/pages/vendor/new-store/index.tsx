import Onboarding from '@/components/Auth/Signup/Onboarding'
import BaseLayout from '@/components/Layout/BaseLayout'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import NewStoreComponent from '@/components/Store/components/NewStore'
import VendorLayout from '@/components/Vendor/VendorLayout'
import React from 'react'

const NewStore = () => {
  return (
    <React.Fragment>
      <SEOHead
        title={`AfricanDiasporaMart | New Store`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <VendorLayout>
        <BaseLayout className="">
          <div className="">
            <div className="mx-auto max-w-[900px]">
              <div className="">
                <NewStoreComponent />{' '}
              </div>
            </div>
          </div>
        </BaseLayout>
      </VendorLayout>
    </React.Fragment>
  )
}
NewStore.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default NewStore
