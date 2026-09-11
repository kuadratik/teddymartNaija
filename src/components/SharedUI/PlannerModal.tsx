import useWindowResize from '@/hooks/useWindowResize'
import { Modal } from 'antd'
import { twMerge } from 'tailwind-merge'
interface IProps {
  children?: React.ReactNode
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  title?: string
  onCloseModal?: any
  height?: number
  width?: any
  className?: string
}
const PlannerModal = ({ children, modalOpen, setModalOpen, title, onCloseModal, height, width, className }: IProps) => {
  const { width: windowWidth } = useWindowResize()
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
        style={{
          height: windowWidth < 1000 ? undefined : height
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
