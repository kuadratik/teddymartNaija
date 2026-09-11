import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import VendorStore from '@/components/Store'
import TopBar from '@/components/Vendor/TopBar'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import axios from 'axios'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {useEffect} from 'react'
import {getAuthToken, getClipUid} from './details/[id]'
import {wrapper} from '@/redux/store'

interface IProps {
  data: any
}
const VendorStorePage = ({data}: IProps) => {
  const router = useRouter()
  useEffect(() => {
    getClipUid()
    getAuthToken()
  }, [])
  return (
    <>
      <SEOHead
        title={`myEKI | ${capitalizeOnlyFirstLetter(data?.data?.name)}` || 'myEKI | Store'}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            {' '}
            <div className="flex w-full flex-col gap-8">
              <TopBar title="Store" showClip />
              <div className="mt-[60px]">
                <VendorStore data={data} />
              </div>
              {/* <AnimatePresence>
            <FormContainer isActive={true} id={'store-information'}> */}
              {/* <ChangePasswordComponent /> */}
              {/* </FormContainer>
          </AnimatePresence> */}
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default VendorStorePage

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {selectedLanguage} = store.getState().country // Access Redux state

  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || '' // Use default if not found
  const authToken = cookies['authToken'] || '' // Use default if not found
  const {type, id} = context.query

  if (!id || !type) {
    return {notFound: true}
  }

  try {
    const res = await axios.get(`${process.env.baseUrl}front/stores/${id}/listings?listingType=${type}`, {
      headers: {
        Authorization: authToken || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'clip-uid': clipUid,
        currency: selectedLanguage?.value
      }
    })
    console.log('API response status:', res.status)
    console.log('API response data:', JSON.stringify(res.data, null, 2))
    const data = res.data

    // Extract SEO-related information from data
    const seoData = {
      title: `myEKI | ${data?.data?.name}`, // Use product name in title
      description: `Explore ${data?.data?.name} store and its products ` || 'Product description not available', // Fallback if description is missing
      image: `${process.env.imageBaseUrl}/${data.data.banner_path}`, // Use the first product image
      slug: data?.data?.name
    }

    // Pass both product and SEO data to the page
    return {props: {data, seoData}}
  } catch (error) {
    console.error('Error fetching product data:', error)
    return {notFound: true}
  }
})
