import CustomRouteTab from '@/components/SharedUI/CustomTab'
import {Layout} from 'antd'
import React from 'react'
import OrderTable from './OrderTable'

const {Content} = Layout

interface OrderContainerProps {
  searchValue?: string
  setSearchValue?: () => void
}

const ProductContainer = ({setSearchValue, searchValue}: OrderContainerProps) => {
  const tabsData = [
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">All</p>
          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">12</div>
        </div>
      ),
      tabBody: <OrderTable />,
      path: 'all'
    },
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">New</p>

          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">5</div>
        </div>
      ),
      tabBody: <OrderTable />,
      path: 'new'
    },
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">Shipped</p>

          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">7</div>
        </div>
      ),
      tabBody: <OrderTable />,
      path: 'shipped'
    },
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">Cancelled</p>

          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">6</div>
        </div>
      ),
      tabBody: <OrderTable />,
      path: 'Cancelled'
    },
    {
      tabTitle: (
        <div className="flex w-full items-center justify-center gap-3">
          <p className="text-[14px] font-semibold">Delivered</p>

          <div className="rounded-[3px] bg-[#E4E4E4] px-[8px] py-[0.5px] text-black">2</div>
        </div>
      ),
      tabBody: <OrderTable />,
      path: 'Delivered'
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
