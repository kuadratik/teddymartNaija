import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Button, ButtonProps} from 'antd'
import {useRouter} from 'next/router'
import React from 'react'

interface DashboardProps extends ButtonProps {
  titleHeader: React.ReactNode
  searchValue?: string
  showBtn?: boolean
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>
  btnText?: string
  showInput?: boolean
}

const CustomerHeader = ({
  titleHeader,
  setSearchValue,
  searchValue,
  showBtn = true,
  btnText,
  showInput = true
}: DashboardProps) => {
  const router = useRouter()
  return (
    <div>
      <div className="flex items-center justify-between">
        <TextComponent as="h1" className="text-[24px] font-semibold leading-[30px] text-black">
          {titleHeader}
        </TextComponent>
        {showInput && (
          <div className="hidden w-full border-[0.5px] border-gray-200 lg:relative lg:mx-auto lg:block lg:max-w-[735px]">
            <div className="absolute left-4 top-1/2 z-40 flex h-[20px] -translate-y-1/2 items-start justify-start">
              <Icon icon="mingcute:search-fill" className="text-xl text-[#6B7280]" />
            </div>
            <TextInput
              iconName="lets-icons:send-duotone"
              iconClassName="cursor-pointer text-2xl"
              className="pl-[50px]"
              placeholder={'Search'}
              onChange={e => setSearchValue && setSearchValue(e.target.value)}
              name={''}
              value={searchValue}
              type={'text'}
            />
          </div>
        )}
        {showBtn && (
          <CustomButton
            onClick={() => {
              router.back()
            }}
            style={{
              
              color: 'white',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
           
            className="whitespace-nowrap rounded-lg bg-transparent px-6 py-2 text-[#6B7280] bg-black w-fit"
          >
            {btnText}
          </CustomButton>
        )}{' '}
      </div>
      {showInput && (
        <div className="relative mt-8 block w-full border-[1px] border-gray-200 lg:mx-auto lg:hidden lg:max-w-[735px]">
          <div className="absolute left-4 top-1/2 z-40 flex h-[20px] -translate-y-1/2 items-start justify-start">
            <Icon icon="mingcute:search-fill" className="text-xl text-[#6B7280]" />
          </div>
          <TextInput
            iconName="lets-icons:send-duotone"
            iconClassName="cursor-pointer text-2xl"
            className="pl-[50px]"
            placeholder={'Search'}
            onChange={e => setSearchValue && setSearchValue(e.target.value)}
            name={''}
            value={searchValue}
            type={'text'}
          />
        </div>
      )}
    </div>
  )
}

export default CustomerHeader
