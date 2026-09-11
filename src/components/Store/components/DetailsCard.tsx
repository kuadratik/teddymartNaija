import {Badge, Button, Image, Rate} from 'antd'

import React, {useEffect, useState} from 'react'
// import Image from 'next/image'
import useSendService from '@/components/Clips/hooks/useSendService'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import Spinner from '@/components/SharedUI/Spinner'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import TitleText from '@/components/Vendor/TitleText'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useModalState} from '@/hooks/useModalState'
import {useGetSpecifiedStoreListingQuery} from '@/services/store'
import {Listing} from '@/types/store'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import useAddToClipsQuery from '../hooks/useAddToClips'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'

interface DetailsProps {
  listing: Listing
  store_name?: string
  store_slug?: string
}

const DetailsCard = ({listing, store_name, store_slug}: DetailsProps) => {
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const router = useRouter()

  const {type} = useSelector((state: any) => state.vendor)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const {id} = router.query
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const {isLoading, handleAddToClip} = useAddToClipsQuery()

  const {isOpen: confirmIsOpen, closeModal: confirmCloseModal, openModal: confirmOpenModal} = useModalState()

  const {
    isOpen: successVendorIsOpen,
    closeModal: successVendorCloseModal,
    openModal: successVendorOpenModal
  } = useModalState()

  const {isOpen: vendorIsOpen, closeModal: vendorCloseModal, openModal: vendorOpenModal} = useModalState()

  const {
    data: storeInfo,
    isLoading: storeInfoIsLoading,
    isFetching: storeInfoIsFetching
  } = useGetSpecifiedStoreListingQuery({params: {listingType: type, store: id}})

  const {isLoading: sendServiceLoading, handleSendService} = useSendService(() => {
    successVendorOpenModal()
    confirmCloseModal()
  })

  return (
    <React.Fragment>
      <div
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          router.push(`/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`)
        }}
        className="m w-full rounded-[8px] border-[1px] border-solid border-[#EDEDED] bg-[#FFFFFF]"
      >
        <div className="flex flex-col items-center justify-center border-b-2 border-[#EDEDED]">
          <div className="flex w-full cursor-pointer flex-col items-center p-4 hover:opacity-90">
            {' '}
            <div className="relative flex !w-full flex-col items-center">
              {/* discount price */}
              {/* <div className="absolute -right-2 -top-3 z-50 rounded-[40px] bg-[#FF2D55] p-[1px] px-2 text-white">
                -20%
              </div>{' '} */}
              <Badge.Ribbon
                text="Unavailable"
                style={{
                  marginTop: 6
                }}
                placement="start"
                className={`custom-ribbon z-10 ${listing?.is_available ? 'hidden' : ''}`}
              >
                <div className="h-[200px] min-w-[230px] overflow-hidden rounded-[4px]">
                  <ImageComponent
                    src={`${process.env.imageBaseUrl}/${listing?.images[0]}`}
                    alt="product-image"
                    className={`rounded-[4px] object-cover`}
                    width={230}
                    height={200}
                  />
                </div>
              </Badge.Ribbon>
              <CustomButton
                disabled={!listing?.is_available}
                type="submit"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (listing?.type === 'service') {
                    if (isAuthenticatedToken) {
                      confirmOpenModal()
                    } else {
                      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                    }
                  } else {
                    handleAddToClip(listing?.slug)
                  }
                }}
                className={` ${listing?.is_available ? 'bg-[#000000]' : 'bg-[#B9B9B9]'} absolute -bottom-2 w-full rounded-[10px] px-1 py-4 text-[14px] text-white`}
              >
                {' '}
                {listing?.type === 'service' ? 'Send a message' : isLoading ? <Spinner /> : 'Clip Item'}
              </CustomButton>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <TextComponent as="h1" className="text-[14px] font-medium text-[#000000]">
            {listing?.name}{' '}
          </TextComponent>

          {listing?.type === 'product' && (
            <span
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()

                router.push(`/store/${listing?.store?.slug}?type=${type}`)
              }}
              className="cursor-pointer text-[14px] leading-[18px] text-[#1D1D1D] duration-100 ease-in-out hover:text-custom_grey hover:underline hover:opacity-60"
            >
              {listing?.store?.name}
            </span>
          )}
          {listing?.type === 'product' && (
            <div className="flex justify-between whitespace-nowrap">
              <div className="flex items-center gap-2">
                {' '}
                <TextComponent as="p" className="text-[18px] font-bold text-[#1C1C1C]">
                  <FormatNumberCurrency value={+listing?.price} currency={listing?.currency} />
                </TextComponent>
                {/* Discount */}
                {/* <TextComponent as="p" className="text-[13px] font-bold text-[#6B7280] line-through">
                  <FormatNumberCurrency value={900} currency={listing?.currency} />
                </TextComponent> */}
              </div>
              <div className="">
                <Rate
                  disabled
                  className="text-sm"
                  value={3}
                  style={{
                    fontSize: '13px' // Adjust size of the stars (optional)
                  }}
                />{' '}
              </div>
            </div>
          )}

          {listing?.type === 'service' && (
            <div className="flex items-center justify-between">
              <span
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()

                  router.push(`/store/${listing?.store?.slug}?type=${type}`)
                }}
                className="cursor-pointer text-[14px] leading-[18px] text-[#1D1D1D] duration-100 ease-in-out hover:text-custom_grey hover:underline hover:opacity-60"
              >
                {listing?.store?.name}
              </span>

              <Button
                htmlType="button"
                className="!border-none"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()

                  router.push(`/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`)
                }}
              >
                <Icon icon={'mingcute:information-fill'} width={24} height={24} />
              </Button>
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
              <>{`Are you ready to send a message to ${listing?.store?.name}  `}</>
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
                    handleSendService({store_id: listing?.store?.slug, listing_id: listing?.slug})
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

      {isDesktop && confirmIsOpen && (
        <PlannerModal
          modalOpen={confirmIsOpen}
          onCloseModal={() => {
            confirmCloseModal()
          }}
          setModalOpen={confirmCloseModal}
          maskCloseable={true}
        >
          <TitleText title={`Confirmation`} />
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              <>{`Are you ready to send a message to ${listing?.store?.name}  `}</>
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
                    handleSendService({store_id: listing?.store?.slug, listing_id: listing?.slug})
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
            successMessage="Thank you for using myEKI!"
            successTitle={''}
            primaryButtonText={`Contact ${type === 'product' ? 'Vendor' : 'Provider'}`}
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
          }}
          setModalOpen={successVendorCloseModal}
          maskCloseable={true}
        >
          <TitleText title={`Success`} />
          <SuccessModal
            successMessage="Thank you for using myEKI!"
            successTitle={''}
            primaryButtonText={`Contact ${type === 'product' ? 'Vendor' : 'Provider'}`}
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
          title={`${type === 'product' ? 'Vendor' : 'Provider'} Information`}
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
              Please note that myEKI does not process payment or shipping.
            </TextComponent>
          </div>
        </DrawerContainer>
      )}

      {isDesktop && vendorIsOpen && (
        <PlannerModal
          modalOpen={vendorIsOpen}
          onCloseModal={() => {
            vendorCloseModal()
          }}
          setModalOpen={vendorCloseModal}
          maskCloseable={true}
        >
          <TitleText title={`${type === 'product' ? 'Vendor' : 'Provider'} Information`} />
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
              Please note that myEKI does not process payment or shipping.
            </TextComponent>
          </div>
        </PlannerModal>
      )}
    </React.Fragment>
  )
}

export default DetailsCard
