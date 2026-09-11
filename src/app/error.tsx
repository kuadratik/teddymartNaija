'use client'

import CustomerLayout from '@/components/Layout/Customerlayout'
import Link from 'next/link'
import {useEffect} from 'react'

export default function Error({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <CustomerLayout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-8">
            <h1 className="mb-3 text-6xl font-bold text-black">Oops!</h1>
            <div className="relative">
              <img
                src="/images/error-teddy.png"
                alt="Error Bear"
                className="mx-auto mb-6 h-40 w-40"
                onError={e => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dc2626'%3E%3Cpath d='M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1zm0 19a8 8 0 1 1-8-8 8 8 0 0 1-8 8zm1-4h-2v-2h2zm0-4h-2V7h2z'/%3E%3C/svg%3E"
                }}
              />
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-800">Something went wrong!</h2>
          <p className="mb-8 text-gray-600">We encountered an unexpected error. Please try again.</p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-red-600">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={reset}
                className="rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-purple-700"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="rounded-lg border border-black bg-white px-6 py-3 font-medium text-black transition-colors duration-200 hover:bg-purple-50"
              >
                Go to Homepage
              </Link>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                If this problem persists, please{' '}
                <Link href="/contact-us" className="text-black hover:underline">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
