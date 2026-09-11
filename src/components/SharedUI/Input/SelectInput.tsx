import {Select} from 'antd'
import {useEffect} from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  data: any
  onChange: (value: any) => void
  value?: any
  disabled?: boolean
  backgroundColor?: string
  placeholder?: React.ReactNode | string
  notFoundContent?: any
  setSearchSelect?: any
  handleSearchSelect?: any
  className?: string
  size?: 'large' | 'middle' | 'small'
  errorMessage?: string
  labelRenderClassName?: string
  suffixIcon?: React.ReactNode
  renderLabel?: (option: any) => React.ReactNode
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
  suffixIcon,
  className,
  labelRenderClassName,
  errorMessage,
  renderLabel
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
    <div>
      <div
        style={{
          backgroundColor:
            backgroundColor === null || backgroundColor === undefined || backgroundColor === '' ? '' : backgroundColor
        }}
        className={twMerge(
          `w-full rounded-[8px] border ${errorMessage ? 'border-red-600' : 'border-gray-100'} bg-[#F9FAFB] p-[1px] text-sm placeholder:font-medium hover:border-darkColor focus:outline-none focus:ring-1 focus:ring-darkColor`,
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
          labelRender={
            renderLabel
              ? (option: any) => {
                  return renderLabel(option)
                }
              : option => <span className={twMerge('text-base', labelRenderClassName)}>{option.label}</span>
          }
          style={{width: '100%', borderRadius: '8px'}}
          className="dark-select custom-select cursor-pointer text-sm text-white placeholder:text-xs"
          disabled={disabled}
          onChange={handleChange}
          options={data}
          notFoundContent={notFoundContent}
          onSearch={handleSearchSelect}
          suffixIcon={suffixIcon ? suffixIcon : undefined}
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
      <p className="flex flex-col gap-1 text-xs text-red-600">{errorMessage}</p>
    </div>
  )
}

export default SelectInput
