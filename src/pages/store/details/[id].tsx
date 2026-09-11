import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import ProductInfo from '@/components/Store/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import {capitalizeFirstLetter} from '@/utils/fx'
import axios from 'axios'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {URLSearchParams} from 'url'

export function getClipUid() {
  if (typeof window !== 'undefined') {
    const clipUid = localStorage.getItem('Clip-Uid')
    if (clipUid) {
      console.log('🚀 ~ getClipUid ~ clipUid:', clipUid)
      // Set the Clip-Uid as a cookie so it can be accessed in getServerSideProps
      return clipUid
    }
  }
  return null
}
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      console.log('🚀 ~ getAuthToken ~ authToken:', authToken)
      // Set the Clip-Uid as a cookie so it can be accessed in getServerSideProps
      return authToken
    }
  }
  return null
}
const ProductDetailsPage = ({data, seoData}: any) => {
  console.log('🚀 ~ ProductDetailsPage ~ seoData:', seoData)
  console.log('🚀 ~ ProductDetailsPage ~ data:', data)
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()
  console.log('🚀 ~ ProductDetailsPage ~ router:', router?.asPath)
  const [params, setParams] = useState<URLSearchParams | null>(null)
  useEffect(() => {
    getClipUid()
    getAuthToken()
  }, [])
  return (
    <>
      <SEOHead
        title={seoData?.title ? `${seoData?.title}` : `myEKI | ${capitalizeFirstLetter(type)} Info`}
        description={seoData.description}
        url={`${process.env.baseRouteProductionLink}${router?.asPath || ''}`}
      />

      <BaseLayout>
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col gap-8">
              <div className="px-[20px] lg:px-20">
                <TopBar title={`${capitalizeFirstLetter(type)} Info`} showClip />
              </div>
              <div className="mt-[60px]">
                <ProductInfo data={data} isLoading={false} setParams={setParams} />
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default ProductDetailsPage

// getserversideprops
export const getServerSideProps = async (context: any) => {
  const {id, slug} = context.query
  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || '' // Use default if not found
  const authToken = cookies['authToken'] || '' // Use default if not found

  try {
    // Fetch product details
    const res = await axios.get(`${process.env.baseUrl}front/stores/${id}/listings/${slug}`, {
      headers: {
        Authorization: authToken || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'clip-uid': clipUid
      }
    })

    const data = await res.data

    // Extract SEO-related information from data
    const seoData = {
      title: `myEKI | ${data.data.name}`, // Use product name in title
      description: data.data.description || 'Product description not available', // Fallback if description is missing
      image: `${process.env.imageBaseUrl}/${data.data.images[0]}`, // Use the first product image
      slug: data.data.slug
    }

    // Pass both product and SEO data to the page
    return {props: {data, seoData}}
  } catch (error) {
    console.error('Error fetching product data:', error)
    return {notFound: true}
  }
}
