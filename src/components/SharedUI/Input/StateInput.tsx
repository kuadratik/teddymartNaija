// import {useGetStateQuery} from '@/services/countryState'
// import {useState} from 'react'
// import SelectInput from './SelectInput'

// interface IProps {
//   backgroundColor?: string
//   onChange: (value: any) => void
//   value: any
//   countryId: number
// }
// const StateInput = ({backgroundColor, onChange, value, countryId}: IProps) => {
//   const [search, setSearch] = useState('')
//   const {data} = useGetStateQuery({
//     search: search,
//     id: countryId
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
//       data={transformData}
//       value={value}
//       handleSearchSelect={handleSearchSelect}
//       onChange={onChange}
//       placeholder="Country"
//       disabled={false}
//       notFoundContent={'Country not found'}
//       setSearchSelect={setSearch}
//       backgroundColor={backgroundColor}
//     />
//   )
// }

// export default StateInput
