import LoginComponent from '@/components/Auth/Login'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'myEKI | Login',
  description:
    'myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!'
}

export default function LoginPage() {
  return (
    <CustomerLayout>
      <BaseLayout className="">
        <div className="lg:my-6">
          <LoginComponent />
        </div>
      </BaseLayout>
    </CustomerLayout>
  )
}
