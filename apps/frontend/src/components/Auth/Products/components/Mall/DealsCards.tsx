import useWishlist from '@/components/Customer/hooks/useWishlist'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import Spinner from '@/components/SharedUI/Spinner'
import useAddToClipsQuery from '@/components/Store/hooks/useAddToClips'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useCopyToClipboard} from '@/hooks/useCopyToClipboard'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps, Tooltip} from 'antd'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share'
interface IProps {
  item: any
  selectedIndex: number | null
  setSelectedIndex: (index: number | null) => void
  isBestDeals: boolean
}
const DealsCards = ({item, selectedIndex, setSelectedIndex, isBestDeals}: IProps) => {
  const store_slug = isBestDeals ? item?.listing?.slug : item?.slug
  const store_slug_name = isBestDeals ? item?.listing?.store?.slug : item?.store?.slug
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const router = useRouter()
  const {isLoading, handleAddToClip} = useAddToClipsQuery()
  const {
    handleAddToWishList,
    addToWishListLoading,
    handleDeleteWishlistClip,
    deleteWishlistClipLoading,
    handleAddToClipsFromWishlist,
    addToClipsWishlistLoading
  } = useWishlist()
  const toggleOpen = () => {
    if (isBestDeals) {
      setSelectedIndex(selectedIndex === item?.listing?.id ? null : item?.listing?.id)
    }
    if (!isBestDeals) {
      setSelectedIndex(selectedIndex === item?.id ? null : item?.id)
    }
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const {handleCopy} = useCopyToClipboard()
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDropdownVisible(false)
  }
  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`This may interest you: ${isBestDeals ? item?.listing?.name : item?.name}`)
    const adUrl = baseUrl + `/store/details/${store_slug_name}?slug=${store_slug}` // or your specific URL for the advertisement
    const body = encodeURIComponent(
      `Hello!\n\n` +
        `I found this product on AfricanDiasporaMart and thought you might be interested:\n` +
        `${item?.name}: ${adUrl}\n\n` +
        `Join AfricanDiasporaMart Community\n` +
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
          url={`${baseUrl}/store/details/${store_slug_name}?slug=${store_slug}`}
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
          url={`${baseUrl}/store/details/${store_slug_name}?slug=${store_slug}`}
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
          url={`${baseUrl}/store/details/${store_slug_name}?slug=${store_slug}`}
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
          url={`${baseUrl}/store/details/${store_slug_name}?slug=${store_slug}`}
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
          url={`${baseUrl}/store/details/${store_slug_name}?slug=${store_slug}`}
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
            handleCopy(`${baseUrl}/store/details/${store_slug_name}?slug=${store_slug}`, {
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
    <>
      {isBestDeals ? (
        <div className="flex items-center gap-3 border border-[#E6E6E6] bg-white p-1">
          <div onClick={toggleOpen} className="h-[100px] w-[150px] cursor-pointer">
            <ImageComponent
              src={
                item?.listing?.images && item?.listing?.images?.length > 0
                  ? `${process.env.imageBaseUrl}/${item?.listing?.images[0]}`
                  : '/assets/default_banner.jpg'
              }
              alt={item?.listing?.name || 'product image'}
              isLoadingImage={isLoadingImage}
              setIsLoadingImage={setIsLoadingImage}
              width={100}
              height={100}
              className="h-full *:w-full"
            />
          </div>
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex flex-col">
              <p onClick={toggleOpen} className="text-[14px]">
                {item?.listing?.name}
              </p>
              {selectedIndex === item?.listing?.id ? (
                <div className="mt-1 flex items-center gap-1">
                  <Tooltip
                    title={
                      item?.listing?.type === 'product'
                        ? `${(item?.listing as any)?.quantity === 0 || (item?.listing as any)?.quantity === null ? 'Sold Out' : 'Clip Item'}`
                        : 'Message Vendor'
                    }
                  >
                    <button
                      disabled={item?.listing?.type === 'product' && (item?.listing as any)?.quantity === 0}
                      onClick={() => {
                        handleAddToClip(item?.listing?.slug, {
                          quantity: 1
                        })
                      }}
                      className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                    >
                      {isLoading ? (
                        <Spinner className="h-3.5 w-3.5" />
                      ) : (
                        <Icon icon="ph:handbag" className="h-[16px] w-[16px]" />
                      )}
                    </button>
                  </Tooltip>
                  <button
                    onClick={() => {
                      router.push(`/store/details/${item?.listing?.store?.slug}?slug=${item?.listing?.slug}`)
                    }}
                    className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                  >
                    {' '}
                    <Icon icon="solar:eye-outline" className="h-[16px] w-[16px]" />
                  </button>
                  <button
                    onClick={() => {
                      handleAddToWishList(item?.listing?.slug)
                    }}
                    title="heart"
                    className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                  >
                    {addToWishListLoading ? (
                      <Spinner className="h-3.5 w-3.5" />
                    ) : (
                      <Icon icon="solar:heart-bold" className="h-[16px] w-[16px]" />
                    )}
                  </button>
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
                      className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                    >
                      <Icon icon="lucide:share" className="h-[16px] w-[16px]" />
                    </button>
                  </Dropdown>
                </div>
              ) : (
                <p className="text-[16px] font-[500]">
                  <FormatNumberCurrency
                    value={
                      Number(item?.listing?.display_price) > 0
                        ? Number(item?.listing?.display_price)
                        : Number(item?.listing?.price ?? 0)
                    }
                    currency={item?.listing?.currency}
                  />
                </p>
              )}
            </div>
            <Icon
              onClick={toggleOpen}
              icon={selectedIndex === item?.listing?.id ? 'iconamoon:arrow-left-2' : 'iconamoon:arrow-right-2'}
              width="24"
              height="24"
              className="cursor-pointer text-black hover:opacity-70"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 border border-[#E6E6E6] bg-white p-1">
          <div onClick={toggleOpen} className="h-[100px] w-[150px] cursor-pointer">
            <ImageComponent
              src={
                item?.images && item?.images?.length > 0
                  ? `${process.env.imageBaseUrl}/${item.images[0]}`
                  : '/assets/default_banner.jpg'
              }
              alt={item?.name || 'product image'}
              isLoadingImage={isLoadingImage}
              setIsLoadingImage={setIsLoadingImage}
              width={100}
              height={100}
              className="h-full w-full cursor-pointer"
            />
          </div>
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex flex-col">
              <p onClick={toggleOpen} className="text-[14px]">
                {item?.name}
              </p>
              {selectedIndex === item?.id ? (
                <div className="mt-1 flex items-center gap-1">
                  <Tooltip
                    title={
                      item?.type === 'product'
                        ? `${(item as any)?.quantity === 0 || (item as any)?.quantity === null ? 'Sold Out' : 'Clip Item'}`
                        : 'Message Vendor'
                    }
                  >
                    {' '}
                    <button
                      disabled={item?.type === 'product' && (item as any)?.quantity === 0 || (item as any)?.quantity === null}
                      onClick={() => {
                        handleAddToClip(item?.slug, {
                          quantity: 1
                        })
                      }}
                      className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                    >
                      {isLoading ? (
                        <Spinner className="h-3.5 w-3.5" />
                      ) : (
                        <Icon icon="ph:handbag" className="h-[16px] w-[16px]" />
                      )}
                    </button>
                  </Tooltip>

                  <button
                    onClick={() => {
                      router.push(`/store/details/${store_slug_name}?slug=${store_slug}`)
                    }}
                    className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                  >
                    {' '}
                    <Icon icon="solar:eye-outline" className="h-[16px] w-[16px]" />
                  </button>
                  <button
                    onClick={() => {
                      handleAddToWishList(item?.slug)
                    }}
                    title="heart"
                    className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                  >
                    {addToWishListLoading ? (
                      <Spinner />
                    ) : (
                      <Icon icon="solar:heart-bold" className="h-[16px] w-[16px]" />
                    )}
                  </button>
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
                      className="rounded-full border border-gray-200 p-2 hover:bg-black hover:text-white"
                    >
                      <Icon icon="lucide:share" className="h-[16px] w-[16px]" />
                    </button>
                  </Dropdown>
                </div>
              ) : (
                <p className="text-[16px] font-[500]">
                  <FormatNumberCurrency
                    value={Number(item?.display_price) > 0 ? Number(item?.display_price) : Number(item?.price ?? 0)}
                    currency={item?.currency}
                  />
                </p>
              )}
            </div>
            <Icon
              onClick={toggleOpen}
              icon={selectedIndex === item?.id ? 'iconamoon:arrow-left-2' : 'iconamoon:arrow-right-2'}
              width="24"
              height="24"
              className="cursor-pointer text-black hover:opacity-70"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default DealsCards
