import {useGetStateQuery} from '@/services/countryState'
import {useState} from 'react'
import SelectInput from './SelectInput'

interface IProps {
  backgroundColor?: string
  onChange: (value: any) => void
  value: any
  countryId: number
  placeholder?: string
  errorMessage?: string
  className?: string
}
const StateInput = ({backgroundColor, onChange, value, countryId, placeholder, errorMessage, className}: IProps) => {
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
      disabled={false}
      className={className}
      notFoundContent={'Country not found'}
      setSearchSelect={setSearch}
      backgroundColor={backgroundColor}
    />
  )
}

export default StateInput
