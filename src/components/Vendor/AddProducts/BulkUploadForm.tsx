import {DataType} from '@/components/EditableTable'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {getIcon} from '@/components/Vendor/utils'
import {getOnlyCurrencyFormatter} from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useCreateUserStoreListingItemMutation, useUpdateUserStoreItemMutation} from '@/services/vendor/vendor'
import {CategoryListType} from '@/types/types'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import styled from '@emotion/styled'
import {Button, Checkbox, Collapse, Form, Input, Popconfirm, RadioChangeEvent, Select} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import tw from 'tailwind-styled-components'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import {BulkUploadProductType} from '../utils'
import {BulkUploadSchema} from '../utils/schema'
import AddVariants from './FormComponents/AddVariants'
import ImageGallery from './FormComponents/ImageGallery'
import ProductAttributes from './FormComponents/ProductAttributes'
import ProductInformation from './FormComponents/ProductInformation'
import SizeChart from './FormComponents/SizeChart'

const {Panel} = Collapse

const {TextArea} = Input

const {Option} = Select

interface BulkUploadProps {
  active: any
  sidebarArr: any[]
  setActive: React.Dispatch<React.SetStateAction<any>>
  addProduct: (val: {}) => void
  editMode?: boolean
  editData?: any
  editProduct: (val: {}, id: number) => void
}

export const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
  event.preventDefault()
  event.stopPropagation()
}

export interface Unit {
  name: string
  abbreviation: string
}

