import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import React from 'react'
import TextComponent from '../SharedUI/TextComponent'

interface IProps {
  navItems: {
    id?: number
    title: string
    link: string
    icon: string
    subLinks?: string[]
  }[]
}

const BottomNavigation = ({navItems}: IProps) => {
  const router = useRouter()
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex max-h-[84px] max-w-[900px] items-center justify-center border-t bg-white px-[10px] py-[7px]">
      <div className="flex w-full items-center justify-between px-[28px] py-2">
        {navItems.map((item, index) => {
          const isActive =
            (item?.link && router?.asPath === item.link) ||
            (item?.subLinks || []).some(link => router.asPath.includes(link))
          return (
            <div
              key={index}
              className="flex cursor-pointer flex-col items-center justify-center gap-[5px]"
              onClick={() => {
                router.push(item.link)
              }}
            >
              <div className="flex items-center justify-center">
                <Icon
                  icon={item.icon}
                  className={`text-[24px] ${isActive ? 'text-black' : 'text-[#6B7280]'}`}
                  color={isActive ? '#000' : '#6B7280'}
                />
              </div>
              <TextComponent
                as="span"
                className={`text-center text-xs ${isActive ? 'font-medium text-black' : 'text-[#6B7280]'}`}
              >
                {item.title}
              </TextComponent>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation
