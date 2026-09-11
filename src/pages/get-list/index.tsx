import Category from '@/components/Auth/Products/components/Category'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import CreateYourBusiness from '@/components/Business/CreateYourBusiness'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useState} from 'react'

const GetList = () => {
  return (
    <div>
      <SEOHead
        title={`Get Listed | myEKI`}
        description="Get Listed on myEKI and start selling for free! Find products and services near you!!"
      />
      <main className="flex w-full flex-col gap-8">
        <div className="flex w-full flex-col">
          {/* <div className="flex w-full flex-col-reverse lg:flex-col">
            <NewNavigation />
          </div> */}
        </div>
        <CreateYourBusiness />
      </main>
    </div>
  )
}

GetList.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default GetList
