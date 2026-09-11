import {Select} from 'antd'
import {twMerge} from 'tailwind-merge'

interface IProps {
  mode: 'multiple' | 'tags'
  onChange: (value: any) => void
  options: any[]
  defaultValue?: string[] | number[] | undefined
  placeholder: string
  children?: React.ReactNode
  optionLabelProps: string
  optionFilterProp: string
  backgroundColor?: string
  setSearchSelect?: any
  handleSearchSelect?: any
  className?: string
  size?: 'large' | 'middle' | 'small'
}
const MultipleSelect = ({
  mode='multiple',
  onChange,
  options,
  defaultValue,
  placeholder,
  children,
  optionLabelProps,
  backgroundColor = '#F9FAFB',
  handleSearchSelect,
  className,
  size = 'large',
  optionFilterProp
}: IProps) => {
  return (
    <div
      style={{
        backgroundColor:
          backgroundColor === null || backgroundColor === undefined || backgroundColor === '' ? '' : backgroundColor
      }}
      className={twMerge(
        'w-full rounded-[8px] border py-[3px] hover:border-black focus:outline-none focus:ring-1 focus:ring-school',
        className
      )}
    >
      <Select
        mode={mode}
        listHeight={200}
        variant="borderless"
        showSearch
        style={{
          width: '100%'
        }}
        defaultValue={defaultValue}
        value={defaultValue}
        allowClear
        optionFilterProp={optionFilterProp}
        optionLabelProp={optionLabelProps}
        size={size}
        className=""
        onSearch={handleSearchSelect} //function to search/filter from API
        labelRender={option => <span className="text-base">{option.label}</span>}
        filterOption={
          handleSearchSelect
            ? false
            : (input, option) => {
                const label = option?.label
                return typeof label === 'string' && label.toLowerCase().includes(input.toLowerCase())
              }
        }
        placeholder={placeholder}
        onChange={onChange}
        options={options}
      >
        {children}
      </Select>
    </div>
  )
}

export default MultipleSelect
