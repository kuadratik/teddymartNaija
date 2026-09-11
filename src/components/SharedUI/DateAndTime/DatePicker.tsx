import {DatePicker} from 'antd'
import {twMerge} from 'tailwind-merge'

interface IProps {
  value: any
  errorMessage: string
  name: string
  placeholder: string
  className: string
  onChange: any
  allowClear: boolean
  size: 'large' | 'middle' | 'small'
  multiple?: boolean
  backgroundColor?: string
}

const DatePickerComponent = ({
  value,
  onChange,
  errorMessage,
  name,
  placeholder,
  className,
  allowClear,
  size = 'large',
  multiple = false,
  backgroundColor = '#F9FAFB'
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
      <DatePicker
        style={{
          width: '100%'
        }}
        variant="borderless"
        multiple={multiple}
        name={name}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        size={size}
        placeholder={placeholder}
        className={className}
      />
      {errorMessage && <div className="flex flex-col gap-1 text-xs italic text-error-50">{errorMessage}</div>}
    </div>
  )
}

export default DatePickerComponent
