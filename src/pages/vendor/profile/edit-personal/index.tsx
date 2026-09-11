import BaseLayout from '@/components/Layout/BaseLayout'
import PersonalInformation from '@/components/Profile/PersonalInformation'
import SEOHead from '@/components/SharedUI/SEOHead'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'

const PersonalInformationPage = () => {
  return (
    <>
      <SEOHead
        title={`myEKI | Edit Personal Information`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
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
    </>
  )
}

export default PersonalInformationPage
