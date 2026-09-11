import useSendToVendor from '@/components/Clips/hooks/useSendToVendor'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import Spinner from '@/components/SharedUI/Spinner'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import useAddToClipsQuery from '@/components/Store/hooks/useAddToClips'
import TitleText from '@/components/Vendor/TitleText'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useModalState} from '@/hooks/useModalState'
import {toggleLargeOpenServiceModal} from '@/redux/features/openServiceModalSlice'
import {useGetPopularNewQuery, useGetPopularQuery} from '@/services/general/general'
import {Icon} from '@iconify/react'
import {Badge, Button, Image} from 'antd'
import NextImage from 'next/image'
import {useRouter} from 'next/router'
import {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Autoplay, Mousewheel, Navigation} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

const Popularproduct = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const dispatch = useDispatch()
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)

  console.log('selectedLanguage', selectedLanguage)

  const {data, isLoading} = useGetPopularNewQuery({
    listingType: type,
    currency: selectedLanguage.value
  })

  // const {data: oldData, isLoading: oldIsLoading} = useGetPopularQuery({
  //   listingType: type
  // })

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

  const {isLoading: sendToVendorLoading, handleSendToVendor} = useSendToVendor(() => {
    confirmCloseModal()
    successVendorOpenModal()
  })

  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [currId, setCurrId] = useState<any>()
  const [clipId, setClipId] = useState<any>()

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const prevRef = useRef(null)
  const nextRef = useRef(null)

  const {isLoading: handleClipIsLoading, handleAddToClip} = useAddToClipsQuery()

  // Ensure navigation is updated after Swiper initialization
  useEffect(() => {
    if (swiperInstance && swiperInstance.navigation) {
      swiperInstance.navigation.update()
    }
  }, [swiperInstance])

  const handleOpenLargeServiceModal = () => {
    dispatch(toggleLargeOpenServiceModal())
  }

  return (
    <div className="lg:mt-[40px]">
      {' '}
      <TextComponent as="p" className="text-[18px] lg:font-bold lg:leading-[24px]">
        {data?.data?.length ? `${type === 'product' ? `Popular Products` : 'Popular Services'}` : ''}
      </TextComponent>
      <div className="mt-[10px] w-full lg:mt-[30px]">
        {isDesktop ? (
          <>
            {isLoading ? (
              <div className="mt-4 flex h-[239px] w-full flex-row gap-4">
                <div className="grid w-full grid-cols-4 gap-[10px]">
                  {[1, 2, 3, 4].map(item => {
                    return <div key={item} className="h-full w-full animate-pulse rounded-[9px] bg-gray-300" />
                  })}
                </div>
              </div>
            ) : (
              data?.data?.length > 0 && (
                <div className="relative mt-4 w-full">
                  {/* <div
                    ref={prevRef}
                    className="swiper-button-disabled absolute -left-2 top-1/3 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                  >
                    <Icon icon="tabler:chevron-left" width={24} height={24} />
                  </div> */}
                  {/* <div
                    ref={nextRef}
                    className="swiper-button-disabled absolute right-0 top-1/3 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                  >
                    <Icon icon="tabler:chevron-right" width={24} height={24} />
                  </div> */}
                  <Swiper
                    breakpoints={{
                      320: {
                        slidesPerView: 2
                      },
                      640: {
                        slidesPerView: 2
                      },
                      768: {
                        slidesPerView: 3
                      },
                      1200: {
                        slidesPerView: 4
                      }
                    }}
                    spaceBetween={20}
                    onSwiper={swiper => setSwiperInstance(swiper)}
                    navigation={{
                      prevEl: prevRef.current,
                      nextEl: nextRef.current
                    }}
                    onBeforeInit={swiper => {
                      // @ts-ignore
                      swiper.params.navigation.prevEl = prevRef.current
                      // @ts-ignore
                      swiper.params.navigation.nextEl = nextRef.current
                    }}
                    modules={[Navigation, Mousewheel]}
                    mousewheel={{forceToAxis: true}} // Enable mousewheel scrolling
                    className="mt-[20px] flex h-full !w-full flex-col gap-8 md:grid md:grid-cols-3 md:gap-6"
                  >
                    {data?.data?.map((listing: any, i: number) => (
                      <SwiperSlide className="w-full" key={i}>
                        <div
                          key={i}
                          onClick={e => {
                            router.push(`/store/details/${listing?.store?.slug}?slug=${listing.slug}`)
                          }}
                          className="w-full rounded-[8px] border-[1px] border-solid border-[#EDEDED] bg-white"
                        >
                          <div className="flex flex-col items-center justify-center border-b-2 border-[#EDEDED]">
                            <div className="flex w-full cursor-pointer flex-col items-center p-6 hover:opacity-90">
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
                                    setClipId(listing)
                                    setCurrId(i)

                                    if (listing?.type === 'service') {
                                      if (isAuthenticatedToken) {
                                        handleOpenLargeServiceModal()
                                        router.push(`/store/details/${listing?.store?.slug}?slug=${listing.slug}`)
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
                                  {listing?.type === 'service' ? (
                                    'Send a message'
                                  ) : handleClipIsLoading && currId == i ? (
                                    <Spinner />
                                  ) : (
                                    'Clip Item'
                                  )}
                                </CustomButton>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-5 p-4">
                            {listing?.type === 'product' && (
                              <TextComponent as="h1" className="text-[14px] font-medium text-[#000000]">
                                {listing?.name}{' '}
                              </TextComponent>
                            )}
                            <div className="flex items-center justify-between">
                              {listing?.type === 'service' && (
                                <TextComponent as="h1" className="text-[14px] font-medium text-[#000000]">
                                  {listing?.name}{' '}
                                </TextComponent>
                              )}

                              {listing?.type === 'product' && (
                                <TextComponent as="p" className="text-[18px] font-semibold text-[#1C1C1C]">
                                  <FormatNumberCurrency value={+listing?.price} currency={listing?.currency} />
                                </TextComponent>
                              )}
                              <Button
                                htmlType="button"
                                className="!border-none"
                                onClick={e => {
                                  e.preventDefault()
                                  e.stopPropagation()

                                  router.push(`/store/details/${listing?.store?.slug}?slug=${listing.slug}`)
                                }}
                              >
                                <Icon icon={'mingcute:information-fill'} width={24} height={24} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}{' '}
                  </Swiper>
                </div>
              )
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col gap-4">
            <Swiper
              slidesPerView={2}
              spaceBetween={20}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false
              }}
              modules={[Autoplay]}
              pagination={{
                clickable: false
              }}
              className="h-full w-full"
            >
              {data?.data?.map((listing: any, i: number) => (
                <SwiperSlide key={i} className="w-full">
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => {
                      router.push(`/store/details/${listing?.store?.slug}?slug=${listing.slug}`)
                    }}
                  >
                    <NextImage
                      src={`${process.env.imageBaseUrl}/${listing?.images[0]}`}
                      alt="Banner-image"
                      width={100}
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
                      layout="responsive" // Makes the image responsive // Percentage of the parent width
                      className="!h-[150px] !rounded-[9px] object-cover"
                      height={47}
                    />

                    <p className="whitespace-wrap mt-[10px] text-center text-[14px] text-[#181A20]">{listing.name}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}{' '}
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
              <>{`Are you ready to send a message to ${clipId?.store?.name}  `}</>
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
                  vendorOpenModal()
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
              <>{`Are you ready to send a message to ${clipId?.store?.name}  `}</>
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
                  vendorOpenModal()
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
            successMessage="Thank you for using myEKI!"
            successTitle={''}
            primaryButtonText={`Contact ${clipId?.type === 'product' ? 'Vendor' : 'Provider'}`}
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
            successMessage="Thank you for using myEKI!"
            successTitle={''}
            primaryButtonText={`Contact ${clipId?.type === 'product' ? 'Vendor' : 'Provider'}`}
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
          title={`${clipId?.type === 'product' ? 'Vendor' : 'Provider'} Information`}
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
                src={`${process.env.imageBaseUrl}/${clipId?.store?.profile_picture_path}`}
                alt="vendor-pic"
                // preview={false}
              />
              <div className="ga-2 flex flex-col items-center justify-center">
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px]">
                  {clipId?.store?.name}
                </TextComponent>
                <TextComponent as="p" className="text-[11px] leading-[14px] text-[#9796A1]">
                  {clipId?.store?.contact_number}
                </TextComponent>
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  const phoneURL = `tel:${clipId?.store?.contact_number}`
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
                  const whatsappURL = `https://wa.me/${clipId?.store?.whatsapp_number}`
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
            setVendorIsOpen(false)
            vendorCloseModal()
          }}
          setModalOpen={setVendorIsOpen}
          maskCloseable={true}
        >
          <TitleText title={`${clipId?.type === 'product' ? 'Vendor' : 'Provider'} Information`} />
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Image
                width={60}
                height={60}
                style={{
                  borderRadius: '100px' // Set the border radius
                }}
                src={`${process.env.imageBaseUrl}/${clipId?.store?.profile_picture_path}`}
                alt="vendor-pic"
                // preview={false}
              />
              <div className="ga-2 flex flex-col items-center justify-center">
                <TextComponent as="h5" className="text-[16px] font-semibold leading-[20px]">
                  {clipId?.store?.name}
                </TextComponent>
                <TextComponent as="p" className="text-[11px] leading-[14px] text-[#9796A1]">
                  {clipId?.store?.contact_number}
                </TextComponent>
              </div>
            </div>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  const phoneURL = `tel:${clipId?.store?.contact_number}`
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
                  const whatsappURL = `https://wa.me/${clipId?.store?.whatsapp_number}`
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
    </div>
  )
}

export default Popularproduct
