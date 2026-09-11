import useUpdateProfile from '@/components/Profile/hooks/useUpdateProfile'
import {VendorPayoutType, VendorPersonalType} from '@/components/Profile/utils'
import {vendorPayoutValidationSchema, vendorPersonalInfoValidationSchema} from '@/components/Profile/utils/schema'
import TextInput from '@/components/SharedUI/Input/TextInput'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Button, Form, Input} from 'antd'
import {useFormik} from 'formik'
import React from 'react'

const PayoutPage = () => {
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const initialValues = {
    bank: '',
    account_name: '',
    account_number: '',
    bank_code: '',
    swift_code: '',
    iban: '',
    institution_no: '',
    transit_number: ''
  }

  // * mutation
  const {updateVendorProfileHandler, isLoading} = useUpdateProfile()

  const {values, handleChange, handleSubmit, touched, resetForm, errors, setFieldValue, setErrors} =
    useFormik<VendorPayoutType>({
      initialValues: initialValues,
      validationSchema: vendorPayoutValidationSchema,
      validateOnMount: false,
      validateOnBlur: false,
      validateOnChange: false,
      enableReinitialize: true,
      onSubmit(values: any) {
        updateVendorProfileHandler(values, resetForm)
      }
    })

  return (
    <div>
      <TextComponent as="p" className="border-b-2 border-gray-200 pb-2 text-[20px] font-semibold text-black">
        Payout Information{' '}
      </TextComponent>

      <Form onFinish={handleSubmit} className="mt-[24px]">
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TextInput
              className={`border-[1px] ${errors.bank ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.bank ? errors.bank : ''}
              placeholder=""
              title="Bank"
              value={values.bank}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'bank'}
              type={'text'}
            />
            <TextInput
              className={`border-[1px] ${errors.account_name ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              title="Account Name"
              errorMessage={errors.account_name ? errors.account_name : ''}
              placeholder=""
              value={values.account_name}
              onChange={handleChange}
              name={'account_name'}
              type={'text'}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TextInput
              errorMessage={errors.account_number ? errors.account_number : ''}
              placeholder=""
              title="Account Number"
              value={values.account_number}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'account_number'}
              type={'text'}
              className={`border-[1px] ${errors.account_number ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            />
            <TextInput
              className={`border-[1px] ${errors.bank_code ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.bank_code ? errors.bank_code : ''}
              placeholder=""
              title="Bank Code"
              value={values.bank_code}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'bank_code'}
              type={'text'}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TextInput
              className={`border-[1px] ${errors.swift_code ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.swift_code ? errors.swift_code : ''}
              placeholder=""
              title="Swift Code"
              value={values.swift_code}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'swift_code'}
              type={'text'}
            />
            <TextInput
              className={`border-[1px] ${errors.iban ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.iban ? errors.iban : ''}
              placeholder=""
              title="IBAN"
              value={values.iban}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'iban'}
              type={'text'}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TextInput
              className={`border-[1px] ${errors.institution_no ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.institution_no ? errors.institution_no : ''}
              placeholder=""
              title="Institution Number"
              value={values.institution_no}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'institution_no'}
              type={'text'}
            />
            <TextInput
              errorMessage={errors.transit_number ? errors.transit_number : ''}
              placeholder=""
              title="Transit Number"
              value={values.transit_number}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'transit_number'}
              type={'text'}
              className={`border-[1px] ${errors.transit_number ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            />
          </div>
        </div>
        <div className="mt-[34px]">
          {' '}
          <Button htmlType="submit" type="primary" className="whitespace-nowrap bg-black px-7 py-[22px] text-white">
            {isLoading ? (
              <span className="!w-full px-7">
                {' '}
                <Spinner className="h-2 w-2" />
              </span>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PayoutPage
