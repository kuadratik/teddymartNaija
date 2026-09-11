import {useGetAdminStaffProfileQuery} from '@/services/super-admin/user-management'

export const useCheckPermission = (requiredPermission: string) => {
  const {data: profileData, isLoading} = useGetAdminStaffProfileQuery({})

  // Adjust this path based on your actual API response structure
  // Example: profileData?.data?.permissions or profileData?.permissions
  const userPermissions: string[] = profileData?.data?.permissions || []

  // Super admin bypass (optional, if you have a specific role that sees everything)
  const isSuperAdmin = profileData?.data?.role === 'super_admin'

  const hasPermission = isSuperAdmin || userPermissions.includes(requiredPermission)

  return {
    hasPermission,
    isLoading,
    userPermissions
  }
}
