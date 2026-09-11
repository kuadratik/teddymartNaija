import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import React from 'react'

const Invite = () => {
  return (
    <div className="flex h-full flex-col items-center gap-4 rounded-[10px] bg-black p-8">
      <Icon icon="noto:wrapped-gift" className="text-[80px]" />

      <TextComponent as="p" className="whitespace-nowrap font-bold !text-white">
        Invite New Seller{' '}
      </TextComponent>
      <TextComponent as="p" className="text-center font-normal !text-[#EAECEF]">
        Refer a new seller to us and earn $10 per referral.{' '}
      </TextComponent>

      <div className="flex w-[50%] items-center rounded-[40px] bg-white px-4 md:w-[80%]">
        <div className="rounded-[25px] bg-black p-1">
          <Icon icon="lets-icons:send-duotone" className="text-[24px] text-white" />
        </div>
        <TextComponent as="p" className="ml-2 text-center font-normal leading-10 text-black">
          Invite Now
        </TextComponent>
      </div>
    </div>
  )
}

export default Invite
