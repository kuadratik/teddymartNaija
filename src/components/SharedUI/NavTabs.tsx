import useWindowResize from '@/hooks/useWindowResize'
import {useRouter} from 'next/router'
import React from 'react'

interface INavItem {
  id?: number
  title: string
  link?: string
  subLinks?: string[]
}

interface IProps {
  naveItems: INavItem[]
  active?: number
  setActive?: React.Dispatch<React.SetStateAction<number>> | undefined
  backgroundColor: string
}

const NavTabs = ({naveItems, active, setActive, backgroundColor}: IProps) => {
  const router = useRouter()
  const {width} = useWindowResize()

  const handleClick = (index: number, link?: string) => {
    if (setActive) {
      setActive(index)
    }
    // only use router if link is not null
    if (link) {
      router.push(link)
    }
  }

  return (
    <div
      style={{
        backgroundColor: backgroundColor
      }}
      className={`statsCardScroll relative flex w-fit items-center gap-3 overflow-auto rounded-md p-3 md:gap-2 md:p-1.5`}
    >
      {naveItems?.map((item, index) => {
        const isActive =
          (active !== undefined && active === item?.id) ||
          (item?.link && router?.asPath === item.link) ||
          (item?.subLinks || []).some(link => router.asPath.includes(link))

        return (
          <div
            key={index}
            style={{
              borderColor: isActive ? '#33357D' : ''
            }}
            className={`cursor-pointer text-nowrap rounded-md px-8 py-2 text-xs font-medium capitalize text-[#1D1B20] lg:text-sm ${
              isActive ? 'border-b-[3px] bg-[#EBF4F9]' : 'bg-white hover:opacity-75'
            }`}
            onClick={() => handleClick(item?.id!, item.link)}
          >
            {item.title}
          </div>
        )
      })}
    </div>
  )
}

export default NavTabs
