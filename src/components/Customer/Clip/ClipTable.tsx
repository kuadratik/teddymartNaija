import {StyledTable} from '@/components/Vendor/components/Order/OrderDetailsTable'
import {useGetAllClipsQuery} from '@/services/clips'
import React, {useState} from 'react'
import {ColumnsType} from 'antd/es/table'
import {Button, Image, Space} from 'antd'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {Icon} from '@iconify/react'
import Column from 'antd/es/table/Column'
import Link from 'next/link'
import useEditProductQuantity from './hooks/useEditProductQuantity'
import Spinner from '@/components/SharedUI/Spinner'
import useAddToWishlistQuery from './hooks/useAddToWishlist'
import {useModalState} from '@/hooks/useModalState'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TitleText from '@/components/Vendor/TitleText'
import useDeleteProduct from './hooks/useDeleteProductFromClip'

interface ClipTableProps {
  cartList: any[]
  isLoading?: boolean
  isFetching?: boolean
}

const ClipTable = ({cartList, isFetching, isLoading}: ClipTableProps) => {
  // * mutations
  const {isEditProductLoading, handleEditProduct} = useEditProductQuantity()
  const {handleAddToWishListCart, isLoading: addToWishlistLoading} = useAddToWishlistQuery()

  const [clipProduct, setClipProduct] = useState<any>()

  const [currCol, setCurrCol] = useState()
  const [currId, setCurrId] = useState()

  const {
    isOpen: deleteProductIsOpen,
    closeModal: deleteProductCloseModal,
    openModal: deleteProductOpenModal
  } = useModalState()

  const closeDeleteFunction = () => {
    deleteProductCloseModal()
  }

  const {isLoading: deleteProductIsLoading, handleDeleteProduct} = useDeleteProduct(closeDeleteFunction)

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product',
        title: 'Product Details',
        dataIndex: 'product',
        render: (text, record) => (
          <div className="flex gap-3">
            <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
              <Image
                src={`${process.env.imageBaseUrl}/${record?.images[0]}`}
                alt="product image"
                preview={false}
                height={48}
                width={48}
                // onLoadStart={() => {
                //   setIsLoadingImage(true)
                // }}
                // onLoad={() => {
                //   setIsLoadingImage(false)
                // }}
                onError={error => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                }}
                // className={`${isLoadingImage ? 'blur-sm' : ''}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <TextComponent as="p" className="font-normal !text-[#000]">
                {record?.name}
              </TextComponent>
              {/* <TextComponent as="p" className="text-[13px] !text-[#6b7280]">
                {record?.description}
              </TextComponent> */}
              <Link className="text-[13px] font-medium !text-[#6b7280] hover:underline" href={`/`}>
                {record?.store_name}
              </Link>
            </div>
          </div>
        )
      },
      {
        key: 'price',
        title: 'Item Price',
        dataIndex: 'price',
        render: (text: string, record) => <FormatNumberCurrency currency={record.currency_code} value={+text} />
      },
      {
        key: 'quantity',
        title: 'Ouantity',
        dataIndex: 'quantity',
        render: (text: string, record) => (
          <div className="flex items-center gap-3">
            {' '}
            <Button
              disabled={+text === 1}
              onClick={() => {
                setCurrCol(record.slug)
                handleEditProduct({
                  product: record.slug,
                  editType: 'remove',
                  body: {
                    quantity: +text - 1
                  }
                })
              }}
              style={{
                backgroundColor: +text === 1 || (isEditProductLoading && currCol == record.slug) ? 'gray' : '#000',
                color: 'white',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="h-6 w-6 whitespace-nowrap bg-[#000] p-1 text-white"
            >
              <Icon icon="ic:outline-minus" className="text-2xl" />
            </Button>
            {isEditProductLoading && currCol == record?.slug ? (
              <Spinner className="!h-4 !w-4 border-black" />
            ) : (
              <TextComponent as="p" className="text-[15px] !text-[#6b7280]">
                {text}
              </TextComponent>
            )}
            <Button
              onClick={() => {
                setCurrCol(record.slug)
                handleEditProduct({
                  product: record.slug,
                  editType: 'add',
                  body: {
                    quantity: +text + 1
                  }
                })
              }}
              style={{
                backgroundColor: isEditProductLoading && currCol == record.slug ? 'gray' : '#000',
                color: 'white',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="h-6 w-6 whitespace-nowrap bg-[#000] p-1 text-white"
            >
              <Icon icon="ic:baseline-plus" className="text-2xl" />
            </Button>
          </div>
        )
      },

      {
        key: 'total_price',
        title: 'Amount',
        dataIndex: 'total_price',
        render: (text: string, record) => <FormatNumberCurrency currency={record.currency_code} value={+text} />
      },
      {
        title: '',
        key: 'action',
        align: 'center',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (record: any) => (
          <Space size="middle">
            <Button
              loading={addToWishlistLoading && currId === record.listing_id}
              onClick={() => {
                setCurrId(record.listing_id)
                handleAddToWishListCart(record.slug as string)
              }}
              style={{
                backgroundColor: '#AF52DE',
                color: 'white',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="whitespace-nowrap rounded-lg bg-[#AF52DE] px-3 py-[17px] text-white"
            >
              Save for later
              <Icon icon="mdi:heart" className="text-lg" />
            </Button>
            <Button
              onClick={() => {
                deleteProductOpenModal()
                setClipProduct(record)
              }}
              style={{
                backgroundColor: 'transparent',
                color: 'none',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="whitespace-nowrap rounded-lg !bg-transparent !p-1 text-[#FF2D55]"
            >
              <Icon icon="mage:trash-3" className="text-lg text-[#FF2D55]" />
            </Button>
          </Space>
        )
      }
    ]
  }, [isEditProductLoading, addToWishlistLoading])

  console.log(cartList)

  return (
    <React.Fragment>
      {' '}
      <div>
        <div className="flex flex-col">
          <StyledTable loading={isLoading} className="" columns={columns} dataSource={cartList} pagination={false} />
        </div>
      </div>
      <div className="hidden md:block">
        <PlannerModal
          modalOpen={deleteProductIsOpen}
          setModalOpen={deleteProductOpenModal}
          onCloseModal={() => {
            setClipProduct(null)
            deleteProductCloseModal()
          }}
        >
          <TitleText title={`Delete`} />{' '}
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              {
                <>
                  {`Are you sure you want to delete `}
                  <b>{clipProduct?.name}</b>
                  {`?`}
                </>
              }
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setClipProduct(null)
                  deleteProductCloseModal()
                }}
                type="button"
                className="w-full rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  handleDeleteProduct({product: clipProduct?.slug})
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {deleteProductIsLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      </div>
    </React.Fragment>
  )
}

export default ClipTable
