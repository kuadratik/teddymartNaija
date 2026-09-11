import Category from '@/components/Auth/Products/components/Category'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import CustomerLayout from '@/components/Layout/Customerlayout'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import VendorStore from '@/components/Store'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {wrapper} from '@/redux/store'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import styled from '@emotion/styled'
import axios from 'axios'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import tw from 'tailwind-styled-components'
import {getAuthToken, getClipUid} from './details/[id]'

interface IProps {
  data: any
}
const VendorStorePage = ({data}: IProps) => {
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const [dropDown, setDropDown] = useState(false)
  const dispatch = useDispatch()

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }
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

      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col-reverse lg:flex-col">
          <div className="hidden">
            <Category open={open} setOpen={setOpen} />
          </div>
          <NewNavigation />
          <div className="w-full max-w-7xl lg:mx-auto">
            <SearchWrapper className="lg:hidden">
              <div className="container">
                <TextInput
                  iconName="iconamoon:category"
                  iconClick={() => {
                    setOpen(true)
                  }}
                  iconClassName="cursor-pointer"
                  className="pl-[20px] lg:pl-[25px]"
                  placeholder={`Search for a ${type} or vendor`}
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  name={''}
                  value={search}
                  type={'text'}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      router.push('/search?id=' + search + `&type=${type}`)
                    }
                  }}
                />
              </div>
            </SearchWrapper>
          </div>
        </div>
        <div className="w-full max-w-7xl lg:mx-auto lg:mt-10 lg:px-[40px] xl:px-[0px]">
          <VendorStore data={data} />
        </div>
      </div>
    </>
  )
}

VendorStorePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

const SearchWrapper = styled(tw.div`
mx-auto flex items-center justify-center bg-black px-3 py-[25px] md:mt-5 lg:rounded-[12px] lg:px-0`)`
  .container {
    position: relative;
    width: 100%;
    margin: 0 auto;

    @media (min-width: 1024px) {
      max-width: 735px;
    }
  }

  .second-container {
    position: absolute;
    left: 0.5rem;
    top: 10px;
    z-index: 40;
    display: flex;
    height: 20px;
    width: 80px;
    align-items: flex-start;
    justify-content: flex-start;
    border-right: 1px solid #d1d5db; /* border-r-gray-300 */
    padding-right: 0.25rem; /* pr-1 */

    @media (min-width: 1024px) {
      left: 1rem; /* 4 in Tailwind (16px) */
      top: 50%;
      width: 87px;
      transform: translateY(-50%);
      padding-right: 13px;
    }
  }
`

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
