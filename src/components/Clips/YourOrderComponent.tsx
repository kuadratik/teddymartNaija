import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {Image} from 'antd'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'

type Props = {
  showLogistics: boolean
  setShowLogistics: React.Dispatch<React.SetStateAction<boolean>>
  handleSelectedAddress: () => void
  btnText: string
  selectedAddress: any
  isLoading: boolean
  getStoreAmount?: any
  isShowShipping: boolean
}

const YourOrderComponent = ({
  showLogistics,
  setShowLogistics,
  btnText,
  handleSelectedAddress,
  isLoading: isLoadingResponse,
  getStoreAmount,
  isShowShipping
}: Props) => {
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })
  const clipProductInfo = data?.data?.products
  console.log('🚀 ~ clipProductInfo:', clipProductInfo)

  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  // First, update the Props type to properly type getStoreAmount
  type Props = {
    showLogistics: boolean
    setShowLogistics: React.Dispatch<React.SetStateAction<boolean>>
    handleSelectedAddress: () => void
    btnText: string
    selectedAddress: any
    isLoading: boolean
    getStoreAmount?: (storeD: string) => number // Properly type the function
    isShowShipping: boolean
  }

  // function to only count shipping once per store, regardless of how many products are from the same store
  const calculateTotalShipping = () => {
    if (!getStoreAmount) return 0 // Early return if function is not provided

    // Create a Set to track unique store_slugs
    const uniqueStores = new Set<string>()

    // First collect all unique store_slugs
    data?.data?.products?.forEach((product: any) => {
      if (product?.store_slug) {
        uniqueStores.add(product.store_slug)
      }
    })

    // Calculate shipping based on unique stores only
    const totalShipping = Array.from(uniqueStores).reduce((acc: number, store_slug: string) => {
      const storeShipping = Number(getStoreAmount(store_slug) || 0)
      return acc + storeShipping
    }, 0)

    return totalShipping || 0
  }
  const groupProductsByStore = (products: any[]) => {
    return products?.reduce((acc: any, product: any) => {
      const storeSlug = product.store_slug
      if (!acc[storeSlug]) {
        acc[storeSlug] = {
          store_name: product.store_name,
          store_slug: storeSlug,
          products: [],
          total_store_price: 0
        }
      }
      acc[storeSlug].products.push(product)
      acc[storeSlug].total_store_price += product.total_price
      return acc
    }, {})
  }
  return (
    <div className="flex h-fit w-full flex-col bg-[#F0F1F5] p-5 lg:w-[40%] lg:rounded-[11px]">
      <div className="space-y-[28px]">
        <div className="flex justify-between">
          <TextComponent as="span" className="text-[20px] font-semibold leading-[26px]">
            Your Order
          </TextComponent>
          {/* <FormatNumberCurrency value={data?.data?.total_price} /> */}
        </div>
        <div className="max-h-[500px] w-full space-y-4 overflow-y-auto">
          {allClipsIsSuccess &&
            Object.values(groupProductsByStore(clipProductInfo)).map((storeGroup: any, storeIndex: number) => (
              <div key={storeGroup.store_slug} className="mb-4">
                {/* Products from this store */}
                {storeGroup.products.map((product: any, productIndex: number) => (
                  <div
                    key={productIndex}
                    onClick={() => {
                      router.push(`/store/details/${product?.store_slug}?slug=${product.slug}`)
                    }}
                    className="flex cursor-pointer items-center space-x-4 px-[20px] pb-4 hover:opacity-90 lg:my-0 lg:px-0"
                  >
                    <div className="h-[40px] w-[40px] overflow-hidden rounded-[9px]">
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
                      <TextComponent as="h3" className="mb-2 text-[11px] font-semibold text-[#6B7280]">
                        {storeGroup.store_name} | {product.quantity} item{product.quantity > 1 &&'s'}
                      </TextComponent>
                    </div>
                    <TextComponent as="p" className="mt-1 font-semibold text-[#6B7280]">
                      <FormatNumberCurrency
                        value={Number(product?.display_price) > 0 ? product?.display_price : product?.price}
                      />
                    </TextComponent>
                  </div>
                ))}

                {/* Single shipping cost per store */}
                {isShowShipping && (
                  <div className="flex justify-between border-b border-dashed border-gray-300 px-3 pb-[15px] text-[14px] font-bold lg:px-0">
                    <TextComponent as="span" className="text-[13px]">
                      Shipping Cost
                    </TextComponent>
                    <FormatNumberCurrency value={Number(getStoreAmount(storeGroup.store_slug) as any)} />
                  </div>
                )}
              </div>
            ))}
        </div>
        <div className="flex justify-between">
          {/* <TextComponent as="span">Subtotal ({data?.data?.total_items} items)</TextComponent> */}
          {/* <FormatNumberCurrency value={data?.data?.total_price} /> */}
        </div>
      </div>

      <div className="my-5 flex justify-between rounded-[7px] bg-white px-3 py-[15px] font-bold">
        <TextComponent as="span" className="">
          Total
        </TextComponent>
        <FormatNumberCurrency value={(data?.data?.total_price || 0) + calculateTotalShipping()} />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <TextComponent as="span" className="text-sm">
          Your personal data will be used to process your order, support your experience throughout this website, and
          for other purposes described in our{' '}
          <Link href={'/privacy-policy'} className="text-sm underline">
            <span>privacy policy</span>
          </Link>
          {/* <TextComponent as="span" className="text-sm underline">
             privacy policy
          </TextComponent> */}
          .
        </TextComponent>
      </div>

      <CustomButton
        className="h-[50px] py-2"
        onClick={() => {
          handleSelectedAddress()
          //   router.push(`/clips/${data?.data?.cart_id}`)
          setShowLogistics(true)
        }}
      >
        <TextComponent as="span" className="text-white">
          {isLoadingResponse ? <Spinner className="border-white" /> : btnText}
        </TextComponent>
      </CustomButton>
    </div>
  )
}

export default YourOrderComponent
