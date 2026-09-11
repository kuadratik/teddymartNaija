export interface IFilterList {
  title: string
  value: string
}

interface IProps {
  filterList: IFilterList[] | undefined
  selected?: any
  setSelected: any
}

const FilterDropdownContent = ({filterList, selected, setSelected}: IProps) => {
  console.log('🚀 ~ FilterDropdownContent ~ selected:', selected)
  return (
    <div className="flex flex-col">
      {filterList?.map((item, index) => (
        <div
          className="w-full px-6 py-2 text-left text-sm font-[500] text-gray-700 hover:bg-gray-300"
          role="button"
          onClick={() => setSelected(item)}
          key={index}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}

export default FilterDropdownContent
