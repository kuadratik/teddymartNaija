import {Dropdown, Image, MenuProps, Tooltip} from 'antd'

import React, {useState} from 'react'

// import Image from 'next/image'

import useSendService from '@/components/Clips/hooks/useSendService'
import useStartConversation from '@/components/Customer/Advert/hooks/useStartVendorConversation'
import useWishlist from '@/components/Customer/hooks/useWishlist'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import Spinner from '@/components/SharedUI/Spinner'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import TitleText from '@/components/Vendor/TitleText'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useCopyToClipboard} from '@/hooks/useCopyToClipboard'
import {useModalState} from '@/hooks/useModalState'
import {toggleLargeOpenServiceModal} from '@/redux/features/openServiceModalSlice'
import {useGetSpecifiedStoreListingQuery} from '@/services/store'
import {skipToken} from '@reduxjs/toolkit/query/react'
import {Listing} from '@/types/store'
import {Icon} from '@iconify/react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useDispatch, useSelector} from 'react-redux'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share'
import useAddToClipsQuery from '../hooks/useAddToClips'
// @ts-ignore
export const TruncatedText = ({text, limit}) => {
  // Check if text length exceeds limit
  const truncatedText = text.length > limit ? `${text.slice(0, limit)}...` : text

  return <span>{truncatedText}</span>
}

interface DetailsProps {
  listing: Listing
  store_name?: string
  store_slug?: string
  deleteMode?: boolean
  savedMode?: boolean
  index: number
}

