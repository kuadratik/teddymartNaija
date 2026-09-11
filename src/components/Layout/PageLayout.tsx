import useNetworkStatus from '@/hooks/useNetworkStatus'
import {addMessage, setTypingStatus} from '@/redux/features/chatSlice'
import {useActiveUserQuery} from '@/services/auth'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import initializeEcho from '@/utils/echo'
import {ConfigProvider} from 'antd'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {useDispatch, useSelector} from 'react-redux'
import {useLocalStorage} from 'react-use'
import ErrorFallback from '../SharedUI/ErrorFallbackComponent'
import PageLoader from '../SharedUI/PageLoader'
import ScrollToTop from '../SharedUI/ScrollToTop'

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
  const allCookies = parseCookies()
  const cookiesToken = allCookies['token']
  const {type} = useSelector((state: any) => state.vendor)
  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery({})
  console.log('🚀 ~ PageLayout ~ activeUserData:', activeUserData?.data?.id)
  const [user] = useLocalStorage<string | null>('authUser', null)
  const dispatch = useDispatch()
  const {isLoading} = useGetAllCategoriesQuery({
    type: type
  })
  const router = useRouter()
  const pathName = router.asPath

  const isOnline = useNetworkStatus()

  useEffect(() => {
    let isSubscribed = true // Track if the component is mounted

    // Early return if required data is not available
    if (!cookiesToken || !activeUserData?.data?.id) {
      console.log('Missing required data:', {cookiesToken, userId: activeUserData?.data?.id})
      return
    }

    const userId = (user as any)?.id || activeUserData.data.id // Store ID in a constant
    console.log('Establishing connection for user:', userId)

    function connect() {
      // Double check we still have valid data before connecting
      if (!isSubscribed || !userId) {
        console.log('Aborting connection - component unmounted or invalid ID')
        return
      }

      const echo = initializeEcho(cookiesToken)

      if (echo) {
        const channel = echo.private(`App.Models.User.${userId}`)

        // Listen for typing events
        channel.listenForWhisper('typing', (event: {user: number; typing: boolean}) => {
          if (!isSubscribed) return // Prevent dispatch if component is unmounted
          console.log('Received typing status:', event)
          dispatch(
            setTypingStatus({
              userId: event.user,
              isTyping: event.typing
            })
          )
        })

        // Message listeners
        channel
          .listenForWhisper('GotMessage', (event: any) => {
            if (!isSubscribed) return
            console.log('Received message:', event)
            dispatch(addMessage(event))
          })
          .listenForWhisper('MessageSent', (event: any) => {
            if (!isSubscribed) return
            console.log('Message sent status:', event)
          })
          .listenForWhisper('MessageDelivered', (event: any) => {
            if (!isSubscribed) return
            console.log('Message delivered status:', event)
          })
          .listenForWhisper('MessageRead', (event: any) => {
            if (!isSubscribed) return
            console.log('Message read status:', event)
          })

        // Basic connection status logging
        echo.connector.pusher.connection.bind('connected', () => {
          if (!isSubscribed) return
          console.log('Successfully connected to websocket for user:', userId)
        })

        echo.connector.pusher.connection.bind('error', (err: any) => {
          if (!isSubscribed) return
          console.error('WebSocket connection error:', err)
        })
      }
    }

    // Establish initial connection
    connect()

    // Cleanup function
    return () => {
      isSubscribed = false // Mark as unmounted
      if (window.Echo) {
        console.log('Disconnecting websocket for user:', userId)
        window.Echo.disconnect()
      }
    }
  }, [cookiesToken, activeUserData?.data?.id, dispatch]) // Include dispatch in dependencies

  // Add this console log outside useEffect to track when activeUserData changes
  console.log('Component rendered with userId:', activeUserData?.data?.id)

  // Function to emit typing status (place this outside useEffect)

  // Function to mark message as read
  const markMessageAsRead = (messageId: string, senderId: string) => {
    if (!window.Echo) return

    window.Echo.private(`App.Models.User.${senderId}`).whisper('MessageRead', {
      messageId: messageId,
      readBy: activeUserData?.data?.id,
      timestamp: new Date().toISOString()
    })
  }

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
        <div className={`!m-0 mx-auto h-full`}>
          {/* {pathName.includes('/auth') ? null : <HeaderComponent />} */}
          {children}
        </div>
        <ScrollToTop />
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default PageLayout
