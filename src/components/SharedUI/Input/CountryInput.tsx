import {useGetCountryQuery} from '@/services/countryState'
import {useState} from 'react'
import SelectInput from './SelectInput'

interface IProps {
  backgroundColor?: string
  onChange: (value: any) => void
  value: any
  placeholder?: React.ReactNode | string
  key?: string
  errorMessage?: string
  className?: string
}
const CountryInput = ({backgroundColor, onChange, value, placeholder, key, errorMessage, className}: IProps) => {
  const [search, setSearch] = useState('')
  const {data} = useGetCountryQuery({
    search: search
  })

  // * restrict the country dropdown to counties that myEKI currently supports
  const filterCountries = data?.data?.filter((item: {currency_code: string}, id: any) => {
    return (
      item.currency_code === 'CAD' ||
      item.currency_code === 'USD' ||
      item.currency_code === 'NGN' ||
      item.currency_code === 'GBP' ||
      item.currency_code === 'EUR' ||
      item.currency_code === 'AUD'
    )
  })

  // console.log('🚀 ~ CountryInput ~ data:', data)
  const transformData = filterCountries?.map((item: any) => {
    return {
      value: item.id,
      label: item.name
    }
  })

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
      disabled={false}
      notFoundContent={'Country not found'}
      setSearchSelect={setSearch}
      backgroundColor={backgroundColor}
      className={className}
    />
  )
}

export default CountryInput
