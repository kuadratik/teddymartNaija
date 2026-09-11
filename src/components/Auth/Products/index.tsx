"use client"
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {setType} from '@/redux/apiSlice/vendorSlice'
import type {AppDispatch} from '@/redux/store'
import {Tag} from 'antd'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Category from './components/Category'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
// import required modules
import CustomButton from '@/components/SharedUI/Buttons/Button'
import CountryStateFilter from '@/components/SharedUI/CountryStateFilter'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import {onPreventMouseDown} from '@/pages/ads-gallery'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {StoreEndpoint, useGetSearchStoreListingQuery} from '@/services/store'
import {CloseOutlined} from '@ant-design/icons'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import tw from 'tailwind-styled-components'
import {ISelectedCategory} from './components/AllCategory'
import CategorySection from './components/Mall/CategorySection'
import TopLowestDeals from './components/Mall/TopLowestDeals'
import NewAdvert from './components/NewAdvert'
import NewNavigation from './components/NewNavigation'
import Popularproduct from './components/Popularproduct'
import SwiperBanner from './components/SwiperBanner'
import TeddyAdvert from './components/TeddyAdvert'

const LandingPage = () => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const has_store = isAuthenticatedUser?.has_store
  const [selectedCategories, setSelectedCategories] = useState<ISelectedCategory[]>([])

  const {data: allCategoriesData} = useGetAllCategoriesQuery({
    type: ''
  })
  const [tags, setTags] = useState<ISelectedCategory[]>([])
  console.log('🚀 ~ LandingPage ~ tags:', tags)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [isStateOpen, setIsStateOpen] = useState(false)
  const isAuth = isAuthenticatedToken
  const [selectedState, setSelectedState] = useState<any>(null)
  const [selectedOnClickState, setSelectedOnClickState] = useState<any>(null)
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const {type} = useSelector((state: any) => state.vendor)

  const [selectedOnclickCountry, setSelectedOnclickCountry] = useState<any>(null)
  console.log('🚀 ~ LandingPage ~ selectedOnclickCountry:', selectedOnclickCountry)
  const dispatch = useDispatch<AppDispatch>()
  const [dropDown, setDropDown] = useState(false)
  const selectedLanguage = useAppSelector(state => state.country.selectedLanguage)

  // Memoized category IDs
  const formattedCategoryIds = useMemo(
    () => (selectedCategories.length > 0 ? selectedCategories.map(item => item?.id) : undefined),
    [selectedCategories]
  )

  // Create a mapping between category ids and their titles for ScrollOptimizer
  const categoryMap = useMemo(() => {
    return [
      {id: 10, title: 'Groceries & Food & Dining'},
      {id: 11, title: 'Groceries & Food & Dining'},
      {id: 2, title: 'Fashion, Beauty & Health'},
      {id: 3, title: 'Home & Kitchen'},
      {id: 5, title: 'Sports & Outdoors'},
      {id: 4, title: 'Home & Kitchen'},
      {id: 1, title: 'Electronics, Books & Toys'},
      {id: 7, title: 'Electronics, Books & Toys'},
      {id: 8, title: 'Automotive'},
      {id: 6, title: 'Electronics, Books & Toys'},
      {id: 31, title: 'Babies & Kids'},
      {id: 28, title: 'Construction, Tools & Hardware'},
      {id: 30, title: 'Construction, Tools & Hardware'}
    ]
  }, [])

  const {
    currentData: data,
    isLoading: isLoading,
    isFetching: isFetching,
    refetch: categoryListingRefetch
  } = useGetSearchStoreListingQuery({
    currency: selectedLanguage.value,
    listType: type,
    country_id: selectedOnclickCountry?.id,
    category: formattedCategoryIds!
  })

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const router = useRouter()

  // Handle category click
  const handleCategoryClick = useCallback((category: ISelectedCategory) => {
    console.log(category, 'category')
    setSelectedCategories(prevSelected => {
      const isAlreadySelected = prevSelected.some(selected => selected.id === category.id)

      if (isAlreadySelected) {
        return prevSelected.filter(selected => selected.id !== category.id)
      } else {
        return [...prevSelected, {id: category.id, name: category.name}]
      }
    })
  }, [])

  // Handle close
  const handleClose = useCallback(
    (removedTag: number) => {
      const newTags = tags.filter(tag => tag?.id !== removedTag)
      setTags(newTags)
      setSelectedCategories(newTags)
    },
    [tags]
  )

  // Handle change
  const handleChange = useCallback(
    (value: 'product' | 'service') => {
      dispatch(setType({type: value}))
      setDropDown(false)
    },
    [dispatch]
  )

  // Sync tags with selected categories
  useEffect(() => {
    // Only update tags if they're different from selectedCategories
    if (JSON.stringify(tags) !== JSON.stringify(selectedCategories)) {
      setTags(selectedCategories)
    }
  }, [selectedCategories, tags])

  // Prefetch data that will likely be needed soon
  useEffect(() => {
    // Check if StoreEndpoint.util exists before using it
    if (StoreEndpoint.util && selectedLanguage?.value) {
      try {
        // Prefetch the best deals
        dispatch(
          StoreEndpoint.util.prefetch(
            'getBestDeals',
            {
              currency: selectedLanguage.value
            },
            {force: false}
          )
        )

        // Prefetch today's deals
        dispatch(
          StoreEndpoint.util.prefetch(
            'getTodayDeals',
            {
              currency: selectedLanguage.value,
              limit: 3
            },
            {force: false}
          )
        )

        // Prefetch only the essential categories first to avoid overwhelming the API
        const topCategories = [12, 11, 2, 3, 4]
        topCategories.forEach(categoryId => {
          dispatch(
            StoreEndpoint.util.prefetch(
              'getSearchStoreListing',
              {
                currency: selectedLanguage.value,
                listType: type,
                category: [categoryId]
              },
              {force: false}
            )
          )
        })

        // Use a setTimeout to delay fetching the remaining categories
        setTimeout(() => {
          const secondaryCategories = [1, 7, 8, 6, 9, 19, 21]
          secondaryCategories.forEach(categoryId => {
            if (StoreEndpoint.util) {
              // Double check it still exists
              dispatch(
                StoreEndpoint.util.prefetch(
                  'getSearchStoreListing',
                  {
                    currency: selectedLanguage.value,
                    listType: type,
                    category: [categoryId]
                  },
                  {force: false}
                )
              )
            }
          })
        }, 1000) // Wait 1 second before fetching secondary categories
      } catch (error) {
        console.error('Error during prefetch:', error)
      }
    }
  }, [dispatch, selectedLanguage?.value, type])

  return (
    <MainWrapper className="">
      {/* removed header */}
      <div className="flex w-full flex-col">
        <Category open={open} setOpen={setOpen} />
        <div className="mx-auto w-full max-w-screen-xl lg:px-5 xl:px-0 2xl:max-w-screen-2xl">
          <div className="flex w-full flex-col-reverse lg:flex-col">
            <NewNavigation />
            <SearchWrapper className="flex w-full max-w-7xl items-center justify-between gap-3 md:gap-5 lg:mx-auto lg:gap-0 lg:px-10">
              <div className="relative z-30 hidden lg:block">
                <SelectInput
                  backgroundColor="black"
                  suffixIcon={
                    <Icon icon="iconamoon:arrow-down-2" width="24" height="24" className="text-white lg:top-3" />
                  }
                  labelRenderClassName="text-white"
                  className="w-[179px] border-white py-1 text-white hover:border-white focus:text-white focus:ring-white"
                  placeholder={<span className="font-[500] text-white">Categories</span>}
                  onChange={value => {
                    const selectedItem = allCategoriesData?.data.find((item: any) => item.id === value)

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
              </div>
              <div className="relative mx-3 w-full">
                <TextInput
                  iconName="iconamoon:category"
                  iconClick={() => {
                    setOpen(true)
                  }}
                  iconClassName="cursor-pointer"
                  className="pl-[20px] lg:pl-[25px]"
                  placeholder={`Search `}
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
            </SearchWrapper>
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 pt-2">
              {selectedOnclickCountry || selectedOnClickState ? (
                <div className="relative top-2 px-[35px] lg:px-0">
                  <p className="font-[500] lg:pt-0">
                    {data?.data?.length === 0 && 'No'} Results for{' '}
                    {selectedOnClickState?.name ? selectedOnClickState?.name + ',' : ''}{' '}
                    {selectedOnclickCountry?.name ?? ''}
                  </p>
                </div>
              ) : null}
              {(selectedOnclickCountry || selectedOnClickState) && (
                <div className="relative top-2">
                  <button
                    onClick={() => {
                      setSelectedOnclickCountry(null)
                      setSelectedOnClickState(null)
                      setSelectedCountry('')
                    }}
                    className="top-2 flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                  >
                    Clear All
                    <Icon icon="mdi:close" className="text-base" />
                  </button>
                </div>
              )}
            </div>
            {tags?.length ? (
              <div className="relative px-[30px] lg:top-6 lg:px-0">
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((value, index) => {
                    return (
                      <Tag
                        key={`tag-${value.id}-${index}`}
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
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-7xl flex-col lg:mx-auto">
        {formattedCategoryIds?.length! > 0 ? (
          <div className="mb-10 flex flex-col gap-6">
            <MemoizedPopularproduct
              data={data}
              isLoading={isLoading || isFetching}
              selectedLanguage={selectedLanguage}
            />
            <div className="flex w-full flex-col gap-6 px-4 lg:flex-row lg:px-0">
              <MemoizedSwiperBanner />
              <div className="w-full lg:w-[29%]">
                <MemoizedTopDealComponent />
              </div>
            </div>
            <div className="">
              <MemoizedNewAdvert
                selectedOnClickState={selectedOnClickState}
                selectedOnclickCountry={selectedOnclickCountry}
                tags={tags}
              />
              {/* <OldAdvert /> */}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <MemoizedCategorySection
              category_id={[10, 11]}
              seeAllLinkHref="/category/10-11-groceries-food-dinning?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Groceries, Food & Dining"
              selectedLanguage={selectedLanguage}
            />
            <MemoizedCategorySection
              category_id={[2, 4, 9]}
              seeAllLinkHref="/category/2-4-9-fashion-beauty-health?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Fashion, Beauty & Health"
              selectedLanguage={selectedLanguage}
            />

            <div className="">
              <MemoizedNewAdvert
                selectedOnClickState={selectedOnClickState}
                selectedOnclickCountry={selectedOnclickCountry}
                tags={tags}
              />
              {/* <OldAdvert /> */}
            </div>
            <MemoizedCategorySection
              category_id={[3]}
              seeAllLinkHref="/category/3-home-kitchen?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Home & Kitchen"
              selectedLanguage={selectedLanguage}
            />
            <div className="">
              <MemoizedTopLowestDeals selectedLanguage={selectedLanguage} />
            </div>
            <MemoizedCategorySection
              category_id={[]}
              isNew={true}
              seeAllLinkHref="/new"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="New to myEKI"
              selectedLanguage={selectedLanguage}
            />
            <MemoizedCategorySection
              category_id={[1, 6, 7]}
              seeAllLinkHref="/category/1-6-7-electronics-books-toys?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Electronics, Books & Toys"
              selectedLanguage={selectedLanguage}
            />
            <MemoizedCategorySection
              category_id={[5]}
              seeAllLinkHref="/category/5-sports-outdoors?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Sports & Outdoors"
              selectedLanguage={selectedLanguage}
            />
            <div className="flex w-full flex-col gap-6 px-4 pt-2 lg:flex-row lg:px-0">
              <MemoizedSwiperBanner />
              <div className="w-full lg:w-[29%]">
                <MemoizedTopDealComponent />
              </div>
            </div>
            <MemoizedCategorySection
              category_id={[8]}
              seeAllLinkHref="/category/8-automotive?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Automotive"
              selectedLanguage={selectedLanguage}
            />
            <MemoizedCategorySection
              category_id={[31]}
              seeAllLinkHref="/category/31-babies-kids?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Babies & Kids"
              selectedLanguage={selectedLanguage}
            />
            <MemoizedCategorySection
              category_id={[28, 30]}
              seeAllLinkHref="/category/28-30-construction-tools-hardware?type=product"
              showSeeAllLink={true}
              formattedCategoryIds={formattedCategoryIds}
              selectedOnclickCountry={selectedOnclickCountry}
              type={type}
              categoryTitle="Construction, Tools & Hardware"
              selectedLanguage={selectedLanguage}
            />
            {/* <MemoizedRecommended /> */}
          </div>
        )}

        {/* Temporarily commented out because of Google Adsense approval hindrance */}
        {/* <div className="">
          <MemoizedTeddyAdvert />
        </div> */}
      </div>

      {/* Add system to monitor scroll position and optimize prefetching */}
      <ScrollOptimizer
        categories={[10, 11, 2, 3, 5, 4, 1, 7, 8, 6, 31, 28, 30]}
        selectedLanguage={selectedLanguage}
        type={type}
        categoryMap={categoryMap}
      />
    </MainWrapper>
  )
}

// New component to intelligently prefetch category data based on scroll position
const ScrollOptimizer = memo(({categories, selectedLanguage, type, categoryMap}: any) => {
  const dispatch = useDispatch<AppDispatch>()
  // Use a ref instead of state for visible section to avoid unnecessary re-renders
  const visibleSectionRef = useRef(0)
  const [hasPrefetched, setHasPrefetched] = useState<Record<number, boolean>>({})
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(false)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)

  // Function to prefetch a specific category with better error handling
  const prefetchCategory = useCallback(
    (categoryId: number, sectionIndex: number) => {
      if (!StoreEndpoint.util || !selectedLanguage?.value || hasPrefetched[sectionIndex]) return

      try {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Prefetching category ${categoryId} for section ${sectionIndex}`)
        }

        dispatch(
          StoreEndpoint.util.prefetch(
            'getSearchStoreListing',
            {
              currency: selectedLanguage.value,
              listType: type,
              category: [categoryId]
            },
            {force: false}
          )
        )

        // Mark as prefetched using a functional update to avoid stale state
        setHasPrefetched(prev => ({...prev, [sectionIndex]: true}))
      } catch (error) {
        console.error(`Error prefetching category ${categoryId}:`, error)
      }
    },
    [dispatch, selectedLanguage?.value, type, hasPrefetched]
  )

  // Setup IntersectionObserver to efficiently detect visible sections
  useEffect(() => {
    // Setup IntersectionObserver for more efficient detection of visible sections
    if ('IntersectionObserver' in window && categories.length > 0) {
      // Cleanup previous observer if it exists
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }

      // Create a new observer with options
      intersectionObserverRef.current = new IntersectionObserver(
        entries => {
          // Find the first section that's intersecting with good visibility
          const visibleEntry = entries.find(entry => entry.isIntersecting && entry.intersectionRatio > 0.2)

          if (visibleEntry) {
            const sectionIndex = parseInt(visibleEntry.target.getAttribute('data-section-index') || '0', 10)

            // Only update if different to avoid unnecessary work
            if (visibleSectionRef.current !== sectionIndex) {
              visibleSectionRef.current = sectionIndex

              // Prefetch the next couple of sections
              const sectionsToFetch = [sectionIndex + 1, sectionIndex + 2]
                .filter(index => index < categories.length)
                .filter(index => !hasPrefetched[index])

              // Stagger the prefetching
              sectionsToFetch.forEach((sectionIndex, i) => {
                const categoryId = categories[Math.min(sectionIndex, categories.length - 1)]
                setTimeout(() => {
                  prefetchCategory(categoryId, sectionIndex)
                }, i * 300)
              })
            }
          }
        },
        {
          root: null,
          rootMargin: '0px 0px 300px 0px', // Detect elements 300px before they enter viewport
          threshold: [0.2, 0.5] // Trigger at 20% and 50% visibility
        }
      )

      // Observe all category sections
      document.querySelectorAll('[data-category-section]').forEach((section, index) => {
        section.setAttribute('data-section-index', index.toString())
        intersectionObserverRef.current?.observe(section)
      })

      // Immediately prefetch the first section
      if (!initialLoadRef.current && categories.length > 0) {
        prefetchCategory(categories[0], 0)
        initialLoadRef.current = true
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      const handleScroll = () => {
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current)
        }

        scrollTimerRef.current = setTimeout(() => {
          // Basic implementation for finding visible sections
          const sections = document.querySelectorAll('[data-category-section]')
          if (!sections.length) return

          const viewportHeight = window.innerHeight
          let currentSection = 0

          for (let i = 0; i < sections.length; i++) {
            const rect = sections[i].getBoundingClientRect()
            if (rect.top < viewportHeight && rect.bottom > 0) {
              currentSection = i
              break
            }
          }

          if (visibleSectionRef.current !== currentSection) {
            visibleSectionRef.current = currentSection

            // Prefetch next sections
            const nextSection = currentSection + 1
            if (nextSection < categories.length && !hasPrefetched[nextSection]) {
              prefetchCategory(categories[nextSection], nextSection)
            }
          }
        }, 100)
      }

      window.addEventListener('scroll', handleScroll)

      // Initial prefetch
      if (!initialLoadRef.current && categories.length > 0) {
        prefetchCategory(categories[0], 0)
        initialLoadRef.current = true
      }

      return () => {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current)
        }
      }
    }

    // Cleanup function
    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [categories, prefetchCategory, hasPrefetched])

  // This component doesn't render anything
  return null
})

const TopDealComponent = () => {
  const url = new URL(window.location.href)
  const router = useRouter()

  // Pre-load the content (text) immediately with display: none for SEO benefits
  return (
    <div className="h-[400px] w-full rounded-[8px]">
      {/* Preload the text content immediately */}
      <div className="flex h-full flex-col items-center justify-center gap-1 rounded-[8px] bg-gray-100">
        <p className="text-[14px] font-semibold uppercase tracking-wider">Today'S Deals</p>
        <p className="w-[70%] text-center text-[32px] font-[400] leading-9">
          <span className="font-bold">Fashion</span> and Beauty
        </p>
        <div className="mt-[16px]">
          <CustomButton
            onClick={() => {
              router.push('/category/2-fashion?type=product')
            }}
            className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black shadow-f2"
          >
            Shop Now <Icon icon="charm:arrow-right" width="16" height="16" />
          </CustomButton>
        </div>
      </div>

      {/* Apply background image after text loads */}
      <style jsx>{`
        div:first-child {
          background-image: url('/assets/fashion_category.png');
          background-size: cover;
          background-position: 10%, 50%;
          background-repeat: no-repeat;
        }
        div:first-child p:first-child {
          color: white;
        }
        div:first-child p:nth-child(2) {
          color: white;
        }
      `}</style>
    </div>
  )
}

// Use dynamic imports for non-critical components that are below the fold
const MemoizedRecommended = dynamic(() => import('./components/Recommended'), {
  loading: () => <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100"></div>,
  ssr: false
})

const TopDealWrapper = tw.div`flex h-[400px] flex-col gap-2 border-[1.5px] rounded-[8px]  border-[#EDEDED] p-4 bg-white`

export const MainWrapper = tw.div`flex w-full flex-col gap-8 lg:items-center lg:justify-center`

export const SearchWrapper = styled(tw.div`
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

  /* Select input styling for dark background */
  .dark-select.ant-select .ant-select-selection-search-input,
  .dark-select.ant-select input,
  .dark-select.ant-select .ant-select-selection-placeholder,
  .dark-select.ant-select .ant-select-selection-item {
    color: white !important;
  }

  .dark-select.ant-select-focused .ant-select-selection-search-input,
  .dark-select.ant-select-focused input,
  .ant-select-selection--focused input,
  .ant-select-selection--focused .ant-select-selection-search-input {
    color: white !important;
  }

  /* Target input specifically */
  .dark-select .ant-select-selection-search input {
    color: white !important;
  }
`
// Memoize the TopDealComponent
const MemoizedTopDealComponent = memo(TopDealComponent)

// At the end of the file, create memoized versions of other components
const MemoizedCategorySection = memo(CategorySection)
const MemoizedPopularproduct = memo(Popularproduct)
const MemoizedNewAdvert = memo(NewAdvert)
const MemoizedSwiperBanner = memo(SwiperBanner)
const MemoizedTopLowestDeals = memo(TopLowestDeals)
// const MemoizedRecommended = memo(Recommended)
const MemoizedTeddyAdvert = memo(TeddyAdvert)
export default memo(LandingPage)
