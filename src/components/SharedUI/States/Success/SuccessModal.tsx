// import success from '../../../../lottieFiles/success.json'
import LottieAnimate from '../../LottieAnimate'
import SuccessImage from '../../../../../public/assets/successImg.svg'
import Image from 'next/image'
import TextComponent from '../../TextComponent'
import CustomButton from '../../Buttons/Button'

interface IProps {
  successMessage?: string
  successTitle: any
  primaryButtonText?: string | null
  secondaryButtonText?: string | null
  primaryButtonAction?: any
  secondaryButtonAction?: any
}
const SuccessModal = ({
  successMessage,
  successTitle,
  primaryButtonAction,
  primaryButtonText,
  secondaryButtonAction,
  secondaryButtonText
}: IProps) => {
  return (
    <>
      <div className="mx-auto w-full text-center">
        <TextComponent as="h4" className="text-[16px] font-bold leading-[20px] text-[#1A1A1A]">
          {successTitle}
        </TextComponent>
        {/* <p className="text-[24px] text-[#17B26A]">{successTitle}</p> */}
        {/* <div className="mx-auto w-[40%]">
          <LottieAnimate altText="success" lottieJson={''} loop={false} />
        </div> */}
        <div></div>
        <Image src={SuccessImage} alt="success image" className="w-full" />
        {/* <p className="text-[#17B26A]">{successMessage}</p> */}
        <TextComponent as="p" className="mb-4 px-2 text-center text-[14px] font-bold leading-[18px] text-custom_grey">
          {successMessage}
        </TextComponent>

        <div className="flex w-full flex-row items-center justify-center">
          <div className="mt-3 flex w-full items-center gap-4">
            {secondaryButtonText && (
              <CustomButton
                onClick={() => {
                  secondaryButtonAction && secondaryButtonAction()
                }}
                type="button"
                className="w-[104px] rounded-[10px] bg-[#f9f9f9] px-1 py-4 text-[14px] text-black"
              >
                {secondaryButtonText}
              </CustomButton>
            )}
            {primaryButtonText && (
              <CustomButton
                onClick={() => {
                  primaryButtonAction && primaryButtonAction()
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {primaryButtonText}
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SuccessModal
