import {useRouter} from 'next/navigation'
import React from 'react'

const PermissionDenied: React.FC = () => {
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-red-50 p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-16 w-16 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Access Denied</h2>
      <p className="mb-8 max-w-md text-gray-500">
        You don't have the required permissions to view this page. Please contact your administrator if you believe this
        is a mistake.
      </p>
      <button
        onClick={() => router.back()}
        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        Go Back
      </button>
    </div>
  )
}

export default PermissionDenied
