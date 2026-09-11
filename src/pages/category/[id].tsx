// src/pages/category/[id].tsx

import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import {CategoryStructuredData} from '@/components/SEOSturcturedData/CategoryStructuredData'
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

function getClipUid() {
  if (typeof window !== 'undefined') {
    const clipUid = localStorage.getItem('Clip-Uid')
    if (clipUid) {
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

const CategoryIdPage = ({category}: {category: any; seoData: any}) => {
  const router = useRouter()
  const {id, type} = router.query

  // Parse the ID and slug from the URL parameter
  const categoryId = id ? String(id).split('-')[0] : null
  const categorySlug = id ? String(id).split('-').slice(1).join('-') : null

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [signUpUser, setSignUpUser] = useState<any>(null)

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
    listType: type as 'product' | 'service',
    category: Number(categoryId), // Use parsed categoryId
    search: searchValue?.length ? searchValue : search,
    currency: selectedLanguage.value
  })

  const {data: categoryData, isLoading: isCategoryLoading} = useGetAllCategoriesQuery({
    type: type as string
  })

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

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 lg:max-w-[900px]">
        <SkeletonLoaderForPage length={2} />
      </div>
    )
  }

  const currentCategory = categoryData?.data?.find((category: any) => category.id === Number(categoryId))

  return (
    <React.Fragment>
      <SEOHead
        title={`myEKI | ${currentCategory?.name}`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <CategoryStructuredData category={category} product={data?.data} />
      <BaseLayout>
        <div className="">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col gap-8">
              <TopBar title={currentCategory?.name} showClip />

              <div className="w-full">
                <TextInput
                  iconName="carbon:search"
                  iconClassName="text-[#181A20] w-[16px] h-[16x]"
                  placeholder={`Search for a ${type} or vendor`}
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  name=""
                  value={search}
                  type="text"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSearchValue(search)
                    }
                  }}
                />
              </div>

              <div
                className={`flex w-full flex-col ${
                  data?.data?.length ? 'md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3' : ''
                }`}
              >
                {data?.data?.length ? (
                  data?.data?.map((item: any, index: number) => (
                    <div key={index} className="mt-10">
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

export const getServerSideProps = async (context: any) => {
  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || ''
  const authToken = cookies['authToken'] || ''
  const currencyCookie = cookies['selectedLanguage'] || 'NGN'
  const {id, type} = context.query
  const categoryId = id ? String(id).split('-')[0] : null

  if (!categoryId || !type) {
    return {notFound: true}
  }

  try {
    const categoryRes = await axios.get(`${process.env.baseUrl}front/category?type=${type}`, {
      headers: {
        Authorization: authToken || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'clip-uid': clipUid
      }
    })

    const categories = categoryRes.data.data
    const category = categories.find((cat: any) => cat.id === parseInt(categoryId))

    if (!category) {
      return {notFound: true}
    }

    const productRes = await axios.get(`${process.env.baseUrl}front/listings`, {
      params: {
        listingType: 'product',
        category: categoryId
      },
      headers: {
        Authorization: authToken || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'clip-uid': clipUid,
        currency: currencyCookie // Use the dynamic currency from the cookie
      }
    })

    const products = productRes.data.data || []

    const seoData = {
      title: `myEKI | ${category.name}`,
      description: category.description || `Explore our ${category.name} category`,
      slug: category.slug
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: `${category?.name} Collection`,
          description: category?.description,
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://myeki.market',
            name: 'myEKI'
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://myeki.market'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: category?.name,
                item: `https://myeki.market/category/${category?.id}-${category?.slug}?type=${category?.type}`
              }
            ]
          },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement:
              products.map((product: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Product',
                  name: product?.name,
                  description: product?.description,
                  image:
                    product?.images && product?.images.length > 0
                      ? `${process.env.imageBaseUrl}/${product?.images[0]}`
                      : `${process.env.imageBaseUrl}/assets/default_banner.jpg`,
                  sku: product?.id,
                  offers: {
                    '@type': 'Offer',
                    price: product?.display_price || 0,
                    priceCurrency: product?.currency || 'NGN', // Default currency
                    availability: product?.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
                  }
                }
              })) || []
          }
        },
        {
          '@type': 'WebPage',
          name: 'MEK Directory | myEKI',
          description: 'Find products and services near you!! Get Listed on myEKI and start selling for free!',
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://myeki.market',
            name: 'myEKI'
          }
        }
      ]
    }

    return {
      props: {
        category,
        currency: currencyCookie,
        products,
        structuredData,
        seoData
      }
    }
  } catch (error) {
    console.error('Error fetching category or product data:', error)
    return {
      props: {
        category: null,
        products: [], // Important: Return an empty array
        seoData: null,
        structuredData: null
      }
    }
  }
}

export default CategoryIdPage
