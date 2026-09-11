import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Tooltip} from 'antd'
import React from 'react'

export interface StatCardData {
  title: string
  value: string | number
  icon: string
  tooltipTitle: string
  bgColor: string
  iconColor: string
}

interface StatCardProps {
  data: StatCardData
  loading?: boolean
}

const StatCard: React.FC<StatCardProps> = ({data, loading = false}) => {
  if (loading) {
    return (
      <div className="flex-1 animate-pulse rounded-[10px] bg-white p-6">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
          <div className="h-12 w-12 self-end rounded-[12px] bg-gray-200"></div>
          <div className="h-6 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 rounded-[10px] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <TextComponent as="p" className="text-[16px] font-normal leading-[19px] text-[#000000]">
            {data.title}
          </TextComponent>
          <Tooltip title={<p className="text-black">{data.tooltipTitle}</p>} color="white">
            <Icon icon="material-symbols:info-outline" className="text-gray-400" />
          </Tooltip>
        </div>

        <div className={`self-end rounded-[12px] p-4 ${data.bgColor}`}>
          <Icon icon={data.icon} className={`text-2xl ${data.iconColor}`} />
        </div>

        <TextComponent as="h1" className="text-[24px] font-semibold leading-[19px] text-[#000000]">
          {data.value}
        </TextComponent>
      </div>
    </div>
  )
}

export default StatCard
