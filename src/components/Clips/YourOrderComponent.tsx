import React, {useEffect, useState} from 'react'
import TextComponent from '../SharedUI/TextComponent'
import {Image} from 'antd'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useGetAllClipsQuery} from '@/services/clips'
import {sliceText} from '@/utils/fx'
import {PayPalButton} from 'react-paypal-button-v2'
import CustomButton from '../SharedUI/Buttons/Button'

type Props = {
  showLogistics: boolean
  setShowLogistics: React.Dispatch<React.SetStateAction<boolean>>
}

const YourOrderComponent = ({showLogistics, setShowLogistics}: Props) => {
  const {data, isLoading, isFetching, isSuccess: allClipsIsSuccess} = useGetAllClipsQuery({})
  const clipProductInfo = data?.data?.products

  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const addPaypalScript = () => {
    if ((window as any).paypal) {
      setScriptLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`

    script.type = 'text/javascript'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }

  useEffect(() => {
    addPaypalScript()
  }, [])
  return (
    <div className="flex h-fit w-full flex-col gap-[28px] bg-[#F1F1F1] p-5 lg:w-[40%] lg:rounded-[11px]">
      <div className="space-y-[28px]">
        <div className="flex justify-between">
          <TextComponent as="span" className="text-[20px] font-semibold leading-[26px]">
            Your Order
          </TextComponent>
          {/* <FormatNumberCurrency value={data?.data?.total_price} /> */}
        </div>
        <div className="w-full space-y-4">
          {allClipsIsSuccess &&
            clipProductInfo.map((product: any, id: any) => (
              <div key={id} className="flex items-center space-x-4 border-b px-[20px] pb-4 lg:my-0 lg:px-0">
                <div className="h-[40px] min-w-[40px] overflow-hidden rounded-[9px]">
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
                  <TextComponent as="p" className="text-sm text-gray-500">
                    {sliceText(product.description, 30)}
                  </TextComponent>
                </div>
                <TextComponent as="p" className="mt-1 font-bold">
                  <FormatNumberCurrency value={product?.total_price} />
                </TextComponent>
              </div>
            ))}
        </div>
        <div className="flex justify-between">
          {/* <TextComponent as="span">Subtotal ({data?.data?.total_items} items)</TextComponent> */}
          {/* <FormatNumberCurrency value={data?.data?.total_price} /> */}
        </div>
      </div>
      {/* <div className="flex justify-between">
<span>Tax</span>
<span>${tax.toFixed(2)}</span>
</div> */}
      <div className="flex justify-between rounded-[7px] bg-white px-3 py-[15px] font-bold">
        <TextComponent as="span" className="">
          Sub total
        </TextComponent>
        <FormatNumberCurrency value={data?.data?.total_price} />
      </div>

      <div>
        <TextComponent as="span" className="text-sm">
          Your personal data will be used to process your order, support your experience throughout this website, and
          for other purposes described in our{' '}
          <TextComponent as="span" className="text-sm underline">
             privacy policy
          </TextComponent>
          .
        </TextComponent>
      </div>

      {scriptLoaded && showLogistics ? (
        <PayPalButton
          amount={data?.data?.total_price}
          // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
          onSuccess={(details: any, data: any) => {
            console.log('order id', data.orderID)
            alert('Transaction completed by ' + details.payer.name.given_name)

            // OPTIONAL: Call your server to save the transaction
            return fetch('/paypal-transaction-complete', {
              method: 'post',
              body: JSON.stringify({
                orderID: data.orderID
              })
            })
          }}
        />
      ) : (
        <CustomButton
          className="h-[50px] py-2"
          onClick={() => {
            //   router.push(`/clips/${data?.data?.cart_id}`)
            setShowLogistics(true)
          }}
        >
          <TextComponent as="span" className="text-white">
            Checkout
          </TextComponent>
        </CustomButton>
      )}

      {/* <button onClick={() => {}}>
      <TextComponent
        as="span"
        className="text-center text-[13px] font-semibold leading-[16px] text-[#6B7280]"
      >
        Select Logistics
      </TextComponent>
    </button> */}
    </div>
  )
}

export default YourOrderComponent
