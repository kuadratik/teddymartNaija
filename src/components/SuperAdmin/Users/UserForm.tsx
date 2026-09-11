import CustomButton from '@/components/SharedUI/Buttons/Button'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {
  useCreateAdminStaffMutation,
  useGetAllPermissionsQuery,
  useUpdateAdminStaffMutation
} from '@/services/super-admin/user-management'
import {IStaffManagementDatum, UserPermissionsResponse} from '@/types/super-admin/user-management'
import {Icon} from '@iconify/react'
import {message} from 'antd' // Added Checkbox & Upload import
import {useFormik} from 'formik'
import {useEffect, useRef, useState} from 'react'
import * as Yup from 'yup'

const UserForm = ({
  isEditing,
  userData,
  userId,
  onCloseModal,
  refetch,
  isPermissionsLoading,
  permissionsData
}: {
  isEditing: boolean
  userId?: string
  userData?: IStaffManagementDatum | null
  onCloseModal?: () => void
  refetch: () => void
  isPermissionsLoading: boolean
  permissionsData: UserPermissionsResponse | undefined
}) => {
  const uploadRef = useRef(null)
  const [hasNewIcon, setHasNewIcon] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const initialValues: {
    first_name: string
    last_name: string
    email: string
    role: string
    password: string
    permissions: string[]
  } = {
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    password: '',
    permissions: []
  }

  const [
    createAdminStaff,
    {
      isLoading: isCreatingAdminStaff,
      isSuccess: isCreateAdminStaffSuccess,
      isError: isCreateAdminStaffError,
      error: createAdminStaffError
    }
  ] = useCreateAdminStaffMutation()
  const [
    updateAdminStaff,
    {
      isLoading: isUpdatingAdminStaff,
      isSuccess: isUpdateAdminStaffSuccess,
      isError: isUpdateAdminStaffError,
      error: updateAdminStaffError
    }
  ] = useUpdateAdminStaffMutation()

  const isSubmitting = isCreatingAdminStaff || isUpdatingAdminStaff
  // Validation schema using Yup
  const validationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    role: Yup.string().required('Role is required'),
    permissions: Yup.array().min(1, 'At least one permission is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Temporary Password is required')
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      try {
        if (isEditing) {
          // If no new icon was selected, omit icon to retain previous icon on server.
          const payload: any = {...values}
          await updateAdminStaff({
            adminStaffId: userId!,
            body: payload
          }).unwrap()
          message.success('User updated successfully')
          // Show success toast after closing
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>User updated successfully!</>}
                  textColor="#FFF"
                  message="The User has been updated."
                  backgroundColor="#000"
                />
              )
            },
            message: 'Success'
          })
        } else {
          await createAdminStaff({
            body: values
          }).unwrap()
          // Show success toast after closing
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>User created successfully!</>}
                  textColor="#FFF"
                  message="The User has been created."
                  backgroundColor="#000"
                />
              )
            },
            message: 'Success'
          })
        }

        formik.resetForm()
        refetch()
        onCloseModal?.()
      } catch (error: any) {
        console.error('Error creating/updating programs card:', error)
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Error {isEditing ? 'updating' : 'creating'} user!</>}
                textColor="#FFF"
                message={error?.data?.message || `There was an error ${isEditing ? 'updating' : 'creating'} the user.`}
                backgroundColor="#000"
              />
            )
          },
          message: 'Error'
        })
      }
    }
  })
  console.log('🚀 ~ ProgramCardForm ~ formik:', formik.isValid)

  // Prefill the form with the data from the programCardData prop
  useEffect(() => {
    if (isEditing && userData) {
      formik.setValues({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        role: userData.role || '',
        password: '',
        permissions: userData.permissions ?? []
      })
    }
  }, [isEditing, userData])

  return (
    <form className="mt-5 flex flex-col gap-3" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="w-full">
            <TextInput
              name="first_name"
              type="text"
              onChange={formik.handleChange}
              placeholder="Enter first name"
              className="rounded-[43px] border-[#DEE1E7] bg-white placeholder:text-sm"
              errorMessage={formik.errors.first_name}
              value={formik.values.first_name}
              title={
                <p>
                  First Name
                  <span className="">*</span>
                </p>
              }
            />
          </div>
          <div className="w-full">
            <TextInput
              name="last_name"
              type="text"
              onChange={formik.handleChange}
              placeholder="Enter last name"
              className="rounded-[43px] border-[#DEE1E7] bg-white placeholder:text-sm"
              errorMessage={formik.errors.last_name}
              value={formik.values.last_name}
              title={
                <p>
                  Last Name
                  <span className="">*</span>
                </p>
              }
            />
          </div>
        </div>
        <div className="w-full">
          <TextInput
            name="email"
            type="email"
            onChange={formik.handleChange}
            placeholder="Enter email"
            className="rounded-[43px] border-[#DEE1E7] bg-white placeholder:text-sm"
            errorMessage={formik.errors.email}
            value={formik.values.email}
            title={
              <p>
                Email
                <span className="">*</span>
              </p>
            }
          />
        </div>
        <div className="relative w-full">
          <div className="relative">
            <Icon
              icon={showPassword ? 'mdi:eye-off-outline' : 'solar:eye-bold'}
              className="absolute right-4 top-9 z-20 cursor-pointer text-2xl text-black"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <TextInput
            name="password"
            type={showPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            placeholder="Enter password"
            className="rounded-[43px] border-[#DEE1E7] bg-white placeholder:text-sm"
            errorMessage={formik.errors.password}
            value={formik.values.password}
            title={
              <p>
                Temporary Password
                <span className="">*</span>
              </p>
            }
          />
        </div>
        <div className="">
          <label className="text-sm font-[500] capitalize text-black">
            Role<span className="">*</span>
          </label>
          <SelectInput
            onChange={(value: string) => formik.setFieldValue('role', value ?? '')}
            placeholder="Select role"
            className="rounded-lg border-[#DEE1E7] bg-[#F9FAFB] py-1 text-sm placeholder:text-sm"
            errorMessage={formik.errors.role || ''}
            value={formik.values.role || undefined}
            tagRender={props => {
              const {value: tagValue} = props
              return (
                <div className="ml-1 flex items-center gap-1">
                  <span className="block w-full text-sm text-black">{tagValue}</span>
                </div>
              )
            }}
            data={[
              {label: 'Admin', value: 'admin'},
              {label: 'Product manager', value: 'product_manager'}
            ]}
          />
        </div>
        <div className="">
          <label className="text-sm font-[500] capitalize text-black">
            Permissions<span className="">*</span>
          </label>
          <SelectInput
            mode="multiple"
            onChange={(value: string[]) => formik.setFieldValue('permissions', value)}
            placeholder="Select permission"
            tagRender={props => {
              const {value: tagValue} = props
              return (
                <div className="ml-1 flex items-center gap-1 rounded-lg bg-gray-200 px-2 py-1">
                  <span className="text-sm text-black">{tagValue}</span>
                  {/* close */}
                  <Icon
                    icon="ic:round-close"
                    className="ml-1 cursor-pointer text-black"
                    onClick={() => {
                      const newPermissions = formik.values.permissions.filter(item => item !== tagValue)
                      formik.setFieldValue('permissions', newPermissions)
                    }}
                  />
                </div>
              )
            }}
            loading={isPermissionsLoading}
            className="rounded-lg border-[#DEE1E7] bg-[#F9FAFB] py-1 placeholder:text-sm"
            errorMessage={
              Array.isArray(formik.errors.permissions)
                ? formik.errors.permissions.join(', ')
                : (formik.errors.permissions as string | undefined)
            }
            value={formik.values.permissions || undefined}
            data={
              permissionsData?.data.map(permission => ({
                label: permission.name,
                value: permission.key
              })) || []
            }
          />
        </div>
      </div>

      <div className="mt-5 flex gap-4">
        <div className="w-full">
          <CustomButton
            type="submit"
            className="w-full rounded-lg border-2 border-black bg-black p-3 text-sm font-[500] text-white"
            disabled={!formik.isValid || isSubmitting}
          >
            {isEditing ? isSubmitting ? <Spinner /> : 'Update' : isSubmitting ? <Spinner /> : 'Create'}
          </CustomButton>
        </div>
      </div>
    </form>
  )
}

export default UserForm
