// import {useGetCountryQuery} from '@/services/countryState'
// import {useState} from 'react'
// import SelectInput from './SelectInput'

// interface IProps {
//   backgroundColor?: string
//   onChange: (value: any) => void
//   value: any
//   placeholder?: string
//   key?: string
// }
// const CountryInput = ({backgroundColor, onChange, value, placeholder, key}: IProps) => {
//   const [search, setSearch] = useState('')
//   const {data} = useGetCountryQuery({
//     search: search
//   })

//   // console.log('🚀 ~ CountryInput ~ data:', data)
//   const transformData = data?.data.map((item: any) => {
//     return {
//       value: item.id,
//       label: item.name
//     }
//   })
//   const handleSearchSelect = (input: string) => {
//     setSearch(input)
//   }
//   return (
//     <SelectInput
//       key={key}
//       data={transformData}
//       value={value}
//       handleSearchSelect={handleSearchSelect}
//       onChange={onChange}
//       placeholder={placeholder ?? 'Country'}
//       disabled={false}
//       notFoundContent={'Country not found'}
//       setSearchSelect={setSearch}
//       backgroundColor={backgroundColor}
//     />
//   )
// }

// export default CountryInput
