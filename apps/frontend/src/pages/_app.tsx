import PageLayout from '@/components/Layout/PageLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {useHolidayPeriod} from '@/hooks/useHolidayPeriod'
import {setSelectedLanguage} from '@/redux/apiSlice/countrySlice'
import {wrapper} from '@/redux/store'
import '@/styles/globals.css'
import {Uuid} from '@/utils/fx'
import {GoogleTagManager} from '@next/third-parties/google'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {ConfigProvider} from 'antd'
import {NextPage} from 'next'
import type {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import Script from 'next/script'
import {parseCookies, setCookie} from 'nookies'
import 'quill/dist/quill.snow.css'
import {ReactElement, ReactNode, useEffect, useState} from 'react'
import 'react-phone-input-2/lib/style.css'
import {Provider} from 'react-redux'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
// Extend the NextPage type to include the getLayout property
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({Component, pageProps}: AppPropsWithLayout) => {
  const [location, setLocation] = useState<{lat: number | null; lng: number | null}>({lat: null, lng: null})
  const [error, setError] = useState<string | null>(null)
  const isHolidaySeason = useHolidayPeriod()
  const {structuredData, hasAdSenseScript, ...rest} = pageProps
  const {store, props: storeProps} = wrapper.useWrappedStore(rest)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

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

  useEffect(() => {
    // Check if GTM loaded after a short delay
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        console.log('GTM loaded successfully:', window.dataLayer)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getLayout = Component.getLayout || (page => page)

  return (
    <>
      <GoogleTagManager gtmId="GTM-MM3TLHHQ" />
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" async />
      <Script src="https://cdn.headwayapp.co/widget.js" strategy="beforeInteractive" />
      <SEOHead
        title={pageProps.seoData?.title || 'myEKI'}
        structuredData={structuredData}
        description={
          pageProps.seoData?.description ||
          'myEKI is a local and global e-commerce marketplace designed to connect small, medium and large businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without any extra costs. Join myEKI today and start selling for free! Find products and services near you!!'
        }
        hasAdSenseScript={hasAdSenseScript}
        image={pageProps.seoData?.image || '/assets/myEKIHome.png'}
        key={pageProps.seoData?.slug || ''}
        storeTitle={pageProps.seoData?.title || 'myEKI - Marketplace'}
        url={`${process.env.baseRouteProductionLink}${router?.asPath || ''}`}
      />
      <GoogleOAuthProvider clientId={process.env.googleClientID!!}>
        <Provider store={store}>
          <AppContent
            location={location}
            Component={Component}
            pageProps={pageProps}
            isClient={isClient}
            getLayout={getLayout}
          />
        </Provider>
      </GoogleOAuthProvider>
    </>
  )
}

const AppContent = ({
  location,
  Component,
  pageProps,
  isClient,
  getLayout
}: {
  location: {lat: number | null; lng: number | null}
  Component: NextPageWithLayout
  pageProps: any
  isClient: boolean
  getLayout: (page: ReactElement) => ReactNode
}) => {
  const {selectionOccurred, selectedLanguage} = useAppSelector(state => state.country)
  const dispatch = useAppDispatch()
  const [country, setCountry] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getCountry = async () => {
      // Check if there's a persisted currency in localStorage
      const persistedCountry = typeof window !== 'undefined' ? localStorage.getItem('country') : null

      // If we have a persisted currency and the current selected language is still USD (default),
      // don't run geolocation - the persisted value will be used
      if (persistedCountry && selectedLanguage.value === 'USD' && !selectionOccurred) {
        // Persisted state will be loaded by Redux store, so we skip geolocation
        return
      }

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

            setCountry(foundCountry)
          } else {
            setError('Unable to get country from coordinates.')
          }
        } catch (error) {
          setError('Error fetching geolocation data.')
        }
      }
    }

    selectionOccurred === false && getCountry()
  }, [location, dispatch, selectionOccurred, selectedLanguage])

  return (
    <ConfigProvider theme={{token: {colorPrimary: '#000000'}}}>
      {isClient ? (
        <PageLayout>
          {getLayout(<Component {...pageProps} />)}
          <ToastContainer limit={3} style={{zIndex: 10001}} />
        </PageLayout>
      ) : (
        <></>
      )}
    </ConfigProvider>
  )
}

export default App
