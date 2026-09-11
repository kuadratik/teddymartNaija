import {useGetCountryQuery} from '@/services/countryState'
import {useState} from 'react'
import SelectInput from './SelectInput'

interface IProps {
  backgroundColor?: string
  onChange: (value: any) => void
  value: any
  placeholder?: string
  key?: string
  errorMessage?: string
  className?: string
}
const CountryInput = ({backgroundColor, onChange, value, placeholder, key, errorMessage, className}: IProps) => {
  const [search, setSearch] = useState('')
  const {data} = useGetCountryQuery({
    search: search
  })

  // console.log('🚀 ~ CountryInput ~ data:', data)
  const transformData = data?.data?.map((item: any) => {
    return {
      value: item.id,
      label: item.name
    }
  })

  // * restrict the country dropdown to counties that myEki currently supports
  const restrictedTransformData = transformData?.filter((item: any) => {
    return item.label === 'Canada' || item.label === 'Nigeria' || item.label === 'United States'
  })

  const handleSearchSelect = (input: string) => {
    setSearch(input)
  }

  return (
    <SelectInput
      key={key}
      data={restrictedTransformData}
      value={value ?? undefined}
      errorMessage={errorMessage}
      handleSearchSelect={handleSearchSelect}
      onChange={onChange}
      placeholder={placeholder ?? 'Country'}
      disabled={false}
      notFoundContent={'Country not found'}
      setSearchSelect={setSearch}
      backgroundColor={backgroundColor}
      className={className}
    />
  )
}

export default CountryInput
