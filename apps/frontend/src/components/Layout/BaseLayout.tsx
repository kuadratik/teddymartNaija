import React from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  children: React.ReactNode
  className?: string
}
const BaseLayout = ({children, className}: IProps) => {
  return (
    <>
      <div className={twMerge('my-2 px-[15px] lg:my-0 lg:px-0', className)}>{children}</div>
    </>
  )
}

export default BaseLayout
