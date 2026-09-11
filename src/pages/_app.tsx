import PageLayout from '@/components/Layout/PageLayout'
import {wrapper} from '@/redux/store'
import '@/styles/globals.css'
import {Uuid} from '@/utils/fx'
import {ConfigProvider} from 'antd'
import type {AppProps} from 'next/app'
import {useEffect, useState} from 'react'
import 'react-phone-input-2/lib/style.css'
import {Provider} from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import {ToastContainer} from 'react-toastify'

export default function App({Component, pageProps}: AppProps) {
  const {store, props} = wrapper.useWrappedStore(pageProps)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log('client')
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      console.log(uuid)
      if (JSON.parse(uuid!) === null) {
        const id = Uuid()
        localStorage.setItem('Clip-Uid', JSON.stringify(id))
      }
    }
  }, [])

  return (
    <Provider store={store}>
      <ConfigProvider theme={{token: {colorPrimary: '#000000'}}}>
        {isClient ? (
          <PageLayout>
            <Component {...props} />
            <ToastContainer limit={3} />
          </PageLayout>
        ) : (
          <></>
        )}
      </ConfigProvider>
    </Provider>
  )
}
