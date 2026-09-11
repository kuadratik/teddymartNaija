import {useGetCountryQuery} from '@/services/countryState'
import {useEffect, useMemo, useRef, useState} from 'react'
import SelectInput from './SelectInput'

interface IProps {
  backgroundColor?: string
  onChange: (value: any) => void
  value: any
  placeholder?: React.ReactNode | string
  key?: string
  errorMessage?: string
  className?: string
  disabled?: boolean
  setSelectedCountry?: (value: any) => void
}
const CountryInput = ({
  backgroundColor,
  onChange,
  value,
  placeholder,
  key,
  errorMessage,
  className,
  disabled = false,
  setSelectedCountry
}: IProps) => {
  const [search, setSearch] = useState('')

  const {data} = useGetCountryQuery({
    search: search
  })

  // * restrict the country dropdown to countries that myEKI currently supports
  const filterCountries = useMemo(() => {
    return data?.data?.filter((item: {currency_code: string}, id: any) => {
      return (
        item.currency_code === 'CAD' ||
        item.currency_code === 'USD' ||
        item.currency_code === 'NGN' ||
        item.currency_code === 'GBP' ||
        item.currency_code === 'EUR' ||
        item.currency_code === 'AUD'
      )
    })
  }, [data?.data])

  // console.log('🚀 ~ CountryInput ~ data:', data)
  const transformData = useMemo(() => {
    return filterCountries?.map((item: any) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  }, [filterCountries])

  // Track previous value to avoid unnecessary updates
  const prevValueRef = useRef(value)

  // Update selectedCountry when value changes
  useEffect(() => {
    if (setSelectedCountry && value && filterCountries && prevValueRef.current !== value) {
      const selectedCountry = filterCountries.find((item: any) => item.id === value)
      if (selectedCountry) {
        setSelectedCountry(selectedCountry)
        prevValueRef.current = value
      }
    }
  }, [value, filterCountries])

  const handleSearchSelect = (input: string) => {
    setSearch(input)
  }

  return (
    <SelectInput
      key={key}
      data={transformData}
      value={value ?? undefined}
      errorMessage={errorMessage}
      handleSearchSelect={handleSearchSelect}
      onChange={onChange}
      placeholder={placeholder ?? 'Country'}
      disabled={disabled}
      notFoundContent={'Country not found'}
      setSearchSelect={setSearch}
      backgroundColor={backgroundColor}
      className={className}
    />
  )
}

export default CountryInput
