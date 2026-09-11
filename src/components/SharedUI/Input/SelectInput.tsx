import {Select} from 'antd'
import {useEffect} from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  data: any
  onChange: (value: any) => void
  value: any
  disabled?: boolean
  backgroundColor?: string
  placeholder?: string
  notFoundContent?: any
  setSearchSelect?: any
  handleSearchSelect?: any
  className?: string
  size?: 'large' | 'middle' | 'small'
}

const SelectInput = ({
  data,
  onChange,
  value,
  disabled,
  backgroundColor = '#F9FAFB',
  placeholder,
  notFoundContent,
  handleSearchSelect,
  size = 'large',
  className
}: IProps) => {
  // console.log('🚀 ~ SelectInput ~ value:', value)

  const handleChange = (selectedValue: string): void => {
    onChange(selectedValue) // Pass the selected value directly
  }

  useEffect(() => {
    if (value) {
      onChange(value)
    }
  }, [value])

  return (
    <div
      style={{
        backgroundColor:
          backgroundColor === null || backgroundColor === undefined || backgroundColor === '' ? '' : backgroundColor
      }}
      className={twMerge(
        'w-full rounded-[8px] border border-[#dfdcdc] p-[1px] text-sm hover:border-darkColor focus:outline-none focus:ring-1 focus:ring-darkColor',
        className
      )}
    >
      <Select
        showSearch
        allowClear
        variant="borderless"
        value={value}
        size={size}
        placeholder={placeholder}
        labelRender={option => <span className="text-base">{option.label}</span>}
        style={{width: '100%', borderRadius: '8px'}}
        className="text-sm placeholder:text-xs"
        disabled={disabled}
        onChange={handleChange}
        options={data}
        notFoundContent={notFoundContent}
        onSearch={handleSearchSelect}
        filterOption={
          handleSearchSelect
            ? false
            : (input, option) => {
                const label = option?.label
                return typeof label === 'string' && label.toLowerCase().includes(input.toLowerCase())
              }
        }
      />
    </div>
  )
}

export default SelectInput
