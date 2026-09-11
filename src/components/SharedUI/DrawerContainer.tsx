import {Drawer, DrawerProps} from 'antd'
import React from 'react'
import {twMerge} from 'tailwind-merge'
import TextComponent from './TextComponent'
import useWindowResize from '@/hooks/useWindowResize'

interface IDrawerContainerProps {
  open: boolean
  onClose: any
  placement?: DrawerProps['placement']
  children: React.ReactNode
  title?: string
  className?: string
  height?: any
}

const DrawerContainer = ({
  open,
  onClose,
  placement = 'bottom',
  children,
  title,
  className,
  height
}: IDrawerContainerProps) => {
  return (
    <Drawer
      placement={placement}
      closable={false}
      onClose={onClose}
      open={open}
      key={placement}
      className={twMerge('rounded-t-[25px]', className ? className : '')}
      height={height ? height : undefined}
    >
      {title && (
        <div className="mb-6 flex h-[50px] items-center justify-center rounded-[12px] bg-[#EDEDED] px-4 py-3">
          <TextComponent as="h4" className="text-[16px] font-bold leading-[20px] text-[#1D1D1D]">
            {title}
          </TextComponent>
        </div>
      )}
      <div className="h-[250px] w-full overflow-y-auto">{children}</div>
    </Drawer>
  )
}

export default DrawerContainer
