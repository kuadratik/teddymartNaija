import React, {useState, useRef} from 'react'
import {Icon} from '@iconify/react'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Select, Input} from 'antd'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {
  useGetBrandCategoriesQuery,
  useCreateBrandCategoryMutation,
  useCreateBrandMutation
} from '@/services/super-admin'
import {useUploadImageFileSuperAdminMutation} from '@/services/general/general'
import {fileToBase64} from '@/components/Vendor/utils'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'

interface AddBrandModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddBrandFormData) => void
}

export interface AddBrandFormData {
  brandName: string
  categories: number[]
  description: string
  logo: File | null
  sourceUrl: string
  targetUrl: string
  makeActive: boolean
}

const AddBrandModal: React.FC<AddBrandModalProps> = ({isOpen, onClose, onSubmit}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Fetch categories
  const {data: categoriesData, refetch: refetchCategories} = useGetBrandCategoriesQuery()
  const [createCategory] = useCreateBrandCategoryMutation()
  const [createBrand, {isLoading: isCreatingBrand}] = useCreateBrandMutation()
  const [uploadImage] = useUploadImageFileSuperAdminMutation()

  // Validation schema
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
      .required('Brand logo is required')
      .test('fileType', 'Only JPEG, PNG, JPG, and WEBP files are allowed', value => {
        if (!value) return false
        return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes((value as File).type)
      })
      .test('fileSize', 'File size must be less than 5MB', value => {
        if (!value) return false
        return (value as File).size <= 5 * 1024 * 1024 // 5MB
      }),
    sourceUrl: Yup.string().required('Source URL is required').url('Please enter a valid URL'),
    targetUrl: Yup.string().required('Target URL is required').url('Please enter a valid URL'),
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
      try {
        setIsUploading(true)
        setUploadProgress(0)

        // Upload the logo first
        if (!values.logo) {
          throw new Error('Logo is required')
        }

        // Convert file to base64
        const base64Image = await fileToBase64(values.logo)
        setUploadProgress(30)

        // Upload image
        const uploadResponse = await uploadImage({
          body: {images: [base64Image]}
        }).unwrap()

        setUploadProgress(60)

        const logoUrl = uploadResponse?.data?.[0]

        if (!logoUrl) {
          throw new Error('Failed to upload image')
        }

        setUploadProgress(80)

        // Create brand
        const brandPayload = {
          name: values.brandName,
          category_ids: values.categories,
          description: values.description,
          logo_url: logoUrl,
          source_url: values.sourceUrl,
          target_url: values.targetUrl,
          is_active: values.makeActive
        }

        await createBrand(brandPayload).unwrap()

        setUploadProgress(100)

        // Reset form and close modal first
        formik.resetForm()
        setUploadedFileName('')
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl)
        }
        setImagePreviewUrl(null)
        setIsUploading(false)
        setUploadProgress(0)
        onClose()

        // Show success toast after closing
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Brand created successfully!</>}
                textColor="#FFF"
                message="The brand has been added to the platform."
                backgroundColor="#000"
              />
            )
          },
          message: 'Success'
        })

        // Trigger parent callback for refetch
        onSubmit(values)
      } catch (error: any) {
        setIsUploading(false)
        setUploadProgress(0)

        const errorMessage = error?.data?.message || error?.message || 'Failed to create brand. Please try again.'

        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Error creating brand</>}
                textColor="#FFF"
                message={errorMessage}
                backgroundColor="#F44336"
              />
            )
          },
          message: 'Error'
        })
      }
    }
  })

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
              backgroundColor="#F44336"
            />
          )
        },
        message: 'Error'
      })
      return
    }

    setIsCreatingCategory(true)

    try {
      const response = await createCategory({name: newCategoryName}).unwrap()

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
      const errorMessage =
        error?.data?.errors?.name?.[0] || error?.data?.message || 'Failed to create category. Please try again.'

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Error creating category</>}
              textColor="#FFF"
              message={errorMessage}
              backgroundColor="#F44336"
            />
          )
        },
        message: 'Error'
      })
    } finally {
      setIsCreatingCategory(false)
    }
  }

  // Scroll to first error field
  const scrollToError = () => {
    const firstErrorKey = Object.keys(formik.errors)[0]
    if (firstErrorKey) {
      const errorElement = document.getElementById(`field-${firstErrorKey}`)
      if (errorElement) {
        errorElement.scrollIntoView({behavior: 'smooth', block: 'center'})
        errorElement.focus()
      }
    }
  }

  // Handle form submission with validation
  const handleSubmit = async () => {
    const errors = await formik.validateForm()
    formik.setTouched({
      brandName: true,
      categories: true,
      description: true,
      logo: true,
      sourceUrl: true,
      targetUrl: true,
      makeActive: true
    })

    if (Object.keys(errors).length > 0) {
      scrollToError()
      return
    }

    formik.handleSubmit()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (
      file &&
      (file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/webp')
    ) {
      formik.setFieldValue('logo', file)
      setUploadedFileName(file.name)
      // Create blob preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreviewUrl(previewUrl)
    } else if (file) {
      // Show error for unsupported file type
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Unsupported file type</>}
              textColor="#FFF"
              message="Please upload only JPEG, PNG, JPG, or WEBP files."
              backgroundColor="#F44336"
            />
          )
        },
        message: 'Error'
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (
      file &&
      (file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/webp')
    ) {
      formik.setFieldValue('logo', file)
      setUploadedFileName(file.name)
      // Create blob preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreviewUrl(previewUrl)
    } else if (file) {
      // Show error for unsupported file type
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Unsupported file type</>}
              textColor="#FFF"
              message="Please upload only JPEG, PNG, JPG, or WEBP files."
              backgroundColor="#F44336"
            />
          )
        },
        message: 'Error'
      })
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveLogo = () => {
    formik.setFieldValue('logo', null)
    setUploadedFileName('')
    // Cleanup the blob URL
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
    }
    setImagePreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
      {/* Modal Container - Full screen on mobile, centered dialog on desktop */}
      <div
        className="relative h-full w-full overflow-hidden bg-white sm:h-auto sm:max-w-2xl sm:rounded-lg sm:shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <TextComponent as="h2" className="text-xl font-semibold text-gray-900">
            Add Brand
          </TextComponent>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Close modal"
          >
            <Icon icon="heroicons:x-mark" className="text-2xl text-gray-900" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-6 sm:max-h-[calc(100vh-16rem)]">
          {/* Brand Name */}
          <div className="mb-4">
            <input
              id="field-brandName"
              type="text"
              placeholder="Brand Name*"
              {...formik.getFieldProps('brandName')}
              className={`w-full rounded-full border px-5 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${
                formik.touched.brandName && formik.errors.brandName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-gray-400'
              }`}
            />
            {formik.touched.brandName && formik.errors.brandName && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.brandName}</p>
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
                placeholder="Description of the brand*"
                {...formik.getFieldProps('description')}
                maxLength={100}
                rows={4}
                className={`w-full rounded-3xl border px-5 py-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${
                  formik.touched.description && formik.errors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-gray-400'
                }`}
              />
              <span className="absolute bottom-3 right-5 text-[12px] text-gray-400">
                {formik.values.description.length}/100
              </span>
            </div>
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
            )}
          </div>

          {/* Logo Upload Area */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Brand Logo<span className="text-red-500">*</span>
            </label>

            {imagePreviewUrl ? (
              <div className="flex flex-col gap-4 rounded-xl border border-gray-300 p-4 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <img src={imagePreviewUrl} alt="Logo preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 md:max-w-[40%]">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {uploadedFileName || formik.values.logo?.name}
                  </p>
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
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
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
              onChange={handleFileSelect}
              className="hidden"
            />
            {formik.touched.logo && formik.errors.logo && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.logo}</p>
            )}
          </div>

          {/* Source URL */}
          <div className="mb-4">
            <label className="mb-2 block text-[14px] font-medium text-gray-900">Source URL*</label>
            <input
              id="field-sourceUrl"
              type="url"
              placeholder="Enter URL"
              {...formik.getFieldProps('sourceUrl')}
              className={`w-full rounded-full border px-5 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${
                formik.touched.sourceUrl && formik.errors.sourceUrl
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-gray-400'
              }`}
            />
            {formik.touched.sourceUrl && formik.errors.sourceUrl && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.sourceUrl}</p>
            )}
          </div>

          {/* Target URL */}
          <div className="mb-4">
            <label className="mb-2 block text-[14px] font-medium text-gray-900">Target URL*</label>
            <input
              id="field-targetUrl"
              type="url"
              placeholder="Enter URL"
              {...formik.getFieldProps('targetUrl')}
              className={`w-full rounded-full border px-5 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 ${
                formik.touched.targetUrl && formik.errors.targetUrl
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-gray-400'
              }`}
            />
            {formik.touched.targetUrl && formik.errors.targetUrl && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.targetUrl}</p>
            )}
          </div>

          {/* Make Active Checkbox */}
          <div className="mb-6">
            <label className="flex cursor-pointer items-center">
              <input
                id="field-makeActive"
                type="checkbox"
                {...formik.getFieldProps('makeActive')}
                className="mr-3 h-5 w-5 cursor-pointer rounded border-gray-300 text-black focus:ring-0 focus:ring-offset-0"
              />
              <TextComponent as="span" className="text-[14px] font-normal text-gray-900">
                Make active on myEKI
              </TextComponent>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-200 px-6 py-5">
          <button
            onClick={onClose}
            disabled={isUploading || isCreatingBrand}
            className="flex-1 rounded-full border border-gray-300 bg-white px-6 py-3 text-[14px] font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[140px] sm:flex-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading || isCreatingBrand}
            className="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 sm:flex-none"
          >
            {isUploading || isCreatingBrand ? (
              <>
                <Icon icon="eos-icons:loading" className="text-lg" />
                <span>{isUploading ? 'Uploading...' : 'Creating...'}</span>
              </>
            ) : (
              'Done'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddBrandModal
