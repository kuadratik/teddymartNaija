import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {setSelectedLanguage, setSelectionOccurred} from '@/redux/apiSlice/countrySlice'
import {Icon} from '@iconify/react'
import {Dropdown, Menu, Tooltip} from 'antd'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {ILanguageList} from './CountrySelect'
import DisplayIcon from './DisplayIcon'

export const languageList: ILanguageList[] = [
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

const setCookie = (name: string, value: string, days: number) => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + days)
  const encodedValue = encodeURIComponent(value) // Encode the value

  // Set the cookie with improved attributes:
  document.cookie = `${name}=${encodedValue};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict;Secure` // Or Lax if needed.
  console.log('Cookie set:', document.cookie) // Debugging: Check the cookie string
}

export const getCookie = (name: string) => {
  const cookies = document.cookie.split(';')
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
  if (cookie) {
    const encodedValue = cookie.split('=')[1]
    try {
      const decodedValue = decodeURIComponent(encodedValue)
      console.log('Cookie retrieved:', decodedValue) // Debugging
      return decodedValue
    } catch (e) {
      console.error('Error decoding cookie:', e)
      return null
    }
  }
  console.log('Cookie not found') // Debugging
  return null
}

const CountrySelectView = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [dropDown, setDropDown] = useState(false)
  const {selectedLanguage} = useAppSelector(state => state.country)

  useEffect(() => {
    const savedLanguage = getCookie('selectedLanguage')
    console.log('Retrieved language from cookie:', savedLanguage)
    if (savedLanguage) {
      const language = languageList.find(lang => lang.value === savedLanguage)
      if (language) {
        dispatch(setSelectedLanguage(language as any))
      }
    }
  }, [dispatch])

  const handleLanguageSelect = (lang: ILanguageList) => {
    dispatch(setSelectedLanguage(lang as any))
    dispatch(setSelectionOccurred())
    setDropDown(false)
    router.push('/')
    setCookie('selectedLanguage', lang.value, 30) // Use the corrected setCookie function
  }

  return (
    <div>
      <Dropdown
        className="!bg-transparent"
        trigger={['click']}
        overlay={
          <Menu className="flex flex-col gap-1">
            {languageList.map((lang, index) => (
              <React.Fragment key={index}>
                {' '}
                {/* Use React.Fragment for multiple elements */}
                <div className="lg:hidden">
                  <div
                    className={`hover:bg-primary flex w-full cursor-pointer items-center justify-center gap-2 px-[10px] py-[14px] hover:text-white ${
                      lang.value === selectedLanguage.value ? 'bg-gray-200 text-white' : 'text-[#414141]'
                    }`}
                    onClick={() => handleLanguageSelect(lang)} // Simplified
                  >
                    {DisplayIcon(lang.value, {className: 'w-6 h-6 rounded-[4px]'})}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Tooltip title={lang.name} placement="left" key={lang.key}>
                    <div
                      className={`hover:bg-primary flex w-full cursor-pointer items-center justify-center gap-2 px-[10px] py-[14px] hover:text-white ${
                        lang.value === selectedLanguage.value ? 'bg-gray-200 text-white' : 'text-[#414141]'
                      }`}
                      onClick={() => handleLanguageSelect(lang)} // Simplified
                    >
                      {DisplayIcon(lang.value, {className: 'w-6 h-6 rounded-[4px]'})}
                    </div>
                  </Tooltip>
                </div>
              </React.Fragment>
            ))}
          </Menu>
        }
        open={dropDown}
        onVisibleChange={visible => setDropDown(visible)}
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
