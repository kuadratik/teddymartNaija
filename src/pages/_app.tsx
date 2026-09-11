import PageLayout from '@/components/Layout/PageLayout'
import {wrapper} from '@/redux/store'
import '@/styles/globals.css'
import {ConfigProvider} from 'antd'
import type {AppProps} from 'next/app'
import 'react-phone-input-2/lib/style.css'
import {Provider} from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'

export default function App({Component, pageProps}: AppProps) {
  const {store, props} = wrapper.useWrappedStore(pageProps)
  return (
    <Provider store={store}>
      <ConfigProvider theme={{token: {colorPrimary: '#000000'}}}>
        <PageLayout>
          <Component {...props} />
        </PageLayout>
      </ConfigProvider>
    </Provider>
  )
}
