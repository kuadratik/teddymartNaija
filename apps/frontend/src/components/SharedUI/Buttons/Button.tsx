import { title } from 'process'
import React from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  onClick?: (e: any) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  bordered?: boolean
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
  title?: string
}

const CustomButton = ({
  onClick,
  children,
  className,
  disabled = false,
  bordered = false,
  style,
  title,
  type = 'button'
}: IProps) => {
  const baseClasses = `w-full text-nowrap bg-black rounded-[6px] text-xs px-10 rounded  font-semibold transition duration-300 ease-in-out text-wrap hover:bg-opacity-80`
  const borderClass = `border-2 border-black text-primary-40 bg-transparent`
  const enabledClasses = bordered ? borderClass : 'hover:bg-opacity-80'
  const disabledClasses = `opacity-50 cursor-not-allowed text-white`

  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      style={style}
      className={twMerge(baseClasses, className, disabled ? disabledClasses : enabledClasses)}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default CustomButton
