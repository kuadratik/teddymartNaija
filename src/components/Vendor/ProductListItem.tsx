import React, {use, useState} from 'react'
import {IProductListType} from './ProductListContainer'
import {Icon} from '@iconify/react'
import {Image} from 'antd'
import TextComponent from '../SharedUI/TextComponent'
import DrawerContainer from '../SharedUI/DrawerContainer'
import {useSelector} from 'react-redux'
import {capitalizeFirstLetter, capitalizeOnlyFirstLetter} from '@/utils/fx'
import CustomButton from '../SharedUI/Buttons/Button'
import {useRouter} from 'next/router'
import {on} from 'events'
import PlannerModal from '../SharedUI/ModalComponent'
import SuccessModal from '../SharedUI/States/Success/SuccessModal'
import {useDeleteUserStoreItemMutation, useUpdateStoreItemAvailabilityMutation} from '@/services/vendor/vendor'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import CustomToast from '../SharedUI/Toast/CustomToast'
import errorToastIcon from '../../../public/assets/error-toast-icon.svg'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import Spinner from '../SharedUI/Spinner'
import {setSelectProduct} from '@/redux/apiSlice/vendorSlice'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'

interface IProductListItemType {
  product: IProductListType
}

const ProductListItem = ({product}: IProductListItemType) => {
  const {type} = useSelector((state: any) => state.vendor)
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [updateAvailability, {isLoading: isAvailabilityLoading}] = useUpdateStoreItemAvailabilityMutation()
  const [deleteProductItem, {isLoading: isDeleteLoading}] = useDeleteUserStoreItemMutation()

  const handleAvailability = async () => {
    let payload = {
      is_available: product.is_available === false ? 1 : 0
    }

    try {
      const res = await updateAvailability({
        userStore: isAuthenticatedUser?.store?.slug!,
        listing: product.slug,
        body: payload
      }).unwrap()

      setShowAvailability(false)
      setShowSuccess(true)
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to change {capitalizeFirstLetter(type)} status!</>}
              image={errorToastIcon}
              textColor="red"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#FCFCFD"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const handleDelete = async () => {
    try {
      const res = await deleteProductItem({
        userStore: isAuthenticatedUser?.store?.slug!,
        listing: product.slug
      }).unwrap()

      setShowDeleteProduct(false)
      setShowSuccess(true)
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Delete {product.name} from store!</>}
              image={errorToastIcon}
              textColor="red"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#FCFCFD"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const options = [
    {
      name: `${capitalizeOnlyFirstLetter(type)} ${product?.is_available ? 'Un' : ''}available`,
      icon: 'hugeicons:unavailable',
      onClick: () => {
        setShowOption(false)
        setShowAvailability(true)
      }
    },
    {
      name: `Delete ${capitalizeOnlyFirstLetter(type)}`,
      icon: 'mdi:delete-outline',
      onClick: () => {
        setShowOption(false)
        setShowDeleteProduct(true)
      }
    }
  ]

  if (product.is_available) {
    options.unshift({
      name: `Edit ${capitalizeOnlyFirstLetter(type)}`,
      icon: 'lucide:edit',
      onClick: () => {
        dispatch(setSelectProduct(product))
        setShowOption(false)
        router.push(`/vendor/edit/${product.slug}`)
      }
    })
  }

  const [showOption, setShowOption] = useState(false)
  const [showDeleteProduct, setShowDeleteProduct] = useState(false)
  const [showAvailability, setShowAvailability] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <div className="flex max-h-[132px] w-full flex-col gap-[25px] rounded-[10px] border px-[15px] py-[19px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px] border">
            <Image src={`${process.env.imageBaseUrl}/${product.images[0]}`} alt="product image" preview={false} />
          </div>
          <TextComponent as="h5" className="text-[15px] font-bold leading-[19px] text-[#1f1f1f]">
            {product.name}
          </TextComponent>
        </div>
        <div className="cursor-pointer" onClick={() => setShowOption(true)}>
          <Icon icon={'mage:dots'} className="text-[24px]" />
        </div>
      </div>
      {product.price && (
        <div className="flex w-full items-center justify-between">
          <TextComponent as="p" className="text-[12px] font-bold leading-[16px] text-[#1f1f1f]">
            Price
          </TextComponent>
          <TextComponent as="p" className="text-[16px] font-medium leading-[20px] text-[#1f1f1f]">
            <FormatNumberCurrency value={+product.price} />{' '}
          </TextComponent>
        </div>
      )}

      {showOption && (
        <DrawerContainer open={showOption} onClose={() => setShowOption(false)} title="Options" height={300}>
          <div className="flex w-full flex-col gap-5">
            {options.map((item, index) => {
              return (
                <div className="flex cursor-pointer items-center gap-[17px]" key={index} onClick={item.onClick}>
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-black">
                    <Icon icon={item.icon} className="text-[18px] text-white" />
                  </div>
                  <TextComponent as="p" className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">
                    {item.name}
                  </TextComponent>
                </div>
              )
            })}
          </div>
        </DrawerContainer>
      )}

      {showDeleteProduct && (
        <DrawerContainer
          open={showDeleteProduct}
          onClose={() => setShowDeleteProduct(false)}
          title="Delete"
          height={300}
        >
          <div className="flex w-full flex-col gap-4">
            <TextComponent as="p" className="text-center text-[14px] font-medium leading-[18px] text-custom_grey">
              Are you sure you want to delete {product.name} from your store?
            </TextComponent>
            <TextComponent as="p" className="text-center text-[12px] font-medium leading-[16px] text-custom_grey">
              This action cannot be undone
            </TextComponent>
          </div>
          <div className="mt-5 flex w-full items-center gap-4">
            <CustomButton
              onClick={() => {
                handleDelete()
              }}
              type="button"
              className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
            >
              {isDeleteLoading ? <Spinner /> : 'Yes'}
            </CustomButton>

            <CustomButton
              onClick={() => {
                setShowDeleteProduct(false)
              }}
              type="button"
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              No
            </CustomButton>
          </div>
        </DrawerContainer>
      )}

      {showAvailability && (
        <DrawerContainer
          open={showAvailability}
          onClose={() => setShowAvailability(false)}
          title={`${capitalizeOnlyFirstLetter(type)} is ${product.is_available ? 'Una' : 'A'}vailable`}
          height={300}
        >
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              {type === 'product' ? '' : 'By '}Clicking <b>Yes</b>{' '}
              {type === 'product'
                ? product.is_available === false
                  ? `will add the product to your shelf and your customers will see that the product is now available.`
                  : `will remove the product from your shelf and your
              customers will see that the product is not available.`
                : `your customers will be see that the service is not available.`}
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setShowAvailability(false)
                }}
                type="button"
                className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  handleAvailability()
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {isAvailabilityLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </DrawerContainer>
      )}

      {showSuccess && (
        <PlannerModal modalOpen={showSuccess} setModalOpen={setShowSuccess} maskCloseable={true}>
          <SuccessModal
            successTitle={'Success'}
            primaryButtonText={`Home`}
            primaryButtonAction={() => {
              setShowSuccess(false)
            }}
          />
        </PlannerModal>
      )}
    </div>
  )
}

export default ProductListItem
