import Category from '@/components/Auth/Products/components/Category'
import BrandCardSkeleton from '@/components/Brand/BrandCardSkeleton'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import ShareIcon from '@/components/SharedUI/ShareIcon'
import useWindowResize from '@/hooks/useWindowResize'
import {useGetBrandCategoriesQuery, useGetBrandsQuery} from '@/services/brands/brands'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Pagination, Tooltip} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useState} from 'react'

const SearchWrapper = styled.div`
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 32px;
  border-radius: 14px;

  @media (max-width: 1024px) {
    border-radius: 0px;
    margin-bottom: 24px;
  }
`

const BrandsPage = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const {width} = useWindowResize()

  const pageSize = 15

  // Fetch categories
  const {data: categoriesResponse, isLoading: categoriesLoading} = useGetBrandCategoriesQuery()

  // Fetch brands with current filters
  const {data: brandsResponse, isLoading: brandsLoading} = useGetBrandsQuery({
    page: currentPage,
    per_page: pageSize,
    search: search || undefined,
    category_ids: selectedCategories.length > 0 ? selectedCategories : undefined
  })

  // Extract data from responses
  const categories = categoriesResponse?.data || []
  const brands = brandsResponse?.data?.data || []
  const totalBrands = brandsResponse?.data?.total || 0

  return (
    <>
      <SEOHead
        title="myEKI | Brands"
        description="Discover top brands on myEKI, a local marketplace connecting small businesses and vendors with customers in their community."
      />

      <BaseLayout className="px-0">
        <div className="md:hidden">
          <Category />
        </div>
        <div className="mx-auto w-full max-w-screen-xl lg:mt-8 lg:px-5 xl:px-0 2xl:max-w-screen-2xl">
          <SearchWrapper className="flex w-full items-center justify-between !px-2 md:gap-3 lg:mx-auto lg:gap-5 lg:!px-5">
            <div className="relative flex-1 lg:mx-0">
              <TextInput
                className="h-[50px] rounded-r-none pl-2 placeholder:text-gray-500 md:rounded-r-xl lg:pl-4"
                placeholder="Search"
                onChange={e => {
                  setSearch(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
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
                    return <span style={{display: 'none'}} />
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
                            setSelectedCategories([])
                            setCurrentPage(1)
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
                          setSelectedCategories(prev => prev.filter(id => id !== tagValue))
                          setCurrentPage(1)
                        }}
                      >
                        ×
                      </span>
                    </span>
                  )
                }}
                value={selectedCategories}
                onChange={value => {
                  setSelectedCategories(value)
                  setCurrentPage(1) // Reset to first page on category change
                }}
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

          <div className="px-5 pb-10 lg:px-0">
            {/* Brands Header Section */}
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-bold">Brands</h1>
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
                      onClick={() => {
                        setSelectedCategories(prev => prev.filter(id => id !== catId))
                        setCurrentPage(1)
                      }}
                      className="inline-flex items-center gap-2 rounded-md bg-[#E5E7EB] px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                      {category?.name}
                      <Icon icon="mdi:close" className="text-base" />
                    </button>
                  )
                })}
                {selectedCategories.length > 1 && (
                  <button
                    onClick={() => {
                      setSelectedCategories([])
                      setCurrentPage(1)
                    }}
                    className="inline-flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                  >
                    Clear All
                    <Icon icon="mdi:close" className="text-base" />
                  </button>
                )}
              </div>
            )}

            {/* Loading State */}
            {brandsLoading && (
              <div className="mx-auto mt-5 w-full max-w-7xl px-0">
                <div className="mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {[...Array(width > 1024 ? 8 : width > 640 ? 4 : 4)].map((_, index) => (
                    <BrandCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Brands Grid */}
            {!brandsLoading && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {brands.map(brand => (
                  <div
                    key={brand.id}
                    className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
                    onClick={e => {
                      e.stopPropagation()
                      window.open(brand.source_url, '_blank', 'noopener,noreferrer')
                    }}
                  >
                    {/* Brand Header */}
                    <div className="flex flex-1 items-center gap-3 border-b border-gray-100 p-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-1 ring-gray-200">
                        <Image
                          src={`${process.env.imageBaseUrl}/${brand.logo_url}`}
                          alt={brand.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold leading-tight text-gray-900">{brand.name}</h3>
                        {(() => {
                          const cats = brand.categories && brand.categories.length > 0 ? brand.categories : []
                          const fullCategoryText = cats.map(c => c.name).join(', ') || 'No category'
                          const categoryText =
                            cats.length > 2
                              ? cats
                                  .slice(0, 2)
                                  .map(c => c.name)
                                  .join(', ') + ` + ${cats.length - 2} more`
                              : fullCategoryText
                          return cats.length > 2 ? (
                            <Tooltip placement="top" title={fullCategoryText}>
                              <span className="block cursor-pointer truncate text-sm text-gray-500">
                                {categoryText}
                              </span>
                            </Tooltip>
                          ) : (
                            <span className="block truncate text-sm text-gray-500">{categoryText}</span>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-4">
                      {/* Brand Description */}
                      <Tooltip placement="top" title={brand.description}>
                        <p className="flex-1 cursor-pointer truncate text-sm leading-relaxed text-gray-600">
                          {brand.description}
                        </p>
                      </Tooltip>

                      {/* Share Button */}
                      <Tooltip title="View in new tab">
                        <button
                          className="flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                          onClick={e => {
                            e.stopPropagation()
                            window.open(brand.source_url, '_blank', 'noopener,noreferrer')
                          }}
                        >
                          <ShareIcon className="text-xl text-black" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {!brandsLoading && brands.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Icon icon="mdi:package-variant-closed-remove" className="mb-4 text-6xl text-gray-300" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">No brands found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            <div className="my-8 flex w-full">
              <div className="ml-auto">
                {(currentPage === 1 && totalBrands! >= 10) || (currentPage > 1 && totalBrands! >= 1) ? (
                  <Pagination
                    current={currentPage}
                    total={totalBrands}
                    pageSize={brandsResponse?.data?.per_page!}
                    showSizeChanger={false}
                    onChange={page => {
                      setCurrentPage(page)
                      window.scrollTo({top: 0, behavior: 'smooth'})
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

BrandsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default BrandsPage
