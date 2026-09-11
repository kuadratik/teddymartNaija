import CustomRouteTab from '@/components/SharedUI/CustomTab'
import {Layout} from 'antd'
import React from 'react'
import OrderTable from '../Order/OrderTable'
import {CountWrapper, TabWrapper} from '../product/ProductContainer'
import PayoutInformation from './PayoutInformation'
import PayoutRequestTable from './PayoutRequestTable'
import PayoutCompleteTable from './PayoutCompleteTable'
import {useGetAllRequestedPayoutQuery, useGetProcessedPayoutQuery} from '@/services/vendor/payout'
import {useAppSelector} from '@/hooks/reduxHooks'

const {Content} = Layout

interface OrderContainerProps {
  searchValue?: string
  setSearchValue?: () => void
}

const PayoutContainer = ({setSearchValue, searchValue}: OrderContainerProps) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser)

  const {data: completeData} = useGetProcessedPayoutQuery({userStore: isActiveUser.slug})
  const {data: requestData} = useGetAllRequestedPayoutQuery({userStore: isActiveUser.slug})

  const tabsData = [
    {
      tabTitle: (
        <TabWrapper>
          <p className="font-semibold">Payout Information</p>
        </TabWrapper>
      ),
      tabBody: <PayoutInformation />,
      path: 'info'
    },
    {
      tabTitle: (
        <TabWrapper>
          <p className="font-semibold">Request Payout</p>

          <CountWrapper>{requestData?.data?.data.length}</CountWrapper>
        </TabWrapper>
      ),
      tabBody: <PayoutRequestTable />,
      path: 'request'
    },
    {
      tabTitle: (
        <TabWrapper>
          <p className="font-semibold">Payout Complete</p>

          <CountWrapper>{completeData?.data?.data.length}</CountWrapper>
        </TabWrapper>
      ),
      tabBody: <PayoutCompleteTable />,
      path: 'complete'
    }
  ]
  return (
    <React.Fragment>
      <Content className="mt-[47px] rounded-md bg-white py-[6px] text-[#000]">
        <div className="">
          <CustomRouteTab elements={tabsData} className="custom-tab" />
        </div>
      </Content>
    </React.Fragment>
  )
}

export default PayoutContainer
