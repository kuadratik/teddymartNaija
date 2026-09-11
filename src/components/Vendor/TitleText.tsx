import React from 'react'
import TextComponent from '../SharedUI/TextComponent'

export interface ITitleText {
  title: string
}

const TitleText = ({title}: ITitleText) => {
  return (
    <div className="mb-6 flex h-[50px] items-center justify-center rounded-[12px] bg-[#EDEDED] px-4 py-3">
      <TextComponent as="h4" className="text-[16px] font-bold leading-[20px] text-[#1D1D1D]">
        {title}
      </TextComponent>
    </div>
  )
}

export default TitleText
