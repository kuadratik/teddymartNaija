import {Select} from 'antd'
import {useEffect, useRef} from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  data: any
  onChange: (value: any, option?: any) => void // Update onChange type to include option
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
  loading?: boolean
  dropdownStyle?: React.CSSProperties
  dropdownClassName?: string
  mode?: 'multiple' | 'tags'
  tagRender?: (props: any) => React.ReactElement
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
  renderLabel,
  loading = false,
  dropdownStyle,
  dropdownClassName,
  mode,
  tagRender
}: IProps) => {
  // Modified to pass both value and option
  const handleChange = (selectedValue: any, option: any): void => {
    onChange(selectedValue, option) // Pass both the selected value and the option object
  }

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      onChange(value)
    }
  }, [value])

  useEffect(() => {
    if (!containerRef.current) return

    const resolvedBackground =
      backgroundColor === null || backgroundColor === undefined || backgroundColor === '' ? '' : backgroundColor

    if (resolvedBackground) {
      containerRef.current.style.setProperty('background-color', resolvedBackground)
    } else {
      containerRef.current.style.removeProperty('background-color')
    }
  }, [backgroundColor])

  return (
    <div>
      {mode === 'multiple' && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Checkbox styling for multi-select */
            .ant-select-dropdown .ant-select-item-option {
              padding: 8px 12px !important;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .ant-select-dropdown .ant-select-item-option::before {
              content: '';
              display: inline-block;
              margin-top: 0;
              width: 16px;
              height: 16px;
              border: 2px solid #d1d5db;
              border-radius: 3px;
              margin-right: 0;
              vertical-align: middle;
              background-color: #ffffff;
              flex-shrink: 0;
            }
            .ant-select-dropdown .ant-select-item-option-selected::before {
              content: '✓';
              background-color: #000000;
              border-color: #000000;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
            }
            .ant-select-dropdown .ant-select-item-option-selected {
              background-color: #f3f4f6 !important;
            }
            /* Prevent text wrapping in selected tags */
            .ant-select-selection-item {
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              max-width: 120px !important;
            }
            .ant-select-selection-overflow-item {
              white-space: nowrap !important;
            }
            /* Ensure select container doesn't overflow */
            .ant-select-selector {
              overflow: hidden !important;
            }
            .ant-select-selection-overflow {
              flex-wrap: nowrap !important;
              overflow: hidden !important;
            }
          `
          }}
        />
      )}
      <div
        ref={containerRef}
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
          loading={loading}
          size={size}
          placeholder={placeholder}
          mode={mode}
          tagRender={tagRender}
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
          dropdownStyle={dropdownStyle}
          dropdownClassName={dropdownClassName}
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
