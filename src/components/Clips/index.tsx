import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useModalState} from '@/hooks/useModalState'
import {useGetAllClipsQuery, useGetClipsByIdQuery} from '@/services/clips'
import {Button, Form, Image} from 'antd'
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
import useDeleteProduct from './hooks/useDeleteProductFromStoreClip'
import useSendToVendor from './hooks/useSendToVendor'
import {OrderClipType} from './utils'
import {ClipOrderSchema} from './utils/schema'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
}

const ClipsComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const router = useRouter()
  const [clipId, setClipId] = useState<any>()

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

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({currency: selectedLanguage.value})

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

  const closeDeleteFunction = () => {
    deleteProductCloseModal()
    successOpenModal()
  }

  const {isLoading: deleteProductIsLoading, handleDeleteProduct} = useDeleteProduct(closeDeleteFunction)

  const {isLoading: deleteClipIsLoading, handleDeleteClip} = useDeleteClip(closeDeleteFunction)

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

  const clipStoreInfo = data?.data?.clips

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <React.Fragment>
      {!clipStoreInfo?.length || clipStoreInfo.filter((info: any) => info?.number_of_listings > 0)?.length === 0 ? (
        <EmptyClip />
      ) : (
        <div className="">
          {allClipsIsSuccess &&
            clipStoreInfo
              ?.filter((info: any) => info?.number_of_listings > 0)
              ?.map((info: any, id: any) => {
                return (
                  <div key={id} className="w-full border-b px-4 pb-[38px] pt-[14px]">
                    <div className="flex w-full flex-col items-center justify-center gap-[37px]">
                      <div className="flex w-full items-start gap-4">
                        <div className="h-[60px] min-w-[60px] overflow-hidden rounded-[9px]">
                          <Image
                            src={`${process.env.imageBaseUrl}/${info?.store_image}`}
                            alt="store-image"
                            className={`${
                              isLoadingImage ? 'blur-sm' : ''
                            } !h-[60px] !w-[60px] rounded-[9px] object-cover`}
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

                        <div className="flex w-full flex-col items-start gap-[5px]">
                          <TextComponent as="h4" className="text-[16px] font-medium leading-[20px] text-[#1D1D1D]">
                            {info?.store_name}
                          </TextComponent>
                          <TextComponent as="span" className="text-[12px] font-normal leading-[16px] text-[#9796A1]">
                            {info?.number_of_listings} {info?.number_of_listings > 1 ? 'items' : 'item'}
                          </TextComponent>
                          <TextComponent
                            as="span"
                            className="text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                          >
                            <FormatNumberCurrency value={+info.total_amount} currency={info?.store_currency_code} />
                          </TextComponent>
                          <div className="flex w-full items-center justify-between py-2">
                            <button
                              type="button"
                              onClick={() => {
                                setClipId(info)
                                deleteProductOpenModal()
                                setClearSelection(true)
                              }}
                            >
                              <TextComponent
                                as="span"
                                className="text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D] hover:opacity-80"
                              >
                                Clear Selection
                              </TextComponent>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setClipId(info)
                                openModal()
                              }}
                            >
                              <TextComponent
                                as="span"
                                className="cursor-pointer text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                              >
                                View Items
                              </TextComponent>
                            </button>
                          </div>
                        </div>
                      </div>
                      {info.has_orders ? (
                        <CustomButton
                          type="button"
                          className="h-[37px] w-[224px] rounded-[5px] border border-black bg-[#000]"
                          onClick={() => {
                            setClipId(info)
                            confirmOpenModal()
                          }}
                        >
                          <TextComponent as="span" className="whitespace-nowrap text-[11px] leading-[13px] text-white">
                            Send to Vendor
                          </TextComponent>
                        </CustomButton>
                      ) : (
                        <CustomButton
                          type="button"
                          className="h-[37px] w-[224px] rounded-[5px] border border-black bg-[#fff] text-black"
                          onClick={() => {
                            if (isAuthenticatedToken) {
                              setClipId(info)
                              contactInfoOpenModal()
                            } else {
                              router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                            }
                          }}
                        >
                          <TextComponent as="span" className="whitespace-nowrap text-[11px] leading-[13px]">
                            Provide Contact Information
                          </TextComponent>
                        </CustomButton>
                      )}
                    </div>
                  </div>
                )
              })}
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
                          <FormatNumberCurrency value={+clipData?.price} currency={clipData?.currency_code} />
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
                        {' '}
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
              console.log('view Items', clipData)
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
                          <FormatNumberCurrency value={+clipData?.price} currency={clipData?.currency_code} />
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
                        {' '}
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
                onClick={() => {
                  if (clearSelection) {
                    handleDeleteClip({clip_id: clipId?.id})
                  } else {
                    handleDeleteProduct({product_id: clipProduct?.slug, clip_id: clipId?.id})
                  }
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {deleteProductIsLoading || deleteClipIsLoading ? <Spinner /> : 'Yes'}
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
                    handleDeleteProduct({product_id: clipProduct?.slug, clip_id: clipId?.id})
                  }
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {deleteProductIsLoading || deleteClipIsLoading ? <Spinner /> : 'Yes'}
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
