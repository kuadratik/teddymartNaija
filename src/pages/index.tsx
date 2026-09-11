import LandingPage from '@/components/Auth/Products'
import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'

export default function Home() {
  return (
    <div>
      <SEOHead
        title={`myEKI | Home`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <main className="">
          <LandingPage />
        </main>
      </BaseLayout>
    </div>
  )
}
