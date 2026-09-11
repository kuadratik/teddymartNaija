import BaseLayout from '@/components/Layout/BaseLayout'
import ProductInfo from '@/components/Store/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import React from 'react'

const ProductDetailsPage = () => {
  return (
    <div className="my-8">
      <div className="flex w-full flex-col gap-8">
        <div className="px-[20px] lg:px-20">
          <TopBar title="Product Info" showClip />
        </div>
        <div className="mt-[60px]">
          <ProductInfo />
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
