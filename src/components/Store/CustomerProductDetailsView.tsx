import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter, formatDateByShort, formatQuantity} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Button, Image, Table} from 'antd'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import tw from 'tailwind-styled-components'
import PlannerModal from '../SharedUI/ModalComponent'

interface DataType {
  key: string
  [key: string]: string | number
}

const CustomerProductDetailsView = ({
  data,
  currVariant,
  setCurrVariant,
  customer = true
}: {
  data: any
  currVariant: any
  setCurrVariant: any
  customer?: boolean
}) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const {type} = useAppSelector(state => state.vendor)
  const router = useRouter()

  console.log(data)

  const [variantId, setvariantId] = useState()

  const currVariantDetails = data?.variants[currVariant]
  const size_chart_html = data?.attributes?.size_chart_html ? JSON.parse(data?.attributes?.size_chart_html) : null

  // Remove columns with an empty title
  const removedTitleSizeChart = size_chart_html?.columns.filter(
    (column: {dataIndex: string}) => column.dataIndex !== 'operation'
  )

  const [showDeleteProduct, setShowDeleteProduct] = useState(false)

  // console.log(JSON.parse(currVariantDetails?.size)?.length)

  return (
    <React.Fragment>
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="w-full">
            <div className="flex h-[28px] w-[327px] items-center justify-between gap-[10px]">
              <TextComponent as="p" className="text-[16px] font-semibold leading-[15.23px] text-[#000000]">
                {currVariant !== null
                  ? capitalizeOnlyFirstLetter(currVariantDetails?.name)
                  : capitalizeOnlyFirstLetter(data?.name)}
              </TextComponent>

              {currVariant !== null && customer === false && currVariantDetails?.discount > 0 ? (
                <div className="flex h-[28px] w-[72px] items-center justify-center rounded-[43px] bg-[#FF2D55]">
                  <TextComponent as="span" className="text-[11px] leading-[14px] text-white">
                    -{parseFloat(currVariantDetails?.discount)}%
                  </TextComponent>
                </div>
              ) : (
                <></>
              )}
              {currVariant == null && customer === false && data?.discount?.length > 0 ? (
                <div className="flex h-[28px] w-[72px] items-center justify-center rounded-[43px] bg-[#FF2D55]">
                  <TextComponent as="span" className="text-[11px] leading-[14px] text-white">
                    -{parseFloat(data?.discount)}%
                  </TextComponent>
                </div>
              ) : (
                <></>
              )}

              {/* {data?.discount?.length > 0 && (
                <div className="flex h-[28px] w-[72px] items-center justify-center rounded-[43px] bg-[#FF2D55]">
                  <TextComponent as="span" className="text-[11px] leading-[14px] text-white">
                    -{parseFloat(data?.discount)}%
                  </TextComponent>
                </div>
              )} */}
            </div>
            <div className="mt-2 flex items-center gap-3">
              {customer ? (
                <TextComponent as="p" className="text-[14px] text-[#6B7280]">
                  Visit{' '}
                  <span
                    className="cursor-pointer text-black underline"
                    onClick={() => {
                      router.push(`/store/${data?.store.slug}?type=${type}`)
                    }}
                  >
                    {data?.store?.name}
                  </span>{' '}
                  store
                </TextComponent>
              ) : (
                <TextComponent as="p" className="text-[14px] text-[#6B7280]">
                  Published:{' '}
                  <span className="text-black">
                    {formatDateByShort(currVariant !== null ? currVariantDetails?.created_at : data?.created_at)}
                  </span>
                </TextComponent>
              )}
            </div>
            {removedTitleSizeChart ? (
              <Button
                onClick={() => {
                  setShowDeleteProduct(true)
                }}
                style={{
                  border: 'none',
                  transition: 'none' // Disable any transitions
                }}
                className="!border-none p-0 hover:!text-[#6B7280] hover:underline"
              >
                Size Chart
              </Button>
            ) : data?.attributes?.size_chart_image?.split('images/')[1] ? (
              <Button
                onClick={() => {
                  setShowDeleteProduct(true)
                }}
                style={{
                  border: 'none',
                  transition: 'none' // Disable any transitions
                }}
                className="!border-none p-0 hover:!text-[#6B7280] hover:underline"
              >
                Size Chart
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>

        {!customer && (
          <div className="mt-[20px] flex w-full gap-3">
            <Wrapper
              icon="price.svg"
              title={'Product Price'}
              amount={
                <FormatNumberCurrency
                  value={currVariant !== null ? +currVariantDetails?.display_price : +data?.display_price}
                  currency={isActiveUser?.currency}
                />
              }
            />
            <Wrapper
              icon="stock.svg"
              title={'Available Stocks'}
              amount={formatQuantity(currVariant !== null ? currVariantDetails?.quantity : data?.quantity)}
            />
          </div>
        )}

        <div className="mt-[20px] flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {currVariantDetails?.size?.length > 0 ||
          (data?.attributes?.size && JSON.parse(data?.attributes?.size)?.length) ? (
            <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-0">
              <div>
                <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
                  Available Sizes
                </TextComponent>

                {currVariant !== null && currVariantDetails?.size?.length ? (
                  <div className="mt-2 flex gap-3">
                    <TagWrapper>{currVariantDetails?.size}</TagWrapper>
                  </div>
                ) : (
                  <></>
                )}

                {currVariant == null && JSON.parse(data?.attributes?.size)?.length ? (
                  <div className="mt-2 flex gap-3">
                    {JSON.parse(data?.attributes?.size)?.map((val: any) => <TagWrapper key={val}>{val}</TagWrapper>)}
                  </div>
                ) : (
                  <></>
                )}

                {/* {currVariant !== null && JSON.parse(currVariantDetails?.size)?.length ? (
                  <div className="mt-2 flex gap-3">
                    <TagWrapper>{currVariantDetails?.size}</TagWrapper>
                  </div>
                ) : (
                  data?.attributes?.size && (
                    <div className="mt-2 flex gap-3">
                      {JSON.parse(data?.attributes?.size)?.map((val: any) => <TagWrapper key={val}>{val}</TagWrapper>)}
                    </div>
                  )
                )} */}
                {/* {currVariant !== null
                  ? currVariantDetails?.size?.length > 0 && (
                      <div className="mt-2 flex gap-3">
                        <TagWrapper>{currVariantDetails?.size}</TagWrapper>
                      </div>
                    )
                  : data?.attributes?.size && (
                      <div className="mt-2 flex gap-3">
                        {JSON.parse(data?.attributes?.size)?.map((val: any) => (
                          <TagWrapper key={val}>{val}</TagWrapper>
                        ))}
                      </div>
                    )} */}
              </div>
            </div>
          ) : (
            ''
          )}

          {(currVariantDetails?.color?.length || data?.attributes?.color?.length) && (
            <div className="flex flex-col md:items-center md:justify-center">
              <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
                Color
              </TextComponent>

              {currVariant !== null && currVariantDetails?.color ? (
                <div className="mt-2 flex gap-3">
                  <ColorTagWrapper>{currVariantDetails?.color}</ColorTagWrapper>
                </div>
              ) : (
                <></>
              )}
              {currVariant == null && data?.attributes?.color ? (
                <div className="mt-2 flex gap-3">
                  <ColorTagWrapper>{data?.attributes?.color}</ColorTagWrapper>
                </div>
              ) : (
                <></>
              )}

              {/* {currVariant !== null
                ? currVariantDetails?.color && (
                    <div className="mt-2 flex gap-3">
                      <ColorTagWrapper>{currVariantDetails?.color}</ColorTagWrapper>
                    </div>
                  )
                : data?.attributes?.color && (
                    <div className="mt-2 flex gap-3">
                      <ColorTagWrapper>{data?.attributes?.color}</ColorTagWrapper>
                    </div>
                  )} */}
            </div>
          )}
        </div>

        {data?.variants?.length > 0 && (
          <div className="mt-[24px]">
            {/* <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
              Variant
            </TextComponent> */}
            <div className="mt-[10px] grid grid-cols-3 gap-3 md:flex md:gap-2">
              {[data, ...data?.variants]?.map((productIn: any, id: any) => (
                <div
                  key={id}
                  className="flex cursor-pointer gap-2"
                  onClick={() => {
                    if (id == 0) {
                      setCurrVariant(null)
                      setvariantId(productIn?.id)
                    } else {
                      setCurrVariant(id.toString() - 1)
                      setvariantId(productIn?.id)
                    }
                  }}
                >
                  <div
                    className={`h-[86px] min-w-[94px] overflow-hidden rounded-[8px] ${
                      variantId == productIn?.id ? 'border-[2px] border-black' : 'border-[1px] border-[#F2F2F2]'
                    }`}
                  >
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
              ))}
            </div>
          </div>
        )}

        {data?.description?.length > 0 && (
          <div className="mt-[24px]">
            <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
              Description
            </TextComponent>
            <TextComponent as="p" className="mt-3 text-[14px] leading-[20px] text-[#6B7280]">
              {data?.description}
            </TextComponent>
          </div>
        )}

        {data?.additional_information?.length > 0 && (
          <div className="mt-[24px]">
            <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
              Additional Description
            </TextComponent>
            <TextComponent as="p" className="mt-3 text-[14px] leading-[20px] text-[#6B7280]">
              {data?.additional_information}
            </TextComponent>
          </div>
        )}

        {data?.attributes &&
          (data?.attributes?.product_model?.length > 0 ||
            data?.attributes?.brand?.length > 0 ||
            data?.attributes?.material?.length > 0 ||
            (data?.attributes?.measurement?.length > 0 && JSON.parse(data?.attributes?.measurement)?.[0]?.value) ||
            JSON.parse(data?.attributes?.tags)?.length > 0) && (
            <div className="mt-[24px]">
              <TextComponent as="p" className="text-[16px] font-semibold text-[#000000]">
                Product Attributes
              </TextComponent>
              <div className="mt-2 flex flex-col gap-1">
                {data?.attributes?.product_model?.length > 0 && (
                  <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
                    Product Model: <span className="text-[#6B7280]">{data?.attributes?.product_model}</span>
                  </TextComponent>
                )}
                {data?.attributes?.brand?.length > 0 && (
                  <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
                    Brand: <span className="text-[#6B7280]">{data?.attributes?.brand}</span>
                  </TextComponent>
                )}
                {data?.attributes?.material?.length > 0 && (
                  <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
                    Material: <span className="text-[#6B7280]">{data?.attributes?.material}</span>
                  </TextComponent>
                )}

                {currVariant == null &&
                  data?.attributes?.measurement?.length > 0 &&
                  JSON.parse(data?.attributes?.measurement)?.[0]?.value && (
                    <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
                      Measurement:{' '}
                      <span className="text-[#6B7280]">
                        {JSON.parse(data?.attributes?.measurement)?.[0]?.value}{' '}
                        {JSON.parse(data?.attributes?.measurement)?.[0]?.unit}
                      </span>
                    </TextComponent>
                  )}

                {currVariant !== null &&
                  currVariantDetails?.measurement?.length > 0 &&
                  JSON.parse(currVariantDetails?.measurement)?.[0]?.value && (
                    <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
                      Measurement:{' '}
                      <span className="text-[#6B7280]">
                        {JSON.parse(currVariantDetails?.measurement)?.[0]?.value}{' '}
                        {JSON.parse(currVariantDetails?.measurement)?.[0]?.unit}
                      </span>
                    </TextComponent>
                  )}
                {JSON.parse(data?.attributes?.tags)?.length > 0 && (
                  <TextComponent as="p" className="text-[14px] font-semibold text-[#000000]">
                    Tags:{' '}
                    {JSON.parse(data?.attributes?.tags)?.map((val: any, index: number) => (
                      <span key={index} className="text-[#6B7280]">
                        {val}
                        {JSON.parse(data?.attributes?.tags).length - 1 === index ? '' : ', '}
                      </span>
                    ))}
                  </TextComponent>
                )}
              </div>
            </div>
          )}
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
                {data?.sku ?? 'Size Chart'}
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
            dataSource={size_chart_html?.data}
            columns={removedTitleSizeChart}
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

export default CustomerProductDetailsView
