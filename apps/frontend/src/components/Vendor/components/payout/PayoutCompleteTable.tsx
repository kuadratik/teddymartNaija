import {Form, Pagination, Tooltip} from 'antd'
import React, {useState} from 'react'

import CustomButton from '@/components/SharedUI/Buttons/Button'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllPaystackBanksQuery, useGetProcessedPayoutQuery} from '@/services/vendor/payout'
import {Icon} from '@iconify/react'
import {ColumnsType} from 'antd/es/table'
import dayjs from 'dayjs'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {StyledTable} from '../dashboard/RecentOrder'

export const payoutInfo = [
  {
    product: 'VL413922',
    price: '$29.00',
    stock: '04',
    payment_status: 'Paid',
    date: '09/24/2024',
    status: 'Processing'
  },
  {
    product: 'VL413922',
    price: '$29.00',
    stock: '04',
    payment_status: 'Paid',
    date: '09/24/2024',
    status: 'New'
  },
  {
    product: 'VL413922',
    price: '$29.00',
    payment_status: 'Paid',
    rating: '4.8',
    date: '09/24/2024',
    status: 'New'
  },
  {
    product: 'VL413922',
    price: '$29.00',
    payment_status: 'Paid',
    rating: '4.8',
    date: '09/24/2024',
    status: 'New'
  }
]

export const StatusRenderer = ({text}: {text: string}) => {
  return (
    <TextComponent
      as="p"
      className={`!w-[113px] rounded-md py-[12px] text-center font-normal capitalize md:ml-0 ${
        text.toLowerCase() === 'processing'
          ? 'bg-[#FFFAEA] text-[#FF9500]'
          : text.toLowerCase() === 'new'
            ? 'bg-[#E7F2FF] text-[#044BFD]'
            : text.toLowerCase() === 'completed'
              ? 'bg-[#D4FFD9] text-[#259240]'
              : text.toLowerCase() === 'failed'
                ? 'bg-[#FFEBEB] text-[#E60000]'
                : 'bg-[#D4FFD9] text-[#259240]'
      }`}
    >
      {text}
    </TextComponent>
  )
}

const PayoutCompleteTable = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showConfirm, setShowConfirm] = useState(false)

  const [showRequestModal, setShowRequestModal] = useState(false)
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const isActiveUser = useAppSelector(state => state.auth.activeUser)

  const {data, isLoading, isFetching} = useGetProcessedPayoutQuery({
    userStore: isActiveUser.slug,
    page: currentPage.toString(),
    from: '0',
    to: pageSize.toString()
  })
  const {data: banks, isLoading: isLoadingBank} = useGetAllPaystackBanksQuery({
    payment_gateway: 'paystack',
    per_page: '150'
  })
  // console.log('data complete ', data)

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        bank: '',
        password: ''
      },
      validationSchema: Yup.object().shape({
        bank: Yup.string().required('Bank name is required'),
        password: Yup.string().required('Account number is required')
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async () => {
        console.log('Submitted')
      }
    }
  )

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product',
        title: 'Id',
        dataIndex: 'product'
      },
      {
        key: 'price',
        title: (
          <Tooltip
            placement="top"
            title="Payouts are calculated based on your product price (after any discounts), not the myEKI display price."
          >
            <span className="flex cursor-pointer items-center gap-1 text-black">
              Price{' '}
              <Icon icon="material-symbols:info-outline-rounded" width="15" height="15" className="relative top-0" />
            </span>
          </Tooltip>
        ),
        dataIndex: 'price'
      },

      {
        key: 'date',
        title: 'Date',
        dataIndex: 'date'
      },
      {
        key: 'payment_status',
        title: 'Payment Status',
        dataIndex: 'payment_status',
        render: text => (
          <TextComponent as="p" className="w-[113px] text-center">
            {text}
          </TextComponent>
        )
      }
    ]
  }, [])
  const transformedData = data?.data?.data?.map(
    (item: {
      id: any
      order_number: any
      payout_amount: string | number
      created_at: string | number | Date | dayjs.Dayjs | null | undefined
      payout_status: string
    }) => ({
      key: item?.id,
      product: item?.id,
      price: (
        <span className="font-medium text-[#000]">
          <FormatNumberCurrency value={+item?.payout_amount} currency={isActiveUser?.currency} />
        </span>
      ),
      date: <> {dayjs(item?.created_at).format('MM/DD/YYYY HH:mm')}</>,
      payment_status: <StatusRenderer text={item?.payout_status} />
    })
  )
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size) setPageSize(size)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
  const locale = {
    emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
  }

  return (
    <div className="px-4">
      {' '}
      <div className="flex flex-col">
        <StyledTable
          rowClassName={'no-selected-row'}
          loading={isLoading || isFetching}
          className=""
          columns={columns}
          //   rowSelection={rowSelection}
          dataSource={transformedData}
          pagination={false}
          locale={locale}
        />
        <div className="w-full px-2 pb-2 pt-5 lg:px-0">
          <div className="">
            {data?.data?.to > 0 && !isLoading && (
              <Pagination
                current={data?.data?.current_page || 1}
                total={data?.data?.total || 0}
                pageSize={data?.data?.per_page || 20}
                showSizeChanger={false}
                onChange={handlePaginationChange}
                // showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              />
            )}
          </div>
        </div>
      </div>
      {isDesktop && showRequestModal && (
        <PlannerModal
          modalOpen={showRequestModal}
          setModalOpen={setShowRequestModal}
          maskCloseable={true}
          onCloseModal={() => {
            setShowRequestModal(false)
          }}
          width={400}
        >
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Icon
                icon="mdi:close"
                className="ml-auto cursor-pointer text-[24px]"
                onClick={() => setShowRequestModal(false)}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <TextComponent as="h2" className="mb-3 text-[20px] font-medium">
                Request Payout
              </TextComponent>
            </div>

            <Form className="flex w-full flex-col gap-6" onFinish={handleSubmit} layout="vertical">
              <div>
                <p className="text-xm pb-1 font-semibold text-black">Bank name*</p>
                <SelectInput
                  data={banks?.data?.banks.map((item: any) => ({
                    label: item.name,
                    value: item.name,
                    code: item.code,
                    id: item.id
                  }))}
                  loading={isLoadingBank}
                  value={values?.bank ?? undefined}
                  errorMessage={touched.bank && typeof errors.bank === 'string' ? errors.bank : ''}
                  onChange={value => {
                    setFieldValue('bank', value)
                  }}
                  placeholder="Bank name*"
                  disabled={false}
                  notFoundContent={'Bank not found'}
                />
              </div>
              <TextInput
                onChange={e => {
                  if (e.target.value.length <= 75) {
                    handleChange(e)
                  }
                }}
                name={'password'}
                value={values.password}
                errorMessage={touched.password && errors.password ? errors.password : ''}
                title={'myEKI Account Password*'}
                labelClassName="text-xm font-semibold text-black"
                iconName={!showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'}
                placeholder="***********"
                type={showConfirm ? 'text' : 'password'}
              />

              <CustomButton
                onClick={() => {
                  handleSubmit()
                }}
                type="button"
                className="rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {/* {isLoading ? <Spinner /> : 'Request Payout'} */}
                Request Payout
              </CustomButton>
            </Form>
          </div>
        </PlannerModal>
      )}
    </div>
  )
}

export default PayoutCompleteTable