export const units: Unit[] = [
  {name: 'Kilogram', abbreviation: 'Kg'},
  {name: 'Meter', abbreviation: 'm'},
  {name: 'Foot', abbreviation: 'Ft'},
  {name: 'Inch', abbreviation: 'In'},
  {name: 'Liter', abbreviation: 'L'},
  {name: 'Yard', abbreviation: 'Y'},
  {name: 'Pound', abbreviation: 'Lb'},
  {name: 'Ton', abbreviation: 'T'},
  {name: 'Ounce', abbreviation: 'Oz'}
]
const BulkUploadForm = ({
  active,
  sidebarArr,
  addProduct,
  setActive,
  editMode = false,
  editData,
  editProduct
}: BulkUploadProps) => {
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {data, isLoading} = useGetAllCategoriesQuery({
    type: 'product'
  })
  const router = useRouter()
  const {id} = router.query
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const allCategories = [
    ...(data?.data || []).map((category: CategoryListType) => ({
      label: category.name,
      value: category.id
    }))
  ]

  const [firstFile, setFirstFile] = useState<string | null>(null)

  const initialValues = {
    category: '',
    name: '',
    quantity: '',
    price: '',
    discount: null,
    discounted_price: '',
    display_price: '',
    discount_start_date: '',
    discount_end_date: '',
    measurement: [
      {
        unit: 'Kilogram',
        value: ''
      }
    ],
    size: [],
    tags: [],
    brand: '',
    product_model: '',
    material: '',
    color: '',
    description: '',
    additional_information: '',
    first_upload: '',
    variants: [],
    size_chart_title: ''
  }
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<BulkUploadProductType>({
      initialValues: editMode ? editData : initialValues,
      validationSchema: BulkUploadSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        // addProduct(val)
        handleFormSubmit()
        window.scrollTo({
          top: 0, // Scroll to the top
          behavior: 'smooth' // Smooth scrolling effect
        })
        // resetForm()
      }
    })

  const handleSuccess = (data: any, isDraft: boolean) => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: 'smooth' // Smooth scrolling effect
    })
    isDraft ? resetForm() : editMode === false ? addProduct(data) : editProduct(data, data?.id)
    resetForm()
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

    editMode && router.push('/vendor/products')
  }

  const [createStoreListing, {isLoading: isCreateStoreListingLoading}] = useCreateUserStoreListingItemMutation()
  const [updateStoreListing, {isLoading: isUpdateLoading}] = useUpdateUserStoreItemMutation()

  // Save form data to localStorage on any change
  // useEffect(() => {
  //   localStorage.setItem('create_product', JSON.stringify(values))
  // }, [values])

  const [showVariant, setShowVariant] = useState(editMode ? (values?.variants?.length > 0 ? true : false) : false)
  console.log('🚀 ~ showVariant:', showVariant)

  const [sizeChartFormat, setSizeChartFormat] = useState(
    editMode ? (editData?.size_chart_html !== null ? 1 : editData?.size_chart_image ? 2 : 0) : 0
  )

  const onChange = (e: RadioChangeEvent) => {
    setSizeChartFormat(e.target.value)
  }

  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)

  // function that takes in the measurement text and return everything apart from the last word

  // images states
  const [uploadedFiles, setUploadedFiles] = useState<{id: number; file: string}[]>(
    (values?.images || [])?.length > 0
      ? [
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
        ].map((item, index) => {
          return {
            id: item.id,
            file: values?.images?.[index] || ''
          }
        })
      : [
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
        ]
  )

  // Update the uploaded files at a specific position
  const updateUploadedFileAtPosition = (position: number, newFile: string) => {
    setUploadedFiles(prevFiles => {
      const updatedFiles = [...prevFiles]
      // Find the item with the matching id and update its file
      const index = updatedFiles.findIndex(item => item.id === position)
      if (index !== -1) {
        updatedFiles[index] = {...updatedFiles[index], file: newFile}
      }
      return updatedFiles
    })
  }

  const [fileList, setFileList] = useState<any[]>([
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

  // variant states
  const [variantUnitValue, setVariantUnitValue] = useState<string>('Kilogram')
  const [variantUploadedFiles, setVariantUploadedFiles] = useState<{id: number; file: string}[]>([
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
  const [variantFileList, setVariantFileList] = useState<any[]>([
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

  // size chart states

  const [dataSource, setDataSource] = useState<DataType[]>(
    editData?.size_chart_html?.data || [
      {
        key: '0',
        name: 'XS',
        age: '32',
        address: '26',
        hip: '36'
      },
      {
        key: '1',
        name: 'S',
        age: '34',
        address: '28',
        hip: '38'
      },
      {
        key: '2',
        name: 'M',
        age: '36',
        address: '30',
        hip: '40'
      },
      {
        key: '3',
        name: 'L',
        age: '38',
        address: '32',
        hip: '42'
      },
      {
        key: '4',
        name: 'XL',
        age: '40',
        address: '34',
        hip: '44'
      },
      {
        key: '4',
        name: 'XXL',
        age: '42',
        address: '36',
        hip: '46'
      }
    ]
  )

  // write a function that takes in the editData?.size_chart_html?.columns and returns it with the one with dataIndex of operation a render function that returns a delete button is added
  const addDeleteButton = (columns: any) => {
    return columns?.map((column: any) => {
      if (column.dataIndex === 'operation') {
        return {
          ...column,
          render: (_: any, record: any) =>
            dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record.key)}>
                <a>Delete</a>
              </Popconfirm>
            ) : null
        }
      }
      return column
    })
  }

  const [columns, setColumns] = useState(
    addDeleteButton(editData?.size_chart_html?.columns) || [
      {
        title: 'Size',
        dataIndex: 'name',
        editable: true
      },
      {
        title: 'Bust',
        dataIndex: 'age',
        editable: true
      },
      {
        title: 'Waist',
        dataIndex: 'address',
        editable: true
      },
      {
        title: 'Hip',
        dataIndex: 'hip',
        editable: true
      },
      {
        title: '',
        dataIndex: 'operation',
        render: (_: any, record: any) =>
          dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null
      }
    ]
  )

  const handleDeleteRow = (key: React.Key) => {
    const newData = dataSource.filter(item => item.key !== key)
    setDataSource(newData)
  }

  const [clickedBtn, setClickedBtn] = useState<number>(0)

  // Add this sanitize function to clean input values
  const sanitizeInput = (value: string): string => {
    if (!value) return ''

    // Check if the value is just empty brackets and return empty string
    if (value.includes?.('[]')) return ''

    // First remove escape sequences
    let sanitized = value.replace(/\\"/g, '')

    // Then remove surrounding quotes
    sanitized = sanitized.replace(/^["'](.*)["']$/, '$1')

    // If there are any remaining quotes at the beginning or end, remove them
    sanitized = sanitized.replace(/^["']+|["']+$/g, '')

    return sanitized
  }

  const [variantInProgress, setVariantInProgress] = useState(false)
  const [userModifiedVariant, setUserModifiedVariant] = useState(false)

  // Sanitize all variant sizes before submission
  const sanitizedVariants = values.variants.map(variant => ({
    ...variant,
    size: variant?.size?.includes?.('[]')
      ? ''
      : typeof variant.size === 'string'
        ? sanitizeInput(variant.size)
        : Array.isArray(variant.size) && variant.size.length === 0
          ? ''
          : variant.size
  }))

  // Add this function at the same level as other utility functions
  const isEmptyHtml = (html: string) => {
    if (!html || html === '') return true
    // Check for empty paragraph with just a break
    const emptyPatterns = ['<p><br></p>', '<p></p>']
    return emptyPatterns.includes(html.trim())
  }

  // Add this helper function to reliably check if currency is Naira
  const isNairaCurrency = () => {
    // Check multiple possible indicators that this is Naira
    return getOnlyCurrencyFormatter(isActiveUser?.currency) === '₦'
  }

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

  // Update validatePricesAndDiscounts to include new price/discount validation rules
  const validatePricesAndDiscounts = (payload: any, isVariant = false) => {
    // Check if price is 0
    const price = parseFloat(payload.price?.replace?.(/,/g, '') || '0')
    if (price === 0) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Product price cannot be 0.</>}
              image={errorToastIcon}
              textColor="white"
              message="Product price cannot be 0."
              backgroundColor=""
            />
          )
        },
        message: 'Price error'
      })
      return false
    }

    // Get minimum price based on currency
    const minPrice = getMinimumPriceForCurrency()

    // Check minimum price for current currency
    if (price < minPrice) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  Minimum product price must be {getOnlyCurrencyFormatter(isActiveUser?.currency)}
                  {minPrice}.
                </>
              }
              image={errorToastIcon}
              textColor="white"
              message={`Minimum product price must be ${getOnlyCurrencyFormatter(isActiveUser?.currency)}${minPrice}.`}
              backgroundColor=""
            />
          )
        },
        message: 'Price error'
      })
      return false
    }

    // Check if there's a discount but price is below minimum
    if (payload.discount && parseFloat(payload.discount) > 0 && price < minPrice) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  Discounts are only available for products priced at {getOnlyCurrencyFormatter(isActiveUser?.currency)}
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
        message: 'Discount not available'
      })
      return false
    }

    // Check if discount is 100%
    if (payload.discount && parseFloat(payload.discount) >= 100) {
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
      return false
    }

    // Check display price after discount
    if (payload.discount && parseFloat(payload.discount) > 0) {
      const discountPercentage = parseFloat(payload.discount) / 100
      const discountedPrice = price - price * discountPercentage
      const displayPrice = discountedPrice + 0.05 * discountedPrice

      // Check if display price is below minimum
      if (displayPrice < minPrice) {
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
        return false
      }
    }

    return true
  }

  const handleFormSubmit = async (isDraft = false) => {
    // Check if at least one image is uploaded for the main product
    const hasMainImages = uploadedFiles.some(item => item.file.length > 0)
    if (!hasMainImages) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>You must upload at least one image for the product.</>}
              image={errorToastIcon}
              textColor="white"
              message="You must upload at least one image for the product."
              backgroundColor=""
            />
          )
        },
        message: 'Image Required'
      })
      return
    }

    // Validate main product price and discount
    if (!validatePricesAndDiscounts(values)) {
      return
    }

    // Validate variant prices and discounts
    if (showVariant && values.variants && values.variants.length > 0) {
      // Check for variants without images
      const variantsWithoutImages = values.variants.filter(variant => {
        // Check if variant has images property and if it has at least one non-empty image
        return (
          !variant.images ||
          !Array.isArray(variant.images) ||
          !variant.images.some(img => img && typeof img === 'string' && img.length > 0)
        )
      })

      if (variantsWithoutImages.length > 0) {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>Images Required for Variants</>}
                image={errorToastIcon}
                textColor="white"
                message="Please add at least one image for each variant."
                backgroundColor=""
              />
            )
          },
          message: 'Variant Images Required'
        })
        return
      }

      // Check variant prices and discounts
      for (const variant of values.variants) {
        if (!validatePricesAndDiscounts(variant, true)) {
          return
        }
      }
    }

    const sizeChartHtml = JSON.stringify({
      columns: columns,
      data: dataSource
    })

    let attributes: any = {
      measurement: values.measurement,
      product_model: values?.product_model,
      material: values?.material,
      brand: values?.brand,
      color: values?.color,
      size: values.size,
      tags: values.tags
    }

    // Only include size chart data when a format is selected
    if (sizeChartFormat === 1) {
      attributes['size_chart_html'] = sizeChartHtml
      // Ensure size_chart_image is not sent if previously set
      attributes['size_chart_image'] = null
    } else if (sizeChartFormat === 2) {
      attributes['size_chart_image'] = values.first_upload
      // Ensure size_chart_html is not sent if previously set
      attributes['size_chart_html'] = null
    } else {
      // If no size chart format is selected, explicitly set both to null
      // This handles the case where size chart was previously set but now unchecked
      attributes['size_chart_html'] = null
      attributes['size_chart_image'] = null
    }

    // Remove variantId if present from each variant
    const updatedVariants = sanitizedVariants.map(({variantId, ...rest}) => rest)

    let payload = {
      type: 'product',
      is_draft: isDraft,
      name: values.name,
      category: values.category,
      price: values.price,
      quantity: values.quantity,
      discount:
        values.discount && values.discount.toString().length > 0 && Number(values.discount) > 0
          ? Number(values.discount)
          : null,
      description: isEmptyHtml(values.description) ? '' : values.description,
      additional_information: isEmptyHtml(values.additional_information) ? '' : values.additional_information,
      discount_start_date:
        values.discount && values.discount.toString().length > 0 && Number(values.discount) > 0
          ? values.discount_start_date?.toString().length > 0
            ? values.discount_start_date
            : null
          : null,
      discount_end_date:
        values.discount && values.discount.toString().length > 0 && Number(values.discount) > 0
          ? values.discount_end_date?.toString().length > 0
            ? values.discount_end_date
            : null
          : null,
      sku: values.size_chart_title,
      images: uploadedFiles.filter(item => item.file.length > 0).map(file => file.file),
      attributes,
      variants: updatedVariants
    }

    // console.log('payload', payload)
    // console.log('values', values)

    try {
      if (editMode === true) {
        const res = await updateStoreListing({
          userStore: isActiveUser?.slug!,
          listing: id! as string,
          body: payload,
          currency: isActiveUser?.country?.currency_code
        })
          .unwrap()
          .then((res: any) => {
            // console.log('res', res)
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>{res?.data?.message || 'Product Edited Successfully!'}</>}
                    image={getIcon('success')}
                    textColor="white"
                    message="Your product has been edited successfully."
                    backgroundColor=""
                  />
                )
              },
              message: 'Success'
            })
            handleSuccess(res.data, isDraft)
          })
          .catch((err: any) => {
            // Prepare error details for toast if present
            window.scrollTo({
              top: 0, // Scroll to the top
              behavior: 'smooth' // Smooth scrolling effect
            })
            let errorDetails = null
            if (err?.data?.errors && typeof err.data.errors === 'object') {
              errorDetails = (
                <ol style={{margin: 0}} className="flex flex-col gap-2 text-left">
                  {Object.entries(err.data.errors).map(([field, messages]: [string, any]) =>
                    Array.isArray(messages)
                      ? messages.map((msg: string, idx: number) => (
                          <li key={field + idx}>
                            <b>{capitalizeOnlyFirstLetter(field.replace(/_/g, ' '))}:</b> {msg}
                          </li>
                        ))
                      : null
                  )}
                </ol>
              )
            }

            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>{errorDetails && <div className="mt-2">{errorDetails}</div>}</>}
                    textColor="#FFF"
                    message={err?.data?.message}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'message'
            })

            // Handle field-specific errors
            handleValidationErrors(err?.data?.errors)
          })
        // setShowSuccess(true)
        return
      }
      const res = await createStoreListing({
        body: payload,
        user_store: isActiveUser?.slug,
        currency: isActiveUser?.country?.currency_code
      })
        .unwrap()
        .then((res: any) => {
          // console.log('res', res)
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Product {isDraft ? 'Saved' : 'Added'} Successfully!</>}
                  image={getIcon('success')}
                  textColor="white"
                  message="Your product has been added successfully."
                  backgroundColor=""
                />
              )
            },
            message: 'Success'
          })
          handleSuccess(res.data, isDraft)
        })
        .catch((err: any) => {
          window.scrollTo({
            top: 0, // Scroll to the top
            behavior: 'smooth' // Smooth scrolling effect
          })

          // Prepare error details for toast if present
          let errorDetails = null
          if (err?.data?.errors && typeof err.data.errors === 'object') {
            errorDetails = (
              <ol style={{margin: 0}} className="flex flex-col gap-2 text-left">
                {Object.entries(err.data.errors).map(([field, messages]: [string, any]) =>
                  Array.isArray(messages)
                    ? messages.map((msg: string, idx: number) => (
                        <li key={field + idx}>
                          <b>{capitalizeOnlyFirstLetter(field.replace(/_/g, ' '))}:</b> {msg}
                        </li>
                      ))
                    : null
                )}
              </ol>
            )
          }

          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={
                    <>
                      {/* {err?.data?.message || `Error updating Product`} */}
                      {errorDetails && <div className="mt-2">{errorDetails}</div>}
                    </>
                  }
                  textColor="#FFF"
                  message={err?.data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          // Handle field-specific errors
          handleValidationErrors(err?.data?.errors)
        })

      // setShowSuccess(true)
    } catch (error: any) {
      window.scrollTo({
        top: 0, // Scroll to the top
        behavior: 'smooth' // Smooth scrolling effect
      })
      let errorDetails = null
      if (error?.data?.errors && typeof error.data.errors === 'object') {
        errorDetails = (
          <ol style={{margin: 0}} className="flex flex-col gap-2 text-left">
            {Object.entries(error.data.errors).map(([field, messages]: [string, any]) =>
              Array.isArray(messages)
                ? messages.map((msg: string, idx: number) => (
                    <li key={field + idx}>
                      <b>{capitalizeOnlyFirstLetter(field.replace(/_/g, ' '))}:</b> {msg}
                    </li>
                  ))
                : null
            )}
          </ol>
        )
      }

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  {/* {err?.data?.message || `Error updating Product`} */}
                  {errorDetails && <div className="mt-2">{errorDetails}</div>}
                </>
              }
              textColor="#FFF"
              message={error?.data?.message}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })

      // Use the new helper function for validation errors
      handleValidationErrors(error?.data?.errors)
    }
  }

  // Add this helper function to handle validation errors
  const handleValidationErrors = (errors: any) => {
    if (!errors) return

    const errorKeys = Object.keys(errors || {})
    errorKeys.forEach((key: string) => {
      if (errors[key] && errors[key][0]) {
        // Set the specific error message from the server
        setFieldError(key, errors[key][0])
      } else {
        setFieldError(key, 'This field is required')
      }
    })
  }

  return (
    <div>
      <Form layout="vertical">
        <div className="flex flex-col gap-6">
          {' '}
          <ProductInformation
            isActiveUser={isActiveUser}
            errors={errors}
            values={values}
            setFieldValue={setFieldValue}
            handleChange={handleChange}
            touched={touched}
          />
          <SizeChart
            values={values}
            setFieldValue={setFieldValue}
            handleChange={handleChange}
            columns={columns}
            setColumns={setColumns}
            dataSource={dataSource}
            setDataSource={setDataSource}
            sizeChartFormat={sizeChartFormat}
            setSizeChartFormat={setSizeChartFormat}
            editMode={editMode}
          />
          <ProductAttributes
            values={values}
            setFieldValue={setFieldValue}
            handleChange={handleChange}
            editMode={editMode}
          />
          <ImageGallery
            values={values}
            setFieldValue={setFieldValue}
            sidebarArr={sidebarArr}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            updateUploadedFileAtPosition={updateUploadedFileAtPosition}
            fileList={fileList}
            setFileList={setFileList}
            errors={errors}
            editMode={editMode}
          />
          <div className="">
            <Button
              onClick={() => {
                setShowVariant(prev => !prev)
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#000',
                border: 'none',
                boxShadow: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="flex items-center gap-2"
            >
              <Checkbox checked={showVariant} className="" />
              <TextComponent as="span" className="">
                Add Variant
              </TextComponent>
            </Button>
          </div>
          {showVariant && (
            <AddVariants
              isActiveUser={isActiveUser}
              values={values}
              setFieldValue={setFieldValue}
              handleChange={handleChange}
              sidebarArr={sidebarArr}
              variantUnitValue={variantUnitValue}
              setVariantUnitValue={setVariantUnitValue}
              uploadedFiles={variantUploadedFiles}
              setUploadedFiles={setVariantUploadedFiles}
              fileList={variantFileList}
              setFileList={setVariantFileList}
              setVariantInProgress={setVariantInProgress}
              userModifiedVariant={userModifiedVariant}
              setUserModifiedVariant={setUserModifiedVariant}
            />
          )}
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className={`ml-auto flex w-full gap-3`}>
              {editMode === false || editData?.is_draft === true ? (
                <CustomButton
                  style={{
                    backgroundColor: '#6B7280',
                    color: '#fff',
                    border: 'none',
                    // Force the styles to remain the same on hover
                    transition: 'none' // Disable any transitions
                  }}
                  title="Save as Draft"
                  type="button"
                  onClick={() => {
                    setClickedBtn(1)
                    handleFormSubmit(true)
                  }}
                  disabled={isCreateStoreListingLoading || isUpdateLoading}
                  className="flex w-[140px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#6B7280] px-4 py-3.5 text-[#fff]"
                >
                  {clickedBtn === 1 && (isCreateStoreListingLoading || isUpdateLoading) && <Spinner />}
                  Save as Draft
                </CustomButton>
              ) : (
                ''
              )}

              <CustomButton
                style={{
                  backgroundColor: '#34C759',
                  color: '#fff',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                title={editMode ? (editData?.is_draft ? 'Add Product' : 'Update Product') : 'Save & Add Another'}
                type="button"
                onClick={() => {
                  setClickedBtn(2)
                  handleFormSubmit()
                  // console.log('values', values)
                }}
                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#34C759] px-4 py-3.5 text-[#fff] lg:w-fit"
              >
                {clickedBtn === 2 && (isCreateStoreListingLoading || isUpdateLoading) && <Spinner />}
                {editMode ? (editData?.is_draft ? 'Add Product' : 'Update Product') : 'Save & Add Another'}
              </CustomButton>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}

export const FormFieldWrapper = styled(tw.div`w-full flex flex-col gap-4 md:flex-row`)``

export const FormFieldTitle = styled(tw.p`font-semibold text-[14px] leading-[18px] text-[#393939]`)``
export const PanelTitle = tw.p`text-[20px] font-bold text-[#6B7280]`

export default BulkUploadForm
