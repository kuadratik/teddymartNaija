import React from 'react'
import {StyledContentWrapper} from '../../Order/OrderLogisticsView'
import {Collapse} from 'antd'
import TextComponent from '@/components/SharedUI/TextComponent'
import tw from 'tailwind-styled-components'

const {Panel} = Collapse

interface SingleProductProps {
  id: number
  active: any
  setActive: React.Dispatch<React.SetStateAction<any>>
}

const SingleProduct = ({id, setActive, active}: SingleProductProps) => {
  console.log(active, id)
  return (
    <div>
      <StyledContentWrapper className="">
        <Collapse
          key={id}
          accordion
          activeKey={active === id ? 1 : 0}
          onChange={e => {
            console.log(e)
            if (!e.length) {
            }
            setActive((prevActive: number) => (prevActive === id ? null : id))
          }}
          expandIconPosition="right"
          className="custom-collapse space-y-2 !border-none bg-transparent"
        >
          <Panel
            header={<p className="!border-none text-[14px] font-bold text-[#6B7280]">Product {id + 1}</p>}
            key="1"
            className=""
          >
            <div className="flex flex-col gap-3">
              <div className="h-[135px] w-full overflow-hidden rounded-[9px] bg-[#D9D9D9]" />
              <div className="flex justify-between">
                <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
                  {'Product Name'}
                </TextComponent>

                <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
                  {'$50'}
                </TextComponent>
              </div>

              <div className="mt-2 flex gap-3">
                <SizeWrapper>S</SizeWrapper>
                <SizeWrapper>M</SizeWrapper> <SizeWrapper>L</SizeWrapper> <SizeWrapper>XL</SizeWrapper>
              </div>

              <div className="mt-2 flex gap-3">
                <div className="rounded !bg-[#FF2D55] !p-[15px]" />
                <div className="rounded !bg-[#007AFF] !p-[15px]" />
                <div className="rounded !bg-[#34C759] !p-[15px]" />
                <div className="rounded !bg-[#FFCC00] !p-[15px]" />
              </div>
            </div>
          </Panel>
        </Collapse>
      </StyledContentWrapper>
    </div>
  )
}

const SizeWrapper = tw.p`rounded bg-[#CAE3FF] p-1 px-[9px] text-[#216FC7]`

export default SingleProduct
