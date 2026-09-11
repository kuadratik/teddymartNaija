import useWindowResize from '@/hooks/useWindowResize'
import {useRouter} from 'next/router'
import React from 'react'

interface INavItem {
  id?: any
  title: string
  link?: string
  subLinks?: string[]
}

interface IProps {
  naveItems: INavItem[]
  active?: number
  setActive?: React.Dispatch<React.SetStateAction<any>> | undefined
  backgroundColor?: string
}

const NavTabs = ({naveItems, active, setActive, backgroundColor = '#FAFAFA'}: IProps) => {
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
      className={`statsCardScroll relative flex w-fit items-center overflow-auto rounded-md p-[6px] md:p-1.5`}
    >
      {naveItems?.map((item, index) => {
        const isActive =
          (active !== undefined && active === item?.id) ||
          (item?.link && router?.asPath === item.link) ||
          (item?.subLinks || []).some(link => router.asPath.includes(link))

        return (
          <div
            key={index}
            className={`cursor-pointer text-nowrap rounded-md px-8 py-2 text-xs font-medium capitalize lg:text-sm ${
              isActive ? 'bg-black text-white' : 'hover:opacity-75'
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
