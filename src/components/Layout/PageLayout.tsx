import useNetworkStatus from '@/hooks/useNetworkStatus'
import {useGetCountryQuery} from '@/services/countryState'
import {ConfigProvider} from 'antd'
import {useRouter} from 'next/router'
import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from '../SharedUI/ErrorFallbackComponent'
import PageLoader from '../SharedUI/PageLoader'
import {useSelector} from 'react-redux'
import {useGetAllCategoriesQuery} from '@/services/category/category'

interface IProps {
  children: React.ReactNode
}

const authRoutes = ['/auth/sign-up', '/auth/login']
const dashboardRoutes = [
  '/enrolment',
  '/newsletter',
  '/profile',
  '/engagement',
  '/clubs',
  'busing',
  '/planner',
  '/forms',
  '/finance',
  '/gradebook',
  '/attendance',
  '/Asset'
]

// Assuming you want to handle standard JavaScript Errors

const PageLayout = ({children}: IProps) => {
  const {type} = useSelector((state: any) => state.vendor)

  const {isLoading} = useGetAllCategoriesQuery({
    type: type
  })
  const router = useRouter()
  const pathName = router.asPath

  const isOnline = useNetworkStatus()

  // error boundary component for handling errors

  // useEffect(() => {
  //   if (!isOnline) {
  //     showPlannerToast({
  //       options: {
  //         customToast: (
  //           <CustomToast
  //             altText={'You are offline'}
  //             title={
  //               <>
  //                 You are <span className="font-bold">offline.</span>
  //               </>
  //             }
  //             image={imgError}
  //             textColor="red"
  //             message="Please check your internet connection."
  //             backgroundColor="#FCFCFD"
  //           />
  //         )
  //       },
  //       message: 'Please check your internet connection.'
  //     })
  //   }
  // }, [isOnline])

  // add Loader

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        router.reload()
      }}
      resetKeys={[pathName]}
    >
      <ConfigProvider
        componentSize="middle"
        theme={{
          token: {
            // colorPrimary: '#00000',
            fontSize: 15
          }
        }}
      >
        <div className={`!m-0 mx-auto min-h-screen`}>{children}</div>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default PageLayout
