import ClipsComponent from '@/components/Clips'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import TopBar from '@/components/Vendor/TopBar'
import {Image} from 'antd'
import React, {useState} from 'react'

const Clips = () => {
  const [showItems, setShowItems] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showVendor, setShowVendor] = useState(false)

  return (
    <BaseLayout>
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

      {showItems && (
        <DrawerContainer open={showItems} onClose={() => setShowItems(false)} title="View Items" height={300}>
          <div className="flex w-full flex-row items-center gap-3 border-b py-[15px]">
            <div className="flex h-[78px] w-[78px] items-center justify-center overflow-hidden">
              <Image src="/assets/item1.svg" alt="item" preview={false} />
            </div>

            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col items-start gap-2">
                <TextComponent as="p" className="text-[16px] font-medium leading-[20px]">
                  New Balance 2024
                </TextComponent>
                <TextComponent as="p" className="text-[12px] leading-[16px] tracking-[-0.16px] text-[#1D1D1D]">
                  $60
                </TextComponent>
              </div>

              <Image src="/assets/delete.svg" alt="item" preview={false} />
            </div>
          </div>
          <div className="mt-5 flex w-full items-center gap-4">
            <CustomButton
              onClick={() => {
                setShowItems(false)
              }}
              type="button"
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              Confirm
            </CustomButton>
          </div>
        </DrawerContainer>
      )}


      {showSuccess && (
        <DrawerContainer open={showSuccess} onClose={() => setShowSuccess(false)} title={`Success`} height={400}>
          <SuccessModal
            successTitle={''}
            primaryButtonText={`Contact Vendor`}
            primaryButtonAction={() => {
              setShowSuccess(false)
              setShowVendor(true)
            }}
          />
        </DrawerContainer>
      )}

      {showVendor && (
        <DrawerContainer
          open={showVendor}
          onClose={() => setShowVendor(false)}
          title={`Vendor Information`}
          height={400}
        >
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Image src="/assets/vendorPic.svg" alt="vendor-pic" preview={false} />
              <div className="ga-2 flex flex-col items-center justify-center">
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px]">
                  Kelvin White
                </TextComponent>
                <TextComponent as="p" className="text-[11px] leading-[14px] text-[#9796A1]">
                  (+234) 708 5351 367
                </TextComponent>
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setShowVendor(false)
                }}
                type="button"
                className="w-full rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                Call
              </CustomButton>

              <CustomButton
                onClick={() => {
                  // handleAvailability()
                  setShowVendor(false)
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {/* {isAvailabilityLoading ? <Spinner /> : */}
                Whatsapp
                {/* // } */}
              </CustomButton>
            </div>

            <TextComponent as="p" className="text-center text-[10px] leading-[12px] text-[#9796A1]">
              Please note that TeddyMart does not process payment or shipping.
            </TextComponent>
          </div>
        </DrawerContainer>
      )}
    </BaseLayout>
  )
}

export default Clips
