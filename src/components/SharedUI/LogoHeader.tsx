import {Icon} from '@iconify/react'
import {Button} from 'antd'
import {useRouter} from 'next/router'
import VendorLogo from '../Auth/Products/components/Logo'

interface LogoHeaderProps {
  text?: string
  onClick?: VoidFunction
}
const LogoHeader = (props: LogoHeaderProps) => {
  const {text, onClick} = props
  const router = useRouter()
  return (
    <div className="flex w-full">
      {' '}
      {onClick && (
        <Button className="!border-none bg-white !p-0 text-[14px] font-bold text-[#141414]" onClick={onClick}>
          <Icon icon="ep:back" className={`text-2xl`} />
        </Button>
      )}
      <div
        onClick={() => {
          router.push('/')
        }}
        className="flex w-full flex-col items-center justify-center !p-0"
      >
        <div className="flex cursor-pointer gap-1">
          <VendorLogo />
          <p className="text-[19px] font-bold">myEKI</p>
        </div>
        {/* <p className="text-center text-[8px] font-normal text-[#9796A1]">{text ?? 'A myEKI Brand'}</p> */}
      </div>
    </div>
  )
}

export default LogoHeader
