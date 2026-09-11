import ServiceInfoPage from '@/components/Service/info'
import SEOHead from '@/components/SharedUI/SEOHead'
import TopBar from '@/components/Vendor/TopBar'

const ServiceInfo = () => {
  return (
    <>
      <SEOHead
        title={`myEKI | Service Info`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <div className="my-8">
        <div className="mx-auto max-w-[900px]">
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
      </div>
    </>
  )
}

export default ServiceInfo
