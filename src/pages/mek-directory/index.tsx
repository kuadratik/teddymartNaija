import {ISelectedCategory} from '@/components/Auth/Products/components/AllCategory'
import AllIndustry from '@/components/Auth/Products/components/AllIndustry'
import MekBanner from '@/components/Auth/Products/components/MekBanner'
import MekDirectories from '@/components/Business/MekDirectories'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CountryStateFilter from '@/components/SharedUI/CountryStateFilter'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useGetAllIndustriesQuery} from '@/services/category/category'
import {useBusinessListingsQuery} from '@/services/myBussiness'
import debounce from '@/utils/debounce'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {useCallback, useEffect, useState} from 'react'
import tw from 'tailwind-styled-components'

const MekDirectory = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<ISelectedCategory[]>([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(16)
  const [isStateOpen, setIsStateOpen] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [selectedOnclickCountry, setSelectedOnclickCountry] = useState<any>(null)
  const [selectedOnClickState, setSelectedOnClickState] = useState<any>(null)
  const [tags, setTags] = useState<ISelectedCategory[]>([])
  const type = 'business' // Default type for search

  const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})
  const router = useRouter()

  // Handle category click
  const handleCategoryClick = useCallback((category: ISelectedCategory) => {
    setSelectedCategories(prevSelected => {
      const isAlreadySelected = prevSelected.some(selected => selected.id === category.id)

      if (isAlreadySelected) {
        return prevSelected.filter(selected => selected.id !== category.id)
      } else {
        return [...prevSelected, {id: category.id, name: category.name}]
      }
    })
  }, [])

  // Handle close tag
  const handleClose = useCallback(
    (removedTag: number) => {
      const newTags = tags.filter(tag => tag?.id !== removedTag)
      setTags(newTags)
      setSelectedCategories(newTags)
    },
    [tags]
  )

  // Sync tags with selected categories
  useEffect(() => {
    // Only update tags if they're different from selectedCategories
    if (JSON.stringify(tags) !== JSON.stringify(selectedCategories)) {
      setTags(selectedCategories)
    }
  }, [selectedCategories, tags])

  useEffect(() => {
    console.log('selectedCategory', selectedCategories)
  }, [selectedCategories])

  const {data, isLoading} = useBusinessListingsQuery({
    search: search! || router.query.search! || ('' as any), // Handle both local state and URL params
    industry: selectedCategories?.map(category => +category.id),
    page: currentPage,
    random: true,
    current_page: currentPage,
    per_page: pageSize,
    country: selectedOnclickCountry?.id,
    state: selectedOnClickState?.id
  })

  // Handle search input change
  const debouncedUpdateURL = useCallback(
    debounce((searchValue: string, pageNumber: number) => {
      const query: {search?: string; page?: number} = {}

      if (searchValue) {
        query.search = searchValue
      }

      if (pageNumber > 1) {
        query.page = pageNumber
      }

      router.replace(
        {
          pathname: '/mek-directory',
          query
        },
        undefined,
        {shallow: true}
      )
    }, 500), // Debounce with a 500ms delay
    [router]
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    setSearch(searchValue)
    // When search changes, reset to page 1
    setCurrentPage(1)
    debouncedUpdateURL(searchValue, 1) // Always start at page 1 for new searches
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    debouncedUpdateURL(search, newPage)
  }

  // Add an effect to sync URL params with state
  useEffect(() => {
    if (router.query.search && typeof router.query.search === 'string') {
      setSearch(router.query.search)
    }

    if (router.query.page && typeof router.query.page === 'string') {
      const pageNumber = parseInt(router.query.page)
      if (!isNaN(pageNumber)) {
        setCurrentPage(pageNumber)
      }
    }
  }, [router.query.search, router.query.page])

  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', preventDefault)
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        preventDefault(e)
      }
    })

    return () => {
      document.removeEventListener('contextmenu', preventDefault)
      document.removeEventListener('keydown', preventDefault)
    }
  }, [])

  return (
    <div>
      <SEOHead
        title={`MEK Directory | myEKI`}
        description="Find products and services near you!! Get Listed on myEKI and start selling for free!"
      />
      <main className="flex w-full flex-col gap-8">
        <div className="flex w-full flex-col">
          <AllIndustry
            industries={industries}
            open={open}
            setOpen={setOpen}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <div className="mx-auto w-full max-w-screen-xl lg:px-5 xl:px-0 2xl:max-w-screen-2xl">
            <SearchWrapper className="flex w-full max-w-7xl items-center justify-between gap-3 md:gap-5 lg:mx-auto lg:gap-0 lg:px-10">
              <div className="relative z-30 hidden lg:block">
                <SelectInput
                  backgroundColor="black"
                  suffixIcon={
                    <Icon icon="iconamoon:arrow-down-2" width="24" height="24" className="text-white lg:top-3" />
                  }
                  labelRenderClassName="text-white"
                  className="w-[179px] border-white py-1 text-white hover:border-white focus:text-white focus:ring-white"
                  placeholder={<span className="font-[500] text-white">Industries</span>}
                  onChange={value => {
                    const selectedItem = industries?.data.find((item: any) => item.id === value)

                    if (selectedItem) {
                      handleCategoryClick({
                        id: selectedItem.id,
                        name: selectedItem.name
                      })
                    }
                  }}
                  data={industries?.data?.map((item: {name: string; id: number}) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: item
                    }
                  })}
                  loading={isLoadingIndustries}
                  notFoundContent={isLoadingIndustries ? 'Loading...' : 'No industry found'}
                />
              </div>
              <div className="relative mx-3 w-full">
                <TextInput
                  iconName="streamline:industry-innovation-and-infrastructure-solid"
                  iconClick={() => {
                    setOpen(true)
                  }}
                  iconClassName="cursor-pointer"
                  className="pl-[20px] lg:pl-[25px]"
                  placeholder={`Search `}
                  onChange={handleSearchChange}
                  name={''}
                  value={search}
                  type={'text'}
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
        </div>
        <MekDirectories
          setCurrentPage={value => handlePageChange(typeof value === 'function' ? value(currentPage) : value)} // Wrap to match expected type
          currentPage={currentPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          selectedCountry={selectedCountry as any}
          setSelectedCountry={setSelectedCountry as any}
          selectedState={selectedState as any}
          setSelectedState={setSelectedState as any}
          search={search}
          data={data}
          isLoading={isLoading}
          industries={industries}
          selectedOnClickState={selectedOnClickState}
          selectedOnclickCountry={selectedOnclickCountry}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        {/* for google adsense */}
        {/* <MekBanner /> */}
      </main>
    </div>
  )
}

MekDirectory.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export const getStaticProps = async (context: any) => {
  const cookies = parseCookies(context)

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'MEK Directory | myEKI',
        description: 'Find products and services near you!! Get Listed on myEKI and start selling for free!',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://myeki.market',
          name: 'myEKI'
        }
      },
      {
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
            name: 'MEK Directory',
            item: 'https://myeki.market/mek-directory'
          }
          // Add more breadcrumbs if needed (e.g., for industry pages)
        ]
      },
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://myeki.market/mek-directory?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
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

export default MekDirectory

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
