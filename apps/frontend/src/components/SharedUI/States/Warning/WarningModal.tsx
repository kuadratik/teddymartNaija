import Image from 'next/image'
import WarningImageModal from '../../../../public/assets/states/warning.svg'
import CustomButton from '../../Buttons/Button'
import Spinner from '../../Spinner'

interface IProps {
  text: string
  handleSubmit: Function
  onCloseModal: () => void
  isLoading: boolean
  altText: string
  title: any
}
const WarningModal = ({text, isLoading, handleSubmit, onCloseModal, altText, title}: IProps) => {
  return (
    <div className="mx-auto flex w-[85%] flex-col items-center justify-center gap-y-2">
      <>
        <Image src={WarningImageModal} alt={'no image'} width={80} height={80} />
        <p className="pb-[32px] pt-[16px] text-center text-[20px] font-medium lg:text-[24px]">{title}</p>

        <div className="flex w-full gap-x-4">
          <CustomButton bordered={true} className="text-[#F79009]" onClick={() => onCloseModal()} disabled={false}>
            No
          </CustomButton>
          <CustomButton
            onClick={() => {
              handleSubmit()
            }}
            disabled={false}
            className="w-full bg-[#F79009] text-white"
          >
            {isLoading ? <Spinner /> : 'Yes'}
          </CustomButton>
        </div>
      </>
    </div>
  )
}

export default WarningModal
