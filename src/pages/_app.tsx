import PageLayout from '@/components/Layout/PageLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {useHolidayPeriod} from '@/hooks/useHolidayPeriod'
import {setSelectedLanguage} from '@/redux/apiSlice/countrySlice'
import {wrapper} from '@/redux/store'
import '@/styles/globals.css'
import {Uuid} from '@/utils/fx'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {ConfigProvider} from 'antd'
import {NextPage} from 'next'
import type {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import Script from 'next/script'
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

const MyApp = ({Component, pageProps}: AppPropsWithLayout) => {
  const {selectionOccurred} = useAppSelector(state => state.country)
  const dispatch = useAppDispatch()
  const [location, setLocation] = useState<{lat: number | null; lng: number | null}>({lat: null, lng: null})
  const [country, setCountry] = useState('')
  const [error, setError] = useState<string | null>(null)
  const isHolidaySeason = useHolidayPeriod()

  const {store, props} = wrapper.useWrappedStore(pageProps)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      console.log(uuid)
      if (JSON.parse(uuid!) === null) {
        const id = Uuid()
        localStorage.setItem('Clip-Uid', JSON.stringify(id))
      }
    }
  }, [])

  // Function to get user's latitude and longitude
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

  // Function to get user's latitude and longitude
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

  // Function to get the country from lat/lng using OpenStreetMap Nominatim API
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
            // Checking the country
            if (foundCountry === 'Nigeria') {
              // console.log("User is in Nigeria");
              dispatch(
                setSelectedLanguage({
                  key: 'ng',
                  value: 'NGN',
                  name: 'Nigeria',
                  currencySign: '₦'
                })
              )
            } else if (foundCountry === 'United States') {
              // console.log('User is in the United States')
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

            setCountry(foundCountry) // Set the country name
          } else {
            setError('Unable to get country from coordinates.')
          }
        } catch (error) {
          setError('Error fetching geolocation data.')
        }
      }
    }

    selectionOccurred === false && getCountry()
  }, [location])

  const getLayout = Component.getLayout || (page => page)

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" async />
      <Script src="https://cdn.headwayapp.co/widget.js" strategy="beforeInteractive" />

      <SEOHead
        title={pageProps.seoData?.title || 'myEKI'}
        description={
          pageProps.seoData?.description ||
          'myEKI is a local and global e-commerce marketplace designed to connect small, medium and large businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without any extra costs. Join myEKI today and start selling for free! Find products and services near you!!'
        }
        image={pageProps.seoData?.image || '/assets/myEKIHome.png'}
        key={pageProps.seoData?.slug || ''}
        storeTitle={pageProps.seoData?.title || 'myEKI - Marketplace'}
        url={`${process.env.baseRouteProductionLink}${router?.asPath || ''}`}
      />
      <GoogleOAuthProvider clientId={process.env.googleClientID!!}>
        <Provider store={store}>
          <ConfigProvider theme={{token: {colorPrimary: '#000000'}}}>
            {isClient ? (
              <PageLayout>
                {getLayout(<Component {...pageProps} />)} <ToastContainer limit={3} />
              </PageLayout>
            ) : (
              <></>
            )}
          </ConfigProvider>
        </Provider>
      </GoogleOAuthProvider>
    </>
  )
}

export default wrapper.withRedux(MyApp)
