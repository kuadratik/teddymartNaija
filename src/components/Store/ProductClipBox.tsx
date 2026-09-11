import useWishlist from '@/components/Customer/hooks/useWishlist'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'
import Spinner from '../SharedUI/Spinner'
import useAddToClipsQuery from './hooks/useAddToClips'
// import SuccessImage from '../../../../../../public/assets/successImg.svg'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useCopyToClipboard} from '@/hooks/useCopyToClipboard'
import {Icon} from '@iconify/react'
import {Dropdown} from 'antd'
import Image from 'next/image'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share'
import SuccessImage from '../../../public/assets/successImg.svg'
import ReferralModal from '../Customer/Advert/ReferralModal'
import TextComponent from '../SharedUI/TextComponent'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
type ProductClipBoxType = {
  data: any
  selectedVariantId?: string
}

const ProductClipBox = ({data, selectedVariantId}: ProductClipBoxType) => {
  console.log('🚀 ~ ProductClipBox ~ selectedVariantId:', selectedVariantId)
  console.log('🚀 ~ ProductClipBox ~ data:', data)
  const {handleAddToWishList, addToWishListLoading} = useWishlist()
  const {isLoading, handleAddToClip} = useAddToClipsQuery()
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const [quantityValue, setQuantityValue] = useState(1)

  // State to store the current variant or product data
  const [currentItem, setCurrentItem] = useState<any>(data)

  // Find the selected variant when selectedVariantId changes
  useEffect(() => {
    if (selectedVariantId && data?.variants) {
      const selectedVariant = data.variants.find((variant: any) => variant.id === selectedVariantId)
      if (selectedVariant) {
        // Merge the variant data with basic product data
        setCurrentItem({
          ...data,
          price: selectedVariant.price,
          display_price: selectedVariant.display_price,
          quantity: selectedVariant.quantity,
          images: selectedVariant.image || data.images // Use variant image if available
        })
      } else {
        setCurrentItem(data)
      }
    } else {
      setCurrentItem(data)
    }
  }, [selectedVariantId, data])

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantityValue(1)
  }, [selectedVariantId])

  function getShippingMethodTypes(shippingMethods: any[]) {
    // Extract all method types and create a unique set
    const methodTypes = Array.from(shippingMethods.reduce((set, method) => set.add(method.method_type), new Set()))
    return methodTypes
  }
  const shippingMethods: string[] = getShippingMethodTypes(data?.store?.shipping_methods) as string[]
  const store_slug = data?.store?.slug
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const {handleCopy} = useCopyToClipboard()
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDropdownVisible(false)
  }
  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`This may interest you: ${data?.name}`)
    const adUrl = baseUrl + `` // or your specific URL for the advertisement
    const body = encodeURIComponent(
      `Hello!\n\n` +
        `I found this product on myEKI and thought you might be interested:\n` +
        `${data?.name}: ${adUrl}\n\n` +
        `Join myEKI Community\n` +
        `Facebook: https://www.facebook.com/myekimarket\n` +
        `Instagram: https://www.instagram.com/myekimarket/\n` +
        `Website: https://myeki.market`
    )
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailtoLink
  }
  const socialShareItems = [
    {
      key: 'facebook',
      label: (
        <FacebookShareButton
          onClick={handleMenuClick}
          url={`${baseUrl}/store/details/${store_slug ?? data?.store?.slug}?slug=${data.slug}`}
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
          url={`${baseUrl}/store/details/${store_slug ?? data?.store?.slug}?slug=${data.slug}`}
          title={`Check out this awesome product!`}
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
          url={`${baseUrl}/store/details/${store_slug ?? data?.store?.slug}?slug=${data.slug}`}
          title={`Check out this awesome product!`}
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
          url={`${baseUrl}/store/details/${store_slug ?? data?.store?.slug}?slug=${data.slug}`}
          title={`Check out this awesome product!`}
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
          url={`${baseUrl}/store/details/${store_slug ?? data?.store?.slug}?slug=${data.slug}`}
          title={`Check out this awesome product!`}
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
            handleCopy(`${baseUrl}/store/details/${store_slug ?? data?.store?.slug}?slug=${data.slug}`, {
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
    <div className="mx-auto h-fit w-full rounded-lg border bg-[#F8F8F8] p-4 shadow-f2 lg:w-[332px]">
      {currentItem?.discount_end_date?.length &&
      dayjs(currentItem?.discount_end_date).isAfter(dayjs()) &&
      currentItem?.discount_start_date?.length ? (
        <div>
          <div className="flex justify-between text-[11px] leading-[14px] text-gray-500"></div>
          <span>Discount valid from </span>
          <span className="font-semibold text-green-600">
            {dayjs(currentItem?.discount_start_date).format('DD/MM/YYYY')} -{' '}
            {dayjs(currentItem?.discount_end_date).format('DD/MM/YYYY')}
          </span>
        </div>
      ) : (
        ''
      )}
      {/* Amount section */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Amount</span>
          <div className="text-right">
            {currentItem?.discount_end_date?.length &&
            dayjs(currentItem?.discount_end_date).isAfter(dayjs()) &&
            currentItem?.discount_start_date?.length ? (
              <span className="block text-gray-400 line-through">
                {' '}
                <FormatNumberCurrency
                  value={+parseFloat(currentItem?.price) + parseFloat(currentItem?.price) * 0.1}
                  currency={currentItem?.currency}
                />
              </span>
            ) : null}
            <span className="text-xl font-bold text-black">
              <FormatNumberCurrency
                value={+currentItem?.display_price > 0 ? currentItem?.display_price : currentItem?.price}
                currency={currentItem?.currency}
              />
            </span>
          </div>
        </div>
        {currentItem?.quantity === 0 || currentItem?.quantity === null ? (
          <div className="mt-2 text-right text-sm font-medium text-red-500">Out of stock</div>
        ) : (
          currentItem?.quantity <= 10 && (
            <div className="mt-2 text-right text-sm font-medium text-red-500">
              Only {currentItem?.quantity ?? 0} left in stock – order soon
            </div>
          )
        )}
      </div>
      {/* Quantity selector */}
      <div className="mt-4 flex w-full items-center justify-between gap-4 border border-[#EAECEF] p-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg font-medium"
          onClick={() => {
            if (quantityValue > 1) {
              setQuantityValue(quantityValue - 1)
            }
          }}
        >
          −
        </button>
        <span className="text-lg font-semibold">
          {/*make the quantity value two unit value by default*/}
          {quantityValue.toString().length === 1 ? `0${quantityValue}` : quantityValue}
        </span>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg font-medium"
          onClick={() => {
            if (quantityValue < currentItem?.quantity) {
              setQuantityValue(quantityValue + 1)
            }
          }}
        >
          +
        </button>
      </div>
      {/* Buttons */}
      <div className="mt-4 space-y-2">
        <button
          disabled={currentItem?.quantity === 0 || currentItem?.quantity === null || isLoading}
          className={`w-full rounded-lg bg-black py-2 font-medium text-white ${
            currentItem?.quantity === 0 || currentItem?.quantity === null ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => {
            handleAddToClip(currentItem?.slug, {
              quantity: quantityValue,
              variant_id: selectedVariantId ? parseInt(selectedVariantId, 10) : undefined
            })
          }}
        >
          {isLoading ? <Spinner /> : 'Clip Item'}
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-black py-2"
          onClick={() => {
            handleAddToWishList(currentItem?.slug)
          }}
        >
          {addToWishListLoading ? <Spinner /> : <span className="text-xl">&#9825;</span>}
          {/* Heart icon */}
          <span>Save</span>
        </button>
      </div>
      <div className="flex justify-between gap-4 pt-3">
        <span
          onClick={() => {
            if (isAuthenticatedUser) {
              setIsReferralModalOpen(true)
            } else {
              showPlannerToast({
                options: {
                  customToast: (
                    <CustomToast
                      altText={''}
                      title={<>You are not authenticated, please login.</>}
                      image={'/assets/states/notificationToasts/successcheck.svg'}
                      textColor="#fff"
                      message=""
                      backgroundColor="#000"
                    />
                  )
                },
                message: 'Copied'
              })
            }
          }}
          className="cursor-pointer font-[500] underline"
        >
          Refer a customer
        </span>
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
          <span className="cursor-pointer font-[500] underline">Share</span>
        </Dropdown>
      </div>
      {/* Delivery options */}
      {shippingMethods?.length > 0 && (
        <div className="mt-3 border-t border-[#EAECEF] pt-2">
          <span className="block text-sm font-medium">Delivery options available</span>
          <div className="mt-2 space-y-2">
            {shippingMethods?.map((method: string, index: number) => (
              <div key={index} className="flex items-center rounded-lg border border-[#EAECEF] bg-white p-2 capitalize">
                <div className="w-[70px] overflow-hidden">
                  <Image
                    src={SuccessImage}
                    alt="success image"
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <TextComponent as="span" className="text-base">
                  {method}
                </TextComponent>
              </div>
            ))}
          </div>
        </div>
      )}
      {isReferralModalOpen && (
        <ReferralModal
          isAuthenticatedUser={isAuthenticatedUser}
          referralLink={`${baseUrl}/auth/sign-up?redirect=%2F&referral_code=${isAuthenticatedUser?.referral_code}&referralType=customer`}
          formValues={''}
          title="Invite a Customer"
          setFormValues={() => {}}
          modalOpen={isReferralModalOpen}
          setModalOpen={setIsReferralModalOpen}
        />
      )}
    </div>
  )
}

export default ProductClipBox
