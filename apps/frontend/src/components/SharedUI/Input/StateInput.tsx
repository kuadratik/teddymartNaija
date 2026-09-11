import {useGetStateQuery} from '@/services/countryState'
import React, {useState} from 'react'
import SelectInput from './SelectInput'

interface IProps {
  backgroundColor?: string
  onChange: (value: any) => void
  value: any
  countryId: number
  placeholder?: React.ReactNode | string
  errorMessage?: string
  className?: string
  disabled?: boolean
}
const StateInput = ({
  backgroundColor,
  onChange,
  value,
  countryId,
  placeholder,
  errorMessage,
  className,
  disabled = false
}: IProps) => {
  const [search, setSearch] = useState('')
  const {data} = useGetStateQuery({
    search: search,
    id: countryId
  })

  // console.log('🚀 ~ CountryInput ~ data:', data)
  const transformData = data?.data.map((item: any) => {
    return {
      value: item.name,
      label: item.name
    }
  })
  const handleSearchSelect = (input: string) => {
    setSearch(input)
  }

  // console.log(value)
  return (
    <SelectInput
      data={transformData}
      value={value}
      errorMessage={errorMessage}
      handleSearchSelect={handleSearchSelect}
      onChange={onChange}
      placeholder={placeholder ?? 'Country'}
      disabled={disabled}
      notFoundContent={'Country not found'}
      setSearchSelect={setSearch}
      backgroundColor={backgroundColor}
      className={className + `${disabled ? ' border border-gray-300 bg-gray-200' : ''}`}
    />
  )
}

export default StateInput
