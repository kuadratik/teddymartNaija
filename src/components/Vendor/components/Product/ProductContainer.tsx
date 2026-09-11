import CustomRouteTab from '@/components/SharedUI/CustomTab'
import {Button, Layout} from 'antd'
import React from 'react'
import ProductTable from './ProductTable'

const {Content} = Layout

interface ProductContainerProps {
  searchValue?: string
  setSearchValue?: () => void
}

const ProductContainer = ({setSearchValue, searchValue}: ProductContainerProps) => {
  const tabsData = [
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">All</p>
          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">12</div>
        </div>
      ),
      tabBody: <ProductTable />,
      path: 'all'
    },
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">Published</p>

          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">5</div>
        </div>
      ),
      tabBody: <ProductTable />,
      path: 'published'
    },
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">Draft</p>

          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">7</div>
        </div>
      ),
      tabBody: <ProductTable />,
      path: 'draft'
    },
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">Unavailable</p>

          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">6</div>
        </div>
      ),
      tabBody: <ProductTable />,
      path: 'unavailable'
    }
  ]
  return (
    <React.Fragment>
      <Content className="mt-[47px] rounded-md bg-white py-[6px] text-[#000]">
        {' '}
        <div className="">
          {' '}
          <CustomRouteTab elements={tabsData} className="custom-tab" />
        </div>
      </Content>
    </React.Fragment>
  )
}

export default ProductContainer
