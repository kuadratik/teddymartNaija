import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import ProfileSkeletonLoader from '@/components/SuperAdmin/Users/Skeleton/ProfileSkeletonLoader'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'
import {
  useCreateAdminStaffPasswordMutation,
  useCreateAdminStaffProfileMutation,
  useGetAdminStaffProfileQuery,
  useGetAllPermissionsQuery
} from '@/services/super-admin/user-management'
import {Icon} from '@iconify/react'
import {message} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {handleShowAdminRole} from '.'
const permissions = ['Manage Navigation Bar', 'Manage Brands', 'Manage Users']

const profileValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required')
})

const passwordValidationSchema = Yup.object().shape({
  old_password: Yup.string().required('Old password is required'),
  new_password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('new_password'), undefined], 'Passwords must match')
    .required('Confirm password is required')
})
const index = () => {
  const {isAuthenticated, isInitialized} = useSuperAdminAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {data: profileData, isLoading: isProfileLoading} = useGetAdminStaffProfileQuery({})
  const [createAdminStaffProfile, {isLoading: isCreatingProfile}] = useCreateAdminStaffProfileMutation()
  const [createAdminStaffPassword, {isLoading: isCreatingPassword}] = useCreateAdminStaffPasswordMutation()
  const {data: permissionsData, isLoading: isPermissionsLoading} = useGetAllPermissionsQuery()
  const initialValues: {
    first_name: string
    last_name: string
    email: string
  } = {
    first_name: '',
    last_name: '',
    email: ''
  }
  const isSuperAdmin = profileData?.data?.role.toLowerCase() === 'super_admin'
  // initialize values for password

  const initialPasswordValues: {
    old_password: string
    new_password: string
    password_confirmation: string
  } = {
    old_password: '',
    new_password: '',
    password_confirmation: ''
  }
  type ProfileFormValues = typeof initialValues
  type PasswordFormValues = typeof initialPasswordValues

  const profileFormik = useFormik<ProfileFormValues>({
    initialValues,
    validationSchema: profileValidationSchema,
    onSubmit: async values => {
      try {
        await createAdminStaffProfile({body: values}).unwrap()
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Profile updated successfully!</>}
                textColor="#FFF"
                message="The profile has been updated."
                backgroundColor="#000"
              />
            )
          },
          message: 'Success'
        })
        profileFormik.resetForm({values})
      } catch (error: any) {
        console.error('Error updating profile:', error)
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>{`${error?.data?.message || 'Unable to update profile.'}`}</>}
                textColor="#FFF"
                message={'Please try again.'}
                backgroundColor="#000"
              />
            )
          },
          message: 'Error'
        })
      }
    }
  })

  const passwordFormik = useFormik<PasswordFormValues>({
    initialValues: initialPasswordValues,
    validationSchema: passwordValidationSchema,
    onSubmit: async values => {
      try {
        await createAdminStaffPassword({
          body: {
            old_password: values.old_password,
            password: values.new_password,
            password_confirmation: values.password_confirmation
          }
        }).unwrap()
        // Show success toast after closing
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Password updated successfully!</>}
                textColor="#FFF"
                message="The password has been updated."
                backgroundColor="#000"
              />
            )
          },
          message: 'Success'
        })
        passwordFormik.resetForm()
      } catch (error: any) {
        console.error('Error updating password:', error)
        message.error(`${error?.data?.message || 'Error updating password'}`)
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>{`${error?.data?.message || 'Unable to update password.'}`}</>}
                textColor="#FFF"
                message={'Please try again.'}
                backgroundColor="#000"
              />
            )
          },
          message: 'Error'
        })
      }
    }
  })
  const handleShowPermissionName = (key: string) => {
    const permission = permissionsData?.data.find(perm => perm.key === key)
    return permission ? permission.name : key
  }
  // Prefill the form for user details
  useEffect(() => {
    if (profileData) {
      profileFormik.setValues({
        first_name: profileData.data.first_name || '',
        last_name: profileData.data.last_name || '',
        email: profileData.data.email || ''
      })
    }
  }, [profileData])

  // Show loading state while checking authentication
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <>
      <SEOHead
        title="Super Admin Dashboard | AfricanDiasporaMart"
        description="Manage and monitor all brands, users, and activities on AfricanDiasporaMart platform"
      />
      <SuperAdminLayout>
        <div className="grid grid-cols-2 items-center gap-4 lg:mb-8">
          <div className="w-fit text-[24px] font-semibold leading-6 text-black">Profile</div>
          <div className="flex justify-end">
            <CustomButton
              type="button"
              onClick={() => router.back()}
              className="w-fit rounded-lg bg-black px-10 py-3 text-white"
            >
              Back
            </CustomButton>
          </div>
        </div>
        {isProfileLoading ? (
          <ProfileSkeletonLoader />
        ) : (
          <div className="flex flex-col gap-6 py-6 lg:bg-[#FFFFFF4D] lg:px-8">
            <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
              <p className="text-base font-bold lg:w-[40%]">User Details</p>
              <div className="lg:w-[60%]">
                <form className="mt-5 flex flex-col gap-3" onSubmit={profileFormik.handleSubmit}>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="w-full">
                        <TextInput
                          name="first_name"
                          type="text"
                          onChange={profileFormik.handleChange}
                          handleBlur={profileFormik.handleBlur}
                          placeholder="Enter first name"
                          className="rounded-[3px] border-0 bg-[#EBEBEB] placeholder:text-sm"
                          errorMessage={profileFormik.touched.first_name ? profileFormik.errors.first_name : undefined}
                          value={profileFormik.values.first_name}
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
                          onChange={profileFormik.handleChange}
                          handleBlur={profileFormik.handleBlur}
                          placeholder="Enter last name"
                          className="rounded-[3px] border-0 bg-[#EBEBEB] placeholder:text-sm"
                          errorMessage={profileFormik.touched.last_name ? profileFormik.errors.last_name : undefined}
                          value={profileFormik.values.last_name}
                          title={
                            <p>
                              Last Name
                              <span className="">*</span>
                            </p>
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="w-full">
                        <TextInput
                          name="email"
                          type="email"
                          disabled={isSuperAdmin}
                          onChange={profileFormik.handleChange}
                          handleBlur={profileFormik.handleBlur}
                          placeholder="Enter email"
                          className="rounded-[3px] border-0 bg-[#EBEBEB] placeholder:text-sm"
                          errorMessage={profileFormik.touched.email ? profileFormik.errors.email : undefined}
                          value={profileFormik.values.email}
                          title={
                            <p>
                              Email
                              <span className="">*</span>
                            </p>
                          }
                        />
                      </div>
                      <div className="w-full">
                        <p className="pb-1 text-sm font-[500] text-black">
                          Role <span className="">*</span>
                        </p>
                        <div className="rounded-[3px] bg-[#EBEBEB] px-4 py-[13px] text-sm font-medium capitalize text-black">
                          {(profileData?.data.role && handleShowAdminRole(profileData?.data.role)) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex lg:mt-0">
                    <CustomButton
                      type="submit"
                      disabled={isCreatingProfile}
                      className="rounded-lg bg-black px-10 py-3 text-white disabled:opacity-50 lg:w-fit"
                    >
                      {isCreatingProfile ? 'Saving...' : 'Save Changes'}
                    </CustomButton>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
              <p className="text-base font-bold lg:w-[40%]">Permissions and accessibility </p>
              <div className="lg:w-[60%]">
                <p className="bg-black px-5 py-3 font-semibold text-white">Permissions</p>
                <div className="flex flex-col rounded-b-lg bg-[#FFFFFF5C] px-5">
                  <div className="py-3">
                    {profileData?.data.role === 'super_admin' ? (
                      <>
                        {permissionsData?.data.length === 0 ? (
                          <p className="text-sm font-medium text-black">No Permissions Available</p>
                        ) : (
                          <>
                            {permissionsData?.data?.map((permission, index) => (
                              <div key={index} className="py-2">
                                <p className="text-sm font-medium capitalize text-black">{permission.name}</p>
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {Array.isArray(profileData?.data.permissions) &&
                          (profileData as any).data.permissions.map((permission: string, index: number) => (
                            <div key={index} className="py-2">
                              <p className="text-sm font-medium capitalize text-black">
                                {handleShowPermissionName(permission)}
                              </p>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
              <p className="text-base font-bold lg:w-[40%]">Change Password</p>
              <div className="lg:w-[60%]">
                <form className="mt-5 flex flex-col gap-3" onSubmit={passwordFormik.handleSubmit}>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="w-full">
                        <TextInput
                          name="old_password"
                          type="password"
                          onChange={passwordFormik.handleChange}
                          handleBlur={passwordFormik.handleBlur}
                          placeholder="Enter current password"
                          className="rounded-[3px] border-0 bg-[#EBEBEB] placeholder:text-sm"
                          errorMessage={
                            passwordFormik.touched.old_password ? passwordFormik.errors.old_password : undefined
                          }
                          value={passwordFormik.values.old_password}
                          title={
                            <p>
                              Old Password
                              <span className="">*</span>
                            </p>
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="relative w-full">
                        <div className="relative">
                          <Icon
                            icon={showPassword ? 'mdi:eye-off-outline' : 'solar:eye-bold'}
                            className="absolute right-4 top-9 z-20 cursor-pointer text-2xl text-black"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        </div>
                        <TextInput
                          name="new_password"
                          type={showPassword ? 'text' : 'password'}
                          onChange={passwordFormik.handleChange}
                          handleBlur={passwordFormik.handleBlur}
                          placeholder="Enter new password"
                          className="rounded-[3px] border-0 bg-[#EBEBEB] placeholder:text-sm"
                          errorMessage={
                            passwordFormik.touched.new_password ? passwordFormik.errors.new_password : undefined
                          }
                          value={passwordFormik.values.new_password}
                          title={
                            <p>
                              New Password
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
                          name="password_confirmation"
                          type={showPassword ? 'text' : 'password'}
                          onChange={passwordFormik.handleChange}
                          handleBlur={passwordFormik.handleBlur}
                          placeholder="Confirm new password"
                          className="rounded-[3px] border-0 bg-[#EBEBEB] placeholder:text-sm"
                          errorMessage={
                            passwordFormik.touched.password_confirmation
                              ? passwordFormik.errors.password_confirmation
                              : undefined
                          }
                          value={passwordFormik.values.password_confirmation}
                          title={
                            <p>
                              Confirm New Password
                              <span className="">*</span>
                            </p>
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex lg:mt-0">
                      <CustomButton
                        type="submit"
                        disabled={isCreatingPassword}
                        className="rounded-lg bg-black px-10 py-3 text-white disabled:opacity-50 lg:w-fit"
                      >
                        {isCreatingPassword ? 'Updating...' : 'Change Password'}
                      </CustomButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </SuperAdminLayout>
    </>
  )
}

export default index
