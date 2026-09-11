import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Button, Checkbox} from 'antd'
import Link from 'next/link'
import React, {useState} from 'react'
import tw from 'tailwind-styled-components'
import type {CheckboxProps} from 'antd'
import {useRouter} from 'next/router'

export interface ClipSideView {
  data: {
    cart_id?: string
    total_items: string
    total_price: string
    total_quantity?: string
    products?: any
  }
}

const ClipSideView = (props: ClipSideView) => {
  const data = props?.data
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [checked, setChecked] = useState(false)

  const onChange: CheckboxProps['onChange'] = e => {
    console.log('checked = ', e.target.checked)
    setChecked(e.target.checked)
  }

  const router = useRouter()

  // console.log(data)

  return (
    <div>
      <div className="flex flex-col gap-5">
        <Wrapper className="">
          <TextWrapper as="p">Estimate Shipping</TextWrapper>
          <AmountWrapper as="p">
            <FormatNumberCurrency value={0} currency={selectedLanguage.value} />
          </AmountWrapper>
        </Wrapper>
        <Wrapper className="">
          <TextWrapper as="p">
            Subtotal ({data?.total_items} {+data?.total_items > 1 ? 'items' : 'item'})
          </TextWrapper>
          <AmountWrapper as="p">
            <FormatNumberCurrency value={0} currency={selectedLanguage.value} />
          </AmountWrapper>
        </Wrapper>
        <Wrapper className="mt-[30px] rounded-lg bg-white px-3 py-5">
          <TextWrapper as="p">Estimated total</TextWrapper>
          <AmountWrapper as="p">
            <FormatNumberCurrency value={+data?.total_price} currency={selectedLanguage.value} />
          </AmountWrapper>
        </Wrapper>
        <div>
          <Checkbox checked={checked} onChange={onChange}>
            {' '}
            <TextWrapper as="p" className="!text-[13px]">
              <span className="text-[#6B7280]">I agree with the </span>{' '}
              <Link href="/" legacyBehavior>
                <a className="hover:text-black hover:underline">Terms and Conditions </a>
              </Link>
            </TextWrapper>
          </Checkbox>
        </div>
        <Button
          disabled={!checked}
          onClick={() => {
            router.push(`/clip/${data?.cart_id}`)
          }}
          style={{
            backgroundColor: checked ? '#000' : 'gray',
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
export const Wrapper = tw.div`flex justify-between`

export const TextWrapper = tw(TextComponent)`font-medium  leading-[12px] text-[#1D1D1D]`

export const AmountWrapper = tw(TextComponent)`font-semibold leading-[12px] text-[#1D1D1D]`

export default ClipSideView
