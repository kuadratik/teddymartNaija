import BaseLayout from '@/components/Layout/BaseLayout'
import PersonalInformation from '@/components/Profile/PersonalInformation'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {useRouter} from 'next/router'
import React from 'react'

const PersonalInformationPage = () => {
  return (
    <VendorLayout>
      <BaseLayout>
        <div className="flex w-full flex-col gap-8">
          <TopBar title="Edit Personal Information" />

          <div className="mt-[60px]">
            {' '}
            <PersonalInformation />
          </div>
        </div>
      </BaseLayout>
    </VendorLayout>
  )
}

export default PersonalInformationPage
