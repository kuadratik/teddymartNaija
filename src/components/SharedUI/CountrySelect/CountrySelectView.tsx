import {Dropdown} from 'antd'
import React, {useState} from 'react'
import {Menu, Tooltip} from 'antd'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {setSelectedLanguage, setSelectionOccurred} from '@/redux/apiSlice/countrySlice'
import {useRouter} from 'next/router'
import DisplayIcon from './DisplayIcon'
import {Icon} from '@iconify/react'
import {ILanguageList} from './CountrySelect'

const languageList: ILanguageList[] = [
  {
    key: 'us',
    value: 'USD',
    name: 'United States',
    currencySign: '$'
  },
  {
    key: 'ca',
    value: 'CAD',
    name: 'Canada',
    currencySign: '$'
  },
  {
    key: 'ng',
    value: 'NGN',
    name: 'Nigeria',
    currencySign: '₦'
  },

  // Add currencies Pound, Euro and Ausie Dollar
  {
    key: 'gb',
    value: 'GBP',
    name: 'United Kingdom',
    currencySign: '£'
  },
  {
    key: 'eu',
    value: 'EUR',
    name: 'Europe',
    currencySign: '€'
  },
  {
    key: 'au',
    value: 'AUD',
    name: 'Australia',
    currencySign: '$'
  }
]

const CountrySelectView = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [dropDown, setDropDown] = useState(false)
  const {selectedLanguage} = useAppSelector(state => state.country)

  return (
    <div>
      <Dropdown
        className="!bg-transparent"
        trigger={['click']}
        overlay={
          <Menu className="flex flex-col gap-1">
            {languageList.map((lang: any, index: any) => (
              <Tooltip title={lang.name} placement="left" key={lang.key}>
                <div
                  className={`hover:bg-primary flex w-full cursor-pointer items-center justify-center gap-2 px-[10px] py-[14px] hover:text-white ${
                    lang.value === selectedLanguage.value ? 'bg-gray-200 text-white' : 'text-[#414141]'
                  }`}
                  onClick={() => {
                    dispatch(setSelectedLanguage(lang))
                    dispatch(setSelectionOccurred())
                    setDropDown(false)
                    router.push('/')
                  }}
                >
                  {DisplayIcon(lang.value, {className: 'w-6 h-6 rounded-[4px]'})}
                </div>
              </Tooltip>
            ))}
          </Menu>
        }
        // trigger={['click']}
        open={dropDown}
        onVisibleChange={visible => {
          setDropDown(visible)
        }}
      >
        <div className="p flex flex-row items-center gap-2 rounded-lg bg-[#262626] py-[8px] font-inter text-[20px] font-medium lg:px-[11px]">
          {DisplayIcon(selectedLanguage.value, {
            className: 'w-8 h-8 lg:w-6 lg:h-6 rounded-[4px]'
          })}
          <Icon icon={'ep:arrow-down-bold'} className="text-[26px] text-white lg:text-[16px]" />
        </div>
      </Dropdown>
    </div>
  )
}

export default CountrySelectView
