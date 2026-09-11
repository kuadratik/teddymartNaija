import useWindowResize from '@/hooks/useWindowResize'
import {Icon} from '@iconify/react'
import {Modal} from 'antd'
import {twMerge} from 'tailwind-merge'
interface IProps {
  children?: React.ReactNode
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  title?: string | React.ReactNode
  onCloseModal?: any
  height?: number
  width?: any
  className?: string
  backgroundColor?: string
  iconClassName?: string
  modalStyles?: any
}
const PlannerModal = ({
  children,
  modalOpen,
  setModalOpen,
  title,
  onCloseModal,
  height,
  width,
  className,
  backgroundColor = '#fff',
  iconClassName = 'text-2xl text-black',
  modalStyles
}: IProps) => {
  const {width: windowWidth} = useWindowResize()
  // const [modalOpen, setModalOpen] = useState(false);
  //  <Button
  //    className="text-error-50"
  //    type="primary"
  //    onClick={() => setModal2Open(true)}
  //  >
  //    Vertically centered modal dialog
  //  </Button>;

  return (
    <>
      <Modal
        title={title}
        centered
        maskClosable={true}
        closeIcon={<Icon icon="ic:round-close" className={iconClassName} />}
        style={{
          height: windowWidth < 1000 ? undefined : height
        }}
        styles={{
          content: {
            backgroundColor: backgroundColor
          }
        }}
        width={windowWidth < 1000 ? undefined : width > 0 ? width : undefined}
        className={twMerge('font-inters overflow-auto', className ? className : '')}
        footer={null}
        open={modalOpen}
        onOk={onCloseModal}
        onCancel={onCloseModal}
      >
        {children}
      </Modal>
    </>
  )
}

export default PlannerModal
