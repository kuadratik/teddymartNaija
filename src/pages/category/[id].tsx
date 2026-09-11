import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import DetailsCard from '@/components/Store/components/DetailsCard'
import TopBar from '@/components/Vendor/TopBar'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetSearchStoreListingQuery} from '@/services/store'
import axios from 'axios'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

function getClipUid() {
  if (typeof window !== 'undefined') {
    const clipUid = localStorage.getItem('Clip-Uid')
    if (clipUid) {
      // Set the Clip-Uid as a cookie so it can be accessed in getServerSideProps
      return clipUid
    }
  }
  return null
}
function getAuthToken() {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      return authToken
    }
  }
  return null
}
const CategoryIdPage = ({category, seoData}: {category: any; seoData: any}) => {
  const router = useRouter()
  const {id} = router.query
  const {type} = useSelector((state: any) => state.vendor)

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
    listType: type,
    category: Number(id),
    search: searchValue?.length ? searchValue : search,
    currency: selectedLanguage.value
  })

  const {data: categoryData, isLoading: isCategoryLoading} = useGetAllCategoriesQuery({
    type: type
  })

  const [signUpUser, setSignUpUser] = useState<any>(null)
  useEffect(() => {
    getClipUid()
    getAuthToken()
  }, [])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = JSON.parse(localStorage.getItem('signUpUser')!)
      setSignUpUser(uuid)
    }
  }, [])

  // const {data: recommendedData} = useGetRecordInteractionQuery({
  //   category: categoryData?.data?.find((category: any) => category.id === Number(id))?.slug,
  //   interactUid: signUpUser
  // })
  // useEffect(() => {
  //   setSearch(id as string)
  // }, [id])

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 lg:max-w-[900px]">
        <SkeletonLoaderForPage length={2} />
      </div>
    )
  }

  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | ${categoryData?.data?.find((category: any) => category.id === Number(id))?.name}`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />

      <BaseLayout>
        <div className="">
          <div className="mx-auto max-w-[900px]">
            {' '}
            <div className="flex w-full flex-col gap-8">
              <TopBar title={categoryData?.data?.find((category: any) => category.id === Number(id))?.name} showClip />

              <div className="w-full">
                <TextInput
                  iconName="carbon:search"
                  iconClassName="text-[#181A20] w-[16px] h-[16x]"
                  placeholder={`Search for a ${type} or vendor`}
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  name={''}
                  value={search}
                  type={'text'}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSearchValue(search)
                    }
                  }}
                />
              </div>

              <div
                className={`flex w-full flex-col ${data?.data?.length ? 'md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3' : ''}`}
              >
                {data?.data?.length ? (
                  data?.data?.map((item: any, index: number) => (
                    <div key={index} className="mt-10">
                      {/* <StoreListItem item={item} /> */}
                      <DetailsCard listing={item} />
                    </div>
                  ))
                ) : (
                  <RecommendedStores />
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

CategoryIdPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default CategoryIdPage

export const getServerSideProps = async (context: any) => {
  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || ''
  const authToken = cookies['authToken'] || ''
  const {type, id} = context.query

  if (!id || !type) {
    return {notFound: true}
  }

  try {
    // Fetch category details
    const res = await axios.get(`${process.env.baseUrl}front/category?type=${type}`, {
      headers: {
        Authorization: authToken || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'clip-uid': clipUid
      }
    })

    const categories = res.data.data

    // Find the specific category by ID
    const category = categories.find((cat: any) => cat.id === parseInt(id))

    if (!category) {
      return {notFound: true}
    }

    // Extract SEO-related information from category data
    const seoData = {
      title: `myEKI | ${category.name}`,
      description: category.description || `Explore our ${category.name} category`,
      slug: category.slug
    }

    // Pass both category and SEO data to the page
    return {props: {category, seoData}}
  } catch (error) {
    console.error('Error fetching category data:', error)
    return {notFound: true}
  }
}