const DetailsCard = ({listing, store_name, store_slug, deleteMode = false, savedMode = false, index}: DetailsProps) => {
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const {isLoadingStartConversation, startConversation, error} = useStartConversation(() => {
    setMessage('')
    confirmCloseModal()
  })

  const [message, setMessage] = useState('')

  const router = useRouter()
  const dispatch = useDispatch()

  const {type} = useSelector((state: any) => state.vendor)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const {id} = router.query
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const [clipUuid, setClipUuid] = useState<any>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleOpenLargeServiceModal = () => {
    dispatch(toggleLargeOpenServiceModal())
  }

  const {isLoading, handleAddToClip} = useAddToClipsQuery()
  const {
    handleAddToWishList,
    addToWishListLoading,
    handleDeleteWishlistClip,
    deleteWishlistClipLoading,
    handleAddToClipsFromWishlist,
    addToClipsWishlistLoading
  } = useWishlist()
  const {handleCopy} = useCopyToClipboard()
  const {isOpen: confirmIsOpen, closeModal: confirmCloseModal, openModal: confirmOpenModal} = useModalState()
  const baseUrl = `${window.location.protocol}//${window.location.host}`
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
  } = useGetSpecifiedStoreListingQuery(
    listing?.store?.slug && type ? {params: {listingType: type, store: listing.store.slug}} : skipToken
  )

  const {isLoading: sendServiceLoading, handleSendService} = useSendService(() => {
    successVendorOpenModal()
    confirmCloseModal()
  })
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDropdownVisible(false)
  }
  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`This may interest you: ${listing?.name}`)
    const adUrl = baseUrl + `/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}` // or your specific URL for the advertisement
    const body = encodeURIComponent(
      `Hello!\n\n` +
        `I found this ${type} on myEKI and thought you might be interested:\n` +
        `${listing?.name}: ${adUrl}\n\n` +
        `Join myEKI Community\n` +
        `Facebook: https://www.facebook.com/myekimarket\n` +
        `Instagram: https://www.instagram.com/myekimarket/\n` +
        `Website: https://myeki.market`
    )
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailtoLink
  }
  const socialShareItems: MenuProps['items'] = [
    {
      key: 'facebook',
      label: (
        <FacebookShareButton
          onClick={handleMenuClick}
          url={`${baseUrl}/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`}
        >
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:facebook-fill" className="text-[#3b5998]" />
            <span>Facebook</span>
          </div>
        </FacebookShareButton>
      )
    },
    {
      key: 'twitter',
      label: (
        <TwitterShareButton
          onClick={handleMenuClick}
          url={`${baseUrl}/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`}
          title={`Check out this awesome ${type}!`}
        >
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:twitter-fill" className="text-[#1da1f2]" />
            <span>Twitter</span>
          </div>
        </TwitterShareButton>
      )
    },
    {
      key: 'linkedin',
      label: (
        <LinkedinShareButton
          onClick={handleMenuClick}
          url={`${baseUrl}/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`}
          title={`Check out this awesome ${type}!`}
          summary="Discover more about this business"
        >
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:linkedin-fill" className="text-[#0077b5]" />
            <span>LinkedIn</span>
          </div>
        </LinkedinShareButton>
      )
    },
    {
      key: 'whatsapp',
      label: (
        <WhatsappShareButton
          onClick={handleMenuClick}
          url={`${baseUrl}/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`}
          title={`Check out this awesome ${type}!`}
        >
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:whatsapp-fill" className="text-[#25D366]" />
            <span>WhatsApp</span>
          </div>
        </WhatsappShareButton>
      )
    },
    {
      key: 'telegram',
      label: (
        <TelegramShareButton
          onClick={handleMenuClick}
          url={`${baseUrl}/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`}
          title={`Check out this awesome ${type}!`}
        >
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:telegram-fill" className="text-[#0088cc]" />
            <span>Telegram</span>
          </div>
        </TelegramShareButton>
      )
    },
    {
      key: 'email',
      label: (
        <button
          onClick={e => {
            handleMenuClick(e)
            handleEmailSubmit()
          }}
          className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10"
        >
          <Icon icon="ic:outline-email" className="text-[#666666]" />
          <span>Email</span>
        </button>
      )
    },
    {
      key: 'copy',
      label: (
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            handleCopy(`${baseUrl}/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`, {
              successTitle: 'Link copied successfully!'
            })
          }}
          className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10"
        >
          <Icon icon="ri:clipboard-fill" className="text-[#666666]" />
          <span>Copy Link</span>
        </button>
      )
    }
  ]
  return (
    <React.Fragment>
      <Link
        href={`/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`}
        className="h-full w-full cursor-pointer rounded-[8px] border-[1px] border-solid border-[#EDEDED] bg-[#FFFFFF]"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-full cursor-pointer flex-col items-center hover:opacity-90">
            {/* {listing?.discount?.length > 0 && (
              <div className="absolute -right-2 -top-3 z-50 rounded-[40px] bg-[#FF2D55] p-[1px] px-2 text-white">
                -{parseFloat(listing.discount)}%
              </div>
            )}{' '} */}
            <div
              className="relative flex !w-full flex-col items-center overflow-hidden p-[5px] lg:p-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* discount price */}

              {!listing?.is_available && (
                <div className="absolute -left-0 top-3">
                  <Image
                    src={`/assets/unavailable-tag.svg`}
                    alt={listing?.name}
                    width={100}
                    height={30}
                    className="h-[35px] object-center"
                  />
                </div>
              )}
              <div
                className={`absolute right-2 top-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-100 lg:opacity-0'} z-30`}
              >
                <Dropdown
                  overlayClassName="lg:max-w-[760px] mx-auto mt-1"
                  destroyPopupOnHide
                  trigger={['click']}
                  menu={{
                    items: socialShareItems
                  }}
                  placement="bottomRight"
                  open={dropdownVisible}
                  onOpenChange={setDropdownVisible}
                >
                  <button
                    title="share"
                    className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-colors duration-200 hover:bg-gray-100"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Icon icon="lucide:share" width="20" height="20" className="text-gray-600" />
                  </button>
                </Dropdown>
                {listing.type === 'product' && (
                  <button
                    className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-colors duration-200 hover:bg-gray-200"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      deleteMode ? handleDeleteWishlistClip(listing?.slug) : handleAddToWishList(listing?.slug)
                    }}
                  >
                    {addToWishListLoading || deleteWishlistClipLoading ? (
                      <Spinner />
                    ) : deleteMode ? (
                      <Image src="/assets/delete.svg" alt="delete" width={20} height={20} preview={false} />
                    ) : (
                      <Icon icon="mdi:heart-outline" className="h-[20px] w-[20px] text-gray-600" />
                    )}
                  </button>
                )}

                <Link
                  href={`/store/details/${store_slug ?? listing?.store?.slug}?slug=${listing.slug}`}
                  className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-colors duration-200 hover:bg-gray-100"
                  // onClick={e => {
                  //   e.preventDefault()
                  //   e.stopPropagation()
                  //   if (type === 'service') {
                  //     handleOpenLargeServiceModal()
                  //   } else {
                  //     dispatch(toggleLargeCloseServiceModal())
                  //   }
                  // }}
                >
                  <Icon icon="solar:eye-outline" className="h-[20px] w-[20px] text-gray-600" />
                </Link>
              </div>

              <div className="h-[250px] w-full overflow-hidden rounded-t-[10px]">
                <ImageComponent
                  isLoadingImage={isLoadingImage}
                  setIsLoadingImage={setIsLoadingImage}
                  src={`${process.env.imageBaseUrl}/${listing?.images[0]}`}
                  alt={listing?.name || 'product image'}
                  className="h-full w-full rounded-t-[10px] object-cover mix-blend-darken"
                  width={500}
                  height={500}
                  index={index}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between p-3">
          <div className="flex flex-col">
            <TextComponent as="h1" className="hidden text-[14px] font-medium text-[#000000] lg:block">
              <TruncatedText text={listing?.name} limit={20} />
            </TextComponent>
            <TextComponent as="h1" className="text-[14px] font-medium text-[#000000] lg:hidden">
              <TruncatedText text={listing?.name} limit={10} />
            </TextComponent>

            {listing?.type === 'product' && (
              <div className="flex justify-between whitespace-nowrap">
                <div
                  className={`flex flex-wrap md:flex-nowrap md:items-center md:gap-2 ${listing?.discount?.length > 0 ? 'flex-row-reverse' : ''}`}
                >
                  {listing?.discount?.length > 0 && (
                    <span className="block w-full text-gray-400 line-through">
                      {' '}
                      <FormatNumberCurrency
                        value={+parseFloat(listing?.display_price) + parseFloat(listing?.display_price) * 0.1}
                        currency={listing?.currency}
                      />
                    </span>
                  )}
                  <span className="w-full text-base font-bold text-[#1a1a1a]">
                    <FormatNumberCurrency
                      value={
                        Number(listing?.display_price) > 0 ? Number(listing?.display_price) : Number(listing?.price)
                      }
                      currency={listing?.currency}
                    />
                  </span>{' '}
                </div>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <Tooltip
              title={
                listing?.type === 'product'
                  ? `${(listing as any)?.quantity === 0 ? 'Sold Out' : 'Clip Item'}`
                  : 'Message Vendor'
              }
            >
              <button
                disabled={(listing as any)?.quantity === 0}
                className={`group flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] hover:bg-black hover:text-white ${(listing as any)?.quantity === 0 ? 'cursor-not-allowed opacity-40 hover:bg-black/40' : 'cursor-pointer hover:bg-black'}`}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (listing?.is_available) {
                    if (listing?.type === 'service') {
                      if (isAuthenticatedToken) {
                        confirmOpenModal()
                      } else {
                        router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                      }
                    } else {
                      savedMode
                        ? handleAddToClipsFromWishlist(listing?.slug)
                        : handleAddToClip(listing?.slug, {
                            quantity: 1
                          })
                    }
                  }
                }}
              >
                {isLoading || addToClipsWishlistLoading ? (
                  <Spinner className="!h-4 !w-4 border-black" />
                ) : listing?.type === 'product' ? (
                  <Icon icon="ph:handbag" className="text-[21px]" />
                ) : (
                  <Icon icon="ph:chat-text" className="text-[21px]" />
                )}
              </button>
            </Tooltip>
          </div>

          <div className="hidden lg:block">
            {' '}
            <Tooltip
              title={
                listing?.type === 'product'
                  ? `${(listing as any)?.quantity === 0 || (listing as any)?.quantity === null ? 'Sold Out' : 'Clip Item'}`
                  : 'Message Vendor'
              }
            >
              <button
                disabled={(listing as any)?.quantity === 0 || (listing as any)?.quantity === null}
                className={`group flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#f2f2f2] text-black hover:text-white ${(listing as any)?.quantity === 0 ? 'cursor-not-allowed opacity-40 hover:bg-black/40' : 'cursor-pointer hover:bg-black'}`}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (listing?.is_available) {
                    if (listing?.type === 'service') {
                      if (isAuthenticatedToken) {
                        confirmOpenModal()
                      } else {
                        router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                      }
                    } else {
                      savedMode
                        ? handleAddToClipsFromWishlist(listing?.slug)
                        : handleAddToClip(listing?.slug, {
                            quantity: 1
                          })
                    }
                  }
                }}
              >
                {isLoading || addToClipsWishlistLoading ? (
                  <Spinner className="!h-4 !w-4 border-black text-[#000000] hover:text-white" />
                ) : listing?.type === 'product' ? (
                  <Icon icon="ph:handbag" className="text-[21px]" />
                ) : (
                  <Icon icon="ph:chat-text" className="text-[21px]" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </Link>
      {!isDesktop && confirmIsOpen && (
        <DrawerContainer
          open={confirmIsOpen}
          onClose={() => {
            confirmCloseModal()
          }}
          title={`Send Message`}
          height={300}
        >
          <div className="flex w-full flex-col gap-5">
            <TextAreaInput
              className="my-2"
              errorMessage={''}
              value={message}
              title={''}
              onChange={e => {
                setMessage(e.target.value)
              }}
              name={'description'}
              row={4}
              placeholder={'Type a message'}
            />

            <div className="flex w-full items-center justify-center gap-4">
              {/* <CustomButton
                onClick={() => {
                  confirmCloseModal()
                }}
                type="button"
                className="w-[200px] rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton> */}

              <CustomButton
                disabled={!message}
                onClick={() => {
                  if (isAuthenticatedToken) {
                    startConversation({
                      body: {
                        user_id: listing?.user_id?.toString(),
                        advert_id: '',
                        listing_id: '',
                        message
                      }
                    })
                  } else {
                    router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                  }
                }}
                type="button"
                className="w-[50%] rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {isLoadingStartConversation ? <Spinner /> : 'Send Message'}
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
          <div className="flex w-full justify-end">
            <span
              className="cursor-pointer"
              onClick={() => {
                confirmCloseModal()
              }}
            >
              <Icon icon={'mdi:close'} className="text-[24px]" />
            </span>
          </div>

          <TextComponent
            as="h1"
            className="my-[14px] text-center text-[20px] font-semibold leading-[32px] text-[#000000]"
          >
            Send Message
          </TextComponent>

          <div className="flex w-full flex-col gap-5">
            <TextAreaInput
              className="my-1 !border-2"
              errorMessage={''}
              value={message}
              title={''}
              onChange={e => {
                setMessage(e.target.value)
              }}
              name={'description'}
              row={4}
              placeholder={'Type a message'}
            />

            <div className="flex w-full items-center justify-center gap-4">
              {/* <CustomButton
                onClick={() => {
                  confirmCloseModal()
                }}
                type="button"
                className="w-[200px] rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton> */}

              <CustomButton
                disabled={!message}
                onClick={() => {
                  if (isAuthenticatedToken) {
                    startConversation({
                      body: {
                        user_id: listing?.user_id?.toString(),
                        advert_id: '',
                        listing_id: '',
                        message
                      }
                    })
                  } else {
                    router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
                  }
                }}
                type="button"
                className="w-[50%] rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {isLoadingStartConversation ? <Spinner /> : 'Send Message'}
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
                onLoadStart={() => {
                  setIsLoadingImage(true)
                }}
                onLoad={() => {
                  setIsLoadingImage(false)
                }}
                src={`${process.env.imageBaseUrl}/${storeInfo?.data?.profile_picture_path}`}
                alt="vendor-pic"
                className={`${isLoadingImage ? 'blur-sm' : ''}`}
                onError={error => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                  setIsLoadingImage(false)
                }}
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
