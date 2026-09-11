import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import VendorStore from '@/components/Store'
import TopBar from '@/components/Vendor/TopBar'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {useRouter} from 'next/router'

const VendorStorePage = () => {
  const router = useRouter()
  console.log('🚀 ~ VendorStorePage ~ router:', router)

  return (
    <>
      <SEOHead
        title={`myEKI | ${capitalizeOnlyFirstLetter(router?.query?.id as string)}`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            {' '}
            <div className="flex w-full flex-col gap-8">
              <TopBar title="Store" showClip />
              <div className="mt-[60px]">
                <VendorStore />
              </div>
              {/* <AnimatePresence>
            <FormContainer isActive={true} id={'store-information'}> */}
              {/* <ChangePasswordComponent /> */}
              {/* </FormContainer>
          </AnimatePresence> */}
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default VendorStorePage
