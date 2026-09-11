import {useAppSelector} from '@/hooks/reduxHooks'
import {useFormik} from 'formik'
import React from 'react'
import {ShippingAddressSchema} from './utils/schema'
import TextInput from '../SharedUI/Input/TextInput'
import StateInput from '../SharedUI/Input/StateInput'
import CountryInput from '../SharedUI/Input/CountryInput'

const AddShippingComponent = () => {
  const user = useAppSelector(state => state.auth.user) // get authenticated user

  const initialValues = {
    address: '',
    state: undefined,
    city: '',
    country: undefined
  }

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    handleChange,
    resetForm,
    touched
    // setFieldError,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ShippingAddressSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      console.log(val)
    }
  })

  return (
    <div className="flex flex-col gap-[40px]">
      <h2 className="text-[20px] font-semibold leading-[26px] text-[#6B7280]">Delivery Address</h2>
      <div className="flex flex-col gap-[27px]">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className="text-sm capitalize !text-black">Country*</label>
            </div>{' '}
            <CountryInput
              placeholder={'Country'}
              errorMessage={errors.country ? errors.country : ''}
              className={`border-[1px] ${errors.country ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              value={values?.country ?? undefined}
              onChange={value => {
                setFieldValue('country', value)
              }}
            />
          </div>
          <div className="w-full">
            {' '}
            <div className={`pb-1`}>
              <label className="text-sm capitalize !text-black">State*</label>
            </div>{' '}
            <StateInput
              className={`border-[1px] ${errors.state ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.state ? errors.state : ''}
              //   @ts-ignore
              countryId={values.country}
              value={values.state ?? undefined}
              onChange={value => {
                setFieldValue('state', value)
              }}
              placeholder="State/Province"
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            {' '}
            <TextInput
              title="City*"
              className={`border-[1px] ${errors.city ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              placeholder="City"
              errorMessage={errors.city ? errors.city : ''}
              value={values.city}
              onChange={handleChange}
              name={'city'}
              type={'text'}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row">
          {' '}
          <TextInput
            className={`border-[1px] ${errors.address ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            placeholder=""
            errorMessage={errors.address ? errors.address : ''}
            value={values.address}
            onChange={handleChange}
            name={'address'}
            labelClassName="!text-black"
            type={'text'}
            title={'Address*'}
          />{' '}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="saveAddress"
            name="saveAddress"
            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="saveAddress" className="text-sm text-gray-700">
            Save Address for later
          </label>
        </div>
      </div>
    </div>
  )
}

export default AddShippingComponent
