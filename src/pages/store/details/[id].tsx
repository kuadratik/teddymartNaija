import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import ProductInfo from '@/components/Store/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import {capitalizeFirstLetter} from '@/utils/fx'
import {useSelector} from 'react-redux'

const ProductDetailsPage = () => {
  const {type} = useSelector((state: any) => state.vendor)
  return (
    <>
      <SEOHead
        title={`myEKI | ${capitalizeFirstLetter(type)} Info`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col gap-8">
              <div className="px-[20px] lg:px-20">
                <TopBar title={`${capitalizeFirstLetter(type)} Info`} showClip />
              </div>
              <div className="mt-[60px]">
                <ProductInfo />
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default ProductDetailsPage
