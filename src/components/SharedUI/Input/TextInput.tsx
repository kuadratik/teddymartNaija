import {Icon} from '@iconify/react'
import React from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  placeholder: string
  onChange: (e: any) => void
  errorMessage?: any
  value?: string | number
  handleBlur?: any
  name: string
  type: string
  title?: string | React.ReactNode
  readOnly?: boolean
  className?: string
  id?: string
  defaultValue?: string
  maxLength?: number
  onFocus?: () => void
  onInput?: (e: any) => void
  labelClassName?: string
  required?: boolean
  helperText?: string
  multiple?: boolean
  accept?: string
  style?: React.CSSProperties
  iconClassName?: string
  iconName?: string
  iconColor?: string
  iconClick?: VoidFunction
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined
}
const TextInput = ({
  placeholder,
  onChange,
  errorMessage,
  handleBlur,
  value,
  name,
  type,
  title,
  readOnly,
  className,
  onInput,
  id,
  defaultValue,
  maxLength,
  labelClassName,
  required,
  onFocus,
  helperText,
  multiple,
  accept,
  style,
  iconClassName = 'left-4',
  iconName,
  iconColor,
  iconClick,
  onKeyDown
}: IProps) => {
  return (
    <div className="w-full">
      {!title || title === '' ? null : (
        <div className={`pb-1`}>
          <label htmlFor={id} className={twMerge('text-sm capitalize text-[#6B7280]', labelClassName)}>
            {title}
          </label>
        </div>
      )}
      <div className="relative">
        <input
          style={style}
          multiple={multiple}
          className={twMerge(
            `w-full rounded-[8px] border ${errorMessage ? 'border-red-600' : 'border-gray-100'} bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`,
            className
          )}
          accept={accept}
          onInput={onInput}
          id={id}
          defaultValue={defaultValue}
          readOnly={readOnly}
          onFocus={onFocus}
          type={type}
          name={name}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={handleBlur}
          value={value}
          required={required}
          onKeyDown={onKeyDown}
        />{' '}
        {iconName && (
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-end justify-end">
            <Icon
              onClick={iconClick}
              width={24}
              height={24}
              icon={iconName ? iconName : 'iconamoon:search-light'}
              className={twMerge('', iconColor, iconClassName)}
            />
          </div>
        )}
      </div>
      <p className="flex flex-col text-xs font-normal text-[#9B9B9B]">{helperText}</p>
      <p className="flex flex-col gap-1 text-xs text-red-600">{errorMessage}</p>
    </div>
  )
}

export default TextInput
