import CustomButton from '@/components/SharedUI/Buttons/Button'
import SEOHead from '@/components/SharedUI/SEOHead'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import UserDetailSkeletonLoader from '@/components/SuperAdmin/Users/Skeleton/UserDetailSkeletonLoader'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'
import {useGetAdminStaffDetailsQuery, useGetAllPermissionsQuery} from '@/services/super-admin/user-management'
import {useRouter} from 'next/router'
import * as Yup from 'yup'
import {handleShowAdminRole} from '.'
const permissions = ['Manage Navigation Bar', 'Manage Brands', 'Manage Users']

const validationSchema = Yup.object().shape({
  name: Yup.string().required('First name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  temporary_Password: Yup.string().required('Temporary password is required'),
  role: Yup.array().min(1, 'At least one role is required').required('Role is required'),
  permission: Yup.array().min(1, 'At least one permission is required').required('Permission is required')
})
const index = () => {
  const {isAuthenticated, isInitialized} = useSuperAdminAuth()
  const router = useRouter()
  const {id} = router.query
  const {data: permissionsData, isLoading: isPermissionsLoading} = useGetAllPermissionsQuery()
  const {data, isLoading, error} = useGetAdminStaffDetailsQuery(
    {
      adminStaffId: id as string
    },
    {
      skip: !id
    }
  )
  const handleShowPermissionName = (key: string) => {
    const permission = permissionsData?.data.find(perm => perm.key === key)
    return permission ? permission.name : key
  }
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
          <div className="w-fit text-[24px] font-semibold leading-6 text-black">User</div>
          <div className="flex justify-end">
            <CustomButton onClick={() => router.back()} className="w-fit rounded-lg bg-black px-10 py-3 text-white">
              Back
            </CustomButton>
          </div>
        </div>
        {isLoading ? (
          <UserDetailSkeletonLoader />
        ) : (
          <div className="flex flex-col gap-6 py-6 lg:bg-[#FFFFFF4D] lg:px-8">
            <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
              <p className="text-base font-bold lg:w-[40%]">User Details</p>
              <div className="lg:w-[60%]">
                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="w-full">
                        <p className="pb-1 text-sm font-[500] text-black">First Name</p>
                        <div className="rounded-[3px] bg-[#EBEBEB] px-4 py-[13px] text-sm font-medium text-black">
                          {data?.data.first_name || ''}
                        </div>
                      </div>
                      <div className="w-full">
                        <p className="pb-1 text-sm font-[500] text-black">Last Name</p>
                        <div className="rounded-[3px] bg-[#EBEBEB] px-4 py-[13px] text-sm font-medium text-black">
                          {data?.data.last_name || ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="w-full">
                        <p className="pb-1 text-sm font-[500] text-black">Email</p>
                        <div className="rounded-[3px] bg-[#EBEBEB] px-4 py-[13px] text-sm font-medium text-black">
                          {data?.data.email || ''}
                        </div>
                      </div>
                      <div className="w-full">
                        <p className="pb-1 text-sm font-[500] text-black">Role</p>
                        <div className="rounded-[3px] bg-[#EBEBEB] px-4 py-[13px] text-sm font-medium text-black">
                          {(data?.data.role && handleShowAdminRole(data?.data.role)) || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
              <p className="text-base font-bold lg:w-[40%]">Permissions and accessibility </p>
              <div className="lg:w-[60%]">
                <p className="bg-black px-5 py-3 font-semibold text-white">Permissions</p>
                <div className="flex flex-col rounded-b-lg bg-[#FFFFFF5C] px-5">
                  {data?.data.role === 'super_admin' ? (
                    <>
                      {permissionsData?.data.length === 0 ? (
                        <p className="text-sm font-medium text-black">No Permissions Available</p>
                      ) : (
                        <>
                          {permissionsData?.data?.map((permission, index) => (
                            <div key={index} className="py-2">
                              <p className="text-sm font-medium text-black">{permission.name}</p>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {Array.isArray(data?.data.permissions) &&
                        (data as any).data.permissions.map((permission: string, index: number) => (
                          <div key={index} className="py-2">
                            <p className="text-sm font-medium text-black capitalize">{handleShowPermissionName(permission)}</p>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </SuperAdminLayout>
    </>
  )
}

export default index
