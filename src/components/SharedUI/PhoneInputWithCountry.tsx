import PhoneInput from 'react-phone-input-2'

interface IProps {
  value: string
  onChange: (value: string) => void
  disabled: boolean
  className?: string
  fontSize?: number
  placeholder?: string
  inputProps?: object
  color?: string
}
const PhoneInputWithCountry = ({value, color, onChange, disabled, fontSize, placeholder, inputProps}: IProps) => {
  return (
    <div className="rounded-md border border-gray-300">
      <PhoneInput
        inputProps={inputProps}
        country={'ca'}
        disabled={disabled}
        placeholder={placeholder}
        buttonClass="py-1.5 border"
        value={value}
        onChange={onChange}
        inputClass="w-full font-light   text-sm outline-none b text-[#000000]  rounded-[8px]  px-[10px] border focus:outline-none focus:ring-1 focus:ring-school"
        inputStyle={{
          paddingBlock: '22px',
          border: 'none',
          color: color,
          fontSize: fontSize
        }}
        countryCodeEditable={true}
      />
    </div>
  )
}

export default PhoneInputWithCountry
