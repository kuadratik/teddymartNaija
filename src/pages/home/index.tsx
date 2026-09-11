import LandingContactForm from '@/components/Landing/LandingContactForm'
import LandingFaq from '@/components/Landing/LandingFaq'
import SectionFourLanding from '@/components/Landing/SectionFourLanding'
import SectionThreeLanding from '@/components/Landing/SectionThreeLanding'
import SectionTwoLanding from '@/components/Landing/SectionTwoLanding'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React from 'react'

const LandingPage = () => {
  const router = useRouter()
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuthenticated = isAuthenticatedToken
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isStartSelling = isAuthenticatedUser ? '/vendor/new-store' : '/auth/sign-up?redirect=/vendor/new-store' // redirect to vendor page if user is authenticated

  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | Home`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <div className="mx-auto max-w-7xl lg:my-8 lg:px-8 xl2:px-0">
          {/* hero section */}
          <div className="rounded-[50px] bg-[#F0F0F0] px-[20px] py-[50px] lg:px-[100px]">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 lg:flex-row">
              <div className="lg:w-[41%]">
                <h2 className="playfair-display-font text-center text-[35px] leading-[56px] lg:text-left lg:text-[48px]">
                  <span className="inline-block">
                    <Icon icon="la:slack-hash" className="text-[35px]" />
                  </span>{' '}
                  <span className="text-[#4D4D4D]">1</span> Largest Hub{' '}
                  <span className="text-[#4D4D4D]">for Local & Global</span> Commerce
                </h2>
                <p className="mx-auto mt-5 w-[70%] text-center font-[500] text-[#4D4D4D] lg:mx-0 lg:text-left">
                  Vendors, Riders, Shippers, Ads & Directories – All in One
                </p>
                <div className="mx-auto mt-8 flex items-center justify-center gap-6 sm:w-[80%] lg:mx-0 lg:justify-between">
                  <CustomButton
                    className="flex items-center justify-center gap-2 rounded-[5px] bg-[#434343] px-5 py-3.5 text-center font-semibold text-white hover:bg-[#4D4D4D]"
                    onClick={() => router.push('/')}
                    type="button"
                  >
                    <Icon icon="el:shopping-cart" className="text-[15px]" /> Shop Now
                  </CustomButton>
                  <CustomButton
                    className="flex items-center justify-center gap-2 rounded-[5px] bg-black px-5 py-3.5 text-center font-semibold text-white hover:opacity-80"
                    onClick={() => router.push(isStartSelling)}
                    type="button"
                  >
                    <Icon icon="solar:shop-bold-duotone" className="text-[15px]" /> Start Selling
                  </CustomButton>
                </div>
              </div>
              <Image
                src={'/assets/landing/hero-landing.png'}
                alt="myEKI"
                width={300}
                height={300}
                className="w-full lg:aspect-square lg:w-[55%] lg:object-contain"
              />
            </div>
          </div>
          {/* section 2 */}
          <div className="px-[20px] py-[50px] lg:px-[100px]">
            <SectionTwoLanding />
          </div>
        </div>
        {/* section 3 */}
        <div className="relative">
          <SectionThreeLanding isStartSelling={isStartSelling} />
        </div>
        {/* section 4 */}
        <div className="mx-auto max-w-7xl lg:my-8 lg:px-8 xl2:px-0">
          {/* hero section */}
          <div className="mt-10 rounded-[50px] bg-[#F0F0F0] px-[20px] lg:mt-0 lg:px-[100px]">
            <SectionFourLanding />
          </div>
        </div>
        {/* section 5 */}
        <div className="mx-auto max-w-7xl lg:my-8 lg:px-8 xl2:px-0">
          {/* hero section */}
          <div className="lg:px-[100px]">
            <LandingFaq />
          </div>
        </div>
        <div className="mx-auto max-w-7xl lg:my-8 lg:px-8 xl2:px-0">
          {/* hero section */}
          <div className="mb-10 lg:px-[100px]">
            <div className="rounded-[50px] bg-[#F0F0F0] px-[20px] py-[50px] lg:px-[100px]">
              <LandingContactForm />
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

LandingPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default LandingPage
