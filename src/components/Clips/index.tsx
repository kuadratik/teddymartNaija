import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useModalState} from '@/hooks/useModalState'
import {useGetAllClipsQuery, useGetClipsByIdQuery} from '@/services/auth/clips'
import {Button, Checkbox, Form, Image, Tooltip} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
import DrawerContainer from '../SharedUI/DrawerContainer'
import EmptyClip from '../SharedUI/EmptyClip'
import TextInput from '../SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '../SharedUI/ModalComponent'
import PhoneInputWithCountry from '../SharedUI/PhoneInputWithCountry'
import Spinner from '../SharedUI/Spinner'
import SuccessModal from '../SharedUI/States/Success/SuccessModal'
import TextComponent from '../SharedUI/TextComponent'
import TitleText from '../Vendor/TitleText'
import useClipOrder from './hooks/useClipOrder'
import useDeleteClip from './hooks/useDeleteClip'

import {sliceText} from '@/utils/fx'
import {MinusSquareFilled, PlusSquareFilled} from '@ant-design/icons'
import useEditProductQuantity from './hooks/useEditProductQuantity'
import useSendToVendor from './hooks/useSendToVendor'
import {OrderClipType} from './utils'
import {ClipOrderSchema} from './utils/schema'

import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import Link from 'next/link'
import MayAlsoLikeProduct from '../Auth/Products/components/MayAlsoLikeProducts'
import useAddToWishlistQuery from './hooks/useAddToWishlist'
import useDeleteProduct from './hooks/useDeleteProductFromStoreClip'

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
}

const ClipsComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const closeDeleteFunction = () => {
    deleteProductCloseModal()
    successOpenModal()
  }
  const {isLoading: deleteProductIsLoading, handleDeleteProduct} = useDeleteProduct(closeDeleteFunction)
  const router = useRouter()
  const [clipId, setClipId] = useState<any>()
  const [checked, setChecked] = useState(true)

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, setFieldError} =
    useFormik<OrderClipType>({
      initialValues: initialValues,
      validationSchema: ClipOrderSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        // handleLoginUser({payload: val, setFieldError})

        handleOrderClip({clip_id: clipId?.id, body: val})
      }
    })

  const [clearSelection, setClearSelection] = useState<boolean>(false)

  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })

  const [clipProduct, setClipProduct] = useState<any>()

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const {
    data: clipsData,
    isLoading: clipsIsLoading,
    isFetching: clipIsFetching,
    isSuccess
  } = useGetClipsByIdQuery({clip_id: clipId?.id ?? '', currency: selectedLanguage.value})

  const {isLoading: deleteClipIsLoading, handleDeleteClip} = useDeleteClip(closeDeleteFunction)
  const {isEditProductLoading, handleEditProduct} = useEditProductQuantity()
  const {handleAddToWishListCart, isLoading: addToWishlistLoading} = useAddToWishlistQuery()

  const {isOpen, closeModal, openModal} = useModalState()

  const {isOpen: successIsOpen, closeModal: successCloseModal, openModal: successOpenModal} = useModalState()

  const {
    isOpen: deleteProductIsOpen,
    closeModal: deleteProductCloseModal,
    openModal: deleteProductOpenModal
  } = useModalState()

  const {
    isOpen: contactInfoIsOpen,
    closeModal: contactInfoCloseModal,
    openModal: contactInfoOpenModal
  } = useModalState()

  const {isOpen: confirmIsOpen, closeModal: confirmCloseModal, openModal: confirmOpenModal} = useModalState()

  const {isLoading: clipOrderIsLoading, handleOrderClip} = useClipOrder(contactInfoCloseModal)

  const {
    isOpen: successVendorIsOpen,
    closeModal: successVendorCloseModal,
    openModal: successVendorOpenModal
  } = useModalState()

  const {isOpen: vendorIsOpen, closeModal: vendorCloseModal, openModal: vendorOpenModal} = useModalState()

  const {isLoading: sendToVendorLoading, handleSendToVendor} = useSendToVendor(() => {
    confirmCloseModal()
    successVendorOpenModal()
  })
  const clipProductInfo = data?.data?.products

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  console.log('clipProductInfo', clipProductInfo)

  return (
    <React.Fragment>
      {!clipProductInfo?.length ? (
        <EmptyClip />
      ) : (
        <div className="flex flex-col justify-between gap-4 md:justify-normal lg:mx-auto lg:w-full lg:max-w-7xl">
          <div className="flex w-full items-center justify-between md:mt-[60px]">
            <h3 className="text-[24px] font-semibold leading-[31px] text-[#1D1d1d]">My Clips</h3>
            <CustomButton
              className="h-[37px] w-[110px] rounded-[8px]"
              onClick={() => {
                router.back()
              }}
            >
              <TextComponent as="p" className="whitespace-nowrap text-white">
                Back
              </TextComponent>
            </CustomButton>
          </div>

          <div className="mt-[10px] w-full space-y-4 lg:flex lg:gap-4">
            {isDesktop && (
              <div className="container mx-auto p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-[#F0F1F5] py-4 text-left">
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Item Price</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allClipsIsSuccess &&
                      clipProductInfo.map((product: any, id: any) => {
                        return (
                          <tr key={id} className="border-b">
                            <td className="px-4 py-4">
                              <div
                                onClick={() => {
                                  router.push(`/store/details/${product?.store_slug}?slug=${product.slug}`)
                                }}
                                className="flex cursor-pointer items-center space-x-4 hover:opacity-90"
                              >
                                <div className="h-[60px] min-w-[60px] overflow-hidden rounded-[9px]">
                                  <Image
                                    src={`${process.env.imageBaseUrl}/${product?.images[0]}`}
                                    alt="store-image"
                                    className={`${isLoadingImage ? 'blur-sm' : ''} !h-[60px] !w-[60px] rounded-[9px] object-cover`}
                                    onLoadStart={() => {
                                      setIsLoadingImage(true)
                                    }}
                                    onLoad={() => {
                                      setIsLoadingImage(false)
                                    }}
                                    onError={error => {
                                      error.currentTarget.src = '/assets/default_banner.jpg'
                                      setIsLoadingImage(false)
                                    }}
                                    width={60}
                                    height={60}
                                    preview={false}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{product.name}</h3>
                                  <TextComponent as="p" className="text-sm text-gray-500">
                                    <Tooltip title={product.store_name}>{sliceText(product.store_name, 30)}</Tooltip>
                                  </TextComponent>
                                  <p className="text-sm text-gray-500">{product.vendor}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <TextComponent as="p" className="text-[13px] leading-[16px] text-[#6B7280]">
                                <FormatNumberCurrency
                                  value={Number(product?.display_price) > 0 ? product?.display_price : product?.price}
                                />
                              </TextComponent>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  className=""
                                  disabled={isEditProductLoading}
                                  onClick={() => {
                                    setEditingProductId(product.listing_id)
                                    if (product.quantity === 1) {
                                      deleteProductOpenModal()
                                      setClipProduct(product)
                                    } else {
                                      handleEditProduct({
                                        product: product.slug,
                                        body: {
                                          quantity: product.quantity - 1
                                        }
                                      })
                                    }
                                  }}
                                >
                                  <MinusSquareFilled className="h-4 w-4" />
                                </button>
                                {/* <span className="w-8 text-center">{product.quantity}</span> */}
                                <span className="mx-2 text-[10px] leading-[12px]">
                                  {isEditProductLoading &&
                                  editingProductId?.toString() === product.listing_id.toString() ? (
                                    <Spinner className="h-3 w-3 border-black" />
                                  ) : (
                                    <span>{product.quantity}</span>
                                  )}
                                </span>

                                <button
                                  className={`${product.quantity === product.product_quantity ? 'cursor-not-allowed opacity-50' : ''}`}
                                  disabled={isEditProductLoading || product.quantity === product.product_quantity}
                                  onClick={() => {
                                    setEditingProductId(product.listing_id)
                                    handleEditProduct({
                                      product: product.slug,
                                      body: {
                                        quantity: product.quantity + 1
                                      }
                                    })
                                  }}
                                >
                                  <PlusSquareFilled className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-between">
                                <TextComponent as="p" className="text-[13px] leading-[16px] text-[#6B7280]">
                                  <FormatNumberCurrency
                                    value={
                                      Number(product.display_price > 0 ? product.display_price : product.price) *
                                      Number(product.quantity)
                                    }
                                  />
                                </TextComponent>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center space-x-2">
                                <Button
                                  className="flex items-center rounded-[8px] bg-[#AF52DE] hover:!bg-[#AF52De]"
                                  onClick={() => {
                                    handleAddToWishListCart(product.slug as string)
                                  }}
                                  loading={addToWishlistLoading}
                                >
                                  {addToWishlistLoading ? (
                                    <Spinner className="" />
                                  ) : (
                                    <p className="text-[10px] leading-[13px] text-white">Add to wishlist</p>
                                  )}
                                  <Image
                                    src="/assets/heart.svg"
                                    alt="item"
                                    preview={false}
                                    height={20}
                                    className="flex-shrink-0"
                                  />
                                </Button>
                                <Button
                                  className="w-fit !border-none text-[#FF2D55]"
                                  onClick={() => {
                                    deleteProductOpenModal()
                                    setClipProduct(product)
                                  }}
                                >
                                  <Image src="/assets/delete.svg" alt="item" preview={false} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            )}
            {!isDesktop && (
              <div className="w-full space-y-4">
                {allClipsIsSuccess &&
                  clipProductInfo.map((product: any, id: any) => (
                    <div key={id} className="flex items-center space-x-4 border-b px-[20px] pb-4 lg:my-0 lg:px-0">
                      <div
                        onClick={() => {
                          router.push(`/store/details/${product?.store_slug}?slug=${product.slug}`)
                        }}
                        className="h-[60px] min-w-[60px] overflow-hidden rounded-[9px] hover:opacity-90"
                      >
                        <Image
                          src={`${process.env.imageBaseUrl}/${product?.images[0]}`}
                          alt="store-image"
                          className={`${isLoadingImage ? 'blur-sm' : ''} !h-[60px] !w-[60px] rounded-[9px] object-cover`}
                          onLoadStart={() => {
                            setIsLoadingImage(true)
                          }}
                          onLoad={() => {
                            setIsLoadingImage(false)
                          }}
                          onError={error => {
                            error.currentTarget.src = '/assets/default_banner.jpg'
                            setIsLoadingImage(false)
                          }}
                          width={60}
                          height={60}
                          preview={false}
                        />
                      </div>
                      <div className="flex-1">
                        <TextComponent as="h3" className="font-semibold">
                          {product.name}
                        </TextComponent>
                        <TextComponent as="p" className="text-sm text-gray-500">
                          {sliceText(product.store_name, 30)}
                        </TextComponent>
                        <TextComponent as="p" className="mt-1 font-bold">
                          <FormatNumberCurrency
                            value={Number(product?.display_price) > 0 ? product?.display_price : product?.price}
                          />
                        </TextComponent>
                        <div className="mt-2 flex items-center">
                          <button
                            className=""
                            disabled={isEditProductLoading}
                            onClick={() => {
                              setEditingProductId(product.listing_id)
                              if (product.quantity === 1) {
                                deleteProductOpenModal()
                                setClipProduct(product)
                              } else {
                                handleEditProduct({
                                  product: product.slug,
                                  body: {
                                    quantity: product.quantity - 1
                                  }
                                })
                              }
                            }}
                          >
                            <MinusSquareFilled className="h-4 w-4" />
                          </button>
                          <span className="mx-2 text-[10px] leading-[12px]">
                            {isEditProductLoading && editingProductId?.toString() === product.listing_id.toString() ? (
                              <Spinner className="h-3 w-3 border-black" />
                            ) : (
                              <span>{product.quantity}</span>
                            )}
                          </span>
                          <button
                            className={`${product.quantity === product.product_quantity ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={isEditProductLoading || product.quantity === product.product_quantity}
                            onClick={() => {
                              setEditingProductId(product.listing_id)
                              handleEditProduct({
                                product: product.slug,
                                body: {
                                  quantity: product.quantity + 1
                                }
                              })
                            }}
                          >
                            <PlusSquareFilled className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex h-full flex-col justify-between">
                        <Button
                          className="!border-none text-[#FF2D55]"
                          onClick={() => {
                            deleteProductOpenModal()
                            setClipProduct(product)
                          }}
                        >
                          <Image src="/assets/delete.svg" alt="item" preview={false} />
                        </Button>

                        <Button
                          className="!border-none text-[16px]"
                          onClick={() => {
                            handleAddToWishListCart(product.slug as string)
                          }}
                          loading={addToWishlistLoading}
                        >
                          {addToWishlistLoading ? (
                            <Spinner />
                          ) : (
                            <Image src="/assets/heart.svg" alt="item" preview={false} height={20} />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <div className="mt-6 flex w-full flex-col gap-[28px] bg-[#F0F1F5] p-5 lg:w-[40%] lg:rounded-[11px]">
              {/* <div className="space-y-2">
                <div className="flex justify-between">
                  <TextComponent as="span">Estimate Shipping</TextComponent>
                  <FormatNumberCurrency value={data?.data?.total_price} />
                </div>
                <div className="flex justify-between">
                  <TextComponent as="span">Subtotal ({data?.data?.total_items} items)</TextComponent>
                  <FormatNumberCurrency value={data?.data?.total_price} />
                </div>
              </div> */}
              {/* <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div> */}
              <div className="flex justify-between rounded-[7px] bg-white px-3 py-[15px] font-bold">
                <TextComponent as="span" className="">
                  Estimated total
                </TextComponent>
                <FormatNumberCurrency value={data?.data?.total_price} />
              </div>
              <TextComponent as="p" className="text-[10px] font-medium">
                Delivery fees are not included yet.
              </TextComponent>

              <div>
                <Checkbox
                  onChange={e => {
                    console.log(e.target.checked)
                    setChecked(e.target.checked)
                  }}
                  checked={checked}
                >
                  <TextComponent as="span" className="text-[10px] font-medium leading-[13px] text-[#404040]">
                    I agree with the{' '}
                    <Link
                      href={'/terms-of-service'}
                      className="text-[10px] font-medium leading-[13px] text-black underline"
                    >
                      <span>Terms and Conditions</span>
                    </Link>
                  </TextComponent>
                </Checkbox>
              </div>

              <CustomButton
                className="h-[50px] py-2"
                disabled={!checked}
                onClick={() => {
                  router.push(`/clips/${data?.data?.cart_id}`)
                }}
              >
                <TextComponent as="span" className="text-white">
                  Checkout
                </TextComponent>
              </CustomButton>

              {/* <button onClick={() => {}}>
                <TextComponent
                  as="span"
                  className="text-center text-[13px] font-semibold leading-[16px] text-[#6B7280]"
                >
                  Select Logistics
                </TextComponent>
              </button> */}
            </div>
          </div>

          <div className="pt-10">
            <MayAlsoLikeProduct />
          </div>
        </div>
      )}

      {!isDesktop && (
        <DrawerContainer
          open={isOpen}
          onClose={() => {
            closeModal()
            setClipId(null)
            setClipProduct(null)
          }}
          title="View Items"
          height={300}
        >
          {clipsIsLoading || clipIsFetching ? (
            <div className="flex h-[120px] w-full items-center justify-center">
              <Spinner className="border-black" />
            </div>
          ) : (
            isSuccess &&
            clipsData?.data.map((clipData: any, id: any) => {
              return (
                <React.Fragment key={id}>
                  {' '}
                  <div className="flex w-full flex-row items-center gap-3 border-b py-[15px]">
                    {/* <div className="flex h-[78px] w-[78px] items-center justify-center overflow-hidden">
                      <Image src={`${process.env.imageBaseUrl}/${clipData?.image}`} alt="item" preview={false} />
                    </div> */}

                    <div className="h-[60px] min-w-[60px] overflow-hidden rounded-[2px]">
                      <Image
                        src={`${process.env.imageBaseUrl}/${clipData?.image}`}
                        alt="item"
                        preview={false}
                        className="!h-[60px] !w-[60px] rounded-[2px] object-cover"
                        width={60}
                        height={60}
                      />
                    </div>

                    <div className="flex w-full items-start justify-between">
                      <div className="flex flex-col items-start gap-2">
                        <TextComponent as="p" className="text-[16px] font-medium leading-[20px]">
                          {clipData?.name}
                        </TextComponent>
                        <TextComponent as="p" className="text-[12px] leading-[16px] tracking-[-0.16px] text-[#1D1D1D]">
                          <FormatNumberCurrency value={+clipData?.price} currency={clipData?.currency} />
                        </TextComponent>
                      </div>

                      <Button
                        className="!border-none"
                        onClick={() => {
                          closeModal()
                          deleteProductOpenModal()
                          setClipProduct(clipData)
                        }}
                      >
                        <Image src="/assets/delete.svg" alt="item" preview={false} />
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              )
            })
          )}{' '}
          <div className="mt-5 flex w-full items-center gap-4">
            <CustomButton
              onClick={() => {
                closeModal()
                setClipId(null)
                setClipProduct(null)
              }}
              type="button"
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              Confirm
            </CustomButton>
          </div>
        </DrawerContainer>
      )}

      {isDesktop && (
        <PlannerModal
          modalOpen={isOpen}
          setModalOpen={openModal}
          onCloseModal={() => {
            closeModal()
            setClipId(null)
            setClipProduct(null)
          }}
        >
          <TitleText title={`View Items`} />{' '}
          {clipsIsLoading || clipIsFetching ? (
            <div className="flex h-[120px] w-full items-center justify-center">
              <Spinner className="border-black" />
            </div>
          ) : (
            isSuccess &&
            clipsData?.data.map((clipData: any, id: any) => {
              return (
                <React.Fragment key={id}>
                  {' '}
                  <div className="flex w-full flex-row items-center gap-3 border-b py-[15px]">
                    <div className="flex h-[78px] w-[78px] items-center justify-center overflow-hidden">
                      <Image src={`${process.env.imageBaseUrl}/${clipData?.image}`} alt="item" preview={false} />
                    </div>

                    <div className="flex w-full items-start justify-between">
                      <div className="flex flex-col items-start gap-2">
                        <TextComponent as="p" className="text-[16px] font-medium leading-[20px]">
                          {clipData?.name}
                        </TextComponent>
                        <TextComponent as="p" className="text-[12px] leading-[16px] tracking-[-0.16px] text-[#1D1D1D]">
                          <FormatNumberCurrency value={+clipData?.price} currency={clipData?.currency} />
                        </TextComponent>
                      </div>

                      <Button
                        className="!border-none"
                        onClick={() => {
                          closeModal()
                          deleteProductOpenModal()
                          setClipProduct(clipData)
                        }}
                      >
                        <Image src="/assets/delete.svg" alt="item" preview={false} />
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              )
            })
          )}{' '}
          <div className="mt-5 flex w-full items-center gap-4">
            <CustomButton
              onClick={() => {
                closeModal()
                setClipId(null)
                setClipProduct(null)
              }}
              type="button"
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              Confirm
            </CustomButton>
          </div>
        </PlannerModal>
      )}

      {isDesktop && (
        <PlannerModal
          modalOpen={deleteProductIsOpen}
          setModalOpen={deleteProductOpenModal}
          onCloseModal={() => {
            setClipId(null)
            setClipProduct(null)
            deleteProductCloseModal()
            setClearSelection(false)
          }}
        >
          <TitleText title={`Delete`} />{' '}
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              {clearSelection ? (
                `Are you sure you want to clear ${clipId?.number_of_listings}  ${clipId?.number_of_listings > 1 ? 'items' : 'item'} from ${clipId?.store_name}`
              ) : (
                <>
                  {`Are you sure you want to delete `}
                  <b>{clipProduct?.name}</b>
                  {`?`}
                </>
              )}
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setClipId(null)
                  setClipProduct(null)
                  deleteProductCloseModal()
                  setClearSelection(false)
                }}
                type="button"
                className="w-full rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={
                  () => handleDeleteProduct(clipProduct?.slug)
                  // if (clearSelection) {
                  //   handleDeleteClip({clip_id: clipId?.id})
                  // } else {
                  //   handleDeleteProduct(clipProduct?.slug)
                  // }
                }
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {deleteProductIsLoading ? <Spinner className="border-white" /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      )}
      {!isDesktop && (
        <DrawerContainer
          open={deleteProductIsOpen}
          onClose={() => {
            setClipId(null)
            setClipProduct(null)
            deleteProductCloseModal()
            setClearSelection(false)
          }}
          title={`Delete`}
          height={300}
        >
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              {clearSelection ? (
                `Are you sure you want to clear ${clipId?.number_of_listings}  ${clipId?.number_of_listings > 1 ? 'items' : 'item'} from ${clipId?.store_name}`
              ) : (
                <>
                  {`Are you sure you want to delete `}
                  <b>{clipProduct?.name}</b>
                  {`?`}
                </>
              )}
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setClipId(null)
                  setClipProduct(null)
                  deleteProductCloseModal()
                  setClearSelection(false)
                }}
                type="button"
                className="w-full rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  if (clearSelection) {
                    handleDeleteClip({clip_id: clipId?.id})
                  } else {
                    handleDeleteProduct(clipProduct?.slug)
                  }
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {deleteProductIsLoading ? <Spinner className="border-white" /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </DrawerContainer>
      )}

      <PlannerModal
        modalOpen={successIsOpen}
        onCloseModal={() => {
          successCloseModal()
          setClipId(null)
          setClipProduct(null)
          setClearSelection(false)
        }}
        setModalOpen={successOpenModal}
        maskCloseable={true}
      >
        <SuccessModal
          successTitle={'Success'}
          successMessage={`${clearSelection ? 'Selection cleared successfully' : clipProduct?.name + ' ' + `deleted successfully`}`}
          primaryButtonText={`Close`}
          primaryButtonAction={() => {
            successCloseModal()
            setClipId(null)
            setClipProduct(null)
            setClearSelection(false)
          }}
          secondaryButtonText=""
        />
      </PlannerModal>
      {isDesktop && (
        <PlannerModal
          modalOpen={contactInfoIsOpen}
          onCloseModal={() => {
            contactInfoCloseModal()
            resetForm()
          }}
          setModalOpen={contactInfoOpenModal}
          maskCloseable={true}
        >
          <TitleText title={`Enter your details`} />

          <Form onFinish={handleSubmit}>
            <div className="flex w-full flex-col gap-5 bg-white">
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center gap-3">
                  <TextInput
                    placeholder="First Name"
                    onChange={handleChange}
                    name={'first_name'}
                    type={'text'}
                    value={values.first_name}
                    errorMessage={errors.first_name ? errors.first_name : ''}
                  />

                  <TextInput
                    placeholder="Last Name"
                    onChange={handleChange}
                    name={'last_name'}
                    type={'text'}
                    value={values.last_name}
                    errorMessage={errors.last_name ? errors.last_name : ''}
                  />
                </div>
                <TextInput
                  value={values.email}
                  errorMessage={errors.email ? errors.email : ''}
                  placeholder="Email"
                  onChange={handleChange}
                  name={'email'}
                  type={'email'}
                />
                <PhoneInputWithCountry
                  errorMessage={errors.phone ? errors.phone : ''}
                  title="Phone Number*"
                  inputProps={{
                    name: 'phone',
                    id: 'phone'
                  }}
                  placeholder={`Phone Number`}
                  disabled={false}
                  fontSize={14}
                  color={'#3D3D3D'}
                  value={values.phone}
                  onChange={e => {
                    setFieldValue('phone', e)
                  }}
                />
              </div>

              <div className="flex w-full items-center gap-4">
                <CustomButton
                  type="submit"
                  className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
                >
                  {clipOrderIsLoading ? <Spinner /> : 'Save'}
                </CustomButton>
              </div>
            </div>
          </Form>
        </PlannerModal>
      )}

      {!isDesktop && (
        <DrawerContainer
          open={contactInfoIsOpen}
          onClose={() => {
            contactInfoCloseModal()
            resetForm()
          }}
          title={`Enter your details`}
          height={400}
          className="bg-white"
        >
          <Form onFinish={handleSubmit}>
            <div className="flex w-full flex-col gap-5 bg-white">
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center gap-3">
                  <TextInput
                    placeholder="First Name"
                    onChange={handleChange}
                    name={'first_name'}
                    type={'text'}
                    value={values.first_name}
                    errorMessage={errors.first_name ? errors.first_name : ''}
                  />

                  <TextInput
                    placeholder="Last Name"
                    onChange={handleChange}
                    name={'last_name'}
                    type={'text'}
                    value={values.last_name}
                    errorMessage={errors.last_name ? errors.last_name : ''}
                  />
                </div>
                <TextInput
                  value={values.email}
                  errorMessage={errors.email ? errors.email : ''}
                  placeholder="Email"
                  onChange={handleChange}
                  name={'email'}
                  type={'email'}
                />
                <PhoneInputWithCountry
                  errorMessage={errors.phone ? errors.phone : ''}
                  title="Phone Number*"
                  inputProps={{
                    name: 'phone',
                    id: 'phone'
                  }}
                  placeholder={`Phone Number`}
                  disabled={false}
                  fontSize={14}
                  color={'#3D3D3D'}
                  value={values.phone}
                  onChange={e => {
                    setFieldValue('phone', e)
                  }}
                />
              </div>

              <div className="flex w-full items-center gap-4">
                <CustomButton
                  type="submit"
                  className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
                >
                  {clipOrderIsLoading ? <Spinner /> : 'Save'}
                </CustomButton>
              </div>
            </div>
          </Form>
        </DrawerContainer>
      )}
      {isDesktop && (
        <PlannerModal
          modalOpen={confirmIsOpen}
          onCloseModal={() => {
            setClipId(null)
            confirmCloseModal()
          }}
          setModalOpen={confirmOpenModal}
          maskCloseable={true}
        >
          {' '}
          <TitleText title={`Confirmation`} />
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              <>
                {`Are you ready to send your clipped items to `}
                <b>{clipId?.store_name}</b>
              </>
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setClipId(null)
                  confirmCloseModal()
                }}
                type="button"
                className="w-[200px] rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  handleSendToVendor({order_id: clipId?.order_id})
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {sendToVendorLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && (
        <DrawerContainer
          open={confirmIsOpen}
          onClose={() => {
            setClipId(null)
            confirmCloseModal()
          }}
          title={``}
          height={300}
        >
          <TitleText title={`Confirmation`} />

          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              <>
                {`Are you ready to send your clipped items to `}
                <b>{clipId?.store_name}</b>
              </>
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setClipId(null)
                  confirmCloseModal()
                }}
                type="button"
                className="w-[200px] rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  handleSendToVendor({order_id: clipId?.order_id})
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {sendToVendorLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </DrawerContainer>
      )}
      {isDesktop && (
        <PlannerModal
          modalOpen={successVendorIsOpen}
          onCloseModal={successVendorCloseModal}
          setModalOpen={successVendorOpenModal}
          maskCloseable={true}
        >
          <TitleText title={`Success`} />{' '}
          <SuccessModal
            successMessage="Thank you for using myEKI!"
            successTitle={''}
            primaryButtonText={`Contact Vendor`}
            primaryButtonAction={() => {
              successVendorCloseModal()
              vendorOpenModal()
            }}
          />
        </PlannerModal>
      )}
      {!isDesktop && (
        <DrawerContainer open={successVendorIsOpen} onClose={successVendorCloseModal} title={`Success`} height={400}>
          <SuccessModal
            successMessage="Thank you for using myEKI!"
            successTitle={''}
            primaryButtonText={`Contact Vendor`}
            primaryButtonAction={() => {
              successVendorCloseModal()
              vendorOpenModal()
            }}
          />
        </DrawerContainer>
      )}
      {isDesktop && (
        <PlannerModal
          modalOpen={vendorIsOpen}
          onCloseModal={vendorCloseModal}
          setModalOpen={vendorOpenModal}
          maskCloseable={true}
        >
          {' '}
          <TitleText title={`Vendor Information`} />
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="h-[90px] min-w-[90px] overflow-hidden rounded-[9px]">
                <Image
                  src={`${process.env.imageBaseUrl}/${clipId?.store_image}`}
                  alt="vendor-pic"
                  className="!h-[90px] !w-[90px] rounded-[9px] object-cover"
                  width={90}
                  height={90}
                  preview={false}
                />
              </div>
              {/* <Image src={`${process.env.imageBaseUrl}/${clipId?.store_image}`} alt="vendor-pic" preview={false} />{' '} */}
              <div className="flex flex-col items-center justify-center gap-2">
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px]">
                  {clipId?.store_name}
                </TextComponent>
                <TextComponent as="p" className="text-[11px] leading-[14px] text-[#9796A1]">
                  {clipId?.store_contact_number}
                </TextComponent>
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  const phoneURL = `tel:${clipId?.store_contact_number}`
                  window.location.href = phoneURL

                  // window.open(phoneURL, '_blank')
                }}
                type="button"
                className="w-full rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                Call
              </CustomButton>

              <CustomButton
                onClick={() => {
                  const whatsappURL = `https://wa.me/${clipId?.store_whatsapp_number}`
                  window.open(whatsappURL, '_blank')
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {/* {isAvailabilityLoading ? <Spinner /> : */}
                WhatsApp
                {/* // } */}
              </CustomButton>
            </div>

            <TextComponent as="p" className="text-center text-[11px] leading-[12px] text-[#9796A1]">
              Please note that myEKI does not process payment or shipping.
            </TextComponent>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && (
        <DrawerContainer open={vendorIsOpen} onClose={vendorCloseModal} title={`Vendor Information`} height={400}>
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="h-[90px] min-w-[90px] overflow-hidden rounded-[9px]">
                <Image
                  src={`${process.env.imageBaseUrl}/${clipId?.store_image}`}
                  alt="vendor-pic"
                  className="!h-[90px] !w-[90px] rounded-[9px] object-cover"
                  width={90}
                  height={90}
                  preview={false}
                />
              </div>
              <div className="ga-2 flex flex-col items-center justify-center">
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px]">
                  {clipId?.store_name}
                </TextComponent>
                <TextComponent as="p" className="text-[12px] leading-[14px] text-[#9796A1]">
                  {clipId?.store_contact_number}
                </TextComponent>
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  const phoneURL = `tel:${clipId?.store_contact_number}`
                  window.location.href = phoneURL

                  // window.open(phoneURL, '_blank')
                }}
                type="button"
                className="w-full rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                Call
              </CustomButton>

              <CustomButton
                onClick={() => {
                  const whatsappURL = `https://wa.me/${clipId?.store_whatsapp_number}`
                  window.open(whatsappURL, '_blank')
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {/* {isAvailabilityLoading ? <Spinner /> : */}
                WhatsApp
                {/* // } */}
              </CustomButton>
            </div>

            <TextComponent as="p" className="text-center text-[11px] leading-[12px] text-[#9796A1]">
              Please note that myEKI does not process payment or shipping.
            </TextComponent>
          </div>
        </DrawerContainer>
      )}
    </React.Fragment>
  )
}

export default ClipsComponent
