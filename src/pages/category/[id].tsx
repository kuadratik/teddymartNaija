// src/pages/category/[id].tsx

import Category from '@/components/Auth/Products/components/Category'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import TeddyAdvert from '@/components/Auth/Products/components/TeddyAdvert'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import {CategoryStructuredData} from '@/components/SEOSturcturedData/CategoryStructuredData'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import DetailsCard from '@/components/Store/components/DetailsCard'
import DetailsCardSkeletonLoader from '@/components/Store/components/DetailsCardSkeletonLoader'
import {useAppSelector} from '@/hooks/reduxHooks'
import useWindowResize from '@/hooks/useWindowResize'
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
  const [open, setOpen] = useState(false)

  // Fix category ID parsing to properly extract multiple numeric IDs
  const extractCategoryIds = () => {
    if (!id) return []

    // Convert id to string and split by dash
    const parts = String(id).split('-')

    // Extract numeric parts at the beginning as category IDs
    const categoryIds = []
    for (const part of parts) {
      // If this part is a number, add it to category IDs
      if (!isNaN(Number(part))) {
        categoryIds.push(Number(part))
      } else {
        // Once we hit a non-numeric part, we've reached the slug
        break
      }
    }

    return categoryIds
  }

  // Get category IDs using the extraction function
  const categoryIds = extractCategoryIds()

  // For display purposes, find the "main" category ID (first one)
  const primaryCategoryId = categoryIds.length > 0 ? categoryIds[0] : null

  // For SEO, extract slug after removing all category IDs
  const categorySlug = id ? String(id).split('-').slice(categoryIds.length).join('-') : null

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [signUpUser, setSignUpUser] = useState<any>(null)

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
    listType: type as 'product' | 'service',
    category: categoryIds, // Use all parsed category IDs
    search: searchValue?.length ? searchValue : search,
    currency: selectedLanguage.value
  })
  const {width} = useWindowResize()

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
      <div className="mx-auto mt-10 px-[20px] lg:max-w-[900px] lg:px-0">
        <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3">
          {Array(width > 1024 ? 6 : width > 760 ? 6 : 4)
            .fill(0)
            .map((_, index) => (
              <DetailsCardSkeletonLoader key={`skeleton-${index}`} />
            ))}
        </div>
      </div>
    )
  }

  // Find all matching categories for the title
  const currentCategories = categoryData?.data?.filter((cat: any) => categoryIds.includes(cat.id))

  // Get combined name for display
  const categoryName =
    currentCategories?.length > 1
      ? currentCategories.map((cat: any) => cat.name).join(', ')
      : currentCategories?.[0]?.name || 'Category'

  return (
    <React.Fragment>
      <Category open={open} setOpen={setOpen} />
      <NewNavigation />
      <SEOHead
        title={`myEKI | ${categoryName}`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <CategoryStructuredData category={category} product={data?.data} />
      <BaseLayout>
        <div className="pb-10 pt-5">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col">
              {/* <TopBar title={currentCategory?.name} showClip /> */}

              <div className="w-full rounded-lg bg-black p-4">
                <div className="mx-auto flex w-full items-center justify-between gap-2 lg:w-[700px]">
                  <TextInput
                    iconName="carbon:search"
                    iconClassName="text-[#181A20] w-[16px] h-[16x]"
                    placeholder={`Search ${categoryName}...`}
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
              </div>
              <h1 className="mt-5 font-bold">{categoryName}</h1>
              <div
                className={`flex w-full flex-col ${
                  data?.data?.length ? 'md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3' : ''
                }`}
              >
                {data?.data?.length ? (
                  data?.data?.map((item: any, index: number) => (
                    <div key={item?.id || index} className="mt-5">
                      <DetailsCard index={index} listing={item} />
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
      <div className="mt-10 max-w-[1024px] lg:mx-auto lg:px-0">
        <TeddyAdvert />
      </div>
    </React.Fragment>
  )
}

CategoryIdPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export const getServerSideProps = async (context: any) => {
  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || ''
  const authToken = cookies['authToken'] || ''
  const currencyCookie = cookies['selectedLanguage'] || 'NGN'
  const {id, type} = context.query

  // Fix category ID parsing to properly extract multiple numeric IDs in SSR too
  const extractCategoryIds = () => {
    if (!id) return []

    // Convert id to string and split by dash
    const parts = String(id).split('-')

    // Extract numeric parts at the beginning as category IDs
    const categoryIds = []
    for (const part of parts) {
      // If this part is a number, add it to category IDs
      if (!isNaN(Number(part))) {
        categoryIds.push(Number(part))
      } else {
        // Once we hit a non-numeric part, we've reached the slug
        break
      }
    }

    return categoryIds
  }

  // Get category IDs using the extraction function
  const categoryIds = extractCategoryIds()

  // For fallback, use the primary category ID
  const primaryCategoryId = categoryIds.length > 0 ? categoryIds[0] : null

  if (!primaryCategoryId || !type) {
    return {notFound: true}
  }

  console.log('Server-side extracted category IDs:', categoryIds)

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

    // Get all matching categories
    const matchingCategories = categories.filter((cat: any) => categoryIds.includes(cat.id))

    // For SEO and breadcrumb purposes, use the primary category
    const primaryCategory = categories.find((cat: any) => cat.id === primaryCategoryId)

    if (!primaryCategory || matchingCategories.length === 0) {
      return {notFound: true}
    }

    // Create combined title for multiple categories
    const categoryName =
      matchingCategories.length > 1 ? matchingCategories.map((cat: any) => cat.name).join(', ') : primaryCategory.name

    const productRes = await axios.get(`${process.env.baseUrl}front/listings`, {
      params: {
        listingType: 'product',
        category: categoryIds // Pass all category IDs
      },
      headers: {
        Authorization: authToken || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'clip-uid': clipUid,
        currency: currencyCookie
      }
    })

    const products = productRes.data.data || []

    const seoData = {
      title: `myEKI | ${categoryName}`,
      description: primaryCategory.description || `Explore our ${categoryName} category`,
      slug: primaryCategory.slug
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: `${categoryName} Collection`,
          description: primaryCategory?.description,
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
                name: categoryName,
                item: `https://myeki.market/category/${primaryCategory?.id}-${primaryCategory?.slug}?type=${primaryCategory?.type}`
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
        category: primaryCategory,
        categories: matchingCategories,
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
        products: [],
        seoData: null,
        structuredData: null
      }
    }
  }
}

export default CategoryIdPage
