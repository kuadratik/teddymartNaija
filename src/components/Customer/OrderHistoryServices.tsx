import TextComponent from '@/components/SharedUI/TextComponent'
import React, {useState} from 'react'
import {Button, Image, Rate} from 'antd'

import {Layout, Space, Table} from 'antd'
import {ColumnsType} from 'antd/es/table'

import {useRouter} from 'next/router'
import {updateRouteParams} from '@/utils/fx'
import tw from 'tailwind-styled-components'
import {useAddRateMutation, useGetOrderHistoryQuery, useGetOrderHistoryServicesQuery} from '@/services/rating'
import dayjs from 'dayjs'
import PlannerModal from '../SharedUI/ModalComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {Icon} from '@iconify/react'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import CustomToast from '../SharedUI/Toast/CustomToast'
import Spinner from '../SharedUI/Spinner'
import DrawerContainer from '../SharedUI/DrawerContainer'
import {getIcon} from '../Vendor/utils'
import {useAppSelector} from '@/hooks/reduxHooks'

const {Content} = Layout

export const StatusRenderer = ({text}: {text: string}) => {
  return (
    <TextComponent
      as="p"
      className={`rounded-md py-[12px] text-center font-normal md:ml-0 ${text === 'New' || text === 'incart' ? 'bg-[#FFFAEA] text-[#FF9500]' : text === 'Shipped' ? 'bg-[#E7F2FF] text-[#044BFD]' : text === 'Canceled' ? 'bg-[#FFE1E7] text-[#FF4E4E]' : text === 'Delivered' ? 'bg-[#E5FFEC] text-[#129500]' : ''}`}
    >
      {text}
    </TextComponent>
  )
}
const OrderHistoryServices = ({servicesOrder}: any) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const {selectedLanguage} = useAppSelector(state => state.country)

  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const router = useRouter()
  const [currentOrder, setCurrentOrder] = useState<any>({})
  const [rateModal, setRateModal] = useState(false)
  const [rateNumber, setRateNumber] = useState(0)
  const [receivedModal, setReceivedModal] = useState(false)

  const {data: orderHistory, isLoading: listingData} = useGetOrderHistoryServicesQuery({
    currency: selectedLanguage.value
  })

  const [addRating, {isLoading}] = useAddRateMutation()

  console.log('servicesOrder ', orderHistory)

  const handleRating = async () => {
    const payload = {
      listing_id: currentOrder?.listingId,
      store_id: currentOrder?.storeId,
      rating: rateNumber
    }

    try {
      await addRating({body: payload}).unwrap()
      setRateModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<> Thanks for the rating</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (err) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>{(err as any)?.data?.message}</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  const serviceColumns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'name',
        title: 'Order',
        dataIndex: 'name',

        render: (text, record) => (
          <div
            className="flex items-center gap-2"
            // onClick={() => {
            //   updateRouteParams({details: record?.id}, router)
            // }}
          >
            <div className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[9px]">
              <Image
                src={record.image || '/assets/default_image.png'}
                alt="product image"
                preview={false}
                // onLoadStart={() => {
                //   setIsLoadingImage(true)
                // }}
                // onLoad={() => {
                //   setIsLoadingImage(false)
                // }}
                onError={error => {
                  error.currentTarget.src = '/assets/default_image.png'
                  setIsLoadingImage(false)
                }}
                // className={`${isLoadingImage ? 'blur-sm' : ''}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#000]">
                {record?.name}
              </TextComponent>

              <TextComponent as="p" className="whitespace-nowrap font-normal !text-[#6b7280]">
                {record?.id}
              </TextComponent>
            </div>
          </div>
        )
      },
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        align: 'center',

        render: (text, record) => (
          <TextComponent as="p" className="whitespace-wrap flex items-center font-normal !text-[#6b7280]">
            {text !== '-' && <Icon icon={getIcon(record.currency)} />}
            {text ? text : `-`}
          </TextComponent>
        )
      },

      {
        title: 'Date',
        key: 'created_at',
        align: 'center',
        dataIndex: 'created_at',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (text, record) => (
          <Space size="middle">
            {/* <Link className="!text-[#000000E0] hover:underline" href={`/`}> */}
            {dayjs(text).format('MM/DD/YYYY HH:mm')}
            {/* </Link> */}
          </Space>
        )
      },

      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <Space size="middle">
            <Button
              onClick={() => {
                setCurrentOrder(record)
                setRateModal(true)
              }}
              className="h-[42px] cursor-pointer bg-black text-white"
              disabled={false}
            >
              Rate Service
            </Button>
          </Space>
        )
      }
    ]
  }, [])

  return (
    <>
      <div className="">
        {/* <NavTabs backgroundColor="#F1F1F1" active={active} setActive={setActive} naveItems={tabItems} />
        {isLoading ? (
          <div className="w-full">
            <SkeletonLoaderForPage length={2} />{' '}
          </div>
        ) : ( */}
        <div className="w-full py-5">
          {servicesOrder?.length > 0 ? (
            <Content className="w-full rounded-md text-[#000]">
              <div className="flex flex-col">
                <StyledTable
                  // loading={isPending || isFetching}
                  className="mt-2"
                  columns={serviceColumns}
                  dataSource={servicesOrder}
                  pagination={false}
                  scroll={{x: 'max-content'}}
                />
              </div>
            </Content>
          ) : (
            <>
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <Image src="/assets/new-empty-state.svg" alt="empty" width={157} height={157} preview={false} />
                <TextComponent as="p" className="text-[14px] leading-[18px] text-[#6B7280]">
                  Nothing to see here
                </TextComponent>
              </div>
            </>
          )}
        </div>
        {/* )} */}
      </div>

      {isDesktop && rateModal && (
        <PlannerModal
          modalOpen={rateModal}
          setModalOpen={setRateModal}
          maskCloseable={true}
          onCloseModal={() => {
            setRateModal(false)
          }}
          width={400}
        >
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setRateModal(false)}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <TextComponent as="h2" className="mb-3 text-[20px] font-medium">
                Rate {currentOrder?.name}
              </TextComponent>
              <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                <Image
                  src={currentOrder.image || '/assets/default_banner.jpg'}
                  alt="product image"
                  preview={false}
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                    setIsLoadingImage(false)
                  }}
                />
              </div>
              <TextComponent as="p" className="text-[14px] capitalize text-[#000]">
                {currentOrder?.name}
              </TextComponent>
              <TextComponent as="p" className="text-[10px] text-[#6B7280]">
                Service ID: {currentOrder?.id}
              </TextComponent>
              <Rate
                // allowHalf
                defaultValue={currentOrder?.rating}
                className="text-[35px] text-[#FDBF5E]"
                onChange={(value: any) => {
                  setRateNumber(value)
                }}
              />
            </div>

            <Button onClick={handleRating} className="h-[42px] cursor-pointer bg-black text-white">
              {isLoading ? <Spinner /> : 'Submit'}
            </Button>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && rateModal && (
        <DrawerContainer open={rateModal} onClose={() => setRateModal(false)} height={300}>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setRateModal(false)}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <TextComponent as="h2" className="mb-3 text-[20px] font-medium">
                Rate {currentOrder?.name}
              </TextComponent>
              <div className="h-[48px] w-[48px] overflow-hidden rounded-[9px]">
                <Image
                  src={currentOrder.image || '/assets/default_banner.jpg'}
                  alt="product image"
                  preview={false}
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                    setIsLoadingImage(false)
                  }}
                />
              </div>
              <TextComponent as="p" className="text-[14px] capitalize text-[#000]">
                {currentOrder?.name}
              </TextComponent>
              <TextComponent as="p" className="text-[10px] text-[#6B7280]">
                Service ID: {currentOrder?.id}
              </TextComponent>
              <Rate
                // allowHalf
                defaultValue={currentOrder?.rating}
                className="text-[35px] text-[#FDBF5E]"
                onChange={(value: any) => {
                  setRateNumber(value)
                }}
              />
            </div>

            <Button onClick={handleRating} className="h-[42px] cursor-pointer bg-black text-white">
              {isLoading ? <Spinner /> : 'Submit'}
            </Button>
          </div>
        </DrawerContainer>
      )}

      {/* Received Modal */}
      {isDesktop && receivedModal && (
        <PlannerModal
          modalOpen={receivedModal}
          setModalOpen={setReceivedModal}
          maskCloseable={true}
          onCloseModal={() => {
            setReceivedModal(false)
          }}
          width={400}
        >
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setReceivedModal(false)}
              />
            </div>

            <p className="mx-auto my-4 w-[50%] text-center text-[20px] font-medium">
              I have received this {currentOrder?.name}
            </p>

            <div className="flex justify-between">
              <Button
                onClick={() => setReceivedModal(false)}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg border border-[#000] text-black"
              >
                No, I haven’t
              </Button>

              <Button
                onClick={handleRating}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg bg-black text-white"
              >
                {isLoading ? <Spinner /> : 'Yes, I have'}
              </Button>
            </div>
          </div>
        </PlannerModal>
      )}

      {!isDesktop && receivedModal && (
        <DrawerContainer open={receivedModal} onClose={() => setReceivedModal(false)} height={300}>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setReceivedModal(false)}
              />
            </div>
            <p className="mx-auto my-4 w-[50%] text-center text-[20px] font-medium">
              I have received this [product name]
            </p>

            <div className="flex justify-between">
              <Button
                onClick={() => setReceivedModal(false)}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg border border-[#000] text-black"
              >
                No, I haven’t
              </Button>

              <Button
                onClick={handleRating}
                className="h-[42px] !w-[154px] cursor-pointer rounded-lg bg-black text-white"
              >
                {isLoading ? <Spinner /> : 'Yes, I have'}
              </Button>
            </div>
          </div>
        </DrawerContainer>
      )}
    </>
  )
}

export const StyledTable = tw(Table)`no-scrollbar overflow-scroll whitespace-nowrap lg:overflow-hidden`

export default OrderHistoryServices
