import React from 'react'
import {useCheckPermission} from '@/hooks/useCheckPermission'
import PermissionDenied from './PermissionDenied'

interface PermissionGuardProps {
  permission: string
  children: React.ReactNode
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({permission, children}) => {
  const {hasPermission, isLoading} = useCheckPermission(permission)

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (!hasPermission) {
    return <PermissionDenied />
  }

  return <>{children}</>
}

export default PermissionGuard
