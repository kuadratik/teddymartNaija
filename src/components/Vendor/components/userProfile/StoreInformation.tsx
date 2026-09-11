import {StoreInformationSchema} from '@/components/Auth/Signup/utils/schema'
import useUpdateStoreInformation from '@/components/Profile/hooks/useUpdateStoreInformation'
import {VendorStoreInformationType} from '@/components/Profile/utils'
import CountryInput from '@/components/SharedUI/Input/CountryInput'
import StateInput from '@/components/SharedUI/Input/StateInput'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Button, Form} from 'antd'
import {useFormik} from 'formik'
import React from 'react'

const UserProfileStoreInformation = () => {
  // * mutation
  const {updateVendorProfileHandler, isLoading} = useUpdateStoreInformation()

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const initialValues = {
    name: isActiveUser?.name ?? '',
    description: isActiveUser?.description ?? '',
    contact_number: isActiveUser?.contact_number ?? '',
    whatsapp_number: isActiveUser?.whatsapp_number ?? '',
    address1: isActiveUser?.address1 ?? '',
    address2: isActiveUser?.address2 ?? '',
    state: isActiveUser?.state ?? undefined,
    city: isActiveUser?.city ?? '',
    postal_code: isActiveUser?.postal_code ?? '',
    country: isActiveUser?.country_id ?? undefined
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
  } = useFormik<VendorStoreInformationType>({
    initialValues: initialValues,
    validationSchema: StoreInformationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      updateVendorProfileHandler(
        {
          ...val,
          slug: isActiveUser?.slug,
          banner_path: isActiveUser?.banner_path,
          profile_picture_path: isActiveUser?.profile_picture_path
        },
        resetForm
      )
    }
  })

  return (
    <div>
      <TextComponent as="p" className="border-b-2 border-gray-200 pb-2 text-[20px] font-semibold text-black">
        Edit Store Information
      </TextComponent>

      <Form onFinish={handleSubmit} className="mt-[24px]">
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TextInput
              className={`border-[1px] ${errors.name ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.name ? errors.name : ''}
              value={values.name ?? ''}
              placeholder="Store Name"
              onChange={e => {
                if (e.target.value.length <= 50) {
                  handleChange(e)
                }
              }}
              name={'name'}
              type={'text'}
              labelClassName="!text-black"
              title={'Store Name*'}
            />
            <TextAreaInput
              labelClassName="!text-black"
              className={`border-[1px] ${errors.description ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.description ? errors.description : ''}
              value={values.description}
              title={'Store Description*'}
              maxLength={200}
              onChange={handleChange}
              name={'description'}
              row={4}
              placeholder={''}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <PhoneInputWithCountry
              backgroundColor="#F5F5F5"
              className={`border-[1px] ${errors.contact_number ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              errorMessage={errors.contact_number ? errors.contact_number : ''}
              title="Store Contact Number*"
              inputProps={{
                name: 'contact_number',
                id: 'contact_number'
              }}
              placeholder={''}
              disabled={false}
              fontSize={14}
              color={'#3D3D3D'}
              value={values.contact_number}
              onChange={e => {
                setFieldValue('contact_number', e)
              }}
            />
            <PhoneInputWithCountry
              backgroundColor="#F5F5F5"
              className={`border-[1px] ${errors.whatsapp_number ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              errorMessage={errors.whatsapp_number ? errors.whatsapp_number : ''}
              title="WhatsApp Number*"
              inputProps={{
                name: 'whatsapp_number',
                id: 'whatsapp_number'
              }}
              placeholder={''}
              disabled={false}
              fontSize={14}
              color={'#3D3D3D'}
              value={values.whatsapp_number}
              onChange={e => {
                setFieldValue('whatsapp_number', e)
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            {' '}
            <TextInput
              className={`border-[1px] ${errors.address1 ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              placeholder="Store Address 1"
              errorMessage={errors.address1 ? errors.address1 : ''}
              value={values.address1}
              onChange={handleChange}
              name={'address1'}
              labelClassName="!text-black"
              type={'text'}
              title={'Store Address 1*'}
            />{' '}
            <TextInput
              title={'Store Address 2'}
              className={`border-[1px] ${errors.address2 ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              placeholder="Store Address 2"
              errorMessage={errors.address2 ? errors.address2 : ''}
              value={values.address2}
              onChange={handleChange}
              name={'address2'}
              labelClassName="!text-black"
              type={'text'}
            />
          </div>

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
            <TextInput
              title="Postal Code"
              className={`border-[1px] ${errors.postal_code ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              placeholder="Postal Code"
              errorMessage={errors.postal_code ? errors.postal_code : ''}
              value={values.postal_code}
              onChange={handleChange}
              name={'postal_code'}
              type={'text'}
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

export default UserProfileStoreInformation
