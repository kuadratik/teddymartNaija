import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {Divider, Form} from 'antd'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import {useMediaQuery} from '@/hooks/use-media-query'
import Image from 'next/image'
import {useState} from 'react'
// import DeleteCard from '../DeleteCard'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppSelector} from '@/hooks/reduxHooks'
import {
  useActivatePayoutDetailsMutation,
  useDeletePayoutDetailMutation,
  useGetPayoutDetailsQuery,
  useSavePayoutDetailMutation,
  useUpdatePayoutDetailMutation
} from '@/services/vendor/payout'
import errorToastIcon from '../../../../../public/assets/error-toast-icon.svg'
import DeleteCard from '../DeleteCard'

export const BANKS = [
  {label: 'First Bank', value: 'First Bank'},
  {label: 'GT Bank', value: 'GT Bank'},
  {label: 'Access Bank', value: 'Access Bank'},
  {label: 'Zenith Bank', value: 'Zenith Bank'},
  {label: 'UBA', value: 'UBA'}
]

type Props = {}

const PayoutInformation = (props: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isActiveUser = useAppSelector(state => state.auth.activeUser)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [payoutDetailId, setPayoutDetailId] = useState<string | number>('')
  const [savePayoutDetail, {isLoading}] = useSavePayoutDetailMutation()
  const [updatePayoutDetail, {isLoading: updating}] = useUpdatePayoutDetailMutation()
  const [removePayoutDetail, {isLoading: deleting}] = useDeletePayoutDetailMutation()
  const [activatePayoutDetail, {isLoading: activating}] = useActivatePayoutDetailsMutation()
  const {data: payoutDetails} = useGetPayoutDetailsQuery({userStore: isActiveUser.slug})

  const [loadingStates, setLoadingStates] = useState<Record<string | number, boolean>>({})

  // const {selectedLanguage} = useAppSelector(state => state.country)

  // // console.log('selectedLanguage', selectedLanguage)

  console.log('payoutDetails', payoutDetails)
  // console.log('isActiveUser ', isActiveUser)

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        bank_name: '',
        account_number: '',
        account_name: '',
        ...(isActiveUser?.currency !== 'NGN' && {
          bank_code: '',
          sort_code: '',
          iban: '',
          institution_number: '',
          transit_number: '',
          interac_information: '',
          zelle_information: ''
        })
      },
      validationSchema: Yup.object().shape({
        bank_name: Yup.string().required('Bank name is required'),
        account_number: Yup.string().required('Account number is required'),
        account_name: Yup.string().required('Account name is required')

        // ...(isActiveUser?.currency !== 'NGN' && {
        //   bank_code: Yup.string().required('Bank code is required'),
        //   // sort_code: Yup.string().required('Sort code is required'),
        //   // iban: Yup.string().required('IBAN is required'),
        //   institution_number: Yup.string().required('Institution number is required'),
        //   transit_number: Yup.string().required('Transit number is required')
        // })

        // ...(isActiveUser?.currency == 'CAD' && {
        //   interac_information: Yup.string().required('Interac information is required')
        // }),

        // ...(isActiveUser?.currency == 'US' && {
        //   zelle_information: Yup.string().required('Zelle information is required')
        // })
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async () => {
        handleSave()
      }
    }
  )

  const handleSave = async () => {
    const payload = {
      ...values,
      store_id: isActiveUser.id,
      detail_type: isActiveUser?.currency == 'NGN' ? 'local' : 'internation'
    }

    console.log('payload', payload)
    try {
      payoutDetailId
        ? await updatePayoutDetail({body: payload, storePayoutDetailId: payoutDetailId}).unwrap()
        : await savePayoutDetail({body: payload}).unwrap()

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Payout detail saved successfully</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      resetForm()
      setPayoutDetailId('')
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
    setPayoutDetailId('')
  }

  const handleActivatePayoutDetail = async (storePayoutDetailId: number | string) => {
    // Set loading to true for the specific button
    setLoadingStates(prev => ({...prev, [storePayoutDetailId]: true}))

    try {
      await activatePayoutDetail({
        storePayoutDetailId,
        userStore: isActiveUser.slug
      }).unwrap()

      // Show success toast
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>You've successfully set this as a default payout detail</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (error: any) {
      // Show error toast
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={(error as any)?.data?.message || 'Please check and try again.'}
              image={errorToastIcon}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    } finally {
      // Reset loading state for the button
      setLoadingStates(prev => ({...prev, [storePayoutDetailId]: false}))
    }
  }

  const handleDeletePayoutDetail = async () => {
    try {
      await removePayoutDetail({
        storePayoutDetailId: payoutDetailId
      }).unwrap()
      setShowDeleteModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Payout Detail deleted successfully</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      setPayoutDetailId('')
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Delete Payout Detail!</>}
              image={errorToastIcon}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
      setPayoutDetailId('')
    }
  }

  return (
    <div className="px-4 pb-5">
      <h2 className="text-xl font-semibold">Payout Information</h2>
      <Divider />
      <Form className="flex w-full flex-col gap-6" onFinish={handleSubmit} layout="vertical">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="!md:w-1/2 w-full">
            {/* <p className="text-xm pb-1 font-semibold text-black">Bank Name*</p>
            <SelectInput
              data={BANKS}
              value={values?.bank_name ?? undefined}
              errorMessage={touched.bank_name && typeof errors.bank_name === 'string' ? errors.bank_name : ''}
              onChange={value => {
                setFieldValue('bank_name', value)
              }}
              placeholder="Bank name*"
              disabled={false}
              notFoundContent={'Bank not found'}
            /> */}
            <TextInput
              onChange={e => handleChange(e)}
              name={'bank_name'}
              type={'text'}
              value={values.bank_name}
              errorMessage={touched.bank_name && errors.bank_name ? errors.bank_name : ''}
              title={'Bank name*'}
              labelClassName="text-xm font-semibold text-black "
              className="!md:w-1/2 w-full" // Ensure consistent width
              placeholder=""
            />
          </div>
          <TextInput
            onChange={e => {
              if (e.target.value.length <= 75) {
                handleChange(e)
              }
            }}
            name={'account_name'}
            type={'text'}
            value={values.account_name}
            errorMessage={touched.account_name && errors.account_name ? errors.account_name : ''}
            title={'Account Name*'}
            labelClassName="text-xm font-semibold text-black "
            className="!md:w-1/2 w-full" // Ensure consistent width
            placeholder=""
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <TextInput
            onChange={e => {
              if (e.target.value.length <= 10) {
                handleChange(e)
              }
            }}
            name={'account_number'}
            type={'text'}
            value={values.account_number}
            errorMessage={errors && errors.account_number ? errors.account_number : ''}
            title={'Acccount Number*'}
            labelClassName="text-xm font-semibold text-black"
            className="flex-1"
            placeholder=""
          />

          {/* Internation fields starts here */}

          {isActiveUser?.currency !== 'NGN' && (
            <TextInput
              onChange={e => {
                if (e.target.value.length <= 6) {
                  handleChange(e)
                }
              }}
              name={'bank_code'}
              type={'text'}
              value={values.bank_code}
              errorMessage={errors && errors.bank_code ? errors.bank_code : ''}
              title={'Bank Code'}
              labelClassName="text-xm font-semibold text-black"
              className="flex-1"
              placeholder=""
            />
          )}
        </div>

        {isActiveUser?.currency !== 'NGN' && (
          <>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <TextInput
                onChange={e => {
                  if (e.target.value.length <= 6) {
                    handleChange(e)
                  }
                }}
                name={'sort_code'}
                type={'text'}
                value={values.sort_code}
                errorMessage={errors && errors.sort_code ? errors.sort_code : ''}
                title={'Sort Code'}
                labelClassName="text-xm font-semibold text-black"
                className="flex-1"
                placeholder=""
              />

              <TextInput
                onChange={e => {
                  if (e.target.value.length <= 34) {
                    handleChange(e)
                  }
                }}
                name={'iban'}
                type={'text'}
                value={values.iban}
                errorMessage={errors && errors.iban ? errors.iban : ''}
                title={'IBAN'}
                labelClassName="text-xm font-semibold text-black"
                className="flex-1"
                placeholder=""
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <TextInput
                onChange={e => {
                  if (e.target.value.length <= 4) {
                    handleChange(e)
                  }
                }}
                name={'institution_number'}
                type={'text'}
                value={values.institution_number}
                errorMessage={errors && errors.institution_number ? errors.institution_number : ''}
                title={'Institution Number'}
                labelClassName="text-xm font-semibold text-black"
                className="flex-1"
                placeholder=""
              />

              <TextInput
                onChange={e => {
                  if (e.target.value.length <= 5) {
                    handleChange(e)
                  }
                }}
                name={'transit_number'}
                type={'text'}
                value={values.transit_number}
                errorMessage={errors && errors.transit_number ? errors.transit_number : ''}
                title={'Transit Number'}
                labelClassName="text-xm font-semibold text-black"
                className="flex-1"
                placeholder=""
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <TextInput
                onChange={e => {
                  if (e.target.value.length <= 75) {
                    handleChange(e)
                  }
                }}
                name={'interac_information'}
                type={'text'}
                value={values.interac_information}
                errorMessage={errors && errors.interac_information ? errors.interac_information : ''}
                title={'interac information (CAD$ Vendors Only)'}
                labelClassName="text-xm font-semibold text-black"
                className="flex-1"
                placeholder="Email, phone number or account details"
              />

              <TextInput
                onChange={e => {
                  if (e.target.value.length <= 75) {
                    handleChange(e)
                  }
                }}
                name={'zelle_information'}
                type={'text'}
                value={values.zelle_information}
                errorMessage={errors && errors.zelle_information ? errors.zelle_information : ''}
                title={'Zelle Information (US$ Vendors Only)'}
                labelClassName="text-xm font-semibold text-black"
                className="flex-1"
                placeholder="Email, phone number or account details"
              />
            </div>
          </>
        )}

        <CustomButton
          onClick={() => {
            handleSubmit()
          }}
          type="button"
          className="!w-[200px] rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          {isLoading || updating ? <Spinner /> : 'Save'}
        </CustomButton>
      </Form>

      {payoutDetails?.data && payoutDetails.data.length > 0 && (
        <div className="pt-10">
          <h2 className="text-xl font-semibold text-[#6B7280]">Saved Payout Information</h2>
          <div className="mt-4 flex flex-col gap-5 md:flex-row">
            {payoutDetails?.data.map((item, idx) => {
              return (
                <div
                  className={`flex h-[152px] w-full flex-col justify-between rounded-lg p-3 md:w-[283px] ${item.is_default == 1 ? 'border-2 border-[#6B7280]' : 'border border-[#EAECEF]'}`}
                >
                  <div className="flex justify-between">
                    <h3 className="capitalize">{item.bank_name}</h3>
                    {payoutDetails?.data.length > 1 && (
                      <Image
                        src="/assets/delete-red.svg"
                        width="18"
                        height="18"
                        alt="delete icon"
                        className="cursor-pointer"
                        onClick={() => {
                          setPayoutDetailId(item.id)
                          setShowDeleteModal(true)
                        }}
                      />
                    )}
                  </div>
                  <p>{item.account_number}</p>

                  <div className="flex items-center justify-between gap-4">
                    <CustomButton
                      type="button"
                      className="h-[33px] rounded-[5px] bg-[#6B7280] text-[11px] font-medium text-white"
                      onClick={() => handleActivatePayoutDetail(item.id)}
                    >
                      {loadingStates[item.id] ? <Spinner /> : 'Use'}
                    </CustomButton>
                    <CustomButton
                      type="button"
                      className="h-[33px] rounded-[5px] bg-[#6B7280] text-[11px] font-medium text-white"
                      onClick={() => {
                        setPayoutDetailId(item.id)
                        setFieldValue('bank_name', item.bank_name)
                        setFieldValue('account_number', item.account_number)
                        setFieldValue('account_name', item.account_name)
                        setFieldValue('bank_code', item.bank_code)
                        setFieldValue('sort_code', item.sort_code)
                        setFieldValue('iban', item.iban)
                        setFieldValue('institution_number', item.institution_number)
                        setFieldValue('transit_number', item.transit_number)
                        setFieldValue('interac_information', item.interac_information)
                        setFieldValue('zelle_information', item.zelle_information)

                        window.scrollTo({top: 0, behavior: 'smooth'}) // Scroll to the top for better UX
                      }}
                    >
                      Edit
                    </CustomButton>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Delete Shipping Method Modal */}
      {isDesktop && showDeleteModal && (
        <PlannerModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          maskCloseable={true}
          onCloseModal={() => {
            setShowDeleteModal(false)
          }}
          width={400}
        >
          <DeleteCard
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeletePayoutDetail}
            isLoading={deleting}
            message={`Are you sure you want to delete this payout information ?`}
          />
        </PlannerModal>
      )}

      {!isDesktop && showDeleteModal && (
        <DrawerContainer open={showDeleteModal} onClose={() => setShowDeleteModal(false)} height={300}>
          <DeleteCard
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeletePayoutDetail}
            isLoading={deleting}
            message={`Are you sure you want to delete this payout information ?`}
          />
        </DrawerContainer>
      )}
    </div>
  )
}

export default PayoutInformation
