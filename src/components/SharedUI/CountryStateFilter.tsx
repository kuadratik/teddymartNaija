import {useAppSelector} from '@/hooks/reduxHooks'
import useWindowResize from '@/hooks/useWindowResize'
import {useGetCountryQuery, useGetStateQuery} from '@/services/countryState'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import DisplayIcon from './CountrySelect/DisplayIcon'

interface IProps {
  isCountryOpen: boolean
  isStateOpen: boolean
  setIsCountryOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsStateOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedCountry: any
  setSelectedCountry: React.Dispatch<React.SetStateAction<any>>
  selectedOnclickCountry: any
  selectedState: any
  setSelectedState: React.Dispatch<React.SetStateAction<any>>
  className?: string
  setSelectedOnClickState: React.Dispatch<React.SetStateAction<any>>
  setSelectedOnclickCountry: React.Dispatch<React.SetStateAction<any>>
}

const CountryStateFilter = ({
  isCountryOpen,
  setIsCountryOpen,
  selectedCountry,
  selectedState,
  setSelectedCountry,
  setSelectedState,
  isStateOpen,
  setIsStateOpen,
  setSelectedOnClickState,
  setSelectedOnclickCountry,
  selectedOnclickCountry,
  className
}: IProps) => {
  const [search, setSearch] = useState('')
  const {selectedLanguage} = useAppSelector(state => state.country)
  console.log('🚀 ~ selectedLanguage:', selectedLanguage?.name)

  const [countryInputValue, setCountryInputValue] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const {width} = useWindowResize()
  const {data: countries = []} = useGetCountryQuery({
    search: search
  })

  const {data: states = [], isLoading: isStatesLoading} = useGetStateQuery({
    search: '',
    id: selectedCountry?.id
  })
  console.log('🚀 ~ states:', states)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false)
        setIsStateOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      setCountryInputValue(selectedCountry.name)
    } else {
      setCountryInputValue('')
    }
  }, [selectedCountry])

  const handleMenuClick = (item: any) => {
    if (item.country_id) {
      setSelectedState(item)
    } else {
      setSelectedCountry(item)
      setCountryInputValue(item.name)
      setIsStateOpen(true)
      setSelectedState(null)
    }
  }

  const handleOnclickMenuClick = (item: any) => {
    if (item.country_id) {
      // This is a state selection
      setSelectedOnClickState(item)
      // Find and set the corresponding country
      const matchingCountry = countries?.data.find((country: any) => country.id === item.country_id)
      if (matchingCountry) {
        setSelectedOnclickCountry(matchingCountry)
        setCountryInputValue(matchingCountry.name)
      }
      setIsCountryOpen(false)
      setIsStateOpen(false)
    } else {
      setSelectedOnclickCountry(item)
      setCountryInputValue(item.name)
      setIsStateOpen(true)
      setSelectedState(null)
    }
  }

  const handleInputChange = (value: string) => {
    setCountryInputValue(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearch(value)
    }, 800) // 0.8 seconds (adjust as needed)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative"
        onMouseEnter={() => {
          setIsCountryOpen(true)
        }}
      >
        <div className="relative">
          <div className="relative">
            <div className="hidden lg:block">
              {selectedCountry || selectedOnclickCountry ? (
                <input
                  type="text"
                  placeholder="Country"
                  onChange={e => handleInputChange(e.target.value)}
                  value={countryInputValue}
                  className="w-[179px] rounded-[8px] border bg-[#F9FAFB] px-[15px] py-[11px] pr-10 text-base font-[500] text-[#141414] shadow-f1 placeholder:font-[500] placeholder:text-black hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]"
                />
              ) : (
                <>
                  <p className="w-[179px] rounded-[8px] border bg-[#F9FAFB] px-[15px] py-[11px] pr-10 text-base font-[500] text-[#141414] shadow-f1 placeholder:font-[500] placeholder:text-black hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]">
                    {selectedLanguage.name}
                  </p>
                </>
              )}
            </div>
            <div className="w-full rounded-[8px] border bg-[#F9FAFB] px-[10px] py-[8px] pr-10 text-base font-[500] text-[#141414] shadow-f1 placeholder:font-[500] placeholder:text-black hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000] lg:hidden">
              {selectedCountry || selectedOnclickCountry ? (
                <Image
                  src={selectedCountry?.flag}
                  alt="flag"
                  width={24}
                  height={24}
                  className="h-[26px] w-[56px] object-contain"
                />
              ) : (
                <>
                  {DisplayIcon(selectedLanguage.value, {
                    className: 'h-[26px] w-[56px] object-contain lg:w-6 lg:h-6 rounded-[4px]'
                  })}
                </>
              )}
            </div>
            <Icon
              icon="iconamoon:arrow-down-2"
              width="24"
              height="24"
              className="absolute right-1.5 top-2.5 z-30 text-black lg:top-3"
            />
          </div>
          {isCountryOpen && (
            <div className="absolute right-0 top-16 z-30 flex max-h-[300px] min-w-[160px] flex-col gap-1 overflow-y-auto rounded-md border border-[#DFDFDF] bg-white p-1 shadow-f2 lg:w-full">
              <button
                onClick={() => {
                  setSelectedCountry(null)
                  setSelectedState(null)
                  setSelectedOnClickState(null)
                  setSelectedOnclickCountry(null)
                  setIsCountryOpen(false)
                  setIsStateOpen(false)
                  setSearch('')
                }}
                className="rounded-md p-2 text-left text-[14px] font-[500] hover:bg-[#F9FAFB] hover:text-[#000000]"
              >
                All Countries
              </button>
              {countries?.data?.map((country: any) => {
                return (
                  <button
                    className={`rounded-md p-2 text-left text-[14px] font-[500] hover:bg-[#d0d0d0] hover:text-[#000000] lg:hover:bg-[#F9FAFB] ${
                      (width >= 1024 ? selectedCountry?.id === country.id : selectedOnclickCountry?.id === country.id)
                        ? 'bg-[#c4c5c5]'
                        : ''
                    }`}
                    onMouseEnter={() => handleMenuClick(country)}
                    onClick={() => {
                      handleOnclickMenuClick(country)
                      setSelectedOnClickState(null)
                      setSelectedState(null)
                    }}
                  >
                    <p className="">{country.name}</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {isStatesLoading ? null : (
          <>
            {isStateOpen && states?.data.length > 0 && (
              <div className="absolute right-[170px] top-16 z-30 grid max-h-[500px] min-w-[160px] gap-x-10 overflow-y-scroll rounded-md border border-[#DFDFDF] bg-white p-1 shadow-f2 lg:right-[185px] lg:top-28 lg:min-w-[400px] lg:grid-cols-2 lg:gap-y-4">
                <button
                  onClick={() => {
                    setSelectedCountry(null)
                    setSelectedState(null)
                    setSelectedOnClickState(null)
                    setSelectedOnclickCountry(null)
                    setIsCountryOpen(false)
                    setIsStateOpen(false)
                    setSearch('')
                  }}
                  className="rounded-none border-b p-2 text-left text-[14px] font-bold hover:bg-[#F9FAFB] hover:text-[#000000] lg:hidden"
                >
                  States
                </button>
                {states?.data?.map((state: any) => {
                  return (
                    <button
                      className="w-full rounded-md p-2 text-left text-[14px] font-[500] hover:bg-[#F9FAFB] hover:text-[#000000]"
                      onMouseEnter={() => handleMenuClick(state)}
                      onClick={() => handleOnclickMenuClick(state)}
                    >
                      <p className="whitespace-wrap">{state.name}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CountryStateFilter
