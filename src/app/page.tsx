import LandingPage from '@/components/Auth/Products'
import CustomerLayout from '@/components/Layout/Customerlayout'
import {MallPageStructuredData} from '@/components/SEOSturcturedData/MallPageStructuredData'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'myEKI | Mall',
  description:
    'myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!'
}

export default function HomePage() {
  return (
    <CustomerLayout className="px-0" maxWidth={false} landingBool={false}>
      <MallPageStructuredData />
      <main className="">
        <LandingPage />
      </main>
    </CustomerLayout>
  )
}
