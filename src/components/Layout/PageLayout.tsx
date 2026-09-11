import useNetworkStatus from '@/hooks/useNetworkStatus'
import {addMessage, setTypingStatus} from '@/redux/features/chatSlice'
import {useActiveUserQuery} from '@/services/auth'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import initializeEcho from '@/utils/echo'
import {ConfigProvider} from 'antd'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect, useRef} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {useDispatch, useSelector} from 'react-redux'
import {useLocalStorage} from 'react-use'
import PersonalizeModals from '../Personalize/PersonalizeModals'
import ErrorFallback from '../SharedUI/ErrorFallbackComponent'
import PageLoader from '../SharedUI/PageLoader'
import ScrollToTop from '../SharedUI/ScrollToTop'

interface IProps {
  children: React.ReactNode
}

const authRoutes = ['/auth/sign-up', '/auth/login']

const PageLayout = ({children}: IProps) => {
  const allCookies = parseCookies()
  const cookiesToken = allCookies['token']
  const {type} = useSelector((state: any) => state.vendor)
  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery({})
  const [modalOpen, setModalOpen] = React.useState(false)
  const [hasSeenCountryModal, setHasSeenCountryModal] = useLocalStorage('hasSeenCountryModal', false)
  console.log('🚀 ~ PageLayout ~ hasSeenCountryModal:', hasSeenCountryModal)
  const [user] = useLocalStorage<string | null>('authUser', null)
  const modalShownInSession = useRef(false)
  const previousAuthState = useRef(!!cookiesToken)
  const isInitialMount = useRef(true)
  const dispatch = useDispatch()
  const {isLoading} = useGetAllCategoriesQuery({
    type: type
  })
  const router = useRouter()
  const pathName = router.asPath

  const isOnline = useNetworkStatus()

  // Listen for localStorage changes to update modal state
  useEffect(() => {
    // Handler for storage events
    const handleStorageChange = () => {
      const currentValue = localStorage.getItem('hasSeenCountryModal')
      // Only update if we haven't shown the modal in this session and value is false
      if ((!currentValue || currentValue === 'false') && !modalShownInSession.current) {
        setHasSeenCountryModal(false)
      }
    }

    // Add event listener
    window.addEventListener('storage', handleStorageChange)

    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [setHasSeenCountryModal])

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

  // Reset state when auth changes
  useEffect(() => {
    const currentAuthState = !!cookiesToken

    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousAuthState.current = currentAuthState
      return
    }

    // ONLY show modal when user just logged in (not on initial page load)
    if (currentAuthState && !previousAuthState.current) {
      console.log('Auth state changed: logged in')
      modalShownInSession.current = false

      // Force modal to show by resetting localStorage value
      localStorage.removeItem('hasSeenCountryModal')
      setHasSeenCountryModal(false)

      // Show modal immediately if not on auth page
      if (!pathName.includes('/auth')) {
        setTimeout(() => {
          setModalOpen(true)
        }, 300) // Slightly longer timeout to ensure redirect is complete
      }
    }

    // User just logged out
    if (!currentAuthState && previousAuthState.current) {
      console.log('Auth state changed: logged out')
      // Clean up session state
      modalShownInSession.current = false
    }

    // Update previous auth state
    previousAuthState.current = currentAuthState
  }, [cookiesToken, pathName, setHasSeenCountryModal])

  // Main modal display logic - ONLY show after login, not on initial load
  useEffect(() => {
    // Never show modal on initial app load - only after explicit login action
    if (isInitialMount.current || !previousAuthState.current) return

    // Only proceed if user is logged in
    if (!cookiesToken) return

    // Only show if hasn't seen modal and not on auth page
    if (hasSeenCountryModal === false && !pathName.includes('/auth') && !modalShownInSession.current) {
      console.log('Showing country modal on login')
      setModalOpen(true)
      modalShownInSession.current = true
    }
  }, [hasSeenCountryModal, pathName, cookiesToken])

  // Function to mark message as read
  const markMessageAsRead = (messageId: string, senderId: string) => {
    if (!window.Echo) return

    window.Echo.private(`App.Models.User.${senderId}`).whisper('MessageRead', {
      messageId: messageId,
      readBy: activeUserData?.data?.id,
      timestamp: new Date().toISOString()
    })
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setHasSeenCountryModal(true)
    modalShownInSession.current = true
  }

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
        <ScrollToTop setModalOpen={setModalOpen} />
      </ConfigProvider>
      {pathName.includes('/auth') ? null : (
        <PersonalizeModals
          hasSeenCountryModal={hasSeenCountryModal}
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
          setModalOpen={setModalOpen}
          setHasSeenCountryModal={setHasSeenCountryModal}
        />
      )}
    </ErrorBoundary>
  )
}

export default PageLayout
