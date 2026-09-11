import React from 'react'
import VendorLogo from '../Auth/Products/components/Logo'
import TextInput from '../SharedUI/Input/TextInput'
import CustomButton from '../SharedUI/Buttons/Button'
import LogoHeader from '../SharedUI/LogoHeader'
import Image from 'next/image'
import {Button} from 'antd'

const AdvertComponent = () => {
  return (
    <div>
      <div className="flex h-[70px] w-[579px] items-center justify-between gap-6 rounded-[8px] bg-[#000000] p-4">
        <div>
          <Image src={'/assets/eki_white.svg'} alt="logo" width={100} height={27} />{' '}
        </div>
        <TextInput placeholder="" errorMessage={''} onChange={() => {}} name={'advert'} value={''} type={'text'} />
        <Button className="rounded-[5px] bg-[#fff] font-semibold text-[#000000]">{'Click here'}</Button>
      </div>
    </div>
  )
}

export default AdvertComponent
