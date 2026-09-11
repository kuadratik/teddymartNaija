import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Button, Rate, Table} from 'antd'
import React, {useState} from 'react'
import CustomerReview from './CustomerReview'
import ProductDetailsReview from './ProductDetailsReview'
import tw from 'tailwind-styled-components'
import {capitalizeOnlyFirstLetter, formatDateByShort, formatQuantity} from '@/utils/fx'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Image} from 'antd'
import PlannerModal from '@/components/SharedUI/ModalComponent'

interface DataType {
  key: string
  [key: string]: string | number
}

const ProductDetailsView = ({
  data,
  currVariant,
  setCurrVariant
}: {
  data: any
  currVariant: any
  setCurrVariant: any
}) => {
  console.log(data)
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const currVariantDetails = data?.variants[currVariant]

  const [showDeleteProduct, setShowDeleteProduct] = useState(false)

  const parsedData = {
    columns: [
      {title: 'Size 1', dataIndex: 'name', width: '30%', editable: true},
      {title: 'Size 2', dataIndex: 'age', editable: true},
      {title: '', dataIndex: 'operation'}
    ],
    data: [
      {key: '0', name: '1', age: '2'},
      {key: '1', name: '3', age: '4'},
      {key: '2', name: '5', age: '6'}
    ]
  }

  console.log(parsedData)

  const size_chart_html = JSON.parse(data?.attributes?.size_chart_html)

  return (
    <React.Fragment>
      {' '}
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="w-full">
            <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#000000]">
              {currVariant
                ? capitalizeOnlyFirstLetter(currVariantDetails?.name)
                : capitalizeOnlyFirstLetter(data?.name)}{' '}
            </TextComponent>
            {/* <div dangerouslySetInnerHTML={{__html: data?.attributes?.size_chart_html}} /> */}
            <div className="mt-2 flex items-center gap-3">
              {/* <TextComponent as="p" className="text-[14px] text-[#6B7280]">
              {data?.attributes?.brand}{' '}
            </TextComponent> */}
              <TextComponent as="p" className="text-[14px] text-[#6B7280]">
                Published:{' '}
                <span className="text-black">
                  {formatDateByShort(currVariant ? currVariantDetails?.created_at : data?.created_at)}
                </span>{' '}
              </TextComponent>
            </div>

            <Button
              onClick={() => {
                setShowDeleteProduct(true)
              }}
              style={{
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              className="!border-none p-0 hover:!text-[#6B7280] hover:underline"
            >
              Size Chart
            </Button>
            {/* <TextComponent as="p" className="mt-2 text-[14px] font-semibold text-[#000]">
            5/5 <Rate disabled className="ml-4 text-sm" value={5} />{' '}
          </TextComponent> */}
          </div>
          {/* <div>
          <Button className="bg-black !p-2" type="primary">
            <Icon icon="ri:pencil-fill" className="text-lg text-white" />
          </Button>
        </div> */}
        </div>
        <div className="mt-[20px] flex w-full gap-3">
          {' '}
          <Wrapper
            icon="price.svg"
            title={'Product Price'}
            amount={
              <FormatNumberCurrency
                value={currVariant ? +currVariantDetails?.price : +data?.price}
                currency={isActiveUser?.currency}
              />
            }
          />
          {/* <Wrapper title={'No of Orders:'} amount="2,234" /> */}
          <Wrapper
            icon="stock.svg"
            title={'Available Stocks'}
            amount={formatQuantity(currVariant ? currVariantDetails?.quantity : data?.quantity)}
          />
        </div>

        <div className="mt-[20px] flex flex-col justify-between gap-6 md:flex-row md:gap-0">
          <div>
            {' '}
            <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
              Available Sizes
            </TextComponent>
            {currVariant ? (
              currVariantDetails?.size && (
                <div className="mt-2 flex gap-3">
                  {JSON.parse(currVariantDetails?.size)?.length &&
                    JSON.parse(currVariantDetails?.size)?.map((val: any) => {
                      return <TagWrapper className="">{val?.size}</TagWrapper>
                    })}
                  {/* <TagWrapper className="">M</TagWrapper>
            <TagWrapper className="">L</TagWrapper>
            <TagWrapper className="">XL</TagWrapper> */}
                </div>
              )
            ) : data?.attributes?.size?.length ? (
              <div className="mt-2 flex gap-3">
                {JSON.parse(data?.attributes?.size)?.length &&
                  JSON.parse(data?.attributes?.size)?.map((val: any) => {
                    return <TagWrapper className="">{val?.size}</TagWrapper>
                  })}
                {/* <TagWrapper className="">M</TagWrapper>
            <TagWrapper className="">L</TagWrapper>
            <TagWrapper className="">XL</TagWrapper> */}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="mr-10 flex flex-col items-center justify-center">
            {' '}
            <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
              Color
            </TextComponent>
            {currVariant
              ? currVariantDetails?.color && (
                  <div className="mt-2 flex gap-3">
                    <ColorTagWrapper className="">{data?.attributes?.color}</ColorTagWrapper>
                    {/* <ColorTagWrapper className="">Blue</ColorTagWrapper> <ColorTagWrapper className="">Green</ColorTagWrapper>{' '}
            <ColorTagWrapper className="">Yellow</ColorTagWrapper> */}
                  </div>
                )
              : data?.attributes?.color && (
                  <div className="mt-2 flex gap-3">
                    <ColorTagWrapper className="">{data?.attributes?.color}</ColorTagWrapper>
                    {/* <ColorTagWrapper className="">Blue</ColorTagWrapper> <ColorTagWrapper className="">Green</ColorTagWrapper>{' '}
            <ColorTagWrapper className="">Yellow</ColorTagWrapper> */}
                  </div>
                )}
          </div>
        </div>

        <div className="mt-[24px]">
          <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
            Variant
          </TextComponent>

          <div className="mt-[10px] grid grid-cols-3 gap-3 md:flex md:gap-2">
            {data?.variants?.map((productIn: any, id: any) => {
              return (
                <div
                  key={id}
                  className="flex cursor-pointer gap-2"
                  onClick={() => {
                    setCurrVariant(id.toString())
                  }}
                >
                  <div
                    // @ts-ignore
                    className={`h-[86px] min-w-[94px] overflow-hidden rounded-[8px] ${currVariant == id ? 'border-[2px] border-black' : 'border-[1px] border-[#F2F2F2]'}`}
                  >
                    {/* <ImageComponent
                        src={`${process.env.imageBaseUrl}/${productIn}`}
                        alt="product-image"
                        className={`rounded-[4px] object-cover`}
                        width={94}
                        height={86}
                      /> */}
                    <Image
                      onError={error => {
                        error.currentTarget.src = '/assets/default_banner.jpg'
                      }}
                      src={`${process.env.imageBaseUrl}/${productIn?.images[0]}`}
                      alt={'img'}
                      width={94}
                      preview={false}
                      height={86}
                      className="h-full w-full rounded-[4px] object-cover"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-[24px]">
          {' '}
          <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
            Description
          </TextComponent>
          <TextComponent as="p" className="mt-3 text-[14px] leading-[20px] text-[#6B7280]">
            {data?.description}{' '}
          </TextComponent>
        </div>

        <div className="mt-[24px]">
          {' '}
          <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
            Additional Description
          </TextComponent>
          <TextComponent as="p" className="mt-3 text-[14px] leading-[20px] text-[#6B7280]">
            {data?.additional_information}{' '}
          </TextComponent>
        </div>

        <div className="mt-[24px]">
          {' '}
          <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
            Product Attributes
          </TextComponent>
          <div className="mt-2 flex flex-col gap-1">
            <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
              Product Model: <span className="text-[#6B7280]"> {data?.attributes?.product_model}</span>
            </TextComponent>
            <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
              Brand: <span className="text-[#6B7280]"> {data?.attributes?.brand}</span>
            </TextComponent>
            <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
              Material: <span className="text-[#6B7280]"> {data?.attributes?.material}</span>
            </TextComponent>

            <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
              Measurement:{' '}
              <span className="text-[#6B7280]">
                {' '}
                {currVariant ? currVariantDetails?.measurement : data?.attributes?.measurement}
              </span>
            </TextComponent>

            <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
              Tags:{' '}
              {data?.attributes?.tags && (
                <span className="text-[#6B7280]">
                  {JSON.parse(data?.attributes?.tags)?.length && JSON.parse(data?.attributes?.tags)?.join(', ')}
                </span>
              )}
            </TextComponent>
          </div>
        </div>

        <div className="mt-[24px]">
          {/* <CustomerReview /> */}

          {/* <ProductDetailsReview data={data?.ratings} /> */}
        </div>
      </div>
      {showDeleteProduct && (
        <PlannerModal
          modalOpen={showDeleteProduct}
          setModalOpen={setShowDeleteProduct}
          maskCloseable={true}
          onCloseModal={() => {
            setShowDeleteProduct(false)
          }}
        >
          <div className="flex w-full justify-between">
            <div className="flex-col!p-0 flex w-full">
              <TextComponent as="h1" className="text-[16px] font-semibold leading-[32px] text-[#000000]">
                Size Chart
              </TextComponent>
            </div>

            <span
              className="cursor-pointer"
              onClick={() => {
                setShowDeleteProduct(false)
              }}
            >
              <Icon icon={'mdi:close'} className="text-[24px]" />
            </span>
          </div>
          <TextComponent as="h1" className="text-[14px] font-normal leading-[32px] text-[#000000]">
            Size guide
          </TextComponent>
          <Table<DataType>
            bordered
            pagination={false}
            dataSource={size_chart_html.data}
            columns={size_chart_html.columns}
          />{' '}
        </PlannerModal>
      )}
    </React.Fragment>
  )
}
interface WrapperProps {
  title: string
  amount: React.ReactNode
  icon: string
}

const Wrapper: React.FC<WrapperProps> = ({title, amount, icon}: WrapperProps) => {
  return (
    <div className="w-full rounded-md border-2 border-dashed p-3">
      <div className="flex items-center gap-4">
        <Image src={`/assets/${icon}`} alt={'Price Icon'} width={20} height={20} />
        <div>
          <TextComponent as="p" className="text-[14px] text-[#6B7280]">
            {title}:
          </TextComponent>
          <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
            {amount}
          </TextComponent>
        </div>
      </div>
    </div>
  )
}

const TagWrapper = tw.div`rounded bg-[#CAE3FF] p-1 px-[10px] text-[#216FC7]`
const ColorTagWrapper = tw.div`rounded bg-[#EEEEEE] p-1 px-3 text-black`

export default ProductDetailsView
