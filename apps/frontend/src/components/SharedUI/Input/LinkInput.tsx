import {Input} from 'antd'
import React from 'react'

interface IProps {
  onChange: any
  value: string
  placeHolder: string
  addonBefore?: string
  defaultValue?: string
  name?: string
  alt?: string
  disabled?: boolean
}
const LinkInput = ({onChange, value, placeHolder, addonBefore, defaultValue, name, alt, disabled}: IProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, name)
  }
  return (
    <div className="">
      <Input
        variant="outlined"
        size="large"
        name={name}
        alt={alt}
        disabled={disabled}
        className="font-inter"
        placeholder={placeHolder}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
      />
    </div>
  )
}

export default LinkInput
