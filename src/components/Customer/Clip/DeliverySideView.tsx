import React, {useState} from 'react'
import {AmountWrapper, ClipSideView, TextWrapper, Wrapper} from './ClipSideView'
import TextComponent from '@/components/SharedUI/TextComponent'
import Link from 'next/link'
import {Button, Image} from 'antd'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useAppSelector} from '@/hooks/reduxHooks'

const DeliverySideView = (props: ClipSideView) => {
  const data = props?.data

  const [couponCode, setCouponCode] = useState('')

  const {selectedLanguage} = useAppSelector(state => state.country)

  return (
    <div>
      <div className="flex flex-col gap-5">
        <TextComponent as="p" className="text-[20px] font-semibold leading-[15.23px] text-[#000]">
          Your Order
        </TextComponent>

        <div className="mt-[28px] flex flex-col gap-3">
          {data?.products?.map((product: any, id: any) => {
            return (
              <div className="flex items-center justify-between">
                {' '}
                <div className="flex gap-3">
                  <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                    <Image
                      src={`${process.env.imageBaseUrl}/${product?.images[0]}`}
                      alt="product image"
                      preview={false}
                      height={48}
                      width={48}
                      // onLoadStart={() => {
                      //   setIsLoadingImage(true)
                      // }}
                      // onLoad={() => {
                      //   setIsLoadingImage(false)
                      // }}
                      onError={error => {
                        error.currentTarget.src = '/assets/default_banner.jpg'
                      }}
                      className={``}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <TextComponent as="p" className="w-[150px] font-normal !text-[#000]">
                      {product?.name}
                    </TextComponent>
                    {/* <TextComponent as="p" className="text-[13px] !text-[#6b7280]">
                {record?.description}
              </TextComponent> */}
                    <Link className="text-[13px] font-medium !text-[#6b7280] hover:underline" href={`/`}>
                      {product?.store_name}
                    </Link>
                  </div>
                </div>
                <TextComponent as="p">
                  <FormatNumberCurrency value={+product?.price} currency={product?.currency_code} />
                </TextComponent>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <TextInput
            errorMessage={''}
            placeholder="Discount code"
            title=""
            value={couponCode}
            onChange={e => {
              setCouponCode(e.target.value)
            }}
            labelClassName="!text-black"
            name={'coupon_code'}
            type={'text'}
            className={`border-[1px] bg-[#F5F5F5]`}
          />

          <Button
            style={{
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
            htmlType="button"
            className="whitespace-nowrap rounded-lg !bg-[#000] px-6 py-[22px] text-white"
          >
            Apply
          </Button>
        </div>

        <Wrapper className="mt-3">
          <TextWrapper as="p">Shipping Cost</TextWrapper>
          <AmountWrapper as="p">
            <FormatNumberCurrency value={0} currency={selectedLanguage.value} />
          </AmountWrapper>
        </Wrapper>

        <Wrapper className="mt-3 rounded-lg bg-white px-3 py-5">
          <TextWrapper as="p">Subtotal</TextWrapper>
          <AmountWrapper as="p">
            <FormatNumberCurrency value={+data?.total_price} currency={selectedLanguage.value} />
          </AmountWrapper>
        </Wrapper>

        <TextComponent as="p" className="text-[13px] font-normal leading-[19px] !text-[#6b7280]">
          Your personal data will be used to process your order, support your experience throughout this website, and
          for other purposes described in our {' '}
          <Link className="underline" href={`/privacy-policy`}>
            privacy policy.
          </Link>{' '}
        </TextComponent>
        <Button
          //   onClick={() => {
          //     router.push(`/clip/${data?.cart_id}`)
          //   }}
          style={{
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            // Force the styles to remain the same on hover
            transition: 'none' // Disable any transitions
          }}
          htmlType="button"
          className="whitespace-nowrap rounded-lg !p-[26px]"
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}

export default DeliverySideView
