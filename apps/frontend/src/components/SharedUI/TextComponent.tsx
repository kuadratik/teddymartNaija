import React from 'react'
import {twMerge} from 'tailwind-merge'

interface ITextProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  as: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const TextComponent = ({children, className, style, as: Component = 'p'}: ITextProps) => {
  const baseClasses = 'text-sm text-gray-800'

  return (
    <Component style={style} className={twMerge(baseClasses, className)}>
      {children}
    </Component>
  )
}

export default TextComponent
