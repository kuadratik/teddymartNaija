import Category from '@/components/Auth/Products/components/Category'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import StoresCard from '@/components/CustomerStores/StoresCard'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useGetBrandCategoriesQuery} from '@/services/super-admin'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {SearchWrapper} from '../new'

const StoresPage = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  // Fetch categories
  const {data: categoriesResponse, isLoading: categoriesLoading} = useGetBrandCategoriesQuery()
  // Extract data from responses
  const categories = categoriesResponse?.data || []
  return (
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
          </div>
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
          </div>
          {/* StoresCard Component */}
          <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3 lg:px-0 xl:grid-cols-4 2xl:grid-cols-5 mb-6">
            {[1, 2, 3, 4].map(item => {
              return <StoresCard key={item} item={item} />
            })}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
StoresPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}
export default StoresPage
