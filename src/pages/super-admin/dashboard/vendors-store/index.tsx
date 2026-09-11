import SEOHead from '@/components/SharedUI/SEOHead'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import PermissionGuard from '@/components/SuperAdmin/PermissionGuard'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'

const index = () => {
  const {isAuthenticated, isInitialized} = useSuperAdminAuth()
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
        title="Super Admin Dashboard | myEKI"
        description="Manage and monitor all brands, users, and activities on myEKI platform"
      />
      <SuperAdminLayout>
        <PermissionGuard permission="manage-vendors-store">index</PermissionGuard>
      </SuperAdminLayout>
    </>
  )
}

export default index
