import CustomerLayout from '@/components/Layout/Customerlayout'
import type {Metadata} from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found | myEKI',
  description: "We couldn't find the page you were looking for"
}

export default function NotFoundPage() {
  return (
    <CustomerLayout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-8">
            <h1 className="mb-3 text-9xl font-bold text-black">404</h1>
            <div className="relative">
              <img
                src="/images/sad-teddy.png"
                alt="Sad Teddy Bear"
                className="mx-auto mb-6 h-40 w-40"
                onError={e => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d1d5db'%3E%3Cpath d='M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1zm0 19a8 8 0 1 1-8-8 8 8 0 0 1-8 8zm4-8a1 1 0 0 1-1 1H9a1 1 0 0 1 0-2h6a1 1 0 0 1 1 1z'/%3E%3C/svg%3E"
                }}
              />
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-800">Oops! This page has gone missing</h2>
          <p className="mb-8 text-gray-600">The page you're looking for doesn't exist or has been moved.</p>

          <div className="space-y-4">
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/home"
                className="rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-purple-700"
              >
                Return to Home
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-black bg-white px-6 py-3 font-medium text-black transition-colors duration-200 hover:bg-purple-50"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                If you believe this is an error, please{' '}
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
