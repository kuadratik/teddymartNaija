import React from 'react'
import {Collapse, Image} from 'antd'
import TextComponent from '@/components/SharedUI/TextComponent'
import tw from 'tailwind-styled-components'
import {StyledContentWrapper} from '@/pages/ads-gallery/[id]'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'

const {Panel} = Collapse

interface SingleProductProps {
  id: number
  active: any
  setActive: React.Dispatch<React.SetStateAction<any>>
  value: any
}

const SingleProduct = ({id, setActive, active, value}: SingleProductProps) => {
  const router = useRouter()
  console.log('value', value)
  return (
    <div>
      <StyledContentWrapper className="">
        <Collapse
          defaultActiveKey={[`1`]}
          accordion
          expandIconPosition="right"
          collapsible="icon"
          className="custom-collapse !border-none bg-transparent"
        >
          <Panel
            header={
              <TextComponent as="p" className="!border-none text-[16px] font-semibold leading-[20px] text-[#393939]">
                {value?.name || ''}
              </TextComponent>
            }
            key={`${id + 1}`}
            className=""
          >
            <div className="flex flex-col gap-3">
              <div className="h-[235px] w-full overflow-hidden rounded-[9px] bg-[#D9D9D9]">
                <Image
                  src={value?.images.length ? `${process.env.imageBaseUrl}/${value?.images[0]}` : ''}
                  alt=""
                  className={`rounded-[8px] object-cover`}
                  width={346}
                  height={235}
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                  }}
                  preview={false}
                />
              </div>
              <div className="flex justify-between">
                {/* <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
                  {'Product Name'}
                </TextComponent> */}

                <TextComponent as="p" className="text-[14px] font-medium text-[#393939]">
                  <FormatNumberCurrency value={+value?.price} currency={value?.currency} />
                </TextComponent>

                <button
                  className="flex h-[21px] w-[21px] items-center justify-center rounded-[4px] bg-[#6B7280] hover:bg-[#6B7280]"
                  onClick={() => {
                    router.push(`/vendor/products/edit/${value?.slug}`).then(() => {
                      localStorage.removeItem('product_arr')
                    })
                  }}
                >
                  <Icon icon="tabler:edit" className="text-[#fff]" />
                </button>
              </div>

              {/* <div className="mt-2 flex gap-3">
                <SizeWrapper>S</SizeWrapper>
                <SizeWrapper>M</SizeWrapper> <SizeWrapper>L</SizeWrapper> <SizeWrapper>XL</SizeWrapper>
              </div>

              <div className="mt-2 flex gap-3">
                <div className="rounded !bg-[#FF2D55] !p-[15px]" />
                <div className="rounded !bg-[#007AFF] !p-[15px]" />
                <div className="rounded !bg-[#34C759] !p-[15px]" />
                <div className="rounded !bg-[#FFCC00] !p-[15px]" />
              </div> */}
            </div>
          </Panel>
        </Collapse>
      </StyledContentWrapper>
    </div>
  )
}

const SizeWrapper = tw.p`rounded bg-[#CAE3FF] p-1 px-[9px] text-[#216FC7]`

export default SingleProduct
