import {ISelectedCategory} from '@/components/Auth/Products/components/AllCategory'
import Category from '@/components/Auth/Products/components/Category'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import CountryStateFilter from '@/components/SharedUI/CountryStateFilter'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import DetailsCard from '@/components/Store/components/DetailsCard'
import {useAppSelector} from '@/hooks/reduxHooks'
import {onPreventMouseDown} from '@/pages/ads-gallery'
import {AppDispatch} from '@/redux/store'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetSearchStoreListingQuery} from '@/services/store'
import {CloseOutlined} from '@ant-design/icons'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Tag} from 'antd'
import {useRouter} from 'next/router'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import tw from 'tailwind-styled-components'

// Reusing the styled component from the reference file
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

const NewPage = () => {
  const router = useRouter()
  const {id} = router.query

  // State variables
  const [open, setOpen] = useState(false)
  const [isStateOpen, setIsStateOpen] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<any>(null)
  const [selectedOnClickState, setSelectedOnClickState] = useState<any>(null)
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [selectedOnclickCountry, setSelectedOnclickCountry] = useState<any>(null)
  const [selectedCategories, setSelectedCategories] = useState<ISelectedCategory[]>([])
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState<ISelectedCategory[]>([])
  const [clipUuid, setClipUuid] = useState<any>(null)

  // Redux
  const dispatch = useDispatch<AppDispatch>()
  const {type} = useSelector((state: any) => state.vendor)
  const selectedLanguage = useAppSelector(state => state.country.selectedLanguage)

  // Queries
  const {data: allCategoriesData} = useGetAllCategoriesQuery({
    type: ''
  })

  // Memoized category IDs
  const formattedCategoryIds = useMemo(
    () => (selectedCategories.length > 0 ? selectedCategories.map(item => item?.id) : undefined),
    [selectedCategories]
  )

  // Query for new products
  const {
    data,
    isLoading,
    isFetching,
    refetch: categoryListingRefetch
  } = useGetSearchStoreListingQuery({
    currency: selectedLanguage.value,
    listType: type,
    country_id: selectedOnclickCountry?.id,
    category: formattedCategoryIds
  })
  const latestProducts = useMemo(
    () =>
      data?.data
        ? [...data.data]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 15)
        : [],
    [data?.data]
  )
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

  // Handle close for tags
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


  // Set search value from URL query parameter
  useEffect(() => {
    if (typeof id === 'string') {
      setSearch(id)
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="mx-auto mt-10">
        <SkeletonLoaderForPage length={2} />
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={`AfricanDiasporaMart | New Products`}
        description="Discover the newest products on AfricanDiasporaMart, a local marketplace connecting small businesses and vendors with customers in their community. Find the latest offerings and services near you!"
      />

      <div className="mx-auto w-full max-w-screen-xl lg:px-5 xl:px-0 2xl:max-w-screen-2xl">
        <Category open={open} setOpen={setOpen} />
        <SearchWrapper className="flex w-full max-w-7xl items-center justify-between gap-3 md:gap-5 lg:mx-auto lg:gap-0 lg:px-10">
          <div className="relative z-30 hidden lg:block">
            <SelectInput
              backgroundColor="black"
              suffixIcon={<Icon icon="iconamoon:arrow-down-2" width="24" height="24" className="text-white lg:top-3" />}
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
              data={
                allCategoriesData?.data?.map((item: {name: string; id: number}) => {
                  return {
                    value: item.id,
                    label: item.name,
                    item: item
                  }
                }) || []
              }
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
        <div className="mx-auto max-w-7xl">
          {selectedOnclickCountry || selectedOnClickState ? (
            <div className="relative px-[25px] pb-4 lg:top-6 lg:px-0">
              <p className="font-[500] lg:pt-0">
                {data?.data?.length === 0 && 'No'} Results for{' '}
                {selectedOnClickState?.name ? selectedOnClickState?.name + ',' : ''}{' '}
                {selectedOnclickCountry?.name ?? ''}
              </p>
            </div>
          ) : null}
          {tags?.length ? (
            <div className="relative px-[20px] py-2 lg:top-6 lg:px-0">
              <div className="flex flex-wrap gap-2">
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
      <BaseLayout>
        <div className="mx-auto">
          <div className="flex w-full flex-col gap-8 lg:pt-10">
            <div className="">
              <h1 className="relative top-2 px-4 text-[20px] font-bold text-gray-800 lg:px-0 lg:pt-5 lg:text-2xl">
                New Products
              </h1>
              {search && (
                <h2 className="mt-2 px-4 font-medium lg:px-0">
                  <span className="text-gray-600">Search results</span>: {search}
                </h2>
              )}
              <div
                className={`mt-6 flex w-full flex-col gap-6 px-4 lg:px-0 ${data?.data?.length ? 'md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-4' : ''}`}
              >
                {latestProducts?.length ? (
                  latestProducts.map((item: any, index: number) => (
                    <div key={item?.id || index}>
                      <DetailsCard index={index} listing={item} />
                    </div>
                  ))
                ) : (
                  <div className="mt-6">
                    <RecommendedStores recommendedClassName="lg:grid-cols-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

NewPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default NewPage
