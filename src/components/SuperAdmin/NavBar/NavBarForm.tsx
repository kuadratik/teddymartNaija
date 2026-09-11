import CustomButton from '@/components/SharedUI/Buttons/Button'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useCreateNavigationMutation, useUpdateNavigationMutation} from '@/services/super-admin/nav-bar'
import {ICreateNavBarRequest, INavBarListDatum, Subnav} from '@/types/super-admin/nav-bar'
import {Icon} from '@iconify/react'
import {Checkbox, Tooltip} from 'antd'
import {useFormik} from 'formik'
import {useCallback, useEffect} from 'react'
import * as Yup from 'yup'

const createEmptySubnav = (): Subnav => ({
  name: '',
  link: '',
  active: true,
  coming_soon: false,
  icon: ''
})

const getInitialValues = (): ICreateNavBarRequest => ({
  type: 'top',
  name: '',
  link: '',
  active: true,
  coming_soon: false,
  icon: '',
  ordering: '',
  subnav: []
})

const subnavSchema = Yup.object({
  name: Yup.string().trim().required('Sub-navigation name is required'),
  link: Yup.string().trim().required('Sub-navigation link is required'),
  icon: Yup.string().trim(),
  active: Yup.boolean(),
  coming_soon: Yup.boolean()
})

const validationSchema = Yup.object({
  type: Yup.string().oneOf(['top', 'bottom']).required('Type is required'),
  name: Yup.string().trim().required('Navigation name is required'),
  link: Yup.string().trim().required('Navigation link is required'),
  icon: Yup.string().trim(),
  active: Yup.boolean(),
  coming_soon: Yup.boolean(),
  subnav: Yup.array().of(subnavSchema).nullable()
})

interface NavBarFormProps {
  isEditing: boolean
  navigationId?: string
  navigationData?: INavBarListDatum | null
  onCloseModal?: () => void
  refetch: () => void
  existingNavigations?: INavBarListDatum[]
}

// Helper function to calculate the next ordering for a given type
const calculateNextOrdering = (existingNavigations: INavBarListDatum[], type: 'top' | 'bottom'): string => {
  const filteredNavs = existingNavigations.filter(nav => nav.type === type)
  if (filteredNavs.length === 0) {
    // Return "1" for top nav, "1B" for bottom nav
    return type === 'bottom' ? '1B' : '1'
  }

  // Extract numeric ordering values and find the maximum
  const orderings = filteredNavs.map(nav => {
    // Extract just the numeric part from ordering (e.g., "1", "2", "1B", "2B" -> 1, 2, 1, 2)
    const numMatch = nav.ordering?.match(/^\d+/)
    return numMatch ? parseInt(numMatch[0]) : 0
  })

  const maxOrdering = Math.max(...orderings, 0)
  // Return with B suffix for bottom nav items
  return type === 'bottom' ? `${maxOrdering + 1}B` : String(maxOrdering + 1)
}

