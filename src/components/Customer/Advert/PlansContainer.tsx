import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {Checkbox} from 'antd'
import React from 'react'

interface AdvertPlan {
  id: string
  name: string
  price: string
  currency: string
  duration_days?: number
}

interface PlansContainerProps {
  loading: boolean
  advertPlans: any[]
  selectedPlanId: number
  onSelectPlan: (planId: string) => void
  errorMessage?: string
}

const PlansContainer: React.FC<PlansContainerProps> = ({
  loading,
  advertPlans,
  selectedPlanId,
  onSelectPlan,
  errorMessage
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-[22px]">
        {loading ? (
          <div className="flex h-[200px] w-full flex-col gap-5">
            {[1, 2, 3].map(item => (
              <div key={item} className="h-[47px] w-full animate-pulse rounded-[9px] bg-gray-300" />
            ))}
          </div>
        ) : (
          advertPlans?.map((plan: any, index) => (
            <div className="flex flex-col gap-1" key={plan.id}>
              <div className="rounded-[8px] bg-[#F9FAFB] px-2 py-4">
                <div className="flex cursor-pointer items-center gap-4" onClick={() => onSelectPlan(plan.id)}>
                  <Checkbox checked={selectedPlanId === plan.id} />
                  <TextComponent as="span" className="text-[13px] leading-[16px] text-[#6B7280]">
                    {plan.price === '0.00' ? (
                      plan.name
                    ) : (
                      <FormatNumberCurrency value={Number(plan.price)} currency={plan.currency} />
                    )}
                    {plan.duration_days ? ` (${plan.duration_days} days)` : ''}
                  </TextComponent>
                </div>
              </div>
              {errorMessage && advertPlans.length === index + 1 ? (
                <TextComponent as="span" className="text-[13px] leading-[16px] text-red-600">
                  {errorMessage}
                </TextComponent>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlansContainer
