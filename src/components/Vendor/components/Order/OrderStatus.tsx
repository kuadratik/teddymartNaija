import TextComponent from '@/components/SharedUI/TextComponent'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Layout, Timeline} from 'antd'
import React from 'react'
import {StyledContentWrapper} from './OrderDetailsComponent'

const {Content} = Layout

const orderStatus = [
  {
    name: 'Order Placed - Wed, 15 Dec 2024',
    title: 'An Order has been placed',
    time: 'Wed, 15 Dec 2021 - 05:34PM',
    icon: 'solar:cart-bold-duotone'
  },
  {
    name: 'Shipped - Thur, 16 Dec 2024',
    title: 'Your item has been shipped',
    time: 'Sat, 18 Dec 2021 - 4.54PM',
    icon: 'material-symbols-light:package-2-sharp'
  },
  {
    name: 'Order Placed - Wed, 15 Dec 2024',
    title: 'An Order has been placed',
    time: 'Wed, 15 Dec 2021 - 05:34PM',
    icon: 'flat-color-icons:shipped'
  },
  {
    name: 'Order Placed - Wed, 15 Dec 2024',
    title: 'An Order has been placed',
    time: 'Wed, 15 Dec 2021 - 05:34PM',
    icon: 'hugeicons:package-delivered'
  }
]

const OrderStatus = () => {
  return (
    <div className="">
      {' '}
      <StyledContentWrapper className="mt-8">
        <div className="flex justify-between border-b-[1.5px]">
          {' '}
          <TextComponent as="p" className="py-5 text-[16px] font-semibold leading-[15.23px] text-black">
            Order Status
          </TextComponent>
        </div>
        <div className="p-[30px]">
          {' '}
          <Timeline className="custom-timeline">
            {orderStatus.map((item, index) => (
              <Timeline.Item
                key={index}
                dot={
                  <CustomDot first={index === 0}>
                    <Icon icon={item.icon} color={index === 0 ? 'white' : 'black'} width={12} height={12} />
                  </CustomDot>
                }
              >
                <div className="flex flex-col gap-4 text-[14px]">
                  {' '}
                  <p className="font-semibold text-[#6B7280]">{item.name}</p>
                  <p className="font-normal text-[#6B7280]">{item.title}</p>
                  <p className="font-normal text-[#6B7280]">{item.time}</p>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>

        {/* <TimeLineContainer className="mt-[32px]">
          {orderStatus?.map((order, id) => {
            return (
              <TimeLineAction key={id}>
                <div className="rail" />
                <div className="content">
                  <p className="header">{order.name}</p>
                </div>
              </TimeLineAction>
            )
          })}
        </TimeLineContainer> */}
      </StyledContentWrapper>
    </div>
  )
}

// Custom Dot Component with Conditional Styling
const CustomDot = styled.div<{first: boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => (props.first ? 'black' : 'lightgray')};
  color: ${props => (props.first ? 'white' : 'black')};
`

export default OrderStatus
