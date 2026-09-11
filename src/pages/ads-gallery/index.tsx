import {MainWrapper, SearchWrapper} from '@/components/Auth/Products'
import AdsBanner from '@/components/Auth/Products/components/AdsBanner'
import AllCategory, {ISelectedCategory} from '@/components/Auth/Products/components/AllCategory'
import {SingleAdvertWrapper} from '@/components/Customer/Advert'
import useAdsGallerylist from '@/components/Customer/Advert/hooks/useGetAllAdsGallery'
import CustomerLayout from '@/components/Layout/Customerlayout'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import VideoView from '@/components/SharedUI/VideoView'
import {TruncatedText} from '@/components/Store/components/DetailsCard'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import useQueryParams from '@/hooks/useQueryParams'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {GetAdsGalleryQuery} from '@/types/adsgallery'
import debounce from '@/utils/debounce'
import {CloseOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Pagination, Tag} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import tw from 'tailwind-styled-components'

export const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
  event.preventDefault()
  event.stopPropagation()
}



const AdsGallery = () => {
  const [open, setOpen] = useState(false)

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

  const {isLoading, handleAllAdsGallery, data, isError} = useAdsGallerylist()

  useEffect(() => {
    // Make the POST request when the component mounts
    handleAllAdsGallery({
      params: {...queryParams, status: 'active'},
      body: tags.map(category => category.id) ?? [],
      currency: selectedLanguage.value
    })
  }, [queryParams, selectedLanguage.value, tags])

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
              isShowServiceProductCategories={false}
              open={open}
              setOpen={setOpen}
              setSelectedCategories={setSelectedCategories}
            />
            <div className="flex w-full flex-col-reverse lg:flex-col">
              {/* <NewNavigation /> */}
              <div className="w-full max-w-7xl lg:mx-auto">
                <SearchWrapper className="">
                  <div className="container">
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
                  </div>
                </SearchWrapper>
              </div>
            </div>
          </div>
        </MainWrapper>
        <div className="mt-[20px] w-full max-w-7xl lg:mx-auto lg:mt-[50px]">
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
            {tags?.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
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
                <AdsSingleComponent data={dataResponseArr?.data ?? []} />
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

const AdsSingleComponent = ({data}: {data: any}) => {
  const router = useRouter()

  // console.log(`${process.env.imageBaseUrl}/${ad?.media[0]}`)

  return (
    <Grid3Layout className="">
      {data.map((ad: any, index: any) => (
        <SingleAdvertWrapper
          key={index}
          className="cursor-pointer bg-white"
          onClick={() => {
            router.push(`/ads-gallery/${ad.id}`)
          }}
        >
          <div className="flex flex-col px-2 py-1 lg:flex-row lg:items-center">
            <div className="h-[300px] rounded-full lg:h-[130px] lg:w-1/3">
              {ad?.media[0]?.type === 'image' ? (
                <Image
                  onError={error => {
                    error.currentTarget.src = '/assets/default_banner.jpg'
                  }}
                  src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                  alt={ad?.title}
                  loading="lazy"
                  width={200}
                  height={50}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <VideoView
                  className="w-full"
                  src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                  width="200"
                  height="50"
                />

                // <video
                //   ref={videoRef}
                //   src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                //   width="200"
                //   height="50"
                //   className="h-full w-full rounded-lg object-cover"
                //   // muted
                //   loop // Optional: loops the video
                //   onMouseEnter={handleMouseEnter}
                //   onMouseLeave={handleMouseLeave}
                //   style={{cursor: 'pointer'}}
                // />
              )}
            </div>
            <div className="flex flex-col justify-center gap-1 p-4 lg:w-2/3">
              <TextComponent as="h2" className="text-[18px] font-bold leading-[22px] text-[#4d4d4d]">
                {ad?.title}
              </TextComponent>
              <TextComponent as="h2" className="text-[18px] font-bold leading-[22px] text-[#4d4d4d]">
                {ad?.price_on_request ? (
                  'Please Contact'
                ) : (
                  <FormatNumberCurrency value={+ad.price} currency={ad?.currency} />
                )}
              </TextComponent>
              <TextComponent as="h2" className="text-[14px] font-normal text-[#6B7280]">
                <TruncatedText text={ad?.description} limit={90} />{' '}
              </TextComponent>
            </div>
          </div>
        </SingleAdvertWrapper>
      ))}
    </Grid3Layout>
  )
}

export const Grid3Layout = tw.div`grid grid-cols-1 gap-8 md:grid-cols-3`

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
