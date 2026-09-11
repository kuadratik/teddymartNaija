import Category from '@/components/Auth/Products/components/Category'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import StoresCard from '@/components/CustomerStores/StoresCard'
import StoresCardSkeleton from '@/components/CustomerStores/StoresCardSkeleton'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import {useAppSelector} from '@/hooks/reduxHooks'
import useWindowResize from '@/hooks/useWindowResize'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetAllStoreListingQuery} from '@/services/store'
import debounce from '@/utils/debounce'
import {Icon} from '@iconify/react'
import {Pagination} from 'antd'
import {useRouter} from 'next/router'
import {useCallback, useEffect, useState} from 'react'
import {SearchWrapper} from './new'

const StoresPage = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const {width} = useWindowResize()

  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  const {selectedLanguage} = useAppSelector(state => state.country)

  // Fetch stores with pagination
  const {data, isLoading} = useGetAllStoreListingQuery({
    listType: 'product',
    currency: selectedLanguage.value,
    search: search || undefined,
    category: selectedCategories.length > 0 ? selectedCategories : undefined,
    sortType: 'alphanumeric',
    page: currentPage,
    per_page: pageSize
  })

  // Fetch categories
  const {data: categoriesResponse} = useGetAllCategoriesQuery({
    type: 'store'
  })

  const categories = categoriesResponse?.data || []

  // Debounced URL update
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
          pathname: '/',
          query
        },
        undefined,
        {shallow: true}
      )
    }, 500),
    [router]
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    setSearch(searchValue)
    setCurrentPage(1)
    debouncedUpdateURL(searchValue, 1)
  }

  // Handle pagination change
  const handlePaginationChange = (page: number) => {
    setCurrentPage(page)
    debouncedUpdateURL(search, page)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  // Handle category selection
  const handleCategoryChange = (value: number[]) => {
    setSelectedCategories(value)
    setCurrentPage(1)
    debouncedUpdateURL(search, 1)
  }

  // Handle category removal
  const handleRemoveCategory = (catId: number) => {
    const newCategories = selectedCategories.filter(id => id !== catId)
    setSelectedCategories(newCategories)
    setCurrentPage(1)
    debouncedUpdateURL(search, 1)
  }

  // Handle clear all categories
  const handleClearAllCategories = () => {
    setSelectedCategories([])
    setCurrentPage(1)
    debouncedUpdateURL(search, 1)
  }

  // Sync URL params with state on mount
  useEffect(() => {
    if (router.query.search && typeof router.query.search === 'string') {
      setSearch(router.query.search)
    }

    if (router.query.page && typeof router.query.page === 'string') {
      const pageNumber = parseInt(router.query.page)
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setCurrentPage(pageNumber)
      }
    }
  }, [router.query.search, router.query.page])

  return (
    <>
      <SEOHead
        title={`AfricanDiasporaMart | Stores`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="px-0">
        {/* removed header */}
        <div className="flex w-full flex-col">
          <Category open={open} setOpen={setOpen} />
          <div className="mx-auto w-full max-w-screen-xl lg:px-5 xl:px-0 2xl:max-w-screen-2xl">
            <div className="flex w-full flex-col-reverse lg:flex-col">
              <NewNavigation />
              <SearchWrapper className="flex w-full items-center justify-between !px-2 md:gap-3 lg:mx-auto lg:gap-5 lg:!px-5">
                <div className="relative flex-1 lg:mx-0">
                  <TextInput
                    className="h-[50px] rounded-r-none pl-2 placeholder:text-gray-500 md:rounded-r-xl lg:pl-4"
                    placeholder="Search"
                    onChange={handleSearchChange}
                    name="search"
                    value={search}
                    type="text"
                  />
                </div>
                <div className="relative z-30 w-[120px] sm:w-[200px] lg:!w-[30%] xl:!w-[20%]">
                  <SelectInput
                    backgroundColor="white"
                    suffixIcon={
                      <Icon
                        icon="iconamoon:arrow-down-2"
                        width="24"
                        height="24"
                        className="h-4 w-4 text-black md:h-6 md:w-6"
                      />
                    }
                    labelRenderClassName="text-black text-xs md:text-sm"
                    className="!w-full rounded-l-none border-gray-300 py-1 text-xs text-black hover:border-gray-400 focus:text-black focus:ring-gray-400 md:rounded-l-xl md:text-sm"
                    placeholder={<span className="text-xs font-[500] text-black md:text-sm">Categories</span>}
                    dropdownClassName="!w-[250px] lg:w-full"
                    mode="multiple"
                    tagRender={props => {
                      const {value: tagValue} = props

                      // Only render the first tag, hide others
                      if (selectedCategories.indexOf(tagValue) !== 0) {
                        return <span className="hidden" />
                      }

                      const selectedCount = selectedCategories.length

                      if (selectedCount > 1) {
                        // Show first category + " +X more" in one tag
                        const firstCategory = categories.find((cat: any) => cat.id === selectedCategories[0])
                        return (
                          <span className="inline-flex max-w-[100px] items-center gap-1 truncate rounded bg-gray-100 px-2 py-1 text-xs text-black md:max-w-[200px] lg:max-w-[300px]">
                            <span className="truncate">
                              {firstCategory?.name} (+{selectedCount - 1} more)
                            </span>
                            <span
                              className="ml-1 flex-shrink-0 cursor-pointer rounded-full p-0.5 hover:bg-gray-200"
                              onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleClearAllCategories()
                              }}
                            >
                              ×
                            </span>
                          </span>
                        )
                      }

                      // Show single category normally
                      const category = categories.find((cat: any) => cat.id === tagValue)
                      return (
                        <span className="inline-flex max-w-[100px] items-center gap-1 truncate rounded bg-gray-100 px-2 py-1 text-xs text-black md:max-w-[200px] lg:max-w-[300px]">
                          <span className="truncate">{category?.name}</span>
                          <span
                            className="ml-1 flex-shrink-0 cursor-pointer rounded-full p-0.5 hover:bg-gray-200"
                            onClick={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleRemoveCategory(tagValue)
                            }}
                          >
                            ×
                          </span>
                        </span>
                      )
                    }}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    data={categories.map((item: {name: string; id: number}) => {
                      return {
                        value: item.id,
                        label: item.name,
                        item: item
                      }
                    })}
                  />
                </div>
              </SearchWrapper>
            </div>
            {isLoading ? (
              <div className="mx-auto mt-5 w-full max-w-7xl px-5 lg:px-0">
                <div className="mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {[...Array(width > 1024 ? 8 : width > 640 ? 4 : 4)].map((_, index) => (
                    <StoresCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {' '}
                <div className="px-5 lg:px-0">
                  {/* Brands Header Section */}
                  <div className="mb-6">
                    <h1 className="my-2 text-2xl font-bold">Stores</h1>
                    {search && (
                      <p className="text-base font-normal">
                        Results for <span className="font-semibold">{search}</span>
                      </p>
                    )}
                  </div>

                  {/* Selected Categories Filter */}
                  {selectedCategories.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {selectedCategories.map(catId => {
                        const category = categories.find((cat: any) => cat.id === catId)
                        return (
                          <button
                            key={catId}
                            onClick={() => handleRemoveCategory(catId)}
                            className="inline-flex items-center gap-2 rounded-md bg-[#E5E7EB] px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                          >
                            {category?.name}
                            <Icon icon="mdi:close" className="text-base" />
                          </button>
                        )
                      })}
                      {selectedCategories.length > 1 && (
                        <button
                          onClick={handleClearAllCategories}
                          className="inline-flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                        >
                          Clear All
                          <Icon icon="mdi:close" className="text-base" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {/* StoresCard Component */}
                {data?.data?.data.length === 0 ? (
                  <div className="my-20 flex w-full justify-center">
                    <p className="text-center text-lg font-medium text-gray-500">No stores found.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 grid grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3 lg:px-0 xl:grid-cols-4 2xl:grid-cols-5">
                      {data?.data?.data.map(item => {
                        return <StoresCard key={item?.id} item={item} />
                      })}
                    </div>
                  </>
                )}
                <div className="my-8 flex w-full">
                  <div className="ml-auto">
                    {(currentPage === 1 && data?.data.total! >= 10) || (currentPage > 1 && data?.data.total! >= 1) ? (
                      <Pagination
                        current={currentPage}
                        total={(data as any)?.data?.total!}
                        pageSize={data?.data.per_page!}
                        showSizeChanger={false}
                        onChange={handlePaginationChange}
                      />
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </BaseLayout>
    </>
  )
}
StoresPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}
export default StoresPage
