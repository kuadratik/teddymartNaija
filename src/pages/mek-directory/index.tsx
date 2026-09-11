import {ISelectedCategory} from '@/components/Auth/Products/components/AllCategory'
import AllIndustry from '@/components/Auth/Products/components/AllIndustry'
import MekBanner from '@/components/Auth/Products/components/MekBanner'
import MekDirectories from '@/components/Business/MekDirectories'
import CustomerLayout from '@/components/Layout/Customerlayout'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useGetAllIndustriesQuery} from '@/services/category/category'
import {useBusinessListingsQuery} from '@/services/myBussiness'
import debounce from '@/utils/debounce'
import styled from '@emotion/styled'
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
  const [pageSize, setPageSize] = useState(15)
  const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})
  const router = useRouter()
  useEffect(() => {
    console.log('selectedCategory', selectedCategories)
  }, [selectedCategories])
  const {data, isLoading} = useBusinessListingsQuery({
    search: search! || router.query.search! || ('' as any), // Handle both local state and URL params
    industry: selectedCategories?.map(category => +category.id),
    page: currentPage,
    current_page: currentPage,
    per_page: pageSize,
    country: selectedCountry as any,
    state: selectedState as any
  })

  // Handle search input change
  const debouncedUpdateURL = useCallback(
    debounce((searchValue: string) => {
      if (searchValue) {
        router.replace(
          {
            pathname: '/mek-directory',
            query: {search: searchValue}
          },
          undefined,
          {shallow: true}
        )
      } else {
        router.replace('/mek-directory', undefined, {shallow: true})
      }
    }, 500), // Debounce with a 500ms delay
    [router]
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    setSearch(searchValue)
    debouncedUpdateURL(searchValue) // Debounced URL update
  }

  // Add an effect to sync URL params with state
  useEffect(() => {
    if (router.query.search && typeof router.query.search === 'string') {
      setSearch(router.query.search)
    }
  }, [router.query.search])

  // useEffect(() => {
  //   const preventDefault = (e: Event) => {
  //     e.preventDefault()
  //     return false
  //   }

  //   document.addEventListener('contextmenu', preventDefault)
  //   document.addEventListener('keydown', e => {
  //     if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
  //       preventDefault(e)
  //     }
  //   })

  //   return () => {
  //     document.removeEventListener('contextmenu', preventDefault)
  //     document.removeEventListener('keydown', preventDefault)
  //   }
  // }, [])

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
          <div className="flex w-full flex-col-reverse lg:flex-col">
            {/* <NewNavigation /> */}
            <div className="w-full max-w-5xl lg:mx-auto">
              <SearchWrapper className="py-4">
                <div className="container">
                  <TextInput
                    iconName="streamline:industry-innovation-and-infrastructure-solid"
                    iconClick={() => {
                      setOpen(true)
                    }}
                    iconClassName="cursor-pointer"
                    className=""
                    placeholder={`Search for a business `}
                    onChange={handleSearchChange}
                    name={''}
                    value={search}
                    type={'text'}
                  />
                </div>
              </SearchWrapper>
            </div>
          </div>
        </div>
        <MekDirectories
          setCurrentPage={setCurrentPage}
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
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <MekBanner />
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
      // {
      //   '@type': 'Directory',
      //   name: 'MEK Business Directory',
      //   description: 'Business directory listing on myEKI marketplace',
      //   hasOfferCatalog: {
      //     '@type': 'LocalBusiness', // Or just 'ItemList' if you don't want to specify LocalBusiness
      //     name: 'Industry Categories',
      //     itemListElement: [] // This will be populated later
      //   }
      // },
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
