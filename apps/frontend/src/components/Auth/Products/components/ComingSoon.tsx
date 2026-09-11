import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import Image from 'next/image'
import React from 'react'

type IComingSoonProps = {
  onClose: () => void
}

const ComingSoon = ({onClose}: IComingSoonProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 bg-black">
      <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={220} height={29} />
      <Image src={'/assets/coming-soon.png'} alt="coming soon" width={600} height={200} />
      <CustomButton onClick={() => onClose()} className="w-[154px] bg-white">
        <TextComponent as="span" className="text-[16px] font-semibold leading-[32px] text-[#000000]">
          Ok
        </TextComponent>
      </CustomButton>
    </div>
  )
}

export default ComingSoon
