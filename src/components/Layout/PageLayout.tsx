import useNetworkStatus from '@/hooks/useNetworkStatus'
import {addMessage, setTypingStatus} from '@/redux/features/chatSlice'
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
import { useActiveUserQuery } from '@/services/general/general'

interface IProps {
  children: React.ReactNode
}

const authRoutes = ['/auth/sign-up', '/auth/login']

const PageLayout = ({children}: IProps) => {
  const allCookies = parseCookies()
  const cookiesToken = allCookies['token']
  const {type} = useSelector((state: any) => state.vendor)
  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery()
  const [modalOpen, setModalOpen] = React.useState(false)
  const [hasSeenCountryModal, setHasSeenCountryModal] = useLocalStorage('hasSeenCountryModal', false)
  const [user] = useLocalStorage<string | null>('authUser', null)
  const modalShownInSession = useRef(false)
  const previousAuthState = useRef(!!cookiesToken)
  const isInitialMount = useRef(true)
  const justLoggedIn = useRef(false)
  const dispatch = useDispatch()
  const {isLoading} = useGetAllCategoriesQuery({
    type: type
  })
  const router = useRouter()
  const pathName = router.asPath

  const isOnline = useNetworkStatus()

  // Listen for localStorage changes to update modal state
  useEffect(() => {
    const handleStorageChange = () => {
      const currentValue = localStorage.getItem('hasSeenCountryModal')
      if ((!currentValue || currentValue === 'false') && !modalShownInSession.current) {
        console.log('Storage event detected: hasSeenCountryModal changed to false')
        setHasSeenCountryModal(false)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [setHasSeenCountryModal])

  useEffect(() => {
    let isSubscribed = true

    if (!cookiesToken || !activeUserData?.data?.id) {
      console.log('Missing required data:', {cookiesToken, userId: activeUserData?.data?.id})
      return
    }

    const userId = (user as any)?.id || activeUserData.data.id
    console.log('Establishing connection for user:', userId)

    function connect() {
      if (!isSubscribed || !userId) {
        console.log('Aborting connection - component unmounted or invalid ID')
        return
      }

      const echo = initializeEcho(cookiesToken)

      if (echo) {
        const channel = echo.private(`App.Models.User.${userId}`)

        channel.listenForWhisper('typing', (event: {user: number; typing: boolean}) => {
          if (!isSubscribed) return
          console.log('Received typing status:', event)
          dispatch(
            setTypingStatus({
              userId: event.user,
              isTyping: event.typing
            })
          )
        })

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

    connect()

    return () => {
      isSubscribed = false
      if (window.Echo) {
        console.log('Disconnecting websocket for user:', userId)
        window.Echo.disconnect()
      }
    }
  }, [cookiesToken, activeUserData?.data?.id, dispatch, user])

  useEffect(() => {
    const currentAuthState = !!cookiesToken

    if (isInitialMount.current) {
      console.log('Initial page load, setting initial auth state:', currentAuthState)
      isInitialMount.current = false
      previousAuthState.current = currentAuthState
      return
    }

    if (currentAuthState && !previousAuthState.current) {
      console.log('Auth state changed: logged in')
      justLoggedIn.current = true
      modalShownInSession.current = false

      previousAuthState.current = currentAuthState

      if (!pathName.includes('/auth')) {
        console.log('Will show modal after login (not on auth page)')
        setTimeout(() => {
          if (!modalShownInSession.current) {
            console.log('Showing modal post-login')
            setModalOpen(true)
            modalShownInSession.current = true
          }
        }, 300)
      }
    } else if (!currentAuthState && previousAuthState.current) {
      console.log('Auth state changed: logged out')
      justLoggedIn.current = false
      modalShownInSession.current = false
      previousAuthState.current = currentAuthState

      if (window.Echo) {
        console.log('Disconnecting websocket on logout')
        window.Echo.disconnect()
      }
    } else {
      previousAuthState.current = currentAuthState
    }
  }, [cookiesToken, pathName])

  useEffect(() => {
    if (justLoggedIn.current && !pathName.includes('/auth') && !modalShownInSession.current) {
      console.log('User navigated away from auth page after login, showing modal')
      setTimeout(() => {
        if (!modalShownInSession.current) {
          setModalOpen(true)
          modalShownInSession.current = true
        }
      }, 300)
    }
  }, [pathName])

  const handleModalClose = () => {
    console.log('Modal closed by user')
    setModalOpen(false)
    setHasSeenCountryModal(true)
    modalShownInSession.current = true
    justLoggedIn.current = false
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        router.reload()
      }}
      resetKeys={[pathName]}
    >
      <ConfigProvider
        componentSize="middle"
        theme={{
          token: {
            fontSize: 15
          }
        }}
      >
        <div className={`!m-0 mx-auto h-full`}>{children}</div>
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
