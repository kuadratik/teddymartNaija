import CountryInput from '@/components/SharedUI/Input/CountryInput'
import CheckboxMultipleSelect from '@/components/SharedUI/Input/CheckboxMultipleSelect'
import StateInput from '@/components/SharedUI/Input/StateInput'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import ProgressBar from '@/components/SharedUI/ProgressBar'
import TextComponent from '@/components/SharedUI/TextComponent'
import { useAppSelector } from '@/hooks/reduxHooks'
import { useGetAllCategoriesQuery } from '@/services/category/category'
import { Icon } from '@iconify/react'
import { Tooltip } from 'antd'
import { twMerge } from 'tailwind-merge'
import { VendorOnboardingProps } from '../utils'

const StoreInformation = (props: VendorOnboardingProps) => {
  const { handleChange, title_header, values, touched, errors, setFieldValue } = props

  // Get user type to determine which categories to fetch
  const isActiveUser = useAppSelector(state => state.auth.activeUser)
  const userType = values.offers_product && values.offers_service
    ? 'both'
    : values.offers_product
      ? 'product'
      : values.offers_service
        ? 'service'
        : 'product'

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery({
    type: userType
  })

  return (
    <div className="mb-[80px]">
      {title_header && (
        <div className="mt-[50px]">
          <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
            Tell us about your store{' '}
          </TextComponent>
          <div className="mt-6">
            <ProgressBar currentStep={1} totalSteps={3} />
          </div>
        </div>
      )}

      <div className={`${title_header ? 'mt-[24px]' : ''} flex w-full flex-col gap-6`}>
        <TextInput
          title="Store Name*"
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

        <div className="w-full">
          <div className="pb-1">
            <label className="text-sm font-[500] capitalize text-[#33373d]">Category*</label>
          </div>
          <CheckboxMultipleSelect
            className={`border-[1px] ${errors.category ? 'border-red-600' : 'border-gray-200'}`}
            backgroundColor="#FFFFFF"
            placeholder="Fashion & Apparel, Beauty & Personal Care... +2"
            value={values.category}
            onChange={(value) => {
              setFieldValue('category', value)
            }}
            options={
              categoriesData?.data?.map((category: any) => ({
                label: category.name,
                value: category.id
              })) || []
            }
            size="large"
            maxTagCount="responsive"
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

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

        <div className="flex w-full flex-col gap-6 md:flex-row">
          <div className="w-full">
            <PhoneInputWithCountry
              errorMessage={errors.contact_number ? errors.contact_number : ''}
              title="Store Contact Number*"
              inputProps={{ name: 'contact_number', id: 'contact_number' }}
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
          <div className="w-full">
            <PhoneInputWithCountry
              errorMessage={errors.whatsapp_number ? errors.whatsapp_number : ''}
              title="WhatsApp Number*"
              inputProps={{ name: 'whatsapp_number', id: 'whatsapp_number' }}
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
        </div>

        <div className="flex w-full flex-col gap-6 md:flex-row">
          <div className="w-full">
            <TextInput
              title="Store Address*"
              placeholder="Store Address 1"
              errorMessage={errors.address1 ? errors.address1 : ''}
              value={values.address1}
              onChange={handleChange}
              name={'address1'}
              type={'text'}
            />
          </div>
          <div className="w-full">
            <TextInput
              title="Store Address"
              placeholder="Store Address 2"
              errorMessage={errors.address2 ? errors.address2 : ''}
              value={values.address2}
              onChange={handleChange}
              name={'address2'}
              type={'text'}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 md:flex-row">
          <div className="w-full">
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
                <label className={twMerge('text-sm font-[500] capitalize text-[#33373d]')}>Country*</label>
                <span className="flex items-center justify-between">
                  <Icon className="relative top-[1px]" icon="material-symbols:info-outline" />
                </span>
              </Tooltip>
              <CountryInput
                placeholder={'Select Country'}
                errorMessage={errors.country ? errors.country : ''}
                value={values?.country ?? undefined}
                onChange={value => {
                  setFieldValue('country', value)
                }}
              />
            </div>
          </div>
          <div className="w-full">
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
                  <Icon className="relative top-[1px]" icon="material-symbols:info-outline" />
                </span>
              </Tooltip>
              <StateInput
                errorMessage={errors.state ? errors.state : ''}
                countryId={values.country}
                value={values.state ?? undefined}
                onChange={value => {
                  setFieldValue('state', value)
                }}
                placeholder="select state/province"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 md:flex-row">
          <div className="w-full">
            <TextInput
              title="City*"
              placeholder=""
              errorMessage={errors.city ? errors.city : ''}
              value={values.city}
              onChange={handleChange}
              name={'city'}
              type={'text'}
            />
          </div>
          <div className="w-full">
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
      </div>
    </div>
  )
}

export default StoreInformation