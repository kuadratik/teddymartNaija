import DatePickerComponent from '@/components/SharedUI/DateAndTime/DatePicker'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {getOnlyCurrencyFormatter} from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {StyledContentWrapper} from '@/pages/ads-gallery/[id]'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {CategoryListType} from '@/types/types'
import {amountFormatter, getPlainTextLength} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Collapse, Form, Input, Select, Tooltip} from 'antd'
import dayjs from 'dayjs'
import {FormikErrors, FormikTouched} from 'formik'
import React, {useEffect} from 'react'
import CurrencyInput from 'react-currency-input-field'
import {useQuill} from 'react-quilljs'
import errorToastIcon from '../../../../../public/assets/error-toast-icon.svg'
import {BulkUploadProductType} from '../../utils'
import {FormFieldTitle, FormFieldWrapper} from '../BulkUploadForm'

// Custom QuillEditor component
const QuillEditor = ({
  value,
  onChange,
  maxLength,
  errorMessage,
  name
}: {
  value: string
  onChange: (value: string, name: string) => void
  maxLength: number
  errorMessage?: string
  name: string
}) => {
  const {quill, quillRef} = useQuill({
    modules: {
      toolbar: [['bold', 'italic', 'underline'], [{list: 'ordered'}, {list: 'bullet'}], ['clean']]
    },
    placeholder: ''
  })

  // Function to check if Quill content is essentially empty
  const isQuillEmpty = (html: string) => {
    if (!html || html === '') return true
    // Check for empty paragraph with just a break
    const emptyPatterns = ['<p><br></p>', '<p></p>']
    return emptyPatterns.includes(html.trim())
  }

  // Function to enforce character limit and prevent extra characters
  const enforceCharacterLimit = () => {
    if (!quill) return

    // Get plain text without HTML tags
    const text = quill.getText().trim()

    // If text exceeds maxLength
    if (text.length > maxLength) {
      // Save selection before modifications
      const selection = quill.getSelection()

      // Disable the text-change event temporarily to prevent infinite loop
      quill.off('text-change')

      // Calculate how many chars to delete
      const deleteCount = text.length - maxLength

      // Get the position where to truncate
      if (deleteCount > 0) {
        // Delete the excess characters from the end of the selection
        const currentPosition = selection ? selection.index : text.length

        // If the cursor is at the end of excess content, move it back
        if (selection && selection.index > maxLength) {
          // Delete from the cursor position
          quill.deleteText(maxLength, currentPosition)
        } else {
          // Delete from the end
          quill.deleteText(text.length - deleteCount, text.length)
        }
      }

      // Re-enable the text-change event
      quill.on('text-change', enforceCharacterLimit)

      // Check if content is empty and pass empty string instead of empty HTML tags
      const html = quill.root.innerHTML
      onChange(isQuillEmpty(html) ? '' : html, name)
    } else {
      // If within limits, check if content is empty and pass empty string instead of empty HTML tags
      const html = quill.root.innerHTML
      onChange(isQuillEmpty(html) ? '' : html, name)
    }
  }

  useEffect(() => {
    if (quill) {
      // Use the reusable function for text changes
      quill.on('text-change', enforceCharacterLimit)

      // Set initial content if value exists and is not empty
      if (value && quill.root.innerHTML !== value) {
        quill.root.innerHTML = value
      }
    }

    // Cleanup
    return () => {
      if (quill) {
        quill.off('text-change', enforceCharacterLimit)
      }
    }
  }, [quill, value, onChange, maxLength, name])

  return (
    <div className="quill-editor-container">
      <div
        className="max-h-[150px] min-h-[150px] overflow-auto rounded-b-md bg-white"
        ref={quillRef}
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          className="ql-container"
          style={{
            flex: '1',
            overflowY: 'auto'
          }}
        />
      </div>
      {errorMessage && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}
    </div>
  )
}

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
  isActiveUser: any
}

const {Panel} = Collapse

const {TextArea} = Input

const {Option} = Select

