import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useModalState} from '@/hooks/useModalState'
import useWindowResize from '@/hooks/useWindowResize'
import {toggleLargeCloseServiceModal, toggleLargeOpenServiceModal} from '@/redux/features/openServiceModalSlice'
import {useGetSpecifiedStoreListingQuery} from '@/services/store'
// import Image from 'next/image'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {Icon} from '@iconify/react'
import {Image, Tooltip} from 'antd'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import useSendService from '../Clips/hooks/useSendService'
import CustomButton from '../SharedUI/Buttons/Button'
import DrawerContainer from '../SharedUI/DrawerContainer'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '../SharedUI/ModalComponent'
import Spinner from '../SharedUI/Spinner'
import SuccessModal from '../SharedUI/States/Success/SuccessModal'
import TextComponent from '../SharedUI/TextComponent'
import TitleText from '../Vendor/TitleText'
import useAddToClipsQuery from './hooks/useAddToClips'

interface IProps {
  isLoading: boolean
  data: any
  setParams: any
}
const ProductInfo = ({isLoading, data, setParams}: IProps) => {
  const {
    isOpen: confirmIsOpen,
    closeModal: confirmCloseModal,
    openModal: confirmOpenModal,
    setIsOpen: setConfirmIsOpen
  } = useModalState()

  const {
    isOpen: successVendorIsOpen,
    closeModal: successVendorCloseModal,
    openModal: successVendorOpenModal,
    setIsOpen: setSuccessVendorIsOpen
  } = useModalState()

  const {
    isOpen: vendorIsOpen,
    closeModal: vendorCloseModal,
    openModal: vendorOpenModal,
    setIsOpen: setVendorIsOpen
  } = useModalState()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const dispatch = useDispatch()
  const {isLargeOpenServiceModal, isOpenMobileServiceModal} = useAppSelector(state => state.openServiceModal)
  const router = useRouter()
  const {width: windowWidth} = useWindowResize()
  const {id} = router.query

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  useEffect(() => {
    // This code only runs on the client-side
    const searchParams = new URLSearchParams(window.location.search)
    setParams(searchParams)
  }, [])

  const [clipUuid, setClipUuid] = useState<any>(null)

  const {type} = useSelector((state: any) => state.vendor)

  const {isLoading: addToClipIsLoading, handleAddToClip} = useAddToClipsQuery()

  const {isLoading: sendServiceLoading, handleSendService} = useSendService(() => {
    successVendorOpenModal()
    confirmCloseModal()

    handleCloseLargeServiceModal()
  })

  const {
    data: storeInfo,
    isLoading: storeInfoIsLoading,
    isFetching: storeInfoIsFetching
  } = useGetSpecifiedStoreListingQuery({params: {listingType: type, store: id}})

  if (isLoading || storeInfoIsLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  // console.log(storeInfo?.data)

  const productInfo = data?.data

  // console.log(storeInfo?.data)

  const handleOpenLargeServiceModal = () => {
    dispatch(toggleLargeOpenServiceModal())
  }

  const handleCloseLargeServiceModal = () => {
    dispatch(toggleLargeCloseServiceModal())
  }

  return (
    <React.Fragment>
      <div className="flex flex-col gap-6">
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src={`${process.env.imageBaseUrl}/${productInfo?.images[0]}`}
            alt="Banner-image"
            width={'1000px'}
            onLoadStart={() => {
              setIsLoadingImage(true)
            }}
            onError={error => {
              error.currentTarget.src = '/assets/default_banner.jpg'
              setIsLoadingImage(false)
            }}
            onLoad={() => {
              setIsLoadingImage(false)
            }}
            preview
            fallback="/assets/default_banner.jpg"
            // layout="responsive" // Makes the image responsive // Percentage of the parent width
            className={`${isLoadingImage ? 'blur-sm' : ''} !h-[347px] !w-full object-cover`}
            // height={107}
          />
        </div>

        <div className="rounded-[8px] border p-[20px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <div className="items-center justify-center rounded-full border-[0.5px] border-[#E4E4E4] bg-white shadow-f2">
                    <Image
                      src={`${process.env.imageBaseUrl}/${storeInfo?.data?.profile_picture_path}`}
                      width={50}
                      height={50}
                      alt="profile"
                      className="object-contain"
                      style={{
                        borderRadius: '100px' // Set the border radius
                      }}
                    />
                  </div> */}
              <div className="h-[50px] w-[50px] rounded-full border-[#E4E4E4] bg-white">
                <Image
                  src={
                    storeInfo?.data?.profile_picture_path
                      ? `${process.env.imageBaseUrl}/${storeInfo?.data?.profile_picture_path}`
                      : '/assets/profile_img.jpg'
                  }
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                    setIsLoadingImage(false)
                  }}
                  alt="Banner-image"
                  onLoadStart={() => {
                    setIsLoadingImage(true)
                  }}
                  onLoad={() => {
                    setIsLoadingImage(false)
                  }}
                  className={`${isLoadingImage ? 'blur-sm' : ''} !h-[50px] !w-[50px] rounded-full object-cover`}
                  width={50}
                  height={50}
                  preview={false}
                />
              </div>

              <div
                className="flex flex-col"
                onClick={() => {
                  if (storeInfo?.data?.slug) {
                    router.push(`/store/${storeInfo?.data?.slug}?type=${type}`)
                  }
                }}
              >
                <TextComponent
                  as="h1"
                  className="cursor-pointer text-[15px] font-semibold text-[#1F1F1F] hover:underline"
                >
                  {storeInfo?.data?.name}
                </TextComponent>
                {/* <div className="flex items-center gap-1">
                <TextComponent as="h1" className="text-[14px] font-normal text-[#1F1F1F]">
                  Official Store{' '}
                </TextComponent>
                <Icon icon="bitcoin-icons:verify-filled" className="text-[22px] text-[#1546A0]" />{' '}
              </div> */}
              </div>
            </div>

            {/* <Button className="!border-none">
            {' '}
            <Icon icon="weui:arrow-filled" className="text-2xl" />{' '}
          </Button> */}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <TextComponent as="h1" className="text-[22px] font-bold leading-[32px] text-[#1F1F1F] lg:text-[24px]">
              {productInfo?.name}{' '}
            </TextComponent>
            <Tooltip title={productInfo?.type === 'product' ? 'Clip Item' : 'Message Vendor'}>
              <button
                disabled={!productInfo?.is_available}
                type="submit"
                onClick={() => {
                  if (productInfo?.type === 'service') {
                    if (windowWidth <= 800) {
                      confirmOpenModal()
                    } else {
                      handleOpenLargeServiceModal()
                    }
                  } else {
                    handleAddToClip(
                      productInfo?.slug,
                      {
                        quantity: 1,
                        variant_id: productInfo?.variants[0]?.id
                      }
                    )
                  }
                }}
                className={`group flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] hover:bg-black hover:text-white`}
              >
                {addToClipIsLoading ? (
                  <Spinner />
                ) : productInfo?.type === 'product' ? (
                  <Icon icon="ph:handbag" className="text-[21px] text-[#000000] group-hover:text-white" />
                ) : (
                  <Icon icon="ph:chat-text" className="text-[21px] text-[#000000] group-hover:text-white" />
                )}
              </button>
            </Tooltip>
          </div>

          {productInfo?.type === 'product' ? (
            <div>
              {' '}
              <TextComponent as="h1" className="mt-1 text-[20px] font-bold text-[#1C1C1C]">
                <FormatNumberCurrency value={+productInfo?.price} currency={productInfo?.currency} />{' '}
              </TextComponent>
              <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[26px] text-[#1F1F1F]">
                {productInfo?.description}
              </TextComponent>
              <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[26px] text-[#1F1F1F]">
                {productInfo?.additional_information}
              </TextComponent>
            </div>
          ) : (
            <div>
              <TextComponent as="h1" className="mt-2 text-[15px] font-bold leading-[24px] text-[#1C1C1C]">
                Service Description{' '}
              </TextComponent>
              <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[26px] text-[#1F1F1F]">
                {productInfo?.description}
              </TextComponent>
              <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[26px] text-[#1F1F1F]">
                {productInfo?.additional_information}
              </TextComponent>
            </div>
          )}
        </div>
      </div>

      {!isDesktop && confirmIsOpen && (
        <DrawerContainer
          open={confirmIsOpen}
          onClose={() => {
            confirmCloseModal()
          }}
          title={`Confirmation`}
          height={300}
        >
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              <>{`Are you ready to send a message to ${storeInfo?.data?.name}  `}</>
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  confirmCloseModal()
                }}
                type="button"
                className="w-[200px] rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  if (isAuthenticatedToken) {
                    handleSendService({store_id: storeInfo?.data?.slug, listing_id: productInfo?.slug})
                  } else {
                    router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                  }
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {sendServiceLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </DrawerContainer>
      )}

      {isDesktop && isLargeOpenServiceModal && (
        <PlannerModal
          modalOpen={isLargeOpenServiceModal}
          onCloseModal={() => {
            // confirmCloseModal()
            // setConfirmIsOpen(false)
            handleCloseLargeServiceModal()
          }}
          setModalOpen={() => handleCloseLargeServiceModal()}
          maskCloseable={true}
        >
          <TitleText title={`Confirmation`} />
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              <>{`Are you ready to send a message to ${storeInfo?.data?.name}  `}</>
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  handleCloseLargeServiceModal()
                }}
                type="button"
                className="w-[200px] rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  if (isAuthenticatedToken) {
                    handleSendService({store_id: storeInfo?.data?.slug, listing_id: productInfo?.slug})
                  } else {
                    router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                  }
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {sendServiceLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && successVendorIsOpen && (
        <DrawerContainer open={successVendorIsOpen} onClose={successVendorCloseModal} title={`Success`} height={400}>
          <SuccessModal
            successMessage="Thank you for using AfricanDiasporaMart!"
            successTitle={''}
            primaryButtonText={`Contact ${productInfo?.type === 'product' ? 'Vendor' : 'Provider'}`}
            primaryButtonAction={() => {
              successVendorCloseModal()
              vendorOpenModal()
            }}
          />
        </DrawerContainer>
      )}

      {isDesktop && successVendorIsOpen && (
        <PlannerModal
          modalOpen={successVendorIsOpen}
          onCloseModal={() => {
            successVendorCloseModal()
            setSuccessVendorIsOpen(false)
          }}
          setModalOpen={setSuccessVendorIsOpen}
          maskCloseable={true}
        >
          <TitleText title={`Success`} />
          <SuccessModal
            successMessage="Thank you for using AfricanDiasporaMart!"
            successTitle={''}
            primaryButtonText={`Contact ${productInfo?.type === 'product' ? 'Vendor' : 'Provider'}`}
            primaryButtonAction={() => {
              successVendorCloseModal()
              vendorOpenModal()
            }}
          />
        </PlannerModal>
      )}

      {!isDesktop && vendorIsOpen && (
        <DrawerContainer
          open={vendorIsOpen}
          onClose={vendorCloseModal}
          title={`${productInfo?.type === 'product' ? 'Vendor' : 'Provider'} Information`}
          height={400}
        >
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Image
                width={60}
                height={60}
                style={{
                  borderRadius: '100px' // Set the border radius
                }}
                src={`${process.env.imageBaseUrl}/${storeInfo?.data?.profile_picture_path}`}
                alt="vendor-pic"
                // preview={false}
              />
              <div className="ga-2 flex flex-col items-center justify-center">
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px]">
                  {storeInfo?.data?.name}
                </TextComponent>
                <TextComponent as="p" className="text-[11px] leading-[14px] text-[#9796A1]">
                  {storeInfo?.data?.contact_number}
                </TextComponent>
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  const phoneURL = `tel:${storeInfo?.data?.contact_number}`
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
                  const whatsappURL = `https://wa.me/${storeInfo?.data?.whatsapp_number}`
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
              Please note that AfricanDiasporaMart does not process payment or shipping.
            </TextComponent>
          </div>
        </DrawerContainer>
      )}

      {isDesktop && vendorIsOpen && (
        <PlannerModal
          modalOpen={vendorIsOpen}
          onCloseModal={() => {
            setVendorIsOpen(false)
            vendorCloseModal()
          }}
          setModalOpen={setVendorIsOpen}
          maskCloseable={true}
        >
          <TitleText title={`${productInfo?.type === 'product' ? 'Vendor' : 'Provider'} Information`} />
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Image
                width={60}
                height={60}
                style={{
                  borderRadius: '100px' // Set the border radius
                }}
                src={`${process.env.imageBaseUrl}/${storeInfo?.data?.profile_picture_path}`}
                alt="vendor-pic"
                // preview={false}
              />
              <div className="ga-2 flex flex-col items-center justify-center">
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px]">
                  {storeInfo?.data?.name}
                </TextComponent>
                <TextComponent as="p" className="text-[11px] leading-[14px] text-[#9796A1]">
                  {storeInfo?.data?.contact_number}
                </TextComponent>
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  const phoneURL = `tel:${storeInfo?.data?.contact_number}`
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
                  const whatsappURL = `https://wa.me/${storeInfo?.data?.whatsapp_number}`
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
              Please note that AfricanDiasporaMart does not process payment or shipping.
            </TextComponent>
          </div>
        </PlannerModal>
      )}
    </React.Fragment>
  )
}

export default ProductInfo
