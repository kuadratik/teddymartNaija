import React from 'react'
import {VendorOnboardingProps} from '../utils'
import TextComponent from '@/components/SharedUI/TextComponent'
import TextInput from '@/components/SharedUI/Input/TextInput'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import CountryInput from '@/components/SharedUI/Input/CountryInput'
import StateInput from '@/components/SharedUI/Input/StateInput'

const StoreInformation = (props: VendorOnboardingProps) => {
  const {handleChange, title_header, values, touched, errors, setFieldValue} = props
  return (
    <div className="mb-[80px]">
      {title_header && (
        <div className="mt-[50px]">
          <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
            Tell us about your store{' '}
          </TextComponent>
        </div>
      )}

      <div className={`${title_header ? 'mt-[24px]' : ''} flex w-full flex-col gap-6`}>
        <TextInput
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
        />
        <TextAreaInput
          errorMessage={errors.description ? errors.description : ''}
          value={values.description}
          title={'Store Description*'}
          maxLength={200}
          onChange={handleChange}
          name={'description'}
          row={4}
          placeholder={''}
        />
        <PhoneInputWithCountry
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
        <TextInput
          placeholder="Store Address 1"
          errorMessage={errors.address1 ? errors.address1 : ''}
          value={values.address1}
          onChange={handleChange}
          name={'address1'}
          type={'text'}
        />{' '}
        <TextInput
          placeholder="Store Address 2"
          errorMessage={errors.address2 ? errors.address2 : ''}
          value={values.address2}
          onChange={handleChange}
          name={'address2'}
          type={'text'}
        />
        <CountryInput
          placeholder={'Country'}
          errorMessage={errors.country ? errors.country : ''}
          value={values?.country ?? undefined}
          onChange={value => {
            setFieldValue('country', value)
          }}
        />
        <StateInput
          errorMessage={errors.state ? errors.state : ''}
          countryId={values.country}
          value={values.state ?? undefined}
          onChange={value => {
            setFieldValue('state', value)
          }}
          placeholder="State/Province"
        />
        <TextInput
          placeholder="City"
          errorMessage={errors.city ? errors.city : ''}
          value={values.city}
          onChange={handleChange}
          name={'city'}
          type={'text'}
        />
        <TextInput
          placeholder="Postal Code"
          errorMessage={errors.postal_code ? errors.postal_code : ''}
          value={values.postal_code}
          onChange={handleChange}
          name={'postal_code'}
          type={'text'}
        />
      </div>
    </div>
  )
}

export default StoreInformation
