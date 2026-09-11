import ClipsComponent from '@/components/Clips'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import TopBar from '@/components/Vendor/TopBar'
import {Image} from 'antd'
import {useRouter} from 'next/router'
import React, {useState} from 'react'

const Clips = () => {
  const router = useRouter()
  return (
    <BaseLayout>
      <div className="md:my-8">
        <div className="mx-auto max-w-[900px]">
          <div className="flex w-full flex-col gap-8">
            <TopBar title="My Clips" />

            <ClipsComponent />

            {/* <div className="w-full border-b px-4 pb-[38px] pt-[14px]">
          <div className="flex w-full flex-col items-center justify-center gap-[37px]">
            <div className="flex w-full items-start gap-4">
              <Image src="/assets/clip1.svg" alt="clip" preview={false} />

              <div className="flex w-full flex-col items-start gap-[5px]">
                <TextComponent as="h4" className="text-[16px] font-medium leading-[20px] text-[#1D1D1D]">
                  Sneakers Central
                </TextComponent>
                <TextComponent as="span" className="text-[12px] font-normal leading-[16px] text-[#9796A1]">
                  3 Items
                </TextComponent>
                <TextComponent
                  as="span"
                  className="text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                >
                  $3200
                </TextComponent>
                <div className="flex w-full items-center justify-between py-2">
                  <TextComponent
                    as="span"
                    className="text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                  >
                    Clear Selection
                  </TextComponent>
                  <button
                    type="button"
                    onClick={() => {
                      setShowItems(true)
                    }}
                  >
                    <TextComponent
                      as="span"
                      className="cursor-pointer text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                    >
                      View Items
                    </TextComponent>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div> */}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Clips
