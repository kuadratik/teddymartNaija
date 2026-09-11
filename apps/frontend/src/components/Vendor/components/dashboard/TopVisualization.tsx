import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Tooltip} from 'antd'
import React from 'react'

interface TopVisualizationProps {
  data: {
    title: 'Total Revenue' | 'Payout Accrued' | 'My Customers' | 'Products Listed' | 'Orders Fulfilled'
    icon: string
    tooltipTitle: string
  }
  loading?: boolean
  url?: string
  value?: React.ReactNode
}

const TopVisualization: React.FC<TopVisualizationProps> = ({data, value}: TopVisualizationProps) => {
  return (
    <div className="flex-1 rounded-[10px] bg-white p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <TextComponent as="p" className="text-[16px] font-normal leading-[19px] text-[#000000]">
            {data?.title}
          </TextComponent>

          <Tooltip title={<p className="text-black">{data?.tooltipTitle}</p>} color="white">
            <Icon icon="material-symbols:info-outline" />{' '}
          </Tooltip>
        </div>

        <div
          className={`self-end rounded-[12px] p-4 ${data?.title === 'Total Revenue' ? 'bg-[#D4FFE6]' : data?.title === 'Orders Fulfilled' ? 'bg-[#FFEBEA]' : data?.title === 'My Customers' ? 'bg-[#FFFAEA]' : 'bg-[#EFEAFF]'}`}
        >
          <Icon
            icon={data?.icon}
            className={`text-2xl ${data?.title === 'Total Revenue' ? 'text-[#259240]' : data?.title === 'Orders Fulfilled' ? 'text-[#FF3B30]' : data?.title === 'My Customers' ? 'text-[#FF9500]' : 'text-[#AF52DE]'}`}
          />
        </div>

        <TextComponent as="h1" className="text-[24px] font-semibold leading-[19px] text-[#000000]">
          {value}
        </TextComponent>
      </div>
    </div>
  )
}

export default TopVisualization
