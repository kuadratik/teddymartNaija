import PhoneInput from 'react-phone-input-2'
import {twMerge} from 'tailwind-merge'

interface IProps {
  value: string
  onChange: (value: string) => void
  disabled: boolean
  className?: string
  fontSize?: number
  placeholder?: string
  inputProps?: object
  color?: string
  title?: string
  errorMessage?: string
  labelClassName?: string
  backgroundColor?: string
}
const PhoneInputWithCountry = ({
  value,
  color,
  title,
  onChange,
  disabled,
  fontSize,
  placeholder,
  inputProps,
  errorMessage,
  labelClassName,
  className,
  backgroundColor,
  ...rest
}: IProps) => {
  return (
    <div className="w-full">
      {!title || title === '' ? null : (
        <div className={`pb-1`}>
          <label className={twMerge('text-sm capitalize text-[#6B7280]', labelClassName)}>{title}</label>
        </div>
      )}

      <div
        className={twMerge(
          `rounded-md border bg-[#F9FAFB] ${errorMessage ? 'border-red-600' : 'border-gray-100'}`,
          className
        )}
      >
        <PhoneInput
          onlyCountries={['ca', 'ng', 'us']} // Restrict to Canada, Nigeria, and US
          inputProps={inputProps}
          country={'ca'}
          disabled={disabled}
          placeholder={placeholder}
          buttonClass="py-1.5 border-none"
          value={value}
          containerClass="border-none"
          dropdownClass="border-none"
          onChange={onChange}
          inputClass="w-full font-light  text-sm outline-none b text-[#000000]  rounded-[8px]  px-[10px] border focus:outline-none focus:ring-1 focus:ring-school"
          inputStyle={{
            paddingBlock: '22px',
            color: color,
            border: 'none',
            backgroundColor: backgroundColor ? backgroundColor : '#F9FAFB',
            fontSize: fontSize,
            width: '100%'
          }}
          buttonStyle={{
            border: 'none',
            backgroundColor: backgroundColor ? backgroundColor : '#F9FAFB'
          }}
          countryCodeEditable={true}
        />
      </div>
      <p className="flex flex-col gap-1 text-xs text-red-600">{errorMessage}</p>
    </div>
  )
}

export default PhoneInputWithCountry
