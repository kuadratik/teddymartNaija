import useWishlist from '@/components/Customer/hooks/useWishlist'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import dayjs from 'dayjs'
import {useState} from 'react'
import Spinner from '../SharedUI/Spinner'
import useAddToClipsQuery from './hooks/useAddToClips'
// import SuccessImage from '../../../../../../public/assets/successImg.svg'
import Image from 'next/image'
import SuccessImage from '../../../public/assets/successImg.svg'
import TextComponent from '../SharedUI/TextComponent'

type ProductClipBoxType = {
  data: any
}

const ProductClipBox = ({data}: ProductClipBoxType) => {
  const {handleAddToWishList, addToWishListLoading} = useWishlist()
  const {isLoading, handleAddToClip} = useAddToClipsQuery()

  const [quantityValue, setQuantityValue] = useState(1)
  function getShippingMethodTypes(shippingMethods: any[]) {
    // Extract all method types and create a unique set
    const methodTypes = Array.from(shippingMethods.reduce((set, method) => set.add(method.method_type), new Set()))
    return methodTypes
  }

  const shippingMethods: string[] = getShippingMethodTypes(data?.store?.shipping_methods) as string[]
  return (
    <div className="mx-auto h-fit w-[332px] rounded-lg border p-4 shadow-md">
      {/* Discount valid date range */}
      {data?.discount_end_date?.length || data?.discount_start_date?.length ? (
        <div className="flex justify-between text-[11px] leading-[14px] text-gray-500">
          <span>Discount valid from</span>
          <span className="font-semibold text-green-600">
            {dayjs(data?.discount_start_date).format('DD/MM/YYYY')} -{' '}
            {dayjs(data?.discount_end_date).format('DD/MM/YYYY')}
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
            {data?.discount?.length > 0 && (
              <span className="block text-gray-400 line-through">
                {' '}
                <FormatNumberCurrency
                  value={+parseFloat(data?.price) + parseFloat(data?.price) * 0.15}
                  currency={data?.currency}
                />
              </span>
            )}
            <span className="text-xl font-bold text-red-600">
              <FormatNumberCurrency
                value={+data?.display_price > 0 ? data?.display_price : data?.price}
                currency={data?.currency}
              />
            </span>
          </div>
        </div>
        {data?.quantity <= 10 && (
          <div className="mt-2 text-right text-sm font-medium text-red-500">
            Only {data?.quantity} left in stock – order soon
          </div>
        )}
      </div>

      {/* Quantity selector */}
      <div className="mt-4 hidden w-full items-center justify-between gap-4 border border-[#EAECEF] p-2">
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
            if (quantityValue < data?.quantity) {
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
          disabled={data?.quantity === 0}
          className={`w-full rounded-lg bg-black py-2 font-medium text-white ${
            data?.quantity === 0 ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => {
            handleAddToClip(data?.slug)
          }}
        >
          {isLoading ? <Spinner /> : 'Clip Item'}
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2"
          onClick={() => {
            handleAddToWishList(data?.slug)
          }}
        >
          {addToWishListLoading ? <Spinner /> : <span className="text-xl">&#9825;</span>}
          {/* Heart icon */}
          <span>Save</span>
        </button>
      </div>

      {/* Delivery options */}
      {shippingMethods?.length > 0 && (
        <div className="mt-6">
          <span className="block text-sm font-medium text-gray-500">Delivery options available</span>
          <div className="mt-2 space-y-2">
            {shippingMethods?.map((method: string, index: number) => (
              <div key={index} className="flex items-center rounded-lg border border-gray-100 p-2 capitalize">
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
    </div>
  )
}

export default ProductClipBox
