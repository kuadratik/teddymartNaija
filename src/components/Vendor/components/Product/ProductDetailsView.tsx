import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Button, Rate} from 'antd'
import React from 'react'
import ProductDetailsReview from './ProductDetailsReview'
import CustomerReview from './CustomerReview'

const ProductDetailsView = () => {
  return (
    <div className="w-full">
      <div className="flex w-full justify-between">
        <div className="w-full">
          <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#000000]">
            Full Sleeve Sweatshirt for Men{' '}
          </TextComponent>
          <div className="mt-2 flex items-center gap-3">
            <TextComponent as="p" className="text-[14px] text-[#6B7280]">
              Tommy Hilfiger{' '}
            </TextComponent>
            <TextComponent as="p" className="text-[14px] text-[#6B7280]">
              Published: <span className="text-black">26 Mar, 2024</span>{' '}
            </TextComponent>
          </div>
          <TextComponent as="p" className="mt-2 text-[14px] font-semibold text-[#000]">
            5/5 <Rate disabled className="ml-4 text-sm" value={5} />{' '}
          </TextComponent>
        </div>
        <div>
          <Button className="bg-black !p-2" type="primary">
            <Icon icon="ri:pencil-fill" className="text-lg text-white" />
          </Button>
        </div>
      </div>
      <div className="mt-[20px] flex w-full gap-3">
        {' '}
        <Wrapper title={'Price'} amount="$120.40" />
        <Wrapper title={'No of Orders:'} amount="2,234" />
        <Wrapper title={'Available Stocks'} amount="1230" />
      </div>

      <div className="mt-[20px] flex flex-col justify-between gap-6 md:flex-row md:gap-0">
        <div>
          {' '}
          <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
            Available Sizes
          </TextComponent>
          <div className="mt-2 flex gap-3">
            <div className="rounded bg-[#CAE3FF] p-1 px-[10px] text-[#216FC7]">S</div>
            <div className="rounded bg-[#CAE3FF] p-1 px-[10px] text-[#216FC7]">M</div>{' '}
            <div className="rounded bg-[#CAE3FF] p-1 px-[10px] text-[#216FC7]">L</div>{' '}
            <div className="rounded bg-[#CAE3FF] p-1 px-[10px] text-[#216FC7]">XL</div>
          </div>
        </div>

        <div>
          {' '}
          <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
            Available Colors
          </TextComponent>
          <div className="mt-2 flex gap-3">
            <div className="rounded bg-[#EEEEEE] p-1 px-3 text-black">Red</div>
            <div className="rounded bg-[#EEEEEE] p-1 px-3 text-black">Blue</div>{' '}
            <div className="rounded bg-[#EEEEEE] p-1 px-3 text-black">Green</div>{' '}
            <div className="rounded bg-[#EEEEEE] p-1 px-3 text-black">Yellow</div>
          </div>
        </div>
      </div>

      <div className="mt-[24px]">
        {' '}
        <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
          Description
        </TextComponent>
        <TextComponent as="p" className="mt-3 text-[14px] leading-[20px] text-[#6B7280]">
          Lorem ipsum dolor sit amet consectetur. Tristique mollis neque aliquet viverra amet vel. Ut orci accumsan
          vivamus phasellus velit risus ut quam amet. Nam nisl vitae sed viverra. Enim praesent ut est eu. Tellus nunc
          volutpat ut risus tellus leo lobortis pulvinar libero. Mauris laoreet eu ut arcu duis sapien amet adipiscing.
          Amet tincidunt orci nunc ultrices. Elit tincidunt feugiat porta gravida pretium. Tincidunt adipiscing ac quam
          enim justo. Integer tortor vel sed aliquam interdum pulvinar mattis. Nascetur nisl vestibulum aliquet in
          commodo. Porta volutpat massa eu libero lobortis. Pellentesque ipsum ut tincidunt hendrerit at leo aliquam.{' '}
        </TextComponent>
      </div>

      <div className="mt-[24px]">
        <ProductDetailsReview />

        <CustomerReview />
      </div>
    </div>
  )
}
interface WrapperProps {
  title: string
  amount: string
}

const Wrapper: React.FC<WrapperProps> = ({title, amount}: WrapperProps) => {
  return (
    <div className="w-full rounded-md border-2 border-dashed p-3">
      <TextComponent as="p" className="text-[14px] text-[#6B7280]">
        {title}:
      </TextComponent>
      <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
        {amount}
      </TextComponent>
    </div>
  )
}

export default ProductDetailsView
