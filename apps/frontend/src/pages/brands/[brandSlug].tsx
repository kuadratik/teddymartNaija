import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useGetBrandBySlugQuery} from '@/services/brands/brands'
import {Button, Spin} from 'antd'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

interface BrandSlugPageProps {
  brandSlug: string
}

const BrandSlugPage = ({brandSlug}: BrandSlugPageProps) => {
  const router = useRouter()
  const {data: brandResponse, isLoading, error} = useGetBrandBySlugQuery(brandSlug)

  useEffect(() => {
    // If we have a successful response with a redirect URL, redirect immediately
    if (brandResponse?.success && brandResponse.data) {
      window.location.href = brandResponse.data
    }
  }, [brandResponse])

  // Show loading state
  if (isLoading) {
    return (
      <>
        <SEOHead title="myEKI | Loading Brand..." description="Loading brand information..." />
        <BaseLayout className="px-0">
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spin size="large" />
          </div>
        </BaseLayout>
      </>
    )
  }

  // Show coming soon page if no redirect URL or error
  if (!brandResponse?.data || error) {
    return (
      <>
        <SEOHead title="myEKI | Brand Coming Soon" description="This brand is coming soon to myEKI marketplace." />
        <BaseLayout className="px-0">
          {/* Fixed Overlay Modal - Cannot be dismissed */}
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 py-8 backdrop-blur-sm">
            <div className="relative mx-auto w-full max-w-md">
              <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-black px-6 py-12 text-center shadow-2xl">
                <div className="flex flex-col items-center justify-center">
                  <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={100} />
                  <TextComponent as="p" className="text-[10px] font-normal leading-[22px] text-white">
                    Find what you love, easily!
                  </TextComponent>
                </div>

                {/* Coming Soon Illustration */}
                <Image
                  src="/assets/brands/brands-empty.svg"
                  alt="Brand coming soon"
                  width={120}
                  height={120}
                  className="text-white/80"
                />

                {/* Content */}
                <div className="max-w-sm space-y-2">
                  <h1 className="text-lg font-medium leading-relaxed text-white">
                    This brand's offer is currently being updated.
                    <br />
                    Please check back soon.
                  </h1>
                </div>

                {/* Navigation Buttons */}
                <div className="flex w-full justify-between gap-3">
                  <Link href="/brands">
                    <Button
                      size="large"
                      className="h-12 w-full rounded-xl border-2 border-white bg-transparent text-base font-medium text-white hover:bg-white hover:text-black md:px-8"
                    >
                      Back to Brands
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button
                      type="primary"
                      size="large"
                      className="h-12 w-full rounded-xl bg-white text-base font-medium text-black hover:bg-gray-100 md:px-12"
                    >
                      Visit the Mall
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Page content below (will be covered by overlay) */}
          <div className="min-h-screen opacity-0">{/* Placeholder content */}</div>
        </BaseLayout>
      </>
    )
  }

  // This should not be reached due to the useEffect redirect, but just in case
  return (
    <>
      <SEOHead title="myEKI | Redirecting..." description="Redirecting to brand page..." />
      <BaseLayout className="px-0">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Redirecting...</p>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {brandSlug} = context.params!

  try {
    // Make server-side API call to check if brand exists and get redirect URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/front/brand/${brandSlug}`)
    const data = await response.json()

    // If we have a valid redirect URL, perform server-side redirect
    if (data.success && data.data) {
      return {
        redirect: {
          destination: data.data,
          permanent: false
        }
      }
    }

    // If no redirect URL, continue to render the coming soon page
    return {
      props: {
        brandSlug: brandSlug as string
      }
    }
  } catch (error) {
    // If API call fails, continue to render the coming soon page
    return {
      props: {
        brandSlug: brandSlug as string
      }
    }
  }
}

BrandSlugPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default BrandSlugPage
