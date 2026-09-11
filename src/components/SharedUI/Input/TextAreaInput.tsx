import {useId} from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  placeholder: string
  onChange: (e: any) => void
  errorMessage?: any
  value?: string
  handleBlur?: any
  name: string
  title?: string
  readOnly?: boolean
  className?: string
  id?: string
  defaultValue?: string
  maxLength?: number
  onFocus?: () => void
  row: number
  helperText?: string
  required?: boolean | undefined
  iconComponent?: any
  labelClassName?: string
}

const TextAreaInput = ({
  placeholder,
  onChange,
  errorMessage,
  handleBlur,
  value,
  name,
  title,
  readOnly,
  className,
  id,
  defaultValue,
  maxLength,
  row,
  onFocus,
  required,
  helperText,
  labelClassName
}: IProps) => {
  const idState = useId()
  return (
    <div className="w-full">
      {!title || title === '' ? null : (
        <div className={`pb-1`}>
          <label className={twMerge('text-sm capitalize text-[#6B7280]', labelClassName)}>{title}</label>
        </div>
      )}
      <div className="relative !w-full">
        <textarea
          className={twMerge(
            `w-full rounded-[8px] border ${errorMessage ? 'border-red-600' : 'border-gray-100'} bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`,
            className
          )}
          id={id}
          rows={row}
          required={required}
          defaultValue={defaultValue}
          readOnly={readOnly}
          onFocus={onFocus}
          name={name}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={handleBlur}
          style={{resize: 'none'}}
          value={value}
        />

        {maxLength && (
          <div className="absolute bottom-3 right-2 text-sm text-gray-500">
            {' '}
            {value?.length || 0} / {maxLength}
          </div>
        )}
      </div>
      <p className="flex flex-col text-xs font-normal text-[#9B9B9B]">{helperText}</p>

      <p className="text-xs italic text-red-600">{errorMessage}</p>
    </div>
  )
}

export default TextAreaInput