const NavBarForm = ({
  isEditing,
  navigationData,
  navigationId,
  onCloseModal,
  refetch,
  existingNavigations = []
}: NavBarFormProps) => {
  const [createNavigation, {isLoading: isCreatingNavigation}] = useCreateNavigationMutation()
  const [updateNavigation, {isLoading: isUpdatingNavigation}] = useUpdateNavigationMutation()
  const isSubmitting = isCreatingNavigation || isUpdatingNavigation

  const formik = useFormik<ICreateNavBarRequest>({
    initialValues: getInitialValues(),
    validationSchema,
    validateOnMount: true,
    onSubmit: async values => {
      // if subnav is empty, set to null
      if (!values.subnav || values.subnav.length === 0) {
        values.subnav = null
      }
      try {
        if (isEditing) {
          if (!navigationId) {
            throw new Error('Navigation identifier is missing.')
          }
          await updateNavigation({
            navigationId,
            body: values
          }).unwrap()
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>Navigation updated successfully!</>}
                  textColor="#FFF"
                  message="The navigation item has been updated."
                  backgroundColor="#000"
                />
              )
            },
            message: 'Success'
          })
          refetch()
        } else {
          await createNavigation(values).unwrap()
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>Navigation created successfully!</>}
                  textColor="#FFF"
                  message="The navigation item has been created."
                  backgroundColor="#000"
                />
              )
            },
            message: 'Success'
          })
        }

        refetch()
        formik.resetForm({values: getInitialValues()})
        onCloseModal?.()
      } catch (error: any) {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>{error?.data?.message || `Error ${isEditing ? 'updating' : 'creating'} navigation!`}</>}
                textColor="#FFF"
                message={
                  error?.data?.message || `There was an error ${isEditing ? 'updating' : 'creating'} the navigation.`
                }
                backgroundColor="#000"
              />
            )
          },
          message: 'Error'
        })
      }
    }
  })

  useEffect(() => {
    if (isEditing && navigationData) {
      formik.setValues({
        type: navigationData.type,
        name: navigationData.name,
        link: navigationData.link,
        active: navigationData.active,
        coming_soon: navigationData.coming_soon,
        icon: navigationData.icon || '',
        ordering: navigationData.ordering,
        subnav:
          navigationData.subnav?.map(subnavItem => ({
            name: subnavItem.name,
            link: subnavItem.link,
            active: subnavItem.active ?? true,
            coming_soon: subnavItem.coming_soon,
            icon: subnavItem.icon || ''
          })) || []
      })
    }

    if (!isEditing && !navigationData) {
      // Calculate and set the ordering for new navigation based on the default type
      const initialOrdering = calculateNextOrdering(existingNavigations, 'top')
      formik.resetForm({values: {...getInitialValues(), ordering: initialOrdering}})
    }
  }, [isEditing, navigationData, existingNavigations])

  // Update ordering when type changes during creation
  useEffect(() => {
    if (!isEditing && formik.values.type) {
      const newOrdering = calculateNextOrdering(existingNavigations, formik.values.type)
      formik.setFieldValue('ordering', newOrdering)
    }
  }, [formik.values.type, isEditing, existingNavigations])

  const handleAddSubnav = useCallback(() => {
    const current = formik.values.subnav || []
    const newSubnav = [...current, createEmptySubnav()]
    formik.setFieldValue('subnav', newSubnav)
    // When subnav is added, disable main link by setting it to #
    if (newSubnav.length > 0) {
      formik.setFieldValue('link', '#')
    }
  }, [formik.values.subnav, formik.setFieldValue])
  const handleRemoveSubnav = useCallback(
    (index: number) => {
      const current = formik.values.subnav || []
      const updatedSubnav = current.filter((_, idx) => idx !== index)
      formik.setFieldValue('subnav', updatedSubnav)
      // If no subnav left, clear the # value so user can enter a real link
      if (updatedSubnav.length === 0 && formik.values.link === '#') {
        formik.setFieldValue('link', '')
      }
    },
    [formik.values.subnav, formik.values.link, formik.setFieldValue]
  )

  const getSubnavFieldError = (index: number, field: keyof Subnav) => {
    // @ts-ignore - Formik types for nested arrays can be tricky
    const error = formik.errors.subnav?.[index]?.[field]
    // @ts-ignore
    const touched = formik.touched.subnav?.[index]?.[field]

    if (error && touched) {
      return error as string
    }
    return undefined
  }

  return (
    <form className="mt-5 flex flex-col gap-5 p-1" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-[500] capitalize text-black">
            Type<span className="">*</span>
          </label>
          <SelectInput
            onChange={(value: string) => formik.setFieldValue('type', value ?? '')}
            placeholder="Select type"
            className="rounded-lg border-[#DEE1E7] bg-[#F9FAFB] py-1 text-sm placeholder:text-sm"
            errorMessage={formik.touched.type ? formik.errors.type : undefined}
            value={formik.values.type || undefined}
            data={[
              {label: 'Top', value: 'top'},
              {label: 'Bottom', value: 'bottom'}
            ]}
          />
        </div>

        <TextInput
          name="name"
          type="text"
          onChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          placeholder="Enter navigation name"
          className="rounded-[10px] border-[#DEE1E7] bg-white placeholder:text-sm"
          errorMessage={formik.touched.name ? formik.errors.name : undefined}
          value={formik.values.name}
          title={
            <p>
              Navigation Name
              <span className="">*</span>
            </p>
          }
        />

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="w-full">
            <TextInput
              name="link"
              type="text"
              onChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              placeholder="https://example.com"
              className="rounded-[10px] border-[#DEE1E7] bg-white placeholder:text-sm"
              errorMessage={formik.touched.link ? formik.errors.link : undefined}
              value={formik.values.link}
              disabled={(formik.values.subnav?.length ?? 0) > 0}
              title={
                <Tooltip
                  title={<span>For internal links use e.g <code>/example</code> while for external links use <code>https://example.com</code></span>}
                  placement="top"
                >
                  <p className="flex items-center">
                    Link
                    <span className="">*</span>
                    <Icon icon="si:info-line" width="14" height="14" />
                  </p>
                </Tooltip>
              }
            />
          </div>

          {/* <TextInput
            name="icon"
            type="text"
            onChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            placeholder="Paste icon (svg string or asset path)"
            className="rounded-[10px] border-[#DEE1E7] bg-white placeholder:text-sm"
            errorMessage={formik.touched.icon ? formik.errors.icon : undefined}
            value={formik.values.icon}
            title={<p>Icon</p>}
          /> */}
        </div>

        <div className="flex flex-wrap gap-6">
          <Checkbox checked={formik.values.active} onChange={e => formik.setFieldValue('active', e.target.checked)}>
            Active
          </Checkbox>
          <Checkbox
            checked={formik.values.coming_soon}
            onChange={e => formik.setFieldValue('coming_soon', e.target.checked)}
          >
            Coming Soon
          </Checkbox>
        </div>
      </div>

      <div className="rounded-2xl border border-[#DEE1E7] bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="w-[60%]">
            <p className="text-base font-semibold text-black">Sub-navigation</p>
            <p className="text-xs text-[#6B7280]">Add links that should appear under this navigation item.</p>
          </div>
          <button
            type="button"
            onClick={handleAddSubnav}
            className="flex items-center gap-2 rounded-lg border border-black px-3 py-1 text-sm font-medium text-black"
          >
            <Icon icon="ic:round-plus" width={18} height={18} /> Subnav
          </button>
        </div>

        {(!formik.values.subnav || formik.values.subnav.length === 0) && (
          <p className="rounded-lg border border-dashed border-[#D1D5DB] px-4 py-6 text-center text-sm text-[#6B7280]">
            No sub-navigation items yet. Click “Add subnav” to create one.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {(formik.values.subnav || []).map((subnavItem, index) => (
            <div key={`subnav-${index}`} className="rounded-xl border border-[#E5E7EB] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-black">Subnav {index + 1}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveSubnav(index)}
                  className="flex items-center gap-1 text-xs font-medium text-red-500"
                >
                  <Icon icon="mdi:trash-can-outline" width={16} height={16} /> Remove
                </button>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <TextInput
                  name={`subnav[${index}].name`}
                  type="text"
                  onChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  placeholder="Subnav name"
                  className="rounded-[10px] border-[#DEE1E7] bg-white placeholder:text-sm"
                  errorMessage={getSubnavFieldError(index, 'name')}
                  value={subnavItem.name}
                  title={
                    <p>
                      Name
                      <span className="">*</span>
                    </p>
                  }
                />

                <TextInput
                  name={`subnav[${index}].link`}
                  type="text"
                  onChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  placeholder="https://example.com"
                  className="rounded-[10px] border-[#DEE1E7] bg-white placeholder:text-sm"
                  errorMessage={getSubnavFieldError(index, 'link')}
                  value={subnavItem.link}
                  title={
                    <p>
                      Link
                      <span className="">*</span>
                    </p>
                  }
                />
              </div>

              {/* <div className="mt-3">
                <TextInput
                  name={`subnav[${index}].icon`}
                  type="text"
                  onChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  placeholder="Paste icon"
                  className="rounded-[10px] border-[#DEE1E7] bg-white placeholder:text-sm"
                  errorMessage={getSubnavFieldError(index, 'icon')}
                  value={subnavItem.icon}
                  title={<p>Icon</p>}
                />
              </div> */}

              <div className="mt-3 flex flex-wrap gap-4">
                <Checkbox
                  checked={subnavItem.active}
                  onChange={e => formik.setFieldValue(`subnav[${index}].active`, e.target.checked)}
                >
                  Active
                </Checkbox>
                <Checkbox
                  checked={subnavItem.coming_soon}
                  onChange={e => formik.setFieldValue(`subnav[${index}].coming_soon`, e.target.checked)}
                >
                  Coming Soon
                </Checkbox>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-full">
          <CustomButton
            type="submit"
            className="w-full rounded-lg border-2 border-black bg-black p-3 text-sm font-[500] text-white"
            disabled={!formik.isValid || isSubmitting}
          >
            {isSubmitting ? <Spinner /> : isEditing ? 'Update navigation' : 'Create navigation'}
          </CustomButton>
        </div>
      </div>
    </form>
  )
}

export default NavBarForm
