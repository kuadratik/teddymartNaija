import Image from 'next/image'
import ErrorImageModal from '../../../../public/assets/states/error.svg'
import CustomButton from '../../Buttons/Button'
import Spinner from '../../Spinner'

interface IProps {
  text: string
  isSuccess?: boolean
  handleDelete: Function
  onCloseModal: () => void
  isLoading: boolean
  altText: string
  imgError: any
  title: any
}
const ErrorModal = ({text, isSuccess, isLoading, handleDelete, onCloseModal, altText, imgError, title}: IProps) => {
  return (
    <div className="mx-auto flex w-[85%] flex-col items-center justify-center gap-y-2">
      <>
        <Image src={ErrorImageModal} alt={'no image'} width={80} height={80} />
        <p className="text-center text-[20px] font-medium lg:text-[24px]">{title}</p>
        <p className="pb-5 text-[16px] text-plannerGrayColor">This action can’t be undone</p>
        <div className="flex w-full gap-x-4">
          <CustomButton bordered={true} onClick={() => onCloseModal()} className="bg-darkColor w-full text-school">
            No
          </CustomButton>
          <CustomButton
            bordered={false}
            onClick={() => {
              handleDelete()
            }}
            className="bg-[#E53535] text-white"
          >
            {isLoading ? <Spinner /> : 'Yes'}
          </CustomButton>
        </div>
      </>
    </div>
  )
}

export default ErrorModal
