import CountryInput from '@/components/SharedUI/Input/CountryInput'
import StateInput from '@/components/SharedUI/Input/StateInput'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Tooltip} from 'antd'
import {twMerge} from 'tailwind-merge'
import {VendorOnboardingProps} from '../utils'

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
          title="Store Name*"
          errorMessage={errors.name ? errors.name : ''}
          value={values.name ?? ''}
          placeholder=""
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
        <div className="">
          <PhoneInputWithCountry
            errorMessage={errors.contact_number ? errors.contact_number : ''}
            title="Store Contact Number*"
            inputProps={{name: 'contact_number', id: 'contact_number'}}
            placeholder={''}
            disabled={false}
            fontSize={14}
            color={'#3D3D3D'}
            value={values.contact_number}
            onChange={e => {
              setFieldValue('contact_number', e)
            }}
          />
        </div>
        <PhoneInputWithCountry
          errorMessage={errors.whatsapp_number ? errors.whatsapp_number : ''}
          title="WhatsApp Number*"
          inputProps={{name: 'whatsapp_number', id: 'whatsapp_number'}}
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
          title="Store Address 1*"
          placeholder=""
          errorMessage={errors.address1 ? errors.address1 : ''}
          value={values.address1}
          onChange={handleChange}
          name={'address1'}
          type={'text'}
        />{' '}
        <TextInput
          title="Store Address 2"
          placeholder=""
          errorMessage={errors.address2 ? errors.address2 : ''}
          value={values.address2}
          onChange={handleChange}
          name={'address2'}
          type={'text'}
        />
        <div className={`pb-1`}>
          <Tooltip
            title={
              <p className="font-[500] text-black">
                The selected country determines your store's currency and cannot be changed later. You can choose a
                different country when creating a new store.
              </p>
            }
            placement="topLeft"
            color="white"
            className="flex items-center gap-1"
          >
            <label className={twMerge('text-sm font-[500] capitalize text-[#33373d]')}>Country</label>
            <span className="flex items-center justify-between">
              <Icon className="relative top-[1px]" icon="material-symbols:info-outline" />*
            </span>
          </Tooltip>
          <CountryInput
            placeholder={''}
            errorMessage={errors.country ? errors.country : ''}
            value={values?.country ?? undefined}
            onChange={value => {
              setFieldValue('country', value)
            }}
          />
        </div>
        <div className={`pb-1`}>
          <Tooltip
            title={
              <p className="font-[500] text-black">
                The selected state/province determines your store's currency and cannot be changed later. You can choose
                a different state/province when creating a new store.
              </p>
            }
            placement="topLeft"
            color="white"
            className="flex items-center gap-1"
          >
            <label className={twMerge('text-sm font-[500] capitalize text-[#33373d]')}>State/Province*</label>
            <span className="flex items-center justify-between">
              <Icon className="relative top-[1px]" icon="material-symbols:info-outline" />*
            </span>
          </Tooltip>
          <StateInput
            errorMessage={errors.state ? errors.state : ''}
            countryId={values.country}
            value={values.state ?? undefined}
            onChange={value => {
              setFieldValue('state', value)
            }}
            placeholder=""
          />
        </div>
        <TextInput
          title="City*"
          placeholder=""
          errorMessage={errors.city ? errors.city : ''}
          value={values.city}
          onChange={handleChange}
          name={'city'}
          type={'text'}
        />
        <TextInput
          title="Postal Code"
          placeholder=""
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
