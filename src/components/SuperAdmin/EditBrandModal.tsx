import React, {useState, useRef, useEffect} from 'react'
import {Icon} from '@iconify/react'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Select, Input} from 'antd'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {
  useGetBrandCategoriesQuery,
  useCreateBrandCategoryMutation,
  useUpdateBrandMutation,
  Brand
} from '@/services/super-admin'
import {useUploadImageFileSuperAdminMutation} from '@/services/general/general'
import {fileToBase64} from '@/components/Vendor/utils'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'

interface EditBrandModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  brand: Brand | null
}

const EditBrandModal: React.FC<EditBrandModalProps> = ({isOpen, onClose, onSubmit, brand}) => {
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
  const [updateBrand, {isLoading: isUpdatingBrand}] = useUpdateBrandMutation()
  const [uploadImage] = useUploadImageFileSuperAdminMutation()

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
            body: {images: [base64Image]}
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
          source_url: values.sourceUrl,
          target_url: values.targetUrl,
          is_active: values.makeActive
        }

        await updateBrand({brandId: brand.id, data: brandPayload}).unwrap()

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

        const errorMessage = error?.data?.message || error?.message || 'Failed to update brand. Please try again.'

        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Error updating brand</>}
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

  // Populate form when brand changes
  useEffect(() => {
    if (brand && isOpen) {
      formik.setValues({
        brandName: brand.name,
        categories: brand.categories.map(cat => cat.id),
        description: brand.description,
        logo: null,
        sourceUrl: brand.source_url,
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
    if (!newCategoryName.trim()) return

    try {
      setIsCreatingCategory(true)
      await createCategory({name: newCategoryName.trim()}).unwrap()
      setNewCategoryName('')
      refetchCategories()
      showPlannerToast({
        message: 'Category created successfully'
      })
    } catch (error: any) {
      const errorMessage = error?.data?.errors?.name?.[0] || error?.data?.message || 'Failed to create category'
      showPlannerToast({
        message: errorMessage
      })
    } finally {
      setIsCreatingCategory(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (file: File | null) => {
    if (!file) return

    if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/webp'
    ) {
      formik.setFieldValue('logo', file)
      setUploadedFileName(file.name)

      // Create preview URL
      if (
        file &&
        (file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'image/webp')
      ) {
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
              backgroundColor="#F44336"
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
        const previewUrl = URL.createObjectURL(file)
        setImagePreviewUrl(previewUrl)
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
                backgroundColor="#F44336"
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
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="brandName"
              className={`w-full rounded-full border px-5 py-3 text-[14px] transition-colors focus:outline-none focus:ring-2 ${
                formik.touched.brandName && formik.errors.brandName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-black'
              }`}
            />
            {formik.touched.brandName && formik.errors.brandName && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.brandName}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
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
                placeholder="Description*"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="description"
                rows={3}
                maxLength={100}
                className={`w-full rounded-3xl border px-5 py-3 text-[14px] transition-colors focus:outline-none focus:ring-2 ${
                  formik.touched.description && formik.errors.description
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
              onChange={e => handleFileSelect(e.target.files?.[0] || null)}
              className="hidden"
            />
            {formik.touched.logo && formik.errors.logo && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.logo}</p>
            )}
          </div>

          {/* Source URL */}
          <div className="mb-4">
            <input
              type="url"
              id="field-sourceUrl"
              placeholder="Source URL*"
              value={formik.values.sourceUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="sourceUrl"
              className={`w-full rounded-full border px-5 py-3 text-[14px] transition-colors focus:outline-none focus:ring-2 ${
                formik.touched.sourceUrl && formik.errors.sourceUrl
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-black'
              }`}
            />
            {formik.touched.sourceUrl && formik.errors.sourceUrl && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.sourceUrl}</p>
            )}
          </div>

          {/* Target URL */}
          <div className="mb-4">
            <input
              type="url"
              id="field-targetUrl"
              placeholder="Target URL*"
              value={formik.values.targetUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="targetUrl"
              className={`w-full rounded-full border px-5 py-3 text-[14px] transition-colors focus:outline-none focus:ring-2 ${
                formik.touched.targetUrl && formik.errors.targetUrl
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-black'
              }`}
            />
            {formik.touched.targetUrl && formik.errors.targetUrl && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.targetUrl}</p>
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
                  style={{width: `${uploadProgress}%`}}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
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
