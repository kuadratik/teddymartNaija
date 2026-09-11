import React from 'react'
import SuperAdminHeader from './Header'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'

interface SuperAdminLayoutProps {
  children: React.ReactNode
  className?: string
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({children, className = ''}) => {
  const {admin, isAuthenticated} = useSuperAdminAuth()

  // If not authenticated, show loading (though the hook should redirect)
  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={`min-h-screen pb-20 ${className}`}
      style={{
        background: 'linear-gradient(225.51deg, #F2F2F2 48.73%, #FFE1CF 104.61%)'
      }}
    >
      {/* Header */}
      <SuperAdminHeader />

      {/* Main Content container */}
      <main className="mx-auto w-full max-w-screen-xl px-5 py-8 pt-28 lg:px-5 xl:px-0 2xl:max-w-screen-2xl">
        {children}
      </main>
    </div>
  )
}

export default SuperAdminLayout
