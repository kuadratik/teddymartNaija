import DatePickerComponent from '@/components/SharedUI/DateAndTime/DatePicker'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {getOnlyCurrencyFormatter} from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {StyledContentWrapper} from '@/pages/ads-gallery/[id]'
import {amountFormatter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Button, Collapse, Form, Input, Select} from 'antd'
import dayjs from 'dayjs'
import {FormikErrors} from 'formik'
import React, {useEffect, useState} from 'react'
import CurrencyInput from 'react-currency-input-field'
import errorToastIcon from '../../../../../public/assets/error-toast-icon.svg'
import {BulkUploadProductType} from '../../utils'
import {FormFieldTitle, FormFieldWrapper, PanelTitle, units} from '../BulkUploadForm'
import ProductIImageFile from '../ProductImage'

type AddVariantsProps = {
  isActiveUser: any
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
  sidebarArr: any[]
  variantUnitValue: string
  setVariantUnitValue: React.Dispatch<React.SetStateAction<string>>
  uploadedFiles: {id: number; file: string}[]
  setUploadedFiles: React.Dispatch<
    React.SetStateAction<
      {
        id: number
        file: string
      }[]
    >
  >
  fileList: any[]
  setFileList: React.Dispatch<React.SetStateAction<any[]>>
  setVariantInProgress: React.Dispatch<React.SetStateAction<boolean>>
  userModifiedVariant: boolean
  setUserModifiedVariant: React.Dispatch<React.SetStateAction<boolean>>
}

type SelectedVariant = {
  name: string
  quantity: string
  size: string
  price: string
  color: string
  discount: string
  discounted_price?: number
  discount_start_date: string
  discount_end_date: string
  display_price: number
  measurement: {
    unit: string
    value: string
  }[]
  images: string[]
}

const {Panel} = Collapse

const {Option} = Select

