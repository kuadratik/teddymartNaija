import React from 'react'
import VendorLogo from '../Auth/Products/components/Logo'

interface LogoHeaderProps {
  text?: string
}
const LogoHeader = (props: LogoHeaderProps) => {
  const {text} = props
  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        {' '}
        <VendorLogo />
        <p className="text-[19px] font-bold">EKI</p>
      </div>
      <p className="text-center text-[8px] font-normal text-[#9796A1]">{text ?? 'A TeddyMart Brand'}</p>
    </div>
  )
}

export default LogoHeader
