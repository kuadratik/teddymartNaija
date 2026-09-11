import {useRouter} from 'next/router'
import React from 'react'
import TextComponent from '../SharedUI/TextComponent'

interface INavItem {
  id: number
  title: string
}

interface IProps {
  navItems: INavItem[]
  active?: number
  setActive?: React.Dispatch<React.SetStateAction<number>> | undefined
  backgroundColor?: string
}

const VendorTabs = ({navItems, active, setActive, backgroundColor = '#FFF'}: IProps) => {
  const router = useRouter()

  const handleClick = (index: number, link?: string) => {
    if (setActive) {
      setActive(index)
    }
  }

  return (
    <div
      style={{
        backgroundColor: backgroundColor
      }}
      className={`flex w-full items-center justify-between overflow-auto border-b`}
    >
      {navItems?.map((item, index) => {
        const isActive = active !== undefined && active === item?.id

        return (
          <div
            key={index}
            className={`flex w-full cursor-pointer items-center justify-center text-nowrap border-b px-5 py-5 text-xs font-medium capitalize lg:text-sm ${
              isActive ? 'border-b-[2px] border-b-black' : ''
            }`}
            onClick={() => handleClick(item?.id!)}
          >
            <TextComponent as="span" className={`${isActive ? 'font-medium text-black' : 'text-white'}`}>
              {item.title}
            </TextComponent>
          </div>
        )
      })}
    </div>
  )
}

export default VendorTabs
