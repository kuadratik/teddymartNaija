import CatalogView from '@/components/Customer/Catalog/CatalogView'
import CustomerLayout from '@/components/Layout/CustomerLayout'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import {Layout} from 'antd'
import {Image} from 'antd'
import React from 'react'

const {Header, Content, Footer} = Layout

const CatalogPage = () => {
  return (
    <div>
      <Content style={{marginTop: '6px'}} className="px-[10px] py-0 md:px-[85px]">
        <div className="p-[8px] md:p-[20px]">
          <div className="flex items-center justify-center rounded-[9px]">
            <Image
              src={`/assets/product_advert.jpg`}
              alt="product image"
              preview={false}
              // onLoadStart={() => {
              //   setIsLoadingImage(true)
              // }}
              // onLoad={() => {
              //   setIsLoadingImage(false)
              // }}
              onError={error => {
                error.currentTarget.src = '/assets/default_banner.jpg'
              }}
              // className={`${isLoadingImage ? 'blur-sm' : ''}`}
            />
          </div>

          <div className="mt-[50px]">
            <CatalogView />
          </div>
        </div>
      </Content>
    </div>
  )
}

CatalogPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default CatalogPage
