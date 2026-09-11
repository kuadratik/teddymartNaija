import React from 'react'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import {Icon} from '@iconify/react'
import Link from 'next/link'
import Head from 'next/head'
import {useRouter} from 'next/router'
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth'

const SuperAdminNotFound = () => {
  const router = useRouter()
  const {isAuthenticated, isInitialized} = useSuperAdminAuth()
  console.log("🚀 ~ SuperAdminNotFound ~ isAuthenticated:", isAuthenticated)

  // Define valid super admin routes
  const validRoutes = [
    '/super-admin/login',
    '/super-admin',
    '/super-admin/dashboard',
    '/super-admin/dashboard/brands',
    '/super-admin/dashboard/brands/[id]',
    '/super-admin/dashboard/users',
    '/super-admin/dashboard/users/[id]'
  ]

  // Check if the current path is a valid route
  const isValidRoute = validRoutes.some(route => {
    // Handle dynamic routes by converting [id] to a regex pattern
    const pattern = route.replace(/\[.*?\]/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(router.asPath)
  })

  // redirect to dashboard if authenticated and route is valid
  React.useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/super-admin/dashboard')
    }else if (isInitialized && !isAuthenticated && isValidRoute) {
      router.replace('/super-admin/login')
    }
  }, [isInitialized, isAuthenticated, router])
  // If it's a valid route, this component shouldn't render (Next.js will handle it)
  // But since we're in a catch-all, we need to show 404 for invalid routes
  if (isValidRoute) {
    return null // This shouldn't happen, but just in case
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Head>
        <title>Page Not Found | Super Admin</title>
        <meta name="description" content="The requested admin page could not be found" />
      </Head>

      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
              <Icon icon="heroicons:shield-exclamation" className="text-6xl text-gray-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              404
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Access Restricted</h1>
          <h2 className="mb-4 text-xl font-semibold text-gray-700 md:text-2xl">Super Admin Zone - Page Not Found</h2>
        </div>

        <p className="mb-8 text-gray-600">
          The admin page you're looking for doesn't exist or has been moved. Please check the URL or navigate back to
          the dashboard.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/super-admin/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg"
            >
              <Icon icon="heroicons:home" className="text-lg" />
              Return to Dashboard
            </Link>
            <Link
              href="/super-admin/dashboard/brands"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
            >
              <Icon icon="heroicons:building-storefront" className="text-lg" />
              Manage Brands
            </Link>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <Link href="/contact-us" className="text-black hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

SuperAdminNotFound.getLayout = function getLayout(page: React.ReactElement) {
  return <SuperAdminLayout>{page}</SuperAdminLayout>
}

export default SuperAdminNotFound