const ProductInformation = ({
  touched,
  errors,
  values,
  setFieldValue,
  handleChange,
  isActiveUser
}: IProdustInformationProps) => {
  console.log('🚀 ~ values:', getOnlyCurrencyFormatter(isActiveUser?.currency) === '₦')
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

  // Add helper function to determine minimum price based on currency
  const getMinimumPriceForCurrency = () => {
    const currencySymbol = getOnlyCurrencyFormatter(isActiveUser?.currency)
    // Return the minimum price requirement based on currency
    switch (currencySymbol) {
      case '₦':
        return 100 // NGN
      case '$': // USD or CAD
      case '€': // EUR
      case '£': // GBP
      default:
        return 1
    }
  }

  // Add helper to get currency code for display
  const getCurrencyCode = () => {
    const currencySymbol = getOnlyCurrencyFormatter(isActiveUser?.currency)
    switch (currencySymbol) {
      case '₦':
        return 'NGN'
      case '$':
        return isActiveUser?.currency === 'USD' ? 'USD' : 'CAD'
      case '€':
        return 'EUR'
      case '£':
        return 'GBP'
      default:
        return ''
    }
  }

  // Check if price is below minimum threshold
  const isPriceBelowMinimum = () => {
    const minPrice = getMinimumPriceForCurrency()
    const currentPrice = parseFloat(values.price?.replace(/,/g, '') || '0')
    return currentPrice < minPrice
  }

  const handleProductPriceChange = (value: string) => {
    // Prevent setting price to 0
    if (value === '0' || value === '0.0' || value === '0.00') {
      return
    }

    // Prevent prices starting with decimal point
    if (value.startsWith('.')) {
      return
    }

    // Allow empty input or proper number format with up to 2 decimal places
    if (value === '' || /^(\d+)(\.(\d{0,2})?)?$/.test(value.replace(/,/g, ''))) {
      const productPrice = value === '' ? 0 : parseFloat(value.replace(/,/g, '')) || 0
      const minPrice = getMinimumPriceForCurrency()

      // If price is below minimum and there's a discount, clear the discount
      if (productPrice < minPrice && values.discount) {
        setFieldValue('discount', '')
        setFieldValue('discount_start_date', '')
        setFieldValue('discount_end_date', '')
        setFieldValue('discounted_price', '')

        // Show toast about discount being removed
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={
                  <>
                    Discount removed
                    <br />
                    Discounts are only available for products priced at
                    {getOnlyCurrencyFormatter(isActiveUser?.currency)}
                    {minPrice} or more.
                  </>
                }
                image={errorToastIcon}
                textColor="white"
                message={`Discounts are only available for products priced at ${getOnlyCurrencyFormatter(isActiveUser?.currency)}${minPrice} or more.`}
                backgroundColor=""
              />
            )
          },
          message: 'Discount removed'
        })
      }

      // Calculate Display Price without discount
      const displayPriceWithoutDiscount = Number((productPrice + 0.05 * productPrice).toFixed(2))

      // Calculate Discounted Price if a discount exists
      const discount =
        typeof values?.discount === 'string'
          ? parseFloat(values.discount.replace(/,/g, ''))
          : typeof values?.discount === 'number'
            ? values.discount
            : 0
      const discountAmount = (discount / 100) * productPrice
      const discountedPrice = Number((productPrice - discountAmount).toFixed(2))

      // Calculate Display Price with discount
      const displayPriceWithDiscount = Number((discountedPrice + 0.05 * discountedPrice).toFixed(2))

      // Apply Nigeria-specific validation for discounted prices
      if (getOnlyCurrencyFormatter(isActiveUser?.currency) === '₦' && discount > 0) {
        if (discountedPrice < 100) {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={
                    <>
                      {' '}
                      Please reduce or remove your discount percentage. Your product price can not be less than{' '}
                      {getOnlyCurrencyFormatter(isActiveUser?.currency) === '₦' ? 100 : '1'}{' '}
                      {getOnlyCurrencyFormatter(isActiveUser?.currency) === '₦' ? 'NGN' : 'USD, CAD, EURO, POUND'}
                    </>
                  }
                  image={errorToastIcon}
                  textColor="white"
                  message="You are getting this error, one of these may apply: Please reduce or remove your discount percentage. Your product price can not be less than 100 NGN, 1USD, 1 CAD, 1 EURO, 1 POUND"
                  backgroundColor=""
                />
              )
            },
            message: 'Discount policy error'
          })
          return
        }
      }

      // Preserve the exact input string instead of converting to number and back
      setFieldValue('price', value === '' ? '' : value)
      setFieldValue('display_price', discount > 0 ? displayPriceWithDiscount : displayPriceWithoutDiscount)

      if (discount > 0) {
        setFieldValue('discounted_price', discountedPrice)
      } else {
        setFieldValue('discounted_price', '')
      }
    }
  }

  // Updated discount change handler with new validation rules
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const minPrice = getMinimumPriceForCurrency()
    const productPrice = parseFloat(values.price?.replace(/,/g, '') || '0')

    // Check if price meets minimum threshold for discounts
    if (productPrice < minPrice) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Discount not available</>}
              image={errorToastIcon}
              textColor="white"
              message={`Discounts are only available for products priced at ${getOnlyCurrencyFormatter(isActiveUser?.currency)}${minPrice} or more.`}
              backgroundColor=""
            />
          )
        },
        message: 'Discount not available'
      })
      return
    }

    // Prevent 100% or higher discount
    if (inputValue !== '' && parseFloat(inputValue) >= 100) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Discount cannot be 100% or higher.</>}
              image={errorToastIcon}
              textColor="white"
              message="Discount cannot be 100% or higher."
              backgroundColor=""
            />
          )
        },
        message: 'Discount error'
      })
      return
    }

    // Allow only numbers and up to 2 decimal places
    if (inputValue === '' || /^(\d+)?\.?(\d{0,2})?$/.test(inputValue)) {
      const discount = parseFloat(inputValue) || 0 // Parse input directly as float

      // Calculate Discounted Price
      const discountAmount = (discount / 100) * productPrice
      const discountedPrice = Number((productPrice - discountAmount).toFixed(2))

      // Calculate Display Price with discount
      const displayPriceWithDiscount = Number((discountedPrice + 0.05 * discountedPrice).toFixed(2))

      // Check if display price after discount would be below minimum
      if (discount > 0 && displayPriceWithDiscount < minPrice) {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={
                  <>
                    Display price must be greater than or equal to {getOnlyCurrencyFormatter(isActiveUser?.currency)}
                    {minPrice}.
                  </>
                }
                image={errorToastIcon}
                textColor="white"
                message={`Display price must be greater than or equal to ${getOnlyCurrencyFormatter(isActiveUser?.currency)}${minPrice}.`}
                backgroundColor=""
              />
            )
          },
          message: 'Invalid discount'
        })
        return
      }

      setFieldValue('discount', inputValue) // Keep the input value as entered by user
      setFieldValue('display_price', displayPriceWithDiscount)

      if (discount > 0) {
        setFieldValue('discounted_price', discountedPrice)
      } else {
        setFieldValue('discounted_price', '')
      }
    }
  }

  return (
    <StyledContentWrapper className="">
      <Collapse defaultActiveKey={['1']} expandIconPosition="right" className="space-y-2 !border-none bg-transparent">
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
                  backgroundColor="white"
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
          </FormFieldWrapper>

          <FormFieldWrapper className="gap-7">
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

            <Form.Item
              label={
                <Tooltip
                  title={
                    <p className="font-[500] text-black">
                      Product weight helps determine shipping costs and logistics. Enter the actual weight in grams for
                      accurate calculations and better user experience.
                    </p>
                  }
                  color="white"
                >
                  <FormFieldTitle>
                    <div className="flex items-center justify-between gap-2">
                      Weight
                      <span className="flex items-center justify-between gap-1">
                        *<Icon className="relative top-[1px]" icon="material-symbols:info-outline" />
                      </span>
                    </div>
                  </FormFieldTitle>
                </Tooltip>
              }
              className="!w-full"
            >
              <TextInput
                placeholder={`e.g 500`}
                onChange={e => {
                  const value = e.target.value

                  // Only allow numbers and decimals
                  if (value === '' || /^[0-9]+\.?([0-9]+)?$/.test(value)) {
                    handleChange(e)
                  }
                }}
                className="h-[54px] rounded"
                name={'weight'}
                type={'text'}
                value={values.weight}
                errorMessage={errors && errors.weight ? errors.weight : ''}
              />
            </Form.Item>
          </FormFieldWrapper>
          <FormFieldWrapper className="gap-3 md:gap-7">
            <Form.Item
              className="lg:!w-[50%]"
              label={
                <FormFieldTitle>
                  Full Description* {`${getPlainTextLength(values.description || '')}/1500`}
                </FormFieldTitle>
              }
            >
              <QuillEditor
                value={values.description || ''}
                onChange={(content, name) => {
                  setFieldValue(name, content)
                }}
                maxLength={1500}
                errorMessage={errors && errors.description ? errors.description : ''}
                name="description"
              />
            </Form.Item>
            <Form.Item
              className="lg:!w-[50%]"
              label={
                <FormFieldTitle>
                  Additional Description {`${getPlainTextLength(values.additional_information || '')}/1000`}
                </FormFieldTitle>
              }
            >
              <QuillEditor
                value={values.additional_information || ''}
                onChange={(content, name) => {
                  setFieldValue(name, content)
                }}
                maxLength={1000}
                name="additional_information"
              />
            </Form.Item>
          </FormFieldWrapper>
          <FormFieldWrapper className="gap-7">
            <Form.Item
              className="!w-full"
              label={
                <Tooltip
                  title={
                    <p className="font-[500] text-black">
                      {'Applicable fees will appear in the display price, consider moderate pricing'}
                    </p>
                  }
                  color="white"
                >
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
                className={`w-full rounded border ${errors && errors.price ? 'border-red-600' : 'border-gray-300'} h-[54px] bg-[#fff] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`}
                value={values.price}
                decimalsLimit={2}
                decimalScale={2}
                allowDecimals={true}
                decimalSeparator="."
                onValueChange={(value: string | undefined, name?: string) => {
                  handleProductPriceChange(value || '')
                }}
                disabled={false}
                groupSeparator=","
                maxLength={10}
                allowNegativeValue={false}
              />
              <p className="flex flex-col gap-1 text-xs text-red-600">{errors && errors.price ? errors.price : ''}</p>
            </Form.Item>
            <Form.Item
              className="!w-full"
              label={
                <FormFieldTitle>
                  Discount
                  {isPriceBelowMinimum() && (
                    <Tooltip
                      title={`Discounts are only available for products priced at ${getOnlyCurrencyFormatter(isActiveUser?.currency)}${getMinimumPriceForCurrency()} or more.`}
                    >
                      <span className="ml-1 text-xs text-gray-500">(Unavailable)</span>
                    </Tooltip>
                  )}
                </FormFieldTitle>
              }
            >
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
                disabled={isPriceBelowMinimum()}
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
                    {getOnlyCurrencyFormatter(isActiveUser?.currency)}
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
                    {getOnlyCurrencyFormatter(isActiveUser?.currency)}
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
            <Form.Item
              className="!w-full"
              label={<FormFieldTitle>Discount Start Date {values.discounted_price > '0' ? '*' : ''}</FormFieldTitle>}
            >
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
                  // Clear end date if it's now invalid (before or equal to start date)
                  if (
                    (values.discount_end_date && dayjs(values.discount_end_date).isBefore(dayjs(dateString))) ||
                    (values.discount_end_date && dayjs(values.discount_end_date).isSame(dayjs(dateString)))
                  ) {
                    setFieldValue('discount_end_date', '')
                  }
                }}
                value={values.discount_start_date ? dayjs(values.discount_start_date, 'YYYY-MM-DD') : null}
                className="h-[54px] overflow-hidden rounded bg-white p-0 text-sm font-medium !text-black placeholder:text-sm placeholder:font-medium placeholder:!text-black"
                errorMessage={errors && errors.discount_start_date ? errors.discount_start_date : ''}
                allowClear
                size="large"
                disabled={values.discount === '' || values.discount === null || isPriceBelowMinimum()}
              />
              {errors && errors.discount_start_date && (
                <p className="mt-1 text-xs text-red-600">{errors.discount_start_date}</p>
              )}
            </Form.Item>
            <Form.Item
              className="!w-full"
              label={
                <FormFieldTitle>
                  Discount End Date
                  {values.discounted_price > '0' ? '*' : ''}
                </FormFieldTitle>
              }
            >
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
                errorMessage={errors && errors.discount_end_date ? errors.discount_end_date : ''}
                allowClear
                size="large"
                disabled={values.discount === '' || values.discount_start_date === '' || isPriceBelowMinimum()}
                disabledDate={(current: any) => {
                  // Can not select the start date or any days before it
                  if (!current || !values.discount_start_date) return false
                  const startDate = dayjs(values.discount_start_date, 'YYYY-MM-DD')
                  return current.isBefore(startDate, 'day') || current.isSame(startDate, 'day')
                }}
              />
              {errors && errors.discount_end_date && (
                <p className="mt-1 text-xs text-red-600">{errors.discount_end_date}</p>
              )}
            </Form.Item>
          </FormFieldWrapper>
        </Panel>
      </Collapse>
    </StyledContentWrapper>
  )
}

export default ProductInformation
