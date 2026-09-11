import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import { showPlannerToast } from '@/components/SharedUI/Toast/plannerToast'
import { fileToBase64 } from '@/components/Vendor/utils'
import { useSlugGeneration } from '@/hooks/useSlugGeneration'
import { useUploadImageFileSuperAdminMutation } from '@/services/general/general'
import {
  Brand,
  useCreateBrandCategoryMutation,
  useGetBrandCategoriesQuery,
  useUpdateBrandMutation
} from '@/services/super-admin'
import { compressImage } from '@/utils/imageCompression'
import { Icon } from '@iconify/react'
import { Input, Select, Tooltip } from 'antd'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'

// Helper function to get dynamic base URL
const getBrandBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin.includes('myeki.market')) {
      return 'https://myeki.market/brands'
    }
  }
  return 'https://myeki-staging.vercel.app/brands'
}

interface EditBrandModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  brand: Brand | null
}

const EditBrandModal: React.FC<EditBrandModalProps> = ({ isOpen, onClose, onSubmit, brand }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [brandBaseUrl] = useState(() => getBrandBaseUrl())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Fetch categories
  const { data: categoriesData, refetch: refetchCategories } = useGetBrandCategoriesQuery()
  const [createCategory] = useCreateBrandCategoryMutation()
  const [updateBrand, { isLoading: isUpdatingBrand }] = useUpdateBrandMutation()
  const [uploadImage] = useUploadImageFileSuperAdminMutation()

  // Slug generation hook
  const {
    generateSlug,
    isGenerating: isGeneratingSlug,
    error: slugError,
    clearError: clearSlugError,
    cleanup: cleanupSlugGeneration
  } = useSlugGeneration({
    onSuccess: (slug: string) => {
      if (!isSlugManuallyEdited) {
        formik.setFieldValue('sourceUrl', slug)
      }
    },
    onError: (error: string) => {
      // Error is already handled by the hook's internal state
    },
    debounceMs: 500
  })

  // Validation schema - logo is optional for edit
  const validationSchema = Yup.object({
    brandName: Yup.string()
      .required('Brand name is required')
      .min(2, 'Brand name must be at least 2 characters')
      .max(50, 'Brand name must be less than 50 characters'),
    categories: Yup.array()
      .of(Yup.number())
      .min(1, 'Please select at least one category')
      .required('Please select at least one category'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(100, 'Description must be less than 100 characters'),
    logo: Yup.mixed()
      .nullable()
      .test('fileType', 'Only JPEG, PNG, JPG, and WEBP files are allowed', value => {
        if (!value) return true // Optional for edit
        return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes((value as File).type)
      })
      .test('fileSize', 'File size must be less than 5MB', value => {
        if (!value) return true // Optional for edit
        return (value as File).size <= 5 * 1024 * 1024 // 5MB
      }),
    sourceUrl: Yup.string()
      .required('Source URL is required')
      .matches(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens are allowed')
      .min(3, 'Source URL must be at least 3 characters')
      .max(50, 'Source URL must be less than 50 characters'),
    targetUrl: Yup.string()
      .required('Target URL is required')
      .test('url', 'Please enter a valid URL', function (value) {
        if (!value) return false

        // Allow URLs with or without protocol
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i

        // Check if it matches the pattern
        if (urlPattern.test(value)) {
          return true
        }

        // Also try adding https:// and validate
        try {
          const urlWithProtocol =
            value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
          new URL(urlWithProtocol)
          return true
        } catch {
          return false
        }
      }),
    makeActive: Yup.boolean()
  })

  const formik = useFormik({
    initialValues: {
      brandName: '',
      categories: [] as number[],
      description: '',
      logo: null as File | null,
      sourceUrl: '',
      targetUrl: '',
      makeActive: false
    },
    validationSchema,
    onSubmit: async values => {
      if (!brand) return

      try {
        setIsUploading(true)
        setUploadProgress(0)

        let logoUrl = brand.logo_url // Keep existing logo by default

        // Upload new logo if provided
        if (values.logo) {
          // Convert file to base64
          const base64Image = await fileToBase64(values.logo)
          setUploadProgress(30)

          // Upload image
          const uploadResponse = await uploadImage({
            body: { images: [base64Image] }
          }).unwrap()

          setUploadProgress(60)

          const newLogoUrl = uploadResponse?.data?.[0]

          if (!newLogoUrl) {
            throw new Error('Failed to upload image')
          }

          logoUrl = newLogoUrl
        }

        setUploadProgress(80)

        // Update brand
        const brandPayload = {
          name: values.brandName,
          category_ids: values.categories,
          description: values.description,
          logo_url: logoUrl,
          source_url: `${getBrandBaseUrl()}/${values.sourceUrl}`,
          target_url: values.targetUrl,
          is_active: values.makeActive
        }

        await updateBrand({ brandId: brand.id, data: brandPayload }).unwrap()

        setUploadProgress(100)

        // Reset form and close modal first
        formik.resetForm()
        setUploadedFileName('')
        if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreviewUrl)
        }
        setImagePreviewUrl(null)
        setIsUploading(false)
        setUploadProgress(0)
        setIsSlugManuallyEdited(false)
        cleanupSlugGeneration()
        onClose()

        // Show success toast after closing
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Brand updated successfully!</>}
                textColor="#FFF"
                message="The brand has been updated."
                backgroundColor="#000"
              />
            )
          },
          message: 'Success'
        })

        // Trigger parent callback for refetch
        onSubmit()
      } catch (error: any) {
        setIsUploading(false)
        setUploadProgress(0)

        // Handle field-specific validation errors
        if (error?.data?.errors && typeof error.data.errors === 'object') {
          handleValidationErrors(error.data.errors)
        }

        const errorMessage = error?.data?.message || error?.message || 'Failed to update brand. Please try again.'

        // Create detailed error list for toast
        let errorDetails = null
        if (error?.data?.errors && typeof error.data.errors === 'object') {
          errorDetails = (
            <ol style={{ margin: 0 }} className="flex flex-col gap-2 text-left">
              {Object.entries(error.data.errors).map(([field, messages]: [string, any]) =>
                Array.isArray(messages)
                  ? messages.map((msg: string, idx: number) => <li key={field + idx}>{msg}</li>)
                  : null
              )}
            </ol>
          )
        }

        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={
                  <>
                    Error updating brand
                    {errorDetails && <div className="mt-2">{errorDetails}</div>}
                  </>
                }
                textColor="#FFF"
                message={errorMessage}
                backgroundColor="#000"
              />
            )
          },
          message: 'Error'
        })
      }
    }
  })

  // Brand name change handler
  const handleBrandNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      formik.setFieldValue('brandName', value)

      // Generate slug if not manually edited
      if (!isSlugManuallyEdited) {
        generateSlug(value)
      }
    },
    [formik, generateSlug, isSlugManuallyEdited]
  )

  // Handle manual slug editing
  const handleSourceUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      formik.setFieldValue('sourceUrl', value)
      setIsSlugManuallyEdited(true)
      clearSlugError()
    },
    [formik, clearSlugError]
  )

  // Reset slug manual edit flag when brand name is cleared
  useEffect(() => {
    if (!formik.values.brandName.trim()) {
      setIsSlugManuallyEdited(false)
      clearSlugError()
    }
  }, [formik.values.brandName, clearSlugError])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSlugGeneration()
    }
  }, [cleanupSlugGeneration])

  // Handle field-specific validation errors from backend
  const handleValidationErrors = (errors: any) => {
    if (!errors) return

    const errorKeys = Object.keys(errors || {})
    let firstErrorFieldId: string | null = null

    errorKeys.forEach((key: string) => {
      if (errors[key] && errors[key][0]) {
        // Map backend field names to frontend field names
        const fieldMapping: Record<string, string> = {
          name: 'brandName',
          category_ids: 'categories',
          logo_url: 'logo',
          source_url: 'sourceUrl',
          target_url: 'targetUrl',
          is_active: 'makeActive'
        }

        const frontendFieldName = fieldMapping[key] || key

        // Set the specific error message from the server
        formik.setFieldError(frontendFieldName, errors[key][0])
        formik.setFieldTouched(frontendFieldName, true, false)

        // Store the first error field for scrolling
        if (!firstErrorFieldId) {
          firstErrorFieldId = `field-${frontendFieldName}`
        }
      }
    })

    // Scroll to the first error field
    setTimeout(() => {
      if (firstErrorFieldId) {
        const errorElement = document.getElementById(firstErrorFieldId!)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          errorElement.focus()
        }
      }
    }, 150)
  }

  // Populate form when brand changes
  useEffect(() => {
    if (brand && isOpen) {
      // Extract slug from source_url
      const sourceUrlSlug = brand.source_url.split('/').pop() || brand.source_url

      formik.setValues({
        brandName: brand.name,
        categories: brand.categories.map(cat => cat.id),
        description: brand.description,
        logo: null,
        sourceUrl: sourceUrlSlug,
        targetUrl: brand.target_url,
        makeActive: brand.is_active
      })
      // Set existing logo as preview
      if (brand.logo_url) {
        setImagePreviewUrl(`${process.env.imageBaseUrl}/${brand.logo_url}`)
      }
    }
  }, [brand, isOpen])

  // Handle category creation
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Category name is required</>}
              textColor="#FFF"
              message="Please enter a category name."
              backgroundColor="#000"
            />
          )
        },
        message: 'Error'
      })
      return
    }

    setIsCreatingCategory(true)

    try {
      const response = await createCategory({ name: newCategoryName }).unwrap()

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Category created successfully!</>}
              textColor="#FFF"
              message={response.message}
              backgroundColor="#000"
            />
          )
        },
        message: 'Success'
      })

      // Add the new category to selected categories
      const newCategoryId = response.data.id
      formik.setFieldValue('categories', [...formik.values.categories, newCategoryId])

      // Refetch categories to update the list
      await refetchCategories()

      // Clear the input
      setNewCategoryName('')
    } catch (error: any) {
      let errorMessage = 'Failed to create category. Please try again.'

      // Handle field-specific validation errors
      if (error?.data?.errors && typeof error.data.errors === 'object') {
        const nameErrors = error.data.errors.name
        if (nameErrors && nameErrors[0]) {
          errorMessage = nameErrors[0]
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      }

      // Create detailed error list for toast if there are multiple field errors
      let errorDetails = null
      if (error?.data?.errors && typeof error.data.errors === 'object') {
        const errorEntries = Object.entries(error.data.errors)
        if (errorEntries.length > 0) {
          errorDetails = (
            <ol style={{ margin: 0 }} className="flex flex-col gap-2 text-left">
              {errorEntries.map(([field, messages]: [string, any]) =>
                Array.isArray(messages)
                  ? messages.map((msg: string, idx: number) => <li key={field + idx}>{msg}</li>)
                  : null
              )}
            </ol>
          )
        }
      }

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  Error creating category
                  {errorDetails && <div className="mt-2">{errorDetails}</div>}
                </>
              }
              textColor="#FFF"
              message={errorMessage}
              backgroundColor="#000"
            />
          )
        },
        message: 'Error'
      })
    } finally {
      setIsCreatingCategory(false)
    }
  }

  // Handle file selection
  const handleFileSelect = async (file: File | null) => {
    if (!file) return

    if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/webp'
    ) {
      try {
        // Compress the image before setting it
        const compressedFile = await compressImage(
          file,
          600, // maxWidth
          600, // maxHeight
          0.9, // quality
          false, // convertToWebP
          true // smartCompression
        )

        formik.setFieldValue('logo', compressedFile)
        setUploadedFileName(compressedFile.name)

        // Create preview URL
        // Revoke old preview URL if exists
        if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreviewUrl)
        }

        const previewUrl = URL.createObjectURL(compressedFile)
        setImagePreviewUrl(previewUrl)
      } catch (error) {
        console.error('Image compression failed:', error)
        // Fallback to original file if compression fails
        formik.setFieldValue('logo', file)
        setUploadedFileName(file.name)

        // Revoke old preview URL if exists
        if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreviewUrl)
        }

        const previewUrl = URL.createObjectURL(file)
        setImagePreviewUrl(previewUrl)
      }
    } else {
      // Show error for unsupported file type
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Unsupported file type</>}
              textColor="#FFF"
              message="Please upload only JPEG, PNG, JPG, or WEBP files."
              backgroundColor="#000"
            />
          )
        },
        message: 'Error'
      })
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/webp'
      ) {
        handleFileSelect(file)
      } else {
        // Show error for unsupported file type
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Unsupported file type</>}
                textColor="#FFF"
                message="Please upload only JPEG, PNG, JPG, or WEBP files."
                backgroundColor="#000"
              />
            )
          },
          message: 'Error'
        })
      }
    }
  }

  const handleRemoveLogo = () => {
    formik.setFieldValue('logo', null)
    setUploadedFileName('')
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl)
    }
    setImagePreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    if (!isUploading && !isUpdatingBrand) {
      formik.resetForm()
      setUploadedFileName('')
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
      setImagePreviewUrl(null)
      setUploadProgress(0)
      setIsSlugManuallyEdited(false)
      cleanupSlugGeneration()
      onClose()
    }
  }

  if (!isOpen || !brand) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={handleClose}>
      {/* Modal Container */}
      <div
        ref={formRef}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isUploading || isUpdatingBrand}
          className="absolute right-4 top-4 rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon icon="heroicons:x-mark" className="text-2xl text-gray-600" />
        </button>

        {/* Title */}
        <TextComponent as="h2" className="mb-6 text-2xl font-semibold text-gray-900">
          Edit Brand
        </TextComponent>

        <form onSubmit={formik.handleSubmit}>
          {/* Brand Name Input */}
          <div className="mb-4">
            <input
              type="text"
              id="field-brandName"
              placeholder="Brand Name*"
              value={formik.values.brandName}
              onChange={handleBrandNameChange}
              onBlur={formik.handleBlur}
              name="brandName"
              className={`w-full rounded-full border px-5 py-3 text-[14px] transition-colors focus:outline-none focus:ring-2 ${formik.touched.brandName && formik.errors.brandName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-black'
                }`}
            />
            {formik.touched.brandName && formik.errors.brandName && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.brandName}</p>
            )}
          </div>

          {/* Source URL */}
          <div className="mb-4">
            <label className="mb-2 block text-[14px] font-medium text-gray-900">myEKI url*</label>
            <div className="flex flex-col-reverse items-center justify-between gap-2 md:flex-row md:gap-0">
              <div className="relative w-full md:w-[49%]">
                <input
                  id="field-sourceUrl"
                  type="text"
                  placeholder="Slug"
                  value={formik.values.sourceUrl}
                  onChange={handleSourceUrlChange}
                  onBlur={formik.handleBlur}
                  name="sourceUrl"
                  className={`w-full rounded-full border px-5 py-3.5 pr-10 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${formik.touched.sourceUrl && (formik.errors.sourceUrl || slugError)
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-gray-400'
                    }`}
                />
                {isGeneratingSlug && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon icon="eos-icons:loading" className="text-lg text-gray-400" />
                  </div>
                )}
              </div>
              <Tooltip title={`${brandBaseUrl}/${formik.values.sourceUrl || '{slug}'}`}>
                <span className="truncate text-[14px] text-[#7E7E7E] w-full md:w-[49%]">
                  {brandBaseUrl}/{formik.values.sourceUrl || '{slug}'}
                </span>
              </Tooltip>
            </div>
            {formik.touched.sourceUrl && formik.errors.sourceUrl && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.sourceUrl}</p>
            )}
            {slugError && <p className="mt-1 text-sm text-red-600">{slugError}</p>}
          </div>

          {/* Target URL */}
          <div className="mb-4">
            <label className="mb-2 block text-[14px] font-medium text-gray-900">Affiliate url*</label>
            <input
              id="field-targetUrl"
              type="url"
              placeholder="Enter URL (affiliate/partner link)"
              value={formik.values.targetUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="targetUrl"
              className={`w-full rounded-full border px-5 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${formik.touched.targetUrl && formik.errors.targetUrl
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-gray-400'
                }`}
            />
            {formik.touched.targetUrl && formik.errors.targetUrl && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.targetUrl}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <style jsx global>{`
              .brand-category-select .ant-select-selector {
                border-radius: 9999px !important;
                min-height: 50px !important;
                padding: 0 20px !important;
              }
              .brand-category-select .ant-select-selection-placeholder {
                line-height: 50px !important;
                color: #9ca3af !important;
                font-size: 14px !important;
              }
              .brand-category-select .ant-select-selection-item {
                line-height: 32px !important;
                font-size: 14px !important;
              }
              .brand-category-select .ant-select-selection-overflow {
                padding: 4px 0 !important;
              }
              .brand-category-select-error .ant-select-selector {
                border-color: #ef4444 !important;
              }
              .category-create-input {
                padding: 8px 12px;
                border-top: 1px solid #e5e7eb;
                background-color: #f9fafb;
              }
              /* Checkbox styling for multi-select */
              .ant-select-dropdown .ant-select-item-option {
                padding: 8px 12px !important;
              }
              .ant-select-dropdown .ant-select-item-option::before {
                content: '';
                display: inline-block;
                margin-top: 4px;
                width: 16px;
                height: 16px;
                border: 2px solid #d1d5db;
                border-radius: 3px;
                margin-right: 8px;
                vertical-align: middle;
                background-color: #ffffff;
                flex-shrink: 0;
              }
              .ant-select-dropdown .ant-select-item-option-selected::before {
                content: '✓';
                background-color: #000000;
                border-color: #000000;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
              }
              .ant-select-dropdown .ant-select-item-option-selected {
                background-color: #f3f4f6 !important;
              }
            `}</style>
            <Select
              id="field-categories"
              mode="multiple"
              placeholder="Select Categories*"
              value={formik.values.categories}
              onChange={value => formik.setFieldValue('categories', value)}
              onBlur={() => formik.setFieldTouched('categories', true)}
              className={`brand-category-select w-full ${formik.touched.categories && formik.errors.categories ? 'brand-category-select-error' : ''}`}
              size="large"
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              maxTagCount="responsive"
              maxTagPlaceholder={omittedValues => `+${omittedValues.length} more`}
              suffixIcon={<Icon icon="heroicons:chevron-down" className="text-xl text-gray-400" />}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <div className="category-create-input">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Create new category"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        onPressEnter={handleCreateCategory}
                        disabled={isCreatingCategory}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={isCreatingCategory || !newCategoryName.trim()}
                        className="flex items-center gap-1 rounded-md bg-black px-3 py-1 text-sm text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {isCreatingCategory ? (
                          <>
                            <Icon icon="eos-icons:loading" className="text-base" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="heroicons:plus" className="text-base" />
                            <span>Create</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              options={categoriesData?.data?.map(cat => ({
                value: cat.id,
                label: cat.name
              }))}
            />
            {formik.touched.categories && formik.errors.categories && (
              <p className="mt-3 text-sm text-red-600">{formik.errors.categories}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div className="mb-4">
            <div className="relative">
              <textarea
                id="field-description"
                placeholder="Description*"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="description"
                rows={3}
                maxLength={100}
                className={`w-full rounded-3xl border px-5 py-3 text-[14px] transition-colors focus:outline-none focus:ring-2 ${formik.touched.description && formik.errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-black'
                  }`}
              />
              <div className="absolute bottom-3 right-5 text-xs text-gray-400">
                {formik.values.description.length}/100
              </div>
            </div>
            {formik.touched.description && formik.errors.description && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
            )}
          </div>

          {/* Logo Upload */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Brand Logo{' '}
              {imagePreviewUrl && <span className="text-gray-400">(optional - keep current or upload new)</span>}
            </label>

            {imagePreviewUrl ? (
              <div className="flex flex-col gap-4 rounded-xl border border-gray-300 p-4 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <img src={imagePreviewUrl} alt="Logo preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 md:max-w-[40%]">
                  <p className="text-sm font-medium text-gray-900">{uploadedFileName || 'Current logo'}</p>
                  <p className="text-xs text-gray-500">Click to change or remove</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Change Logo
                  </button>
                  {uploadedFileName && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={e => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                  } ${formik.touched.logo && formik.errors.logo ? 'border-red-500' : ''}`}
              >
                <Icon icon="heroicons:cloud-arrow-up" className="mx-auto mb-3 text-4xl text-gray-400" />
                <TextComponent as="p" className="mb-1 text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </TextComponent>
                <TextComponent as="p" className="text-xs text-gray-500">
                  PNG, JPG, JPEG or WEBP (max. 5MB)
                </TextComponent>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={e => handleFileSelect(e.target.files?.[0] || null)}
              className="hidden"
            />
            {formik.touched.logo && formik.errors.logo && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.logo}</p>
            )}
          </div>

          {/* Make Active Checkbox */}
          <div className="mb-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                id="field-makeActive"
                checked={formik.values.makeActive}
                onChange={formik.handleChange}
                name="makeActive"
                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-2 focus:ring-black"
              />
              <TextComponent as="span" className="text-sm font-medium text-gray-700">
                Make brand active
              </TextComponent>
            </label>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Updating brand...</span>
                <span className="font-medium text-gray-900">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading || isUpdatingBrand}
              className="flex-1 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || isUpdatingBrand || !formik.isValid}
              className="flex-1 rounded-full bg-black px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isUploading || isUpdatingBrand ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon="eos-icons:loading" className="text-xl" />
                  Updating...
                </span>
              ) : (
                'Update Brand'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBrandModal
