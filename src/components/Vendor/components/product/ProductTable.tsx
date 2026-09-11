import {Dropdown, Pagination, Rate, Tooltip} from 'antd'
import React, {useState} from 'react'

import Badge from '@/components/SharedUI/Badge'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import Spinner from '@/components/SharedUI/Spinner'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import SuccessModal from '@/components/SharedUI/States/Success/SuccessModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useDeleteUserStoreItemMutation, useUpdateStoreItemAvailabilityMutation} from '@/services/vendor/vendor'
import {ProductListingQuery} from '@/types/store'
import {Status} from '@/types/types'
import {capitalizeFirstLetter, capitalizeOnlyFirstLetter, formatQuantity, formattedDateString} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Image} from 'antd'
import {ColumnsType} from 'antd/es/table'
import {useRouter} from 'next/router'
import TitleText from '../../TitleText'
import {StyledTable} from '../dashboard/RecentOrder'

export interface ProductTableProps {
  loading: boolean
  data: any
  isFetching: boolean
  queryParams: ProductListingQuery
  updateQueryParams: any
  isActiveUser?: any
  setShowShipping?: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductTable = ({
  loading,
  data,
  isFetching,
  queryParams,
  updateQueryParams,
  isActiveUser: isActiveUserShippingMethods,
  setShowShipping
}: ProductTableProps) => {
  const router = useRouter()
  // if (isActiveUserShippingMethods?.shipping_methods?.length === 0) {
  //             setShowShipping(true)
  //           } else {
  //             router.push('/vendor/products/add-product')
  //           }
  const [currentProduct, setCurrentProduct] = useState<any>()

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [showDeleteProduct, setShowDeleteProduct] = useState(false)
  const [showAvailability, setShowAvailability] = useState(false)

  const [showSuccess, setShowSuccess] = useState(false)

  // console.log(queryParams)

  // console.log(data?.total)

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  // console.log(isActiveUser?.type)

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  const onSelectChange = (newSelectedRowKeys: React.SetStateAction<any>) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const handlePagination = (page: number) => {
    if (!data?.data) return

    updateQueryParams({current_page: page})
  }

  // mutations

  const [deleteProductItem, {isLoading: isDeleteLoading}] = useDeleteUserStoreItemMutation()

  const [updateAvailability, {isLoading: isAvailabilityLoading}] = useUpdateStoreItemAvailabilityMutation()

  // delete function
  const handleDelete = async () => {
    try {
      const res = await deleteProductItem({
        userStore: isActiveUser?.slug!!,
        listing: currentProduct?.slug
      }).unwrap()

      setShowDeleteProduct(false)
      setShowSuccess(true)
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Delete {currentProduct.name} from store!</>}
              image={'/assets/error-toast-icon.svg'}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  // handle avaiilability function
  const handleAvailability = async () => {
    let payload = {
      is_available: currentProduct.is_available === false ? 1 : 0
    }

    try {
      const res = await updateAvailability({
        userStore: isActiveUser?.slug!!,
        listing: currentProduct.slug,
        body: payload
      }).unwrap()

      setShowAvailability(false)
      setShowSuccess(true)
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to change {capitalizeFirstLetter(isActiveUser?.type)} status!</>}
              image={'/assets/error-toast-icon.svg'}
              textColor="#FFF"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product',
        title: 'Product',
        dataIndex: 'product',
        render: (text, record) => (
          <div className="flex items-center gap-1">
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
                {capitalizeOnlyFirstLetter(record?.name ?? '')}
              </TextComponent>
            </div>
          </div>
        ),
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        key: 'status',
        title: (
          <span style={{textAlign: 'center'}} className="lg:ml-6">
            Status
          </span>
        ),
        dataIndex: 'status',
        render: (text: Status, record) => (
          <Badge
            className=""
            status={record?.is_draft ? 'Draft' : !record?.is_available ? 'Unavailable' : 'Published'}
          />
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
        ),
        sorter: (a, b) => a.price - b.price
      },
      {
        key: 'stock',
        title: (
          <span style={{textAlign: 'center'}} className="">
            Available Quantity
          </span>
        ),
        dataIndex: 'stock',
        render: (text, record) => (
          <>
            {record?.quantity == 0 ? (
              <Badge className="" status={'Outofstock'} />
            ) : (
              <TextComponent as="p" className="text-center font-normal !text-[#6b7280] lg:ml-8 lg:text-left">
                {formatQuantity(record?.quantity)}
              </TextComponent>
            )}
          </>
        ),
        sorter: (a, b) => a.quantity - b.quantity
      },

      {
        key: 'rating',
        title: 'Rating',
        dataIndex: 'rating',
        render: (text, record) => (
          <div className="flex items-center justify-center gap-1 lg:ml-2 lg:justify-start">
            <span>{text}</span>
            {text ? <Rate disabled className="text-base text-[#FDBF5E]" value={1} count={1} /> : '-'}
          </div>
        ),
        sorter: (a, b) => a.rating - b.rating
      },

      {
        key: 'date',
        title: (
          <span style={{textAlign: 'center'}} className="ml-6">
            Date
          </span>
        ),
        dataIndex: 'date',
        render: (text, record) => (
          <TextComponent as="p" className="font-normal !text-[#6b7280] lg:ml-4">
            {formattedDateString(record?.created_at)}
          </TextComponent>
        )
      },

      {
        title: 'Action',
        key: 'action',
        align: 'center',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (record: any) => (
          <Dropdown
            // disabled
            trigger={['click']}
            menu={{
              items: [
                !record?.is_draft
                  ? {
                      label: 'View',
                      key: '1'
                    }
                  : null,

                {
                  label: 'Edit',
                  key: '2'
                },
                !record?.is_available && !record?.is_draft
                  ? {
                      label: 'Available',
                      key: '3'
                    }
                  : null,
                record?.is_available && !record?.is_draft
                  ? {
                      label:
                        record?.quantity <= 3 ? (
                          'Unavailable'
                        ) : (
                          <Tooltip
                            title={
                              <p className="text-black">
                                {'You can only hide items with a stock count of less than 3.'}
                              </p>
                            }
                            color="white"
                          >
                            <p className="cursor-not-allowed text-gray-400"> Unavailable </p>
                          </Tooltip>
                        ),
                      key: '4'
                    }
                  : null,

                {
                  label:
                    record?.quantity <= 3 ? (
                      'Delete'
                    ) : (
                      <Tooltip
                        title={
                          <p className="text-black">{'You can only delete items with a stock count of less than 3.'}</p>
                        }
                        color="white"
                      >
                        <p className="cursor-not-allowed text-gray-400">Delete</p>
                      </Tooltip>
                    ),
                  key: '5'
                }
              ],
              onClick: ({key}) => {
                setCurrentProduct(record)

                if (key === '1') {
                  router.push(`/vendor/products/${record?.slug}`)
                } else if (key === '2') {
                  // console.log(record);
                  if (isActiveUserShippingMethods?.shipping_methods?.length === 0) {
                    if (setShowShipping) {
                      setShowShipping(true)
                    }
                  } else {
                    router.push(`/vendor/products/edit/${record?.slug}`)
                  }
                } else if (key === '3') {
                  setShowAvailability(true)
                } else if (key === '4') {
                  if (record?.quantity <= 3) {
                    setShowAvailability(true)
                  }
                } else if (key === '5') {
                  if (record?.quantity <= 3) {
                    setShowDeleteProduct(true)
                  }
                }
              }
            }}
          >
            <button
              style={{
                width: 'auto',
                height: 'auto'
              }}
              className="border-none"
            >
              <Icon style={{width: 'auto', height: 'auto'}} icon="tabler:dots" className="text-2xl" />{' '}
            </button>
          </Dropdown>
        )
      }
    ]
  }, [])

  const locale = {
    emptyText: (
      <EmptyResult
        showBtn
        onClick={() => {
          router.push('/vendor/products/add-product')
        }}
        title=""
        text="Add product"
      />
    )
  }

  return (
    <React.Fragment>
      <div className="">
        <div className="flex flex-col">
          <StyledTable
            locale={locale}
            rowClassName={'no-selected-row'}
            loading={loading || isFetching}
            className=""
            columns={columns}
            //   rowSelection={rowSelection}
            dataSource={data?.data}
            pagination={false}
          />
        </div>
        {data?.data?.length ? (
          <div className="my-4 flex justify-end">
            <Pagination
              current={queryParams.current_page ? queryParams.current_page : 1}
              showSizeChanger={false}
              onChange={page => {
                handlePagination(page)
              }}
              className="mx-auto my-[0] flex w-fit flex-row items-center justify-center self-center rounded-md bg-white p-2 text-white lg:mx-0"
              showLessItems={true}
              pageSize={queryParams.per_page ? queryParams.per_page : 15}
              total={data?.total}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {isDesktop && showDeleteProduct && (
        <PlannerModal
          modalOpen={showDeleteProduct}
          setModalOpen={setShowDeleteProduct}
          maskCloseable={true}
          onCloseModal={() => {
            setShowDeleteProduct(false)
          }}
        >
          <TitleText title={`Delete`} />
          <div className="flex w-full flex-col gap-4">
            <TextComponent as="p" className="text-center text-[14px] font-medium leading-[18px] text-custom_grey">
              <span>
                Are you sure you want to delete <b className="">{currentProduct.name}</b> from your store?
              </span>{' '}
            </TextComponent>
            <TextComponent as="p" className="text-center text-[12px] font-medium leading-[16px] text-custom_grey">
              This action cannot be undone
            </TextComponent>
          </div>
          <div className="mt-5 flex w-full items-center gap-4">
            <CustomButton
              onClick={() => {
                handleDelete()
              }}
              type="button"
              className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
            >
              {isDeleteLoading ? <Spinner /> : 'Yes'}
            </CustomButton>

            <CustomButton
              onClick={() => {
                setShowDeleteProduct(false)
              }}
              type="button"
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              No
            </CustomButton>
          </div>
        </PlannerModal>
      )}
      {!isDesktop && showDeleteProduct && (
        <DrawerContainer
          open={showDeleteProduct}
          onClose={() => setShowDeleteProduct(false)}
          title="Delete"
          height={300}
        >
          <div className="flex w-full flex-col gap-4">
            <TextComponent as="p" className="text-center text-[14px] font-medium leading-[18px] text-custom_grey">
              <span>
                Are you sure you want to delete <b className="bg-red-800">{currentProduct.name}</b> from your store?
              </span>{' '}
            </TextComponent>
            <TextComponent as="p" className="text-center text-[12px] font-medium leading-[16px] text-custom_grey">
              This action cannot be undone
            </TextComponent>
          </div>
          <div className="mt-5 flex w-full items-center gap-4">
            <CustomButton
              onClick={() => {
                handleDelete()
              }}
              type="button"
              className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
            >
              {isDeleteLoading ? <Spinner /> : 'Yes'}
            </CustomButton>

            <CustomButton
              onClick={() => {
                setShowDeleteProduct(false)
              }}
              type="button"
              className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              No
            </CustomButton>
          </div>
        </DrawerContainer>
      )}
      {isDesktop && showAvailability && (
        <PlannerModal
          modalOpen={showAvailability}
          setModalOpen={setShowAvailability}
          maskCloseable={true}
          onCloseModal={() => {
            setShowAvailability(false)
          }}
        >
          <TitleText
            title={`${capitalizeOnlyFirstLetter(isActiveUser?.type)} is ${currentProduct.is_available ? 'Una' : 'A'}vailable`}
          />
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              {isActiveUser?.type === 'product' ? '' : 'By '}Clicking <b>Yes</b>{' '}
              {isActiveUser?.type === 'product'
                ? currentProduct.is_available === false
                  ? `will add the product to your shelf and your customers will see that the product is now available.`
                  : `will remove the product from your shelf and your
              customers will see that the product is not available.`
                : `your customers will be see that the service is not available.`}
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setShowAvailability(false)
                }}
                type="button"
                className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  handleAvailability()
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {isAvailabilityLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      )}
      {!isDesktop && showAvailability && (
        <DrawerContainer
          open={showAvailability}
          onClose={() => setShowAvailability(false)}
          title={`${capitalizeOnlyFirstLetter(isActiveUser?.type)} is ${currentProduct.is_available ? 'Una' : 'A'}vailable`}
          height={300}
        >
          <div className="flex w-full flex-col gap-5">
            <TextComponent as="p" className="px-2 text-center text-[14px] font-normal leading-[18px] text-custom_grey">
              {isActiveUser?.type === 'product' ? '' : 'By '}Clicking <b>Yes</b>{' '}
              {isActiveUser?.type === 'product'
                ? currentProduct.is_available === false
                  ? `will add the product to your shelf and your customers will see that the product is now available.`
                  : `will remove the product from your shelf and your
              customers will see that the product is not available.`
                : `your customers will be see that the service is not available.`}
            </TextComponent>

            <div className="flex w-full items-center gap-4">
              <CustomButton
                onClick={() => {
                  setShowAvailability(false)
                }}
                type="button"
                className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
              >
                No
              </CustomButton>

              <CustomButton
                onClick={() => {
                  handleAvailability()
                }}
                type="button"
                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {isAvailabilityLoading ? <Spinner /> : 'Yes'}
              </CustomButton>
            </div>
          </div>
        </DrawerContainer>
      )}
      {showSuccess && (
        <PlannerModal
          modalOpen={showSuccess}
          setModalOpen={setShowSuccess}
          maskCloseable={true}
          onCloseModal={() => {
            setShowSuccess(false)
          }}
        >
          <SuccessModal
            successTitle={'Success'}
            primaryButtonText={`Close`}
            primaryButtonAction={() => {
              setShowSuccess(false)
            }}
          />
        </PlannerModal>
      )}
    </React.Fragment>
  )
}

export default ProductTable
