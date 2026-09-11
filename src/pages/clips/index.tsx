import ClipsComponent from '@/components/Clips'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useRouter} from 'next/router'

const ClipsPage = () => {
  const router = useRouter()
  return (
    <>
      <SEOHead
        title={`myEKI | Clips`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col gap-8">
              <ClipsComponent />
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

ClipsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default ClipsPage
