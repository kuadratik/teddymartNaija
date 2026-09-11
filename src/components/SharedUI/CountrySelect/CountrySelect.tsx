import React, {useState} from 'react'
import DisplayIcon from './DisplayIcon'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
import {setSelectedLanguage, setSelectionOccurred} from '@/redux/apiSlice/countrySlice'

interface ILanguageList {
  key: string
  value: string
  name: 'United States' | 'Canada' | 'Nigeria'
}

const CountrySelect = () => {
  const {selectedLanguage} = useAppSelector(state => state.country)
  const dispatch = useAppDispatch()
  const [dropDown, showDropDown] = useState(false)
  const languageList: ILanguageList[] = [
    {
      key: 'us',
      value: 'USD',
      name: 'United States'
    },
    {
      key: 'ca',
      value: 'CAD',
      name: 'Canada'
    },
    {
      key: 'ng',
      value: 'NGN',
      name: 'Nigeria'
    }
  ]

  return (
    <div className="relative flex cursor-pointer items-center gap-1">
      <div
        onClick={() => {
          showDropDown(prev => !prev)
        }}
      >
        {DisplayIcon(selectedLanguage.value, {
          className: 'w-6 h-5 rounded-[4px]'
        })}
      </div>
      <Icon
        icon={'fe:arrow-down'}
        className="text-[16px] lg:text-white"
        onClick={() => {
          showDropDown(prev => !prev)
        }}
      />

      {dropDown && (
        <div className="absolute left-0 top-[28px] z-10 flex w-full flex-col items-center justify-center overflow-hidden rounded-[4px] border border-[#EFEFEF] bg-white">
          {languageList.map(lang => (
            <div
              key={lang.key}
              className={`hover:bg-primary flex w-full cursor-pointer items-center justify-center gap-2 px-1 py-[14px] hover:text-white ${
                lang.value === selectedLanguage.value ? 'bg-gray-200 text-white' : 'text-[#414141]'
              }`}
              onClick={() => {
                dispatch(setSelectedLanguage(lang))
                dispatch(setSelectionOccurred())
                showDropDown(false)
              }}
            >
              {DisplayIcon(lang.value, {className: 'w-6 h-5 rounded-[4px]'})}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CountrySelect
