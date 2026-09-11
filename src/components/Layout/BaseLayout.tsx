import {useAppSelector} from '@/hooks/reduxHooks'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  children: React.ReactNode
  className?: string
}
const BaseLayout = ({children, className}: IProps) => {
  return <div className={twMerge('my-8 px-[20px] lg:px-20', className)}>{children}</div>
}

export default BaseLayout
