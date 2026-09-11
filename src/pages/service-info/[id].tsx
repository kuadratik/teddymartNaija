import BaseLayout from '@/components/Layout/BaseLayout'
import ServiceInfoPage from '@/components/Service/info'
import TopBar from '@/components/Vendor/TopBar'
import React from 'react'

const ServiceInfo = () => {
  return (
    <div className="my-8">
      <div className="flex w-full flex-col gap-8">
        <div className="px-[20px] lg:px-20">
          {' '}
          <TopBar title="My Clips" service_types={true} />
        </div>
        <div className='"mt-[60px]"'>
          {' '}
          <ServiceInfoPage />
        </div>
      </div>
    </div>
  )
}

export default ServiceInfo
