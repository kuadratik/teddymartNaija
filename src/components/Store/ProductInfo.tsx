import React, {useEffect, useState} from 'react'
import TextComponent from '../SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Button} from 'antd'
import Image from 'next/image'
import CustomButton from '../SharedUI/Buttons/Button'
import {useRouter} from 'next/router'
import {useGetSpecifiedStoreListingQuery, useGetStoreProductListingQuery} from '@/services/store'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import {useSelector} from 'react-redux'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {Uuid} from '@/utils/fx'
import {useLocalStorage} from 'react-use'
import useAddToClipsQuery from './hooks/useAddToClips'
import Spinner from '../SharedUI/Spinner'
import DrawerContainer from '../SharedUI/DrawerContainer'
import SuccessModal from '../SharedUI/States/Success/SuccessModal'
import {useModalState} from '@/hooks/useModalState'
import {useMediaQuery} from '@/hooks/use-media-query'
import PlannerModal from '../SharedUI/ModalComponent'
import TitleText from '../Vendor/TitleText'

const ProductInfo = () => {
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

  const [params, setParams] = useState<URLSearchParams | null>(null)
  const router = useRouter()

  const {id} = router.query

  useEffect(() => {
    // This code only runs on the client-side
    const searchParams = new URLSearchParams(window.location.search)
    setParams(searchParams)
  }, [])

  const product = params?.get('slug')

  const {data, isLoading, isFetching} = useGetStoreProductListingQuery({params: {listing: product, store: id}})

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const {type} = useSelector((state: any) => state.vendor)

  const {isLoading: addToClipIsLoading, handleAddToClip} = useAddToClipsQuery()

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

  return (
    <React.Fragment>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center">
          <Image
            src={`${process.env.imageBaseUrl}/${productInfo?.images[0]}`}
            alt="Banner-image"
            width={100}
            layout="responsive" // Makes the image responsive // Percentage of the parent width
            className="!h-[347px] object-cover"
            height={47}
          />
        </div>

        <div className="rounded-[8px] border p-[20px]">
          <div className="flex items-center justify-between">
            {productInfo?.type === 'product' && (
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
                <div className="h-[50px] w-[50px] overflow-hidden rounded-full border-[0.5px] border-[#E4E4E4] bg-white shadow-f2">
                  <Image
                    src={`${process.env.imageBaseUrl}/${storeInfo?.data?.profile_picture_path}`}
                    alt="Banner-image"
                    className="rounded-[8px] object-cover"
                    width={50}
                    height={50}
                  />
                </div>

                <div className="flex flex-col">
                  <TextComponent as="h1" className="text-[15px] font-semibold text-[#1F1F1F]">
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
            )}
            {/* <Button className="!border-none">
            {' '}
            <Icon icon="weui:arrow-filled" className="text-2xl" />{' '}
          </Button> */}
          </div>
          <div className="flex items-center justify-between">
            <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#1F1F1F]">
              {productInfo?.name}{' '}
            </TextComponent>
            <CustomButton
              disabled={!productInfo?.is_available}
              type="submit"
              onClick={() => {
                if (productInfo?.type === 'service') {
                  confirmOpenModal()
                } else {
                  handleAddToClip(productInfo?.slug)
                }
              }}
              className={` ${true ? 'bg-[#000000]' : 'bg-[#B9B9B9]'} flex h-[46px] w-[172px] items-center justify-center rounded-[10px] px-1 py-4 text-[14px] text-white`}
            >
              {productInfo?.type === 'service' ? 'Send a message' : addToClipIsLoading ? <Spinner /> : 'Clip Item'}
            </CustomButton>
          </div>

          {productInfo?.type === 'product' ? (
            <div>
              {' '}
              <TextComponent as="h1" className="mt-1 text-[20px] font-bold text-[#1C1C1C]">
                <FormatNumberCurrency value={+productInfo?.price} />{' '}
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
                  successVendorOpenModal()
                  confirmCloseModal()
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {'Yes'}
              </CustomButton>
            </div>
          </div>
        </DrawerContainer>
      )}

      {isDesktop && confirmIsOpen && (
        <PlannerModal
          modalOpen={confirmIsOpen}
          onCloseModal={() => {
            confirmCloseModal()
            setConfirmIsOpen(false)
          }}
          setModalOpen={setConfirmIsOpen}
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
                  confirmCloseModal()
                }}
                type="button"
                className="w-[200px] rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  successVendorOpenModal()
                  confirmCloseModal()
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {'Yes'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && successVendorIsOpen && (
        <DrawerContainer open={successVendorIsOpen} onClose={successVendorCloseModal} title={`Success`} height={400}>
          <SuccessModal
            successMessage="Thank you for using TeddyMart!"
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
            successMessage="Thank you for using TeddyMart!"
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
              Please note that TeddyMart does not process payment or shipping.
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
              Please note that TeddyMart does not process payment or shipping.
            </TextComponent>
          </div>
        </PlannerModal>
      )}
    </React.Fragment>
  )
}

export default ProductInfo
