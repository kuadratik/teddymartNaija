import {Badge, Button, Image} from 'antd'

import React, {useEffect, useState} from 'react'
// import Image from 'next/image'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {Listing} from '@/types/store'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useLocalStorage} from 'react-use'
import {Uuid} from '@/utils/fx'
import useAddToClipsQuery from '../hooks/useAddToClips'
import Spinner from '@/components/SharedUI/Spinner'
import {useSelector} from 'react-redux'
import {useModalState} from '@/hooks/useModalState'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import {useGetSpecifiedStoreListingQuery} from '@/services/store'

interface DetailsProps {
  listing: Listing
  store_name?: string
}

const DetailsCard = ({listing, store_name}: DetailsProps) => {
  const router = useRouter()

  const {type} = useSelector((state: any) => state.vendor)

  const {id} = router.query

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

  // console.log(storeInfo, listing?.slug)

  return (
    <React.Fragment>
      <div className="m w-ful rounded-[8px] border-[1px] border-solid border-[#EDEDED]">
        <div className="flex flex-col items-center justify-center border-b-2 border-[#EDEDED]">
          <div className="flex w-full flex-col items-center p-6">
            {' '}
            <div className="relative flex !w-full flex-col items-center">
              {' '}
              <Badge.Ribbon
                text="Unavailable"
                style={{
                  marginTop: 6
                }}
                placement="start"
                className={`custom-ribbon ${listing?.is_available ? 'hidden' : ''}`}
              >
                <div className="h-[200px] min-w-[230px] overflow-hidden rounded-[4px]">
                  <Image
                    src={`${process.env.imageBaseUrl}/${listing?.images[0]}`}
                    alt="product-image"
                    className="rounded-[4px] object-cover"
                    width={230}
                    height={200}
                    preview={false}
                  />
                </div>
              </Badge.Ribbon>
              <CustomButton
                disabled={!listing?.is_available}
                type="submit"
                onClick={() => {
                  if (listing?.type === 'service') {
                    confirmOpenModal()
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
        <div className="flex flex-col gap-5 p-4">
          {listing?.type === 'product' && (
            <TextComponent as="h1" className="text-[20px] font-bold text-[#000000]">
              {listing?.name}{' '}
            </TextComponent>
          )}
          <div className="flex items-center justify-between">
            {listing?.type === 'service' && (
              <TextComponent as="h1" className="text-[24px] font-medium text-[#000000]">
                {listing?.name}{' '}
              </TextComponent>
            )}

            {listing?.type === 'product' && (
              <TextComponent as="p" className="text-[16px] font-medium text-[#1C1C1C]">
                <FormatNumberCurrency value={+listing?.price} />
              </TextComponent>
            )}
            <Button
              htmlType="button"
              className="!border-none"
              onClick={() => {
                router.push(`/store/details/${id}?slug=${listing.slug}`)
              }}
            >
              <Icon icon={'mingcute:information-fill'} width={24} height={24} />
            </Button>
          </div>
        </div>
      </div>

      {confirmIsOpen && (
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
              <>{`Are you ready to send a message to ${store_name}  `}</>
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

      {successVendorIsOpen && (
        <DrawerContainer open={successVendorIsOpen} onClose={successVendorCloseModal} title={`Success`} height={400}>
          <SuccessModal
            successMessage="Thank you for using TeddyMart!"
            successTitle={''}
            primaryButtonText={`Contact Vendor`}
            primaryButtonAction={() => {
              successVendorCloseModal()
              vendorOpenModal()
            }}
          />
        </DrawerContainer>
      )}

      {vendorIsOpen && (
        <DrawerContainer open={vendorIsOpen} onClose={vendorCloseModal} title={`Vendor Information`} height={400}>
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
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px] text-[#1D1D1D]">
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
    </React.Fragment>
  )
}

export default DetailsCard
