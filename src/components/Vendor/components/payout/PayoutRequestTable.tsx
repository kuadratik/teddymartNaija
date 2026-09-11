import {Button, Form, Space} from 'antd'
import React, {useState} from 'react'

import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import Spinner from '@/components/SharedUI/Spinner'
import EmptyResult from '@/components/SharedUI/States/EmptyState'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useConfirmAuthMutation, useGetAllRequestedPayoutQuery, useRequestPayoutMutation} from '@/services/vendor/payout'
import {Status} from '@/types/types'
import {Icon} from '@iconify/react'
import {ColumnsType} from 'antd/es/table'
import dayjs from 'dayjs'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {StyledTable} from '../dashboard/RecentOrder'

interface Payout {
  id: number
}

export const StatusRenderer = ({text}: {text: string}) => {
  return (
    <TextComponent
      as="p"
      className={`!w-[113px] rounded-md py-[12px] text-center font-normal capitalize md:ml-0 ${text.toLowerCase() === 'processing' ? 'bg-[#FFFAEA] text-[#FF9500]' : text.toLowerCase() === 'new' ? 'bg-[#E7F2FF] text-[#044BFD]' : 'bg-[#D4FFD9] text-[#259240]'}`}
    >
      {text}
    </TextComponent>
  )
}

const PayoutRequestTable = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showConfirm, setShowConfirm] = useState(false)

  const [showRequestModal, setShowRequestModal] = useState(false)
  const isActiveUser = useAppSelector(state => state.auth.activeUser)

  const [currentPayout, setCurrentPayout] = useState<Payout | null>(null)

  const {data, isLoading} = useGetAllRequestedPayoutQuery({userStore: isActiveUser.slug})
  const [requestPayout, {isLoading: requesting}] = useRequestPayoutMutation()
  const [authPassword, {isLoading: checking}] = useConfirmAuthMutation()

  // console.log('data', data)

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        // bank: '',
        password: ''
      },
      validationSchema: Yup.object().shape({
        // bank: Yup.string().required('Bank name is required'),
        password: Yup.string().required('Password is required')
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async () => {
        requestPayoutHandler()
      }
    }
  )

  const requestPayoutHandler = async () => {
    const payload = {password: values.password}

    try {
      const authResponse = await authPassword({body: payload}).unwrap()

      if (!authResponse.success) {
        throw new Error('Authentication failed.')
      }

      resetForm()
      setShowRequestModal(false)

      console.log('payl ', {userStore: isActiveUser.slug, payout: currentPayout?.id as number})

      const payoutResponse = await requestPayout({
        userStore: isActiveUser.slug,
        payout: currentPayout?.id as number
      }).unwrap()

      if (!payoutResponse.success) {
        throw new Error(payoutResponse.message || 'Failed to request payout.')
      }

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Successfully requested for payout</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (error: any) {
      const errorMessage = error?.data?.message || error.message || 'An error occurred while processing your request.'

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={errorMessage}
              textColor="#FFF"
              message={errorMessage}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'product',
        title: 'Id',
        dataIndex: 'product',
        render: (text: string, record: any) => (
          <TextComponent as="p" className="text-black">
            {record.id}
          </TextComponent>
        )
      },
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'price',
        render: (text: string, record: any) => (
          <TextComponent as="p" className="flex items-center text-black">
            <FormatNumberCurrency value={+record.total_amount || 0} currency={isActiveUser?.currency} />
          </TextComponent>
        )
      },

      {
        title: 'Date',
        key: 'created_at',
        align: 'center',
        dataIndex: 'created_at',
        render: (text, record) => <Space size="middle">{dayjs(text).format('MM/DD/YYYY HH:mm')}</Space>
      },

      {
        key: 'status',
        title: (
          <span style={{textAlign: 'center'}} className="ml-4">
            Status
          </span>
        ),
        dataIndex: 'status',
        render: (text: Status, record: any) => (
          <div className="w-[40%]">
            <StatusRenderer text={record?.payout_status} />
          </div>
        )
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <Button
            onClick={() => {
              setCurrentPayout(record)
              setShowRequestModal(true)
            }}
            className="h-[42px] cursor-pointer bg-black text-white"
            disabled={record.payout_status === 'processing'}
          >
            {requesting ? <Spinner /> : 'Request Payout'}
          </Button>
        )
      }
    ]
  }, [])

  const locale = {emptyText: <EmptyResult showBtn={false} onClick={() => {}} title="" text="" />}

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
          scroll={{x: 'max-content'}}
          locale={locale}
        />
      </div>
      {/* {isDesktop && showRequestModal && ( */}
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
            {/* <div>
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
              </div> */}
            <TextInput
              onChange={e => {
                if (e.target.value.length <= 75) {
                  handleChange(e)
                }
              }}
              name={'password'}
              value={values.password}
              errorMessage={errors && errors.password ? errors.password : ''}
              title={'myEKI Account Password*'}
              labelClassName="text-xm font-semibold text-black"
              iconName={!showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'}
              placeholder="***********"
              type={showConfirm ? 'text' : 'password'}
              iconClick={() => {
                setShowConfirm(prev => !prev)
              }}
              capitalize={false}
            />

            <CustomButton
              onClick={requestPayoutHandler}
              type="button"
              className="rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
            >
              {checking ? <Spinner /> : 'Request Payout'}
            </CustomButton>
          </Form>
        </div>
      </PlannerModal>
      {/* )} */}
    </div>
  )
}

export default PayoutRequestTable
