import {Form} from 'antd'
import React, {useState} from 'react'

import CustomButton from '@/components/SharedUI/Buttons/Button'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetProcessedPayoutQuery} from '@/services/vendor/payout'
import {Icon} from '@iconify/react'
import {ColumnsType} from 'antd/es/table'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {StyledTable} from '../dashboard/RecentOrder'
import {BANKS} from './PayoutInformation'

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
      className={`rounded-md py-[12px] text-center font-normal md:ml-0 ${text === 'Processing' ? 'bg-[#FFFAEA] text-[#FF9500]' : 'bg-[#E7F2FF] text-[#044BFD]'}`}
    >
      {text}
    </TextComponent>
  )
}

const PayoutCompleteTable = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showConfirm, setShowConfirm] = useState(false)

  const [showRequestModal, setShowRequestModal] = useState(false)

  //   const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  //   const onSelectChange = (newSelectedRowKeys: React.SetStateAction<any>) => {
  //     setSelectedRowKeys(newSelectedRowKeys)
  //   }

  //     const rowSelection = {
  //       selectedRowKeys,
  //       onChange: onSelectChange
  //     }

  const isActiveUser = useAppSelector(state => state.auth.activeUser)

  const {data, isLoading} = useGetProcessedPayoutQuery({userStore: isActiveUser.slug})

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
        title: 'Order ID',
        dataIndex: 'product'
      },
      {
        key: 'price',
        title: 'Price',
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
          <TextComponent as="p" className="w-[113px] rounded-md bg-[#E6E6E6] py-2 text-center !text-[#6b7280]">
            {text}
          </TextComponent>
        )
      }
    ]
  }, [])

  const locale = {
    emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />
  }

  return (
    <div className="px-4">
      {' '}
      <div className="flex flex-col">
        <StyledTable
          rowClassName={'no-selected-row'}
          // loading={isPending || isFetching}
          className=""
          columns={columns}
          //   rowSelection={rowSelection}
          dataSource={data?.data?.data}
          pagination={false}
          locale={locale}
        />
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
                  data={BANKS}
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
