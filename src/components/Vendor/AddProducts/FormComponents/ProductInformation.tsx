import DatePickerComponent from '@/components/SharedUI/DateAndTime/DatePicker'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useAppSelector} from '@/hooks/reduxHooks'
import {StyledContentWrapper} from '@/pages/ads-gallery/[id]'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {CategoryListType} from '@/types/types'
import {amountFormatter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Collapse, Form, Input, Select, Tooltip} from 'antd'
import dayjs from 'dayjs'
import {FormikErrors, FormikTouched} from 'formik'
import React from 'react'
import CurrencyInput from 'react-currency-input-field'
import {BulkUploadProductType, getIcon} from '../../utils'
import {FormFieldTitle, FormFieldWrapper} from '../BulkUploadForm'

type IProdustInformationProps = {
  touched: FormikTouched<BulkUploadProductType>
  errors: FormikErrors<BulkUploadProductType>
  values: BulkUploadProductType
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<BulkUploadProductType>>
  handleChange: {
    (e: React.ChangeEvent<any>): void
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void
  }
}

const {Panel} = Collapse

const {TextArea} = Input

const {Option} = Select

const ProductInformation = ({touched, errors, values, setFieldValue, handleChange}: IProdustInformationProps) => {
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {data, isLoading} = useGetAllCategoriesQuery({
    type: 'product'
  })

  const allCategories = [
    ...(data?.data || []).map((category: CategoryListType) => ({
      label: category.name,
      value: category.id
    }))
  ]

  const handleProductPriceChange = (value: string) => {
    const productPrice = parseFloat(value.replace(/,/g, '')) || 0 // Parse and handle invalid values

    // Calculate Display Price without discount
    const displayPriceWithoutDiscount = productPrice + 0.1 * productPrice

    // Calculate Discounted Price if a discount exists
    const discount = parseFloat(values.discount.replace(/,/g, '')) || 0
    const discountAmount = (discount / 100) * productPrice
    const discountedPrice = productPrice - discountAmount

    // Calculate Display Price with discount
    const displayPriceWithDiscount = discountedPrice + 0.1 * discountedPrice

    setFieldValue('price', productPrice.toString())
    setFieldValue('display_price', discount > 0 ? displayPriceWithDiscount : displayPriceWithoutDiscount)

    if (discount > 0) {
      setFieldValue('discounted_price', discountedPrice)
    }
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value.replace(/,/g, '')) || 0 // Parse and handle invalid values

    // Get the current Product Price
    const productPrice = parseFloat(values.price.replace(/,/g, '')) || 0

    // Calculate Discounted Price
    const discountAmount = (discount / 100) * productPrice
    const discountedPrice = productPrice - discountAmount

    // Calculate Display Price with discount
    const displayPriceWithDiscount = discountedPrice + 0.1 * discountedPrice

    setFieldValue('discount', discount)
    setFieldValue('display_price', displayPriceWithDiscount)

    if (discount > 0) {
      setFieldValue('discounted_price', discountedPrice)
    } else {
      setFieldValue('discounted_price', '')
    }
  }

  return (
    <StyledContentWrapper className="">
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="right"
        collapsible="icon"
        className="space-y-2 !border-none bg-transparent"
      >
        <Panel
          header={<p className="text-[20px] font-bold text-[#6B7280]">Product Information</p>}
          key="1"
          className=" "
        >
          <FormFieldWrapper className="gap-7">
            <Form.Item label={<FormFieldTitle>Category*</FormFieldTitle>} className="!w-full !rounded">
              <div className="w-full rounded border">
                <SelectInput
                  placeholder="select"
                  data={allCategories}
                  value={values.category ? allCategories.find(cat => cat.value === values.category)?.value : null}
                  onChange={e => {
                    setFieldValue('category', e)
                  }}
                  disabled={false}
                  notFoundContent={'Category not found'}
                  errorMessage={typeof errors.category === 'string' ? errors.category : ''}
                  className="flex h-[54px] items-center !rounded-[4px] bg-white"
                />
              </div>
            </Form.Item>

            <Form.Item className="!w-full" label={<FormFieldTitle>Product Name*</FormFieldTitle>}>
              <TextInput
                placeholder={``}
                onChange={e => {
                  if (e.target.value.length <= 75) {
                    handleChange(e)
                  }
                }}
                name={'name'}
                type={'text'}
                className="h-[54px] rounded bg-white"
                value={values.name}
                errorMessage={errors && errors.name ? errors.name : ''}
              />
            </Form.Item>

            <Form.Item label={<FormFieldTitle>Quantity*</FormFieldTitle>} className="!w-full">
              <TextInput
                placeholder={``}
                onChange={e => {
                  const value = e.target.value

                  // check if the number is greater than or equal to 5

                  if (value === '' || /^[0-9]+\.?([0-9]+)?$/.test(value)) {
                    handleChange(e)
                  }

                  // if (parseInt(value) < 5) {
                  //   setFieldValue('quantity', '5')
                  // }
                }}
                className="h-[54px] rounded"
                name={'quantity'}
                type={'text'}
                value={values.quantity}
                errorMessage={errors && errors.quantity ? errors.quantity : ''}
              />
            </Form.Item>
          </FormFieldWrapper>
          <FormFieldWrapper className="gap-7">
            <Form.Item
              className="lg:!w-[50%]"
              label={<FormFieldTitle>Full Description* {`${values.description?.length}/500`}</FormFieldTitle>}
            >
              <TextAreaInput
                placeholder={''}
                maxLength={500}
                onChange={handleChange}
                name={'description'}
                row={5}
                className="rounded bg-white"
                value={values.description}
                errorMessage={errors && errors.description ? errors.description : ''}
                showMaxLength={false}
              />
            </Form.Item>
            <Form.Item
              className="lg:!w-[50%]"
              label={
                <FormFieldTitle>
                  Additional Description {`${values.additional_information?.length || 0}/1000`}
                </FormFieldTitle>
              }
            >
              <TextAreaInput
                placeholder={''}
                maxLength={1000}
                onChange={handleChange}
                name={'additional_information'}
                row={5}
                className="rounded bg-white"
                value={values.additional_information}
                showMaxLength={false}
              />
            </Form.Item>
          </FormFieldWrapper>
          <FormFieldWrapper className="gap-7">
            <Form.Item
              className="!w-full"
              label={
                <Tooltip title={<p className="text-black font-[500]">{'Applicable fees will appear in the display price, consider moderate pricing'}</p>} color="white">
                  <FormFieldTitle>
                    <div className="flex items-center justify-between gap-2">
                      Product Price{' '}
                      <span className="flex items-center justify-between">
                        <Icon className="relative top-[1px]" icon="material-symbols:info-outline" />*
                      </span>
                    </div>{' '}
                  </FormFieldTitle>
                </Tooltip>
              }
            >
              <CurrencyInput
                id={'price'}
                name={'price'}
                placeholder={''}
                className={`w-full rounded border ${errors && errors.price ? 'border-red-600' : 'border-gray-300'} h-[54px] bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`}
                value={values.price}
                decimalsLimit={2}
                onValueChange={(value: string | undefined, name?: string) => {
                  handleProductPriceChange(value || '')
                }}
                disabled={false}
                // required={required}
                groupSeparator=","
                maxLength={7}
                max={7}
              />
              {/* <Input
                size="large"
                prefix={
                  <div className="mr-2 flex h-full w-[61px] items-center justify-center bg-[#F3F3F3]">
                    <Icon icon={getIcon(selectedLanguage?.value)} className="text-[18px]" />
                  </div>
                }
                type="text"
                name={'price'}
                placeholder=""
                onChange={e => {
                  handleProductPriceChange(e)
                }}
                value={values.price}
                className="h-[54px] overflow-hidden rounded p-0"
              /> */}
              <p className="flex flex-col gap-1 text-xs text-red-600">{errors && errors.price ? errors.price : ''}</p>
            </Form.Item>
            <Form.Item className="!w-full" label={<FormFieldTitle>Discount</FormFieldTitle>}>
              <Input
                prefix={
                  <div className="mr-2 flex h-full w-[61px] items-center justify-center bg-[#F3F3F3]">
                    <span className="text-[16px]">%</span>
                  </div>
                }
                size="large"
                type="text"
                name={'discount'}
                placeholder=""
                onChange={e => {
                  handleDiscountChange(e)
                }}
                value={values.discount}
                className="h-[54px] overflow-hidden rounded p-0"
              />
            </Form.Item>
            <Form.Item
              label={<FormFieldTitle>Display Price</FormFieldTitle>}
              className="!w-full"
              help={touched.display_price && errors.display_price ? errors.display_price : ''}
              validateStatus={touched.display_price && errors.display_price ? 'error' : undefined}
            >
              <Input
                prefix={
                  <div className="mr-2 flex h-full w-[61px] items-center justify-center">
                    <Icon icon={getIcon(selectedLanguage?.value)} className="text-[18px]" />
                  </div>
                }
                size="large"
                type="text"
                disabled
                name={'display_price'}
                placeholder=""
                onChange={handleChange}
                value={(values.display_price && amountFormatter(Number(values.display_price))) || ''}
                className="h-[54px] rounded p-0"
              />
            </Form.Item>

            <Form.Item
              label={<FormFieldTitle>Discounted Price</FormFieldTitle>}
              className="!w-full"
              help={touched.discounted_price && errors.discounted_price ? errors.discounted_price : ''}
              validateStatus={touched.discounted_price && errors.discounted_price ? 'error' : undefined}
            >
              <Input
                prefix={
                  <div className="mr-2 flex h-full w-[61px] items-center justify-center">
                    <Icon icon={getIcon(selectedLanguage?.value)} className="text-[18px]" />
                  </div>
                }
                size="large"
                type="text"
                disabled
                name={'discounted_price'}
                placeholder=""
                onChange={handleChange}
                value={(values.discounted_price && amountFormatter(Number(values.discounted_price))) || ''}
                className="h-[54px] rounded p-0"
              />
            </Form.Item>
          </FormFieldWrapper>
          <FormFieldWrapper className="gap-7">
            <Form.Item className="!w-full" label={<FormFieldTitle>Discount Start Date</FormFieldTitle>}>
              <DatePickerComponent
                prefix={
                  <div className="mr-2 flex h-[54px] w-[61px] items-center justify-center bg-[#F3F3F3]">
                    <Icon icon="lets-icons:date-today-duotone" className="text-[24px]" />
                  </div>
                }
                name={'discount_start_date'}
                placeholder="Select Date"
                onChange={(date: any, dateString: any) => {
                  setFieldValue('discount_start_date', dateString)
                }}
                value={values.discount_start_date ? dayjs(values.discount_start_date, 'YYYY-MM-DD') : null}
                className="h-[54px] overflow-hidden rounded bg-white p-0 text-sm font-medium !text-black placeholder:text-sm placeholder:font-medium placeholder:!text-black"
                errorMessage=""
                allowClear
                size="large"
                disabled={values.discount === ''}
              />
            </Form.Item>
            <Form.Item className="!w-full" label={<FormFieldTitle>Discount End Date</FormFieldTitle>}>
              <DatePickerComponent
                prefix={
                  <div className="mr-2 flex h-[54px] w-[61px] items-center justify-center bg-[#F3F3F3]">
                    <Icon icon="lets-icons:date-today-duotone" className="text-[24px]" />
                  </div>
                }
                name={'discount_end_date'}
                placeholder="Select Date"
                onChange={(date: any, dateString: any) => {
                  setFieldValue('discount_end_date', dateString)
                }}
                value={values.discount_end_date ? dayjs(values.discount_end_date, 'YYYY-MM-DD') : null}
                className="h-[54px] overflow-hidden rounded bg-white p-0 text-sm font-medium !text-black placeholder:text-sm placeholder:font-medium placeholder:!text-black"
                errorMessage=""
                allowClear
                size="large"
                disabled={values.discount === '' || values.discount_start_date === ''}
                disabledDate={(current: any) => {
                  // Can not select days before today and the start date
                  return current && current < dayjs(values.discount_start_date, 'YYYY-MM-DD')
                }}
              />
            </Form.Item>
          </FormFieldWrapper>
        </Panel>
      </Collapse>
    </StyledContentWrapper>
  )
}

export default ProductInformation
