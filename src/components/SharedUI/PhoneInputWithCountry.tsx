import {useAppSelector} from '@/hooks/reduxHooks'
import PhoneInput from 'react-phone-input-2'
import {twMerge} from 'tailwind-merge'

const euroCountries = [
  'at', // Austria
  'be', // Belgium
  'cy', // Cyprus
  'ee', // Estonia
  'fi', // Finland
  'fr', // France
  'de', // Germany
  'gr', // Greece
  'ie', // Ireland
  'it', // Italy
  'lv', // Latvia
  'lt', // Lithuania
  'lu', // Luxembourg
  'mt', // Malta
  'nl', // Netherlands
  'pt', // Portugal
  'sk', // Slovakia
  'si', // Slovenia
  'es' // Spain
]

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
  enableSearch?: boolean 
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
  enableSearch = true, // Default to true
  ...rest
}: IProps) => {
  const {selectedLanguage} = useAppSelector(state => state.country)
  return (
    <div className="w-full">
      {!title || title === '' ? null : (
        <div className={`pb-1`}>
          <label className={twMerge('text-sm font-[500] capitalize text-[#33373d]', labelClassName)}>{title}</label>
        </div>
      )}

      <div
        className={twMerge(
          `rounded-md border bg-[#F9FAFB] ${errorMessage ? 'border-red-600' : 'border-gray-100'}`,
          className
        )}
      >
        <PhoneInput
          onlyCountries={['ca', 'ng', 'us', ...euroCountries, 'au', 'gb']} // Restrict to Canada, Nigeria, and US
          inputProps={inputProps}
          country={selectedLanguage.key || 'ca'}
          disabled={disabled}
          placeholder={placeholder}
          buttonClass="py-1.5 border-none"
          value={value}
          enableSearch={enableSearch} // Add enableSearch prop
          containerClass="border-none"
          dropdownClass="border-none"
          onChange={onChange}
          inputClass="w-full  text-base outline-none text-[#000000]  rounded-[8px]  px-[10px] border focus:outline-none focus:ring-1 focus:ring-school"
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
