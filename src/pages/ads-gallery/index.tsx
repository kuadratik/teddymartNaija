import {MainWrapper, SearchWrapper} from '@/components/Auth/Products'
import AdsBanner from '@/components/Auth/Products/components/AdsBanner'
import AllCategory, {ISelectedCategory} from '@/components/Auth/Products/components/AllCategory'
import AdsSingleComponent from '@/components/Customer/Advert/AdsSingleComponent'
import useAdsGallerylist from '@/components/Customer/Advert/hooks/useGetAllAdsGallery'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CountryStateFilter from '@/components/SharedUI/CountryStateFilter'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import useQueryParams from '@/hooks/useQueryParams'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {GetAdsGalleryQuery} from '@/types/adsgallery'
import debounce from '@/utils/debounce'
import {CloseOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Pagination, Tag} from 'antd'
import Link from 'next/link'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import tw from 'tailwind-styled-components'

export const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
  event.preventDefault()
  event.stopPropagation()
}

const AdsGallery = () => {
  const [open, setOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<any>(null)
  const [selectedOnClickState, setSelectedOnClickState] = useState<any>(null)
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [selectedOnclickCountry, setSelectedOnclickCountry] = useState<any>(null)
  const [tags, setTags] = useState<ISelectedCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<ISelectedCategory[]>([])

  useEffect(() => {
    setTags(selectedCategories)
  }, [selectedCategories])

  const {type} = useSelector((state: any) => state.vendor)

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {queryParams, updateQueryParams} = useQueryParams<GetAdsGalleryQuery>({
    page: 1,
    search: ''
  })
  const {data: allCategoriesData} = useGetAllCategoriesQuery({
    type: ''
  })
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [isStateOpen, setIsStateOpen] = useState(false)

  const {isLoading, handleAllAdsGallery, data, isError} = useAdsGallerylist()

  useEffect(() => {
    const tagIds = tags.map(category => category.id) ?? []

    // Create base params object
    const requestParams: any = {
      params: {
        ...queryParams,
        status: 'active',
        country_id: selectedOnclickCountry?.id,
        state: selectedOnClickState?.name
      },
      currency: selectedLanguage.value
    }

    // Only add body if tagIds is not empty
    if (tagIds.length > 0) {
      requestParams['body'] = tagIds
    }

    // Make the POST request when the component mounts
    handleAllAdsGallery(requestParams)
  }, [queryParams, selectedLanguage.value, tags, selectedOnclickCountry, selectedOnClickState])

  const dataResponseArr = data?.data

  const dispatch = useDispatch()

  const [dropDown, setDropDown] = useState(false)

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (queryParams?.type) {
      dispatch(setType({type: queryParams?.type}))
    }
  }, [])

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }

  const handlePagination = (page: number) => {
    if (!dataResponseArr?.data) return
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling effect
    })
    updateQueryParams({page: page})
  }

  const handleClose = (removedTag: number) => {
    const newTags = tags.filter(tag => tag?.id !== removedTag)

    setTags(newTags)
    setSelectedCategories(newTags)
  }
  const handleCategoryClick = (category: ISelectedCategory) => {
    console.log(category, 'category')
    setSelectedCategories(prevSelected => {
      // Check if the category is already selected
      const isAlreadySelected = prevSelected.some(selected => selected.id === category.id)

      if (isAlreadySelected) {
        // Remove the category if it's already selected
        return prevSelected.filter(selected => selected.id !== category.id)
      } else {
        // Add the category if it's not selected
        return [...prevSelected, {id: category.id, name: category.name}]
      }
    })
  }

  const totalPages = data?.data?.pagination?.total ?? undefined

  const [queryString, setQueryString] = useState(queryParams?.search ?? '')

  // * This debounce function update the search queryParams and delays executing the api request
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateQueryParams({
        search: value ?? ''
      })
    }, 1000),
    []
  )

  return (
    <>
      <SEOHead
        title={`myEKI | Ads Gallery`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <main className="">
        {' '}
        <MainWrapper className="">
          {/* Ads Gallery */}
          <div className="flex w-full flex-col">
            <AllCategory
              data={allCategoriesData}
              handleCategoryClick={handleCategoryClick as any}
              isShowServiceProductCategories={false}
              open={open}
              setOpen={setOpen}
              setSelectedCategories={setSelectedCategories}
            />
            <div className="flex w-full flex-col-reverse lg:flex-col">
              {/* <NewNavigation /> */}
              <div className="w-full max-w-5xl lg:mx-auto">
                <SearchWrapper className="">
                  <div className="flex w-full items-center justify-between gap-3 px-2 md:gap-5 lg:px-10">
                    <div className="relative hidden lg:block">
                      <SelectInput
                        backgroundColor="transparent"
                        labelRenderClassName="text-white"
                        className="w-[179px] border-white py-0.5 text-white hover:border-white focus:ring-white"
                        placeholder={<span className="font-[500] text-white">Categories</span>}
                        onChange={value => {
                          console.log('Selected value:', value)
                          const selectedItem = allCategoriesData?.data.find((item: any) => item.id === value)
                          console.log('Found item:', selectedItem)
                          if (selectedItem) {
                            handleCategoryClick({
                              id: selectedItem.id,
                              name: selectedItem.name
                            })
                          }
                        }}
                        data={allCategoriesData?.data.map((item: {name: string; id: number}) => {
                          return {
                            value: item.id,
                            label: item.name,
                            item: item
                          }
                        })}
                      />
                      <Icon
                        icon="iconamoon:arrow-down-2"
                        width="24"
                        height="24"
                        className="absolute right-1.5 top-2.5 z-30 text-white lg:top-3"
                      />
                    </div>
                    <TextInput
                      iconName="iconamoon:category"
                      iconClick={() => {
                        setOpen(true)
                      }}
                      iconClassName="cursor-pointer"
                      className="pl-[20px] lg:pl-[25px]"
                      placeholder={`Search for classified ads`}
                      onChange={e => {
                        setQueryString(e.target.value)
                        debouncedSearch(e.target.value as string)
                      }}
                      name={''}
                      value={queryString}
                      type={'text'}
                    />

                    <CountryStateFilter
                      isStateOpen={isStateOpen}
                      setIsStateOpen={setIsStateOpen}
                      isCountryOpen={isCountryOpen}
                      setIsCountryOpen={setIsCountryOpen}
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      setSelectedOnclickCountry={setSelectedOnclickCountry}
                      selectedState={selectedState}
                      setSelectedState={setSelectedState}
                      selectedOnclickCountry={selectedOnclickCountry}
                      setSelectedOnClickState={setSelectedOnClickState}
                    />
                  </div>
                </SearchWrapper>
              </div>
            </div>
          </div>
        </MainWrapper>
        <div className="mt-[20px] w-full max-w-7xl lg:mx-auto lg:mt-[40px]">
          <div className="px-4">
            <div className="flex items-center justify-between">
              <TextComponent as="span" className="text-[19px] font-bold capitalize leading-[13px]">
                Classified Ads
              </TextComponent>{' '}
              <Link
                href="/post-ad"
                className="rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:text-gray-200 hover:opacity-80 lg:px-8"
              >
                Post Ad
              </Link>
            </div>
            {selectedOnclickCountry || selectedOnClickState ? (
              <p className="pt-2 font-[500] lg:pt-0">
                {dataResponseArr?.data?.length === 0 && 'No'} Results for{' '}
                {selectedOnClickState?.name ? selectedOnClickState?.name + ',' : ''}{' '}
                {selectedOnclickCountry?.name ?? ''}
              </p>
            ) : null}
            {tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((value, index) => {
                  return (
                    <Tag
                      closable
                      closeIcon={<CloseOutlined style={{fontSize: '14px', color: '#6B7280'}} />}
                      onClose={e => {
                        e.preventDefault()
                        handleClose(value?.id)
                      }}
                      style={{marginRight: 5, marginLeft: 5}}
                      className="flex items-center rounded-[7px] !border-none bg-[#CFD6E4] p-1 px-3 font-inter text-[#6B7280]"
                      onMouseDown={onPreventMouseDown}
                    >
                      <div className="p-1 text-sm font-semibold">{value?.name}</div>
                    </Tag>
                  )
                })}
              </div>
            ) : (
              <></>
            )}
            <div className="my-4">
              {isLoading ? (
                <SkeletonLoaderForPage length={2} />
              ) : dataResponseArr?.data?.length ? (
                <AdsSingleComponent className="md:grid-cols-3" data={dataResponseArr?.data ?? []} />
              ) : !dataResponseArr?.data?.length && !tags?.length ? (
                <div className="mx-auto my-[40px] flex flex-col items-center justify-center px-[16px] text-center md:w-[60%]">
                  <p className="flex text-center text-[20px] font-bold">Classified Ads loading…</p>
                  <p className="flex items-center pb-10 pt-1 text-center text-[20px] font-bold opacity-80">
                    Check back so you don’t miss out!{' '}
                    <span className="ml-3 hidden md:block">
                      <Icon icon="flowbite:gift-box-solid" />
                    </span>
                  </p>
                </div>
              ) : !dataResponseArr?.data?.length && tags?.length ? (
                <div className="mx-auto my-[40px] flex flex-col items-center justify-center px-[16px] text-center md:w-[60%]">
                  <p className="flex items-center pb-10 pt-1 text-center text-[20px] font-bold opacity-80">
                    No classified Ads found in this category
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          {dataResponseArr?.data?.length ? (
            <div className="my-8 flex justify-end">
              <Pagination
                current={queryParams.page ? queryParams.page : 1}
                showSizeChanger={false}
                onChange={page => {
                  handlePagination(page)
                }}
                className="mx-auto my-[0] flex w-fit flex-row items-center justify-center self-center rounded-md bg-white p-2 text-white lg:mx-0"
                showLessItems={true}
                pageSize={queryParams.per_page ? queryParams.per_page : 15}
                total={totalPages}
              />
            </div>
          ) : (
            <></>
          )}
          <AdsBanner />
        </div>
      </main>
    </>
  )
}

export const Grid3Layout = tw.div`grid grid-cols-1 gap-8 `

AdsGallery.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}
export async function getStaticProps() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'myEKI | Ads Gallery',
        description:
          'myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community.',
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
              name: 'Ads Gallery',
              item: 'https://myeki.market/ads-gallery'
            }
          ]
        }
      },
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://myeki.market/ads-gallery?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },

      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I post an ad?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Click on the "Post Ad" button, fill in your ad details including title, description, price, and images, then submit your ad for review.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is it free to post ads?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, posting classified ads on myEKI is completely free.'
            }
          }
        ]
      }
    ]
  }

  return {
    props: {
      structuredData,
      hasAdSenseScript: true
    }
  }
}

export default AdsGallery
