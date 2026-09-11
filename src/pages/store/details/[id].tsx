import BaseLayout from '@/components/Layout/BaseLayout'
import ProductInfo from '@/components/Store/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import {capitalizeFirstLetter} from '@/utils/fx'
import React, {use} from 'react'
import {useSelector} from 'react-redux'

const ProductDetailsPage = () => {
  const {type} = useSelector((state: any) => state.vendor)
  return (
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
  )
}

export default ProductDetailsPage
