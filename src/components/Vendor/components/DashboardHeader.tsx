import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import React from 'react'
import tw from 'tailwind-styled-components'

interface DashboardProps {
  titleHeader: React.ReactNode
  searchValue?: string
  showBtn?: boolean
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>
  btnText?: string
  showInput?: boolean
  extra?: React.ReactNode
  onClick?: () => void
  fallbackPath?: string // New prop for fallback navigation
}

const DashboardHeader = ({
  titleHeader,
  setSearchValue,
  searchValue,
  showBtn = true,
  btnText,
  showInput = true,
  onClick,
  extra,
  fallbackPath = '/' // Default fallback is home page
}: DashboardProps) => {
  const router = useRouter()
  const windowurl = window.history.length
  console.log('🚀 ~ windowurl:', windowurl)
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.back()
    }
  }

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
          <ButtonWrapper onClick={handleClick} title={btnText} type="button" className="">
            {btnText}
          </ButtonWrapper>
        )}{' '}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        {showInput && (
          <InputFieldWrapper className="">
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
          </InputFieldWrapper>
        )}
        {extra}{' '}
      </div>
    </div>
  )
}

const InputFieldWrapper = tw.div`relative mt-8 block w-[80%] border-[1px] w-full border-gray-200 lg:mx-auto lg:hidden lg:max-w-[735px]`

const ButtonWrapper = tw(CustomButton)`whitespace-nowrap rounded-lg bg-black px-8 w-fit py-3.5 text-white md:w-[140px]`

export default DashboardHeader
