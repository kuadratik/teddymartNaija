import {Popover} from 'antd'
import {TooltipPlacement} from 'antd/es/tooltip'
import React from 'react'

interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  dropdownContent: React.ReactNode
  children: React.ReactNode
  dropdownTitle?: string
  placement?: TooltipPlacement | undefined
}
const DropdownComponent = ({open, setOpen, dropdownContent, children, dropdownTitle = '', placement}: IProps) => {
  const hide = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Popover
      overlayInnerStyle={{padding: 0}}
      placement={placement}
      content={<div onClick={hide}>{dropdownContent}</div>}
      title={dropdownTitle}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  )
}

export default DropdownComponent
