import TextComponent from '@/components/SharedUI/TextComponent'
import {Image} from 'antd'
import React, {useState} from 'react'

import Badge from '@/components/SharedUI/Badge'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {formatQuantity, formattedDateString} from '@/utils/fx'
import {Layout, Space, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'
import Link from 'next/link'
import {useRouter} from 'next/router'
// NextImage
import NextImage from 'next/image'

export interface TopSellingprops {
  data?: any
}

const {Content} = Layout

const TopSelling = ({data}: TopSellingprops) => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const [showShipping, setShowShipping] = useState(false)
  const router = useRouter()
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product_id',
        title: 'Product Name',
        dataIndex: 'product_id',
        render: (text, record) => (
          <div className="flex gap-1">
            <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
              <Image
                onError={error => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                }}
                src={`${process.env.imageBaseUrl}/${record?.images[0]}`}
                alt={'img'}
                width={48}
                preview={false}
                height={48}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col">
              <TextComponent as="p" className="font-normal !text-[#6b7280]">
                {record?.name}
              </TextComponent>
              <TextComponent as="p" className="!text-[#6b7280]">
                {formattedDateString(record?.created_at)}
              </TextComponent>
            </div>
          </div>
        )
      },
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        render: (text, record) => (
          <FormatNumberCurrency
            value={+record?.display_price ? +record?.display_price : +record?.price}
            currency={isActiveUser?.currency}
          />
        )
      },
      {
        key: 'available',
        title: (
          <span style={{textAlign: 'center'}} className="">
            Available Quantity
          </span>
        ),

        dataIndex: 'available',
        render: (text, record) => (
          <>
            {record?.quantity == 0 ? (
              <Badge className="" status={'Outofstock'} />
            ) : (
              <TextComponent as="p" className="font-normal !text-[#6b7280] md:ml-8">
                {formatQuantity(record?.quantity)}
              </TextComponent>
            )}
          </>
        )
      },

      // {
      //   key: 'rating',
      //   title: (
      //     <span style={{textAlign: 'center'}} className="ml-6">
      //       Ratings
      //     </span>
      //   ),
      //   dataIndex: 'rating',
      //   render: (text, record) => <Rate disabled className="text-base" value={text} />
      // },

      {
        title: 'Action',
        key: 'action',
        align: 'center',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (record: any) => (
          <Space size="middle">
            <Link className="!text-[#000000E0] hover:underline" href={`/vendor/products/${record?.slug}`}>
              View
            </Link>
          </Space>
        )
      }
    ]
  }, [isActiveUser?.currency])

  const locale = {
    emptyText: (
      <EmptyResult
        showBtn
        onClick={() => {
          localStorage.removeItem('product_arr')
          if (isActiveUser?.shipping_methods?.length === 0) {
            if (setShowShipping) {
              setShowShipping(true)
            }
          } else {
            router.push('/vendor/products/add-product')
          }
        }}
        title=""
        text="Add product"
      />
    )
  }

  return (
    <React.Fragment>
      <Content className="mt-8 hidden rounded-md bg-white py-[10px] text-[#000] md:block">
        <TextComponent as="p" className="px-4 text-[16px] font-normal leading-[19px] text-[#000000]">
          Top 5 Selling Products
        </TextComponent>

        <Table
          locale={locale}
          // loading={isPending || isFetching}
          className="mt-4 whitespace-nowrap"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Content>
      <div className="md:hidden">
        <Content className="rounded-md bg-white py-[10px] text-[#000]">
          <TextComponent as="p" className="px-4 text-center text-[16px] font-normal leading-[19px] text-[#000000]">
            Top 5 Selling Products
          </TextComponent>
        </Content>
        {data?.length ? (
          data?.map((val: any, i: React.Key | null | undefined) => (
            <div className="mt-[19px]" key={i}>
              <Content className="flex flex-col gap-4 rounded-md bg-white px-2 py-[10px] text-[#000]">
                <div className="flex gap-2">
                  <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                    <Image
                      onError={error => {
                        error.currentTarget.src = '/assets/default_banner.jpg'
                      }}
                      src={`${process.env.imageBaseUrl}/${val?.images[0]}`}
                      alt={'img'}
                      width={48}
                      preview={false}
                      height={48}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <TextComponent as="p" className="font-normal !text-[#6b7280]">
                      {val?.name}
                    </TextComponent>
                    <TextComponent as="p" className="!text-[#6b7280]">
                      {formattedDateString(val?.created_at)}
                    </TextComponent>
                  </div>
                </div>
                <div className="flex justify-between gap-10 px-1">
                  <div className="flex flex-col">
                    <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                      <FormatNumberCurrency value={+val?.price} currency={isActiveUser?.currency} />
                    </TextComponent>
                    <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                      Price{' '}
                    </TextComponent>
                  </div>
                  {/* <div className="flex flex-col">
                  <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                    04
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                    Order{' '}
                  </TextComponent>
                </div> */}
                  <div className="flex flex-col items-center">
                    {val?.quantity == 0 ? (
                      <Badge className="" status={'Outofstock'} />
                    ) : (
                      <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                        {formatQuantity(val?.quantity)}
                      </TextComponent>
                    )}

                    <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                      Stock{' '}
                    </TextComponent>
                  </div>
                  {/* <div className="flex flex-col">
                  <TextComponent as="p" className="text-[14px] font-normal !text-[#6b7280]">
                    $1,798{' '}
                  </TextComponent>
                  <TextComponent as="p" className="text-[14px] font-semibold !text-[#000]">
                    Amount{' '}
                  </TextComponent>
                </div> */}
                </div>

                <CustomButton
                  onClick={() => router.push(`/vendor/products/${val?.slug}`)}
                  className="!hover:bg-[#6B7280] rounded-[6px] bg-[#6B7280] px-1 py-2 text-[14px] font-normal text-white underline"
                >
                  View
                </CustomButton>
              </Content>
            </div>
          ))
        ) : (
          <EmptyResult
            showBtn
            onClick={() => {
              localStorage.removeItem('product_arr')
              if (isActiveUser?.shipping_methods?.length === 0) {
                if (setShowShipping) {
                  setShowShipping(true)
                }
              } else {
                router.push('/vendor/products/add-product')
              }
            }}
            title=""
            text={isActiveUser?.type === 'product' ? 'Add Products' : 'Add Services'}
          />
        )}
      </div>
      <PlannerModal
        modalOpen={showShipping}
        onCloseModal={() => {
          setShowShipping(false)
        }}
        setModalOpen={setShowShipping}
        maskCloseable={true}
        width={380}
      >
        <div className="flex flex-col items-center gap-4">
          <TextComponent as="p" className="text-center text-[20px] font-bold leading-[26px]">
            Set Shipping Method
          </TextComponent>
          <div className="relative h-[200px] w-[200px]">
            <NextImage src="/assets/shipping.svg" alt="Shipping animation" layout="fill" objectFit="cover" />
          </div>
          <TextComponent as="p" className="py-4 text-center text-[14px] leading-[18px] text-[#6B7280]">
            Let&apos;s set up your shipping method first
          </TextComponent>

          <CustomButton
            onClick={() => {
              router.push('/vendor/shipping')
            }}
            disabled={false}
            type="button"
            className="w-full rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
          >
            {'Proceed'}
          </CustomButton>
        </div>
      </PlannerModal>
    </React.Fragment>
  )
}

export default TopSelling
