// import success from '../../../../lottieFiles/success.json'
import LottieAnimate from '../../LottieAnimate'

interface IProps {
  successMessage: string
  successTitle: any
}
const SuccessModal = ({successMessage, successTitle}: IProps) => {
  return (
    <>
      <div className="mx-auto w-[85%] text-center">
        <p className="text-[24px] text-[#17B26A]">{successTitle}</p>
        <div className="mx-auto w-[40%]">
          <LottieAnimate altText="success" lottieJson={''} loop={false} />
        </div>
        <p className="text-[#17B26A]">{successMessage}</p>
      </div>
    </>
  )
}

export default SuccessModal
