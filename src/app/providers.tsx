'use client'

import PageLayout from '@/components/Layout/PageLayout'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {setSelectedLanguage} from '@/redux/apiSlice/countrySlice'
import {wrapper} from '@/redux/store'
import {Uuid} from '@/utils/fx'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {ConfigProvider} from 'antd'
import {usePathname} from 'next/navigation'
import {parseCookies, setCookie} from 'nookies'
import {ReactNode, useEffect, useState} from 'react'
import {Provider} from 'react-redux'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Providers({children, pageProps}: {children: ReactNode; pageProps?: any}) {
  const {store} = wrapper.useWrappedStore(pageProps || {})

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ClIENT_ID || ''}>
      <Provider store={store}>
        <AppContent>{children}</AppContent>
      </Provider>
    </GoogleOAuthProvider>
  )
}

function AppContent({children}: {children: ReactNode}) {
  const [location, setLocation] = useState<{lat: number | null; lng: number | null}>({
    lat: null,
    lng: null
  })
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const {selectionOccurred} = useAppSelector(state => state.country)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  // Initialize Clip-Uid
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const cookies = parseCookies()
      let clipUid = cookies['Clip-Uid']

      if (!clipUid) {
        const localUuid = localStorage.getItem('Clip-Uid')
        if (localUuid && localUuid !== 'null') {
          try {
            clipUid = JSON.parse(localUuid)
          } catch (e) {
            clipUid = localUuid
          }
        }
      }

      if (!clipUid) {
        clipUid = Uuid()
      }

      localStorage.setItem('Clip-Uid', JSON.stringify(clipUid))
      setCookie(null, 'Clip-Uid', clipUid, {
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      })
    }
  }, [])

  // Get user's geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords
          setLocation({lat: latitude, lng: longitude})
        },
        error => {
          setError(error.message)
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }, [])

  // Set country based on geolocation
  useEffect(() => {
    const getCountry = async () => {
      if (location.lat && location.lng) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          )
          const data = await response.json()

          if (data && data.address && data.address.country) {
            const foundCountry = data.address.country
            if (foundCountry === 'Nigeria') {
              dispatch(
                setSelectedLanguage({
                  key: 'ng',
                  value: 'NGN',
                  name: 'Nigeria',
                  currencySign: '₦'
                })
              )
            } else if (foundCountry === 'United States') {
              dispatch(
                setSelectedLanguage({
                  key: 'us',
                  value: 'USD',
                  name: 'United States',
                  currencySign: '$'
                })
              )
            } else if (foundCountry === 'Canada') {
              dispatch(
                setSelectedLanguage({
                  key: 'ca',
                  value: 'CAD',
                  name: 'Canada',
                  currencySign: '$'
                })
              )
            } else {
              dispatch(
                setSelectedLanguage({
                  key: 'us',
                  value: 'USD',
                  name: 'United States',
                  currencySign: '$'
                })
              )
            }
          } else {
            setError('Unable to get country from coordinates.')
          }
        } catch (error) {
          setError('Error fetching geolocation data.')
        }
      }
    }

    selectionOccurred === false && getCountry()
  }, [location, dispatch, selectionOccurred])

  return (
    <ConfigProvider theme={{token: {colorPrimary: '#000000'}}}>
      {isClient ? (
        <PageLayout>
          {children}
          <ToastContainer limit={3} style={{zIndex: 10001}} />
        </PageLayout>
      ) : (
        <></>
      )}
    </ConfigProvider>
  )
}