const AddVariants = ({
  values,
  setFieldValue,
  handleChange,
  sidebarArr,
  variantUnitValue,
  setVariantUnitValue,
  uploadedFiles,
  setUploadedFiles,
  fileList,
  setFileList,
  setVariantInProgress,
  userModifiedVariant,
  setUserModifiedVariant,
  isActiveUser
}: AddVariantsProps) => {
  const {selectedLanguage} = useAppSelector(state => state.country)

  // Enhanced sanitize function to better handle quoted strings
  const sanitizeInput = (value: string): string => {
    if (!value) return ''

    // Handle empty array representation
    if (value?.includes?.('[]')) return ''

    // First remove escape sequences
    let sanitized = value.replace(/\\"/g, '')

    // Then remove surrounding quotes using a more comprehensive approach
    // This handles both double and single quotes at the beginning and end
    sanitized = sanitized.replace(/^["'](.*)["']$/, '$1')

    // If there are any remaining quotes at the beginning or end, remove them
    sanitized = sanitized.replace(/^["']+|["']+$/g, '')

    return sanitized
  }

  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant>({
    name: values.name || '',
    quantity: values.quantity || '',
    size: '',
    price: values.price || '',
    color: '',
    discount: '',
    discounted_price: 0,
    discount_start_date: '',
    discount_end_date: '',
    display_price: 0,
    measurement: [
      {
        unit: 'Kilogram',
        value: ''
      }
    ],
    images: []
  })

  const [variantEditMode, setVariantEditMode] = useState(false)
  const [variantFormReset, setVariantFormReset] = useState(false)

  // Effect to update variant fields when product values change or form resets
  useEffect(() => {
    // Only prefill if not in edit mode and either:
    // 1. Form was just reset, or
    // 2. Product values changed and we want to reflect those changes
    if (!variantEditMode) {
      // Calculate product display price for prefilling
      const productPrice = parseFloat(values.price?.replace(/,/g, '') || '0') || 0
      const displayPrice = productPrice + 0.05 * productPrice

      setSelectedVariant(prev => ({
        ...prev,
        name: values.name || prev.name,
        quantity: values.quantity || prev.quantity,
        price: values.price || prev.price,
        display_price: displayPrice || prev.display_price
      }))

      if (variantFormReset) {
        setVariantFormReset(false)
      }
    }
  }, [values.name, values.quantity, values.price, variantEditMode, variantFormReset])

  const [selectVariantError, setSelectVariantError] = useState({
    name: '',
    quantity: '',
    price: '',
    images: '',
    discount_start_date: '',
    discount_end_date: ''
  })

  // Check if variant has any data entered
  useEffect(() => {
    const hasVariantData =
      selectedVariant.name !== '' ||
      selectedVariant.quantity !== '' ||
      selectedVariant.price !== '' ||
      selectedVariant.discount !== '' ||
      selectedVariant.size !== '' ||
      selectedVariant.color !== '' ||
      selectedVariant.measurement[0].value !== '' ||
      selectedVariant.discount_start_date !== '' ||
      selectedVariant.discount_end_date !== '' ||
      uploadedFiles.some(item => item.file.length > 0)

    setVariantInProgress(hasVariantData)
  }, [selectedVariant, uploadedFiles, setVariantInProgress])

  const handleErrorHandling = () => {
    const selectedVariantImages = uploadedFiles.filter(item => item.file.length > 0).map(file => file.file)
    const {images, ...newSelectedVariant} = selectedVariant

    // Log the size value before and after sanitization for debugging
    console.log('Size before sanitization:', newSelectedVariant.size)

    // Sanitize the size value before creating the payload
    const sanitizedSelectedVariant = {
      ...newSelectedVariant,
      size: sanitizeInput(newSelectedVariant.size || '')
    }

    console.log('Size after sanitization:', sanitizedSelectedVariant.size)

    let payload

    if (variantEditMode === true) {
      // When editing, ensure we preserve the variant ID for proper updating
      payload = {
        ...sanitizedSelectedVariant,
        images: selectedVariantImages,
        variantId: (selectedVariant as any).id // Keep track of which variant we're updating
      }
    } else {
      // For new variants
      payload = {
        ...sanitizedSelectedVariant,
        images: selectedVariantImages
      }
    }

    const {name, quantity, price, images: newImages} = payload

    const errors: any = {}

    if (name === '') {
      errors['name'] = 'Variant Name is required'
    } else {
      errors['name'] = ''
    }

    if (quantity === '') {
      errors['quantity'] = 'Quantity is required'
    }
    if (Number(quantity) < 5 && parseFloat(price) < 1000000) {
      errors['quantity'] = 'Quantity must be at least 5 when price is less than 1,000,000'
    } else {
      errors['quantity'] = ''
    }

    if (price === '') {
      errors['price'] = 'Price is required'
    } else {
      errors['price'] = ''
    }

    if (newImages.length === 0) {
      errors['images'] = 'Variant Image is required'
    } else {
      errors['images'] = ''
    }

    // check if there is discount and validate the discount start and end date
    if (Number(selectedVariant.discount) > 0) {
      if (selectedVariant.discount_start_date === '') {
        errors['discount_start_date'] = 'Discount Start Date is required'
      } else {
        errors['discount_start_date'] = ''
      }

      if (selectedVariant.discount_end_date === '') {
        errors['discount_end_date'] = 'Discount End Date is required'
      } else {
        errors['discount_end_date'] = ''
      }
    }

    // if there are no errors, add the variant
    if (Object.keys(errors).every(key => errors[key] === '')) {
      addVariant(payload)
    } else {
      setSelectVariantError(errors)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Add Variant!</>}
              image={errorToastIcon}
              textColor="white"
              message={'Please check and try again.'}
              backgroundColor=""
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const handleProductPriceChange = (value: string) => {
    const productPrice = parseFloat(value.replace(/,/g, '')) || 0 // Parse and handle invalid values

    // Calculate Display Price without discount
    const displayPriceWithoutDiscount = productPrice + 0.05 * productPrice

    // Calculate Discounted Price if a discount exists
    const discount = parseFloat(selectedVariant.discount.replace(/,/g, '')) || 0
    const discountAmount = (discount / 100) * productPrice
    const discountedPrice = productPrice - discountAmount

    // Calculate Display Price with discount
    const displayPriceWithDiscount = discountedPrice + 0.05 * discountedPrice

    const updatedVariant = {
      ...selectedVariant,
      price: productPrice.toString(),
      display_price: discount > 0 ? displayPriceWithDiscount : displayPriceWithoutDiscount
    }

    if (Number(discount) > 0) {
      updatedVariant.discounted_price = discountedPrice
    } else {
      delete updatedVariant.discounted_price
    }

    setSelectedVariant(updatedVariant)
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Allow only numbers and up to 2 decimal places
    // Accept empty input, numbers, single decimal point, and proper decimal format
    if (inputValue === '' || /^(\d+)?\.?(\d{0,2})?$/.test(inputValue)) {
      const discount = parseFloat(inputValue) || 0 // Parse input as float

      // Get the current Product Price
      const productPrice = parseFloat(selectedVariant.price.replace(/,/g, '')) || 0

      // Calculate Discounted Price
      const discountAmount = (discount / 100) * productPrice
      const discountedPrice = productPrice - discountAmount

      // Calculate Display Price with discount
      const displayPriceWithDiscount = discountedPrice + 0.05 * discountedPrice

      const updatedVariant = {
        ...selectedVariant,
        discount: inputValue, // Keep the input value as entered by user
        display_price: discount > 0 ? displayPriceWithDiscount : productPrice
      }

      if (Number(discount) > 0) {
        updatedVariant.discounted_price = discountedPrice
      } else {
        delete updatedVariant.discounted_price
      }

      setSelectedVariant(updatedVariant)
    }
  }

  const addVariant = (payload: any) => {
    console.log('Payload before final sanitization:', payload)

    // Ensure size is sanitized again at this final step
    const sanitizedPayload = {
      ...payload,
      size: payload.size.includes?.('[]')
        ? ''
        : typeof payload.size === 'string'
          ? sanitizeInput(payload.size)
          : Array.isArray(payload.size) && payload.size.length === 0
            ? ''
            : payload.size
    }

    console.log('Payload after final sanitization:', sanitizedPayload)

    if (variantEditMode === true) {
      const updatedVariants = values.variants.map((item: any, index) => {
        if (index === (sanitizedPayload.variantId ?? sanitizedPayload.id)) {
          // Remove the id/variantId from the payload when updating
          const {id, variantId, ...newPayload} = sanitizedPayload
          return newPayload
        }
        return item
      })

      setFieldValue('variants', updatedVariants).then(successAction)
      setVariantEditMode(false)
      setVariantInProgress(false)
    } else {
      setFieldValue('variants', [...values.variants, sanitizedPayload]).then(successAction)
      setVariantInProgress(false)
    }
  }

  const successAction = () => {
    setSelectedVariant({
      name: values.name || '', // Prefill with product name
      quantity: values.quantity || '', // Prefill with product quantity
      price: values.price || '', // Prefill with product price
      discount: '',
      display_price: values.price ? parseFloat(values.price.replace(/,/g, '') || '0') * 1.05 : 0, // Calculate display price
      discounted_price: 0,
      size: '',
      color: '',
      measurement: [
        {
          unit: 'Kilogram',
          value: ''
        }
      ],
      discount_start_date: '',
      discount_end_date: '',
      images: []
    })
    setVariantFormReset(true)
    setSelectVariantError({
      name: '',
      quantity: '',
      price: '',
      images: '',
      discount_start_date: '',
      discount_end_date: ''
    })
    setUploadedFiles([
      {
        id: 1,
        file: ''
      },
      {
        id: 2,
        file: ''
      },
      {
        id: 3,
        file: ''
      },
      {
        id: 4,
        file: ''
      }
    ])
    setFileList([
      {
        id: 1,
        file: null,
        base64: null
      },
      {
        id: 2,
        file: null,
        base64: null
      },
      {
        id: 3,
        file: null,
        base64: null
      },
      {
        id: 4,
        file: null,
        base64: null
      }
    ])
  }

  const handleRemoveImage = (id: number) => {
    // Update fileList
    const newFileList = fileList.map(item => {
      if (item.id === id) {
        return {
          id: item.id,
          file: null,
          base64: null
        }
      }
      return item
    })
    setFileList(newFileList)

    // Update uploadedFiles
    const newUploadedFiles = uploadedFiles.map(item => {
      if (item.id === id) {
        return {
          id: item.id,
          file: ''
        }
      }
      return item
    })
    setUploadedFiles(newUploadedFiles)

    // If in edit mode, also update selectedVariant.images
    if (variantEditMode && selectedVariant.images && selectedVariant.images.length > 0) {
      const updatedImages = [...selectedVariant.images]
      const imageIndex = id - 1 // Convert id to array index
      if (imageIndex >= 0 && imageIndex < updatedImages.length) {
        updatedImages[imageIndex] = ''
        setSelectedVariant({
          ...selectedVariant,
          images: updatedImages
        })
      }
    }
  }

  // Add helper function to mark user modifications
  const markAsUserModified = () => {
    setUserModifiedVariant(true)
  }

  return (
    <StyledContentWrapper className="">
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="right"
        collapsible="icon"
        className="space-y-2 !border-none bg-transparent"
      >
        <Panel header={<PanelTitle>Add Variant</PanelTitle>} key="1" className=" ">
          <div>
            <FormFieldWrapper>
              <Form.Item className="!w-full" label={<FormFieldTitle>Variant Name*</FormFieldTitle>}>
                <Input
                  size="large"
                  type="text"
                  name={'name'}
                  placeholder=""
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedVariant({...selectedVariant, name: e.target.value})
                    // Only mark as modified if the value differs from the pre-filled value
                    if (e.target.value !== values.name) {
                      markAsUserModified()
                    }
                  }}
                  value={selectedVariant.name}
                  className="h-[54px] rounded"
                />
                {selectVariantError.name && (
                  <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{selectVariantError.name}</p>
                )}
              </Form.Item>
              <Form.Item className="!w-full" label={<FormFieldTitle>Quantity*</FormFieldTitle>}>
                <Input
                  size="large"
                  type="text"
                  name={'name'}
                  placeholder=""
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedVariant({...selectedVariant, quantity: e.target.value})
                    if (e.target.value !== values.quantity) {
                      markAsUserModified()
                    }
                  }}
                  value={selectedVariant.quantity}
                  className="h-[54px] rounded"
                />
                {selectVariantError.quantity && (
                  <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{selectVariantError.quantity}</p>
                )}
              </Form.Item>

              <Form.Item className="!w-full" label={<FormFieldTitle>Variant Price*</FormFieldTitle>}>
                <CurrencyInput
                  id={'product_price'}
                  name={'product_price'}
                  placeholder={''}
                  className={`w-full rounded border ${selectVariantError.price ? 'border-red-600' : 'border-gray-300'} h-[54px] bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`}
                  value={selectedVariant.price}
                  decimalsLimit={2}
                  onValueChange={(value: string | undefined, name?: string) => {
                    handleProductPriceChange(value || '')
                    if (value !== values.price) {
                      markAsUserModified()
                    }
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
                  name={'product_price'}
                  placeholder=""
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleProductPriceChange(e)
                  }}
                  value={selectedVariant.price}
                  className="h-[54px] overflow-hidden rounded p-0"
                /> */}
                {selectVariantError.price && (
                  <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{selectVariantError.price}</p>
                )}
              </Form.Item>
            </FormFieldWrapper>

            <FormFieldWrapper>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleDiscountChange(e)
                  }}
                  value={selectedVariant.discount}
                  className="h-[54px] overflow-hidden rounded p-0"
                />
              </Form.Item>
              <Form.Item
                label={<FormFieldTitle>Display Price</FormFieldTitle>}
                className="!w-full"
                // help={touched.display_price && errors.display_price ? errors.display_price : ''}
                // validateStatus={touched.display_price && errors.display_price ? 'error' : undefined}
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
                  value={(selectedVariant.display_price && amountFormatter(selectedVariant.display_price)) || ''}
                  className="h-[54px] rounded p-0"
                />
              </Form.Item>

              <Form.Item
                label={<FormFieldTitle>Discounted Price</FormFieldTitle>}
                className="!w-full"
                // help={touched.discounted_price && errors.discounted_price ? errors.discounted_price : ''}
                // validateStatus={touched.discounted_price && errors.discounted_price ? 'error' : undefined}
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
                  value={(selectedVariant.discounted_price && amountFormatter(selectedVariant.discounted_price)) || ''}
                  className="h-[54px] rounded p-0"
                />
              </Form.Item>
            </FormFieldWrapper>
            <FormFieldWrapper>
              <Form.Item className="!w-full" label={<FormFieldTitle>Size</FormFieldTitle>}>
                <Input
                  size="large"
                  type="text"
                  name={'size'}
                  placeholder="e.g small , medium, size 45"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // Sanitize the input value before setting it in state
                    const sanitizedValue = sanitizeInput(e.target.value)
                    setSelectedVariant({...selectedVariant, size: sanitizedValue})
                  }}
                  value={selectedVariant.size}
                  className="h-[54px] rounded"
                />
              </Form.Item>
              <Form.Item className="!w-full" label={<FormFieldTitle>Color</FormFieldTitle>}>
                <Input
                  size="large"
                  type="text"
                  name={'color'}
                  placeholder=""
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedVariant({...selectedVariant, color: e.target.value})
                  }}
                  value={selectedVariant.color}
                  className="h-[54px] rounded"
                />
              </Form.Item>

              <Form.Item className="!w-full" label={<FormFieldTitle>Measurement</FormFieldTitle>}>
                <Input
                  size="large"
                  type="text"
                  prefix={
                    <div
                      className="mr-2 flex h-[54px] w-[124px] items-center justify-center bg-[#F3F3F3]"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <Select
                        variant="borderless"
                        value={selectedVariant.measurement[0].unit}
                        className="!bg-transparent !text-white"
                        onChange={(value: string) => {
                          setSelectedVariant({
                            ...selectedVariant,
                            measurement: [{...selectedVariant.measurement[0], unit: value}]
                          })
                        }}
                      >
                        {units.map((unit, index) => (
                          <Option
                            className="!bg-transparent hover:!bg-black hover:!text-white"
                            value={unit.name}
                            key={index}
                          >
                            {`${unit.name} (${unit.abbreviation})`}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  }
                  name={'measurement'}
                  placeholder=""
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedVariant({
                      ...selectedVariant,
                      measurement: [{...selectedVariant.measurement[0], value: e.target.value}]
                    })
                  }}
                  value={selectedVariant.measurement[0].value}
                  className="h-[54px] overflow-hidden rounded p-0"
                />
              </Form.Item>
            </FormFieldWrapper>
            <FormFieldWrapper>
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
                    setSelectedVariant({...selectedVariant, discount_start_date: dateString})
                  }}
                  value={
                    selectedVariant.discount_start_date
                      ? dayjs(selectedVariant.discount_start_date, 'YYYY-MM-DD')
                      : null
                  }
                  className="h-[54px] overflow-hidden rounded bg-white p-0 text-sm font-medium !text-black placeholder:text-sm placeholder:font-medium placeholder:!text-black"
                  errorMessage=""
                  allowClear
                  size="large"
                  disabled={selectedVariant.discount === ''}
                />
                {selectVariantError.discount_start_date && (
                  <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">
                    {selectVariantError.discount_start_date}
                  </p>
                )}
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
                    setSelectedVariant({...selectedVariant, discount_end_date: dateString})
                  }}
                  value={
                    selectedVariant.discount_end_date ? dayjs(selectedVariant.discount_end_date, 'YYYY-MM-DD') : null
                  }
                  className="h-[54px] overflow-hidden rounded bg-white p-0 text-sm font-medium !text-black placeholder:text-sm placeholder:font-medium placeholder:!text-black"
                  errorMessage=""
                  allowClear
                  size="large"
                  disabled={selectedVariant.discount === '' || selectedVariant.discount_start_date === ''}
                  disabledDate={(current: any) => {
                    // Can not select days before today and the start date
                    return current && current < dayjs(selectedVariant.discount_start_date, 'YYYY-MM-DD')
                  }}
                />
                {selectVariantError.discount_end_date && (
                  <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">
                    {selectVariantError.discount_end_date}
                  </p>
                )}
              </Form.Item>

              {/* <Form.Item className="hidden !w-full lg:block" label={<FormFieldTitle></FormFieldTitle>}></Form.Item> */}
            </FormFieldWrapper>

            <div className="w-full">
              {selectVariantError.images && (
                <p className="mb-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{selectVariantError.images}</p>
              )}
              <div
                className={`mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-6 ${sidebarArr?.length ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}
              >
                {fileList.map((file, index) => (
                  <div className="relative" key={index}>
                    <ProductIImageFile
                      errorText={''}
                      id="image-upload"
                      className="relative"
                      accept=".png, .jpeg, .jpg, .webp"
                      title={<FormFieldTitle>Variant Image {file.id === 1 ? '1*' : String(file.id)}</FormFieldTitle>}
                      placeholder={'PNG, JPG, JPEG, WEBP (max. 1080×1080px)'}
                      uploadedDetails={file.file}
                      setUploadedDetails={e => {
                        // update the fileList based on the id
                        const newFileList = fileList.map(item => {
                          if (item.id === file.id) {
                            return {
                              id: item.id,
                              file: e,
                              base64: item.base64
                            }
                          }
                          return item
                        })

                        setFileList(newFileList)
                      }}
                      uploadedFile={
                        variantEditMode
                          ? selectedVariant?.images?.length
                            ? selectedVariant?.images[file.id - 1]
                            : uploadedFiles.find(item => item.id === file.id)?.file || ''
                          : ''
                      }
                      setUploadedFile={(e: string) => {
                        // update the fileList based on the id

                        const newUploadedFiles = uploadedFiles.map(item => {
                          if (item.id === file.id) {
                            return {
                              id: item.id,
                              file: e
                            }
                          }
                          return item
                        })

                        setUploadedFiles(newUploadedFiles)
                      }}
                      heightLimit={10800000000}
                      widthLimit={1080000000000}
                      editMode={variantEditMode && (selectedVariant.images ?? [])[file.id - 1] !== undefined}
                    />
                    {/* Add remove button if there's an uploaded file */}
                    {(file.file ||
                      uploadedFiles.find(item => item.id === file.id)?.file ||
                      (variantEditMode && selectedVariant?.images?.length && selectedVariant?.images[file.id - 1])) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(file.id)}
                        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <Icon icon="mdi:close" className="text-[16px]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full justify-end">
              <Button
                style={{
                  backgroundColor: '#007AFF',
                  color: '#fff',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                onClick={() => {
                  // addVariant()
                  // setSelectedVariant({
                  //   name: '',
                  //   quantity: '',
                  //   price: '',
                  //   discount: '',
                  //   display_price: 0,
                  //   discounted_price: 0,
                  //   size: '',
                  //   color: '',
                  //   measurement: '',
                  //   discount_start_date: '',
                  //   discount_end_date: '',
                  //   images: []
                  // })
                  // console.log('Selected Variant', selectedVariant)
                  handleErrorHandling()
                }}
                htmlType="button"
                className="w-full whitespace-nowrap rounded-lg bg-[#007AFF] px-4 py-[22px] text-[#fff] md:w-[140px]"
              >
                {variantEditMode ? 'Update Variant' : 'Add Variant'}
              </Button>
            </div>

            {values.variants.length > 0 && (
              <div
                className={`mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-6 ${sidebarArr?.length ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}
              >
                {values.variants.map((variant: any, index) => (
                  <div
                    className="flex items-center justify-between rounded-[7px] border border-[#EAECEF] py-2 pl-4 pr-2"
                    key={index}
                  >
                    <TextComponent as="h5" className="text-[14px] font-semibold leading-[27px]">
                      {variant.name}
                    </TextComponent>

                    <div className="flex items-center">
                      <button
                        title="Edit"
                        className="h-[26px] w-[26px]"
                        type="button"
                        onClick={e => {
                          e.preventDefault()
                          e.stopPropagation()
                          setVariantEditMode(true)
                          // Set the variant ID and update uploadedFiles with the variant's images
                          setSelectedVariant({...variant, id: index})

                          // Also update the uploadedFiles to show existing variant images
                          if (variant.images && variant.images.length > 0) {
                            const newUploadedFiles = [...uploadedFiles]
                            variant.images.forEach((img: string, imgIndex: number) => {
                              if (imgIndex < newUploadedFiles.length && img) {
                                newUploadedFiles[imgIndex].file = img
                              }
                            })
                            setUploadedFiles(newUploadedFiles)
                          }
                        }}
                      >
                        <Icon icon="tabler:edit" className="text-[18px]" />
                      </button>
                      <button
                        title="Delete"
                        className="h-[26px] w-[26px] hover:bg-white"
                        onClick={() => {
                          setFieldValue(
                            'variants',
                            values.variants.filter((item: any) => item.name !== variant.name)
                          )
                        }}
                        disabled={selectedVariant.name === variant.name}
                      >
                        <Icon icon="mdi:delete" className="text-[18px] text-[#FF2D55]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </Collapse>
    </StyledContentWrapper>
  )
}

export default AddVariants
