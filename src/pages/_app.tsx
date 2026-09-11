import PageLayout from '@/components/Layout/PageLayout'
import {wrapper} from '@/redux/store'
import '@/styles/globals.css'
import {Uuid} from '@/utils/fx'
import {ConfigProvider} from 'antd'
import type {AppProps} from 'next/app'
import {JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState} from 'react'
import 'react-phone-input-2/lib/style.css'
import {Provider} from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import {ToastContainer} from 'react-toastify'
import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import {NextPage} from 'next'

// Extend the NextPage type to include the getLayout property
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({Component, pageProps}: AppPropsWithLayout) {
  const {store, props} = wrapper.useWrappedStore(pageProps)

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
  const getLayout = Component.getLayout || (page => page)
  return (
    <Provider store={store}>
      <ConfigProvider theme={{token: {colorPrimary: '#000000'}}}>
        {isClient ? (
          <PageLayout>
            {getLayout(<Component {...pageProps} />)}
            <ToastContainer limit={3} />
          </PageLayout>
        ) : (
          <></>
        )}
      </ConfigProvider>
    </Provider>
  )
}
