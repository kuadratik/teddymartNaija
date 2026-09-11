import useWindowResize from '@/hooks/useWindowResize'
import {Modal} from 'antd'
import {twMerge} from 'tailwind-merge'
interface IProps {
  children?: React.ReactNode
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  title?: string
  onCloseModal?: any
  height?: number
  width?: any
  className?: string
  maskCloseable?: boolean
  wrapClassName?: string
  modalStyles?: any
}
const PlannerModal = ({
  children,
  modalOpen,
  setModalOpen,
  maskCloseable,
  title,
  onCloseModal,
  height,
  width,
  className,
  wrapClassName,
  modalStyles
}: IProps) => {
  const {width: windowWidth} = useWindowResize()

  return (
    <>
      <Modal
        title={title}
        closeIcon={null}
        centered
        maskClosable={maskCloseable}
        style={{
          height: windowWidth < 1000 ? undefined : height,
          margin: 0
        }}
        styles={{
          ...modalStyles
        }}
        width={windowWidth < 1000 ? undefined : width > 0 ? width : undefined}
        className={twMerge('font-inters overflow-auto', className ? className : '')}
        footer={null}
        open={modalOpen}
        onOk={onCloseModal}
        onCancel={onCloseModal}
        wrapClassName={twMerge('', wrapClassName ? wrapClassName : '')}
      >
        {children}
      </Modal>
    </>
  )
}

export default PlannerModal
