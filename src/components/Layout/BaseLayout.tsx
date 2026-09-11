import React from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  children: React.ReactNode
  className?: string
}
const BaseLayout = ({children, className}: IProps) => {
  return (
    <>
      <div className={twMerge('my-8 px-[20px] lg:my-0 lg:px-0', className)}>{children}</div>
    </>
  )
}

export default BaseLayout
