import {BusinessIndustryTopLevel} from '@/types/business'
import CountryInput from '../SharedUI/Input/CountryInput'
import SelectInput from '../SharedUI/Input/SelectInput'
import StateInput from '../SharedUI/Input/StateInput'
export interface ISelectedIndustry {
  id: number
  name: string
}
interface IProps {
  data: BusinessIndustryTopLevel
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedIndustry[]>>
  selectedCountry: string
  selectedState: string
  setSelectedCountry: React.Dispatch<React.SetStateAction<string | null>>
  setSelectedState: React.Dispatch<React.SetStateAction<string | null>>
}
const MekDirectoryQuickAction = ({
  data,
  setSelectedCategories,
  selectedCountry,
  selectedState,
  setSelectedCountry,
  setSelectedState
}: IProps) => {
  const handleCountryChange = (value: any) => {
    setSelectedCountry(value)
    setSelectedState(null) // Reset state when country changes
  }

  const handleStateChange = (value: any) => {
    setSelectedState(value)
  }
  const handleIndustryClick = (category: ISelectedIndustry) => {
    setSelectedCategories(prevSelected => {
      const isAlreadySelected = prevSelected.some(selected => selected.id === category.id)

      if (isAlreadySelected) {
        return prevSelected.filter(selected => selected.id !== category.id)
      } else {
        return [...prevSelected, {id: category.id, name: category.name}]
      }
    })
  }

  return (
    <div className="grid grid-cols-1 justify-between gap-2 rounded-[11px] border border-[#C4C4C4] bg-white px-[30px] py-2 md:grid-cols-3 lg:gap-6">
      <CountryInput
        placeholder={<span className="text-[#4D4D4D]">Country</span>}
        errorMessage={''}
        className="py-1"
        backgroundColor="#F5F5F5"
        onChange={handleCountryChange}
        value={selectedCountry}
      />
      <StateInput
        errorMessage={''}
        backgroundColor="#F5F5F5"
        className="py-1"
        countryId={selectedCountry as any}
        onChange={handleStateChange}
        value={selectedState}
        placeholder={<span className="text-[#4D4D4D]">State/Province</span>}
      />
      {/* share */}
      <div className="">
        <SelectInput
          backgroundColor="#F5F5F5"
          className="py-1"
          placeholder={<span className="text-[#4D4D4D]">Industry</span>}
          onChange={value => {
            console.log('Selected value:', value)
            const selectedItem = data?.data.find(item => item.id === value)
            console.log('Found item:', selectedItem)
            if (selectedItem) {
              handleIndustryClick({
                id: selectedItem.id,
                name: selectedItem.name
              })
            }
          }}
          data={data?.data.map((item: {name: string; id: number}) => {
            return {
              value: item.id,
              label: item.name,
              item: item
            }
          })}
        />
      </div>

      {/* Distance */}
      {/* <button className="hidden items-center gap-3 rounded-[5px] bg-[#FF2D55] px-3 py-2 text-[13px] font-medium text-white hover:opacity-80">
        <Icon icon="ic:baseline-delete" width="18" height="18" /> Distance
      </button> */}
    </div>
  )
}

export default MekDirectoryQuickAction
