import { Checkbox, Select } from 'antd'
import { twMerge } from 'tailwind-merge'
import React from 'react'

interface IProps {
  onChange: (value: any) => void
  options: { label: string; value: any }[]
  value?: (string | number)[]
  placeholder: string
  className?: string
  size?: 'large' | 'middle' | 'small'
  backgroundColor?: string
  maxTagCount?: number | 'responsive'
}

const CheckboxMultipleSelect = ({
  onChange,
  options,
  value = [],
  placeholder,
  className,
  size = 'large',
  backgroundColor = '#FFFFFF',
  maxTagCount = 'responsive'
}: IProps) => {
  return (
    <div
      style={{
        backgroundColor: backgroundColor
      }}
      className={twMerge(
        'w-full rounded-[8px] border py-[3px] hover:border-black focus:outline-none focus:ring-1 focus:ring-school',
        className
      )}
    >
      <Select
        mode="multiple"
        listHeight={200}
        variant="borderless"
        showSearch
        style={{
          width: '100%'
        }}
        value={value}
        allowClear
        optionFilterProp="label"
        optionLabelProp="label"
        size={size}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
        className="placeholder:text-sm placeholder:font-[500]"
        labelRender={option => <span className="text-base">{option.label}</span>}
        filterOption={(input, option) => {
          const label = option?.label
          return typeof label === 'string' && label.toLowerCase().includes(input.toLowerCase())
        }}
        placeholder={placeholder}
        onChange={onChange}
      >
        {options.map(option => (
          <Select.Option key={option.value} value={option.value} label={option.label}>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={value.some(v => v === option.value)}
                onChange={(e) => e.stopPropagation()}
              />
              <span>{option.label}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default CheckboxMultipleSelect