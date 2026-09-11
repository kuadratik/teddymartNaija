import BaseLayout from '@/components/Layout/BaseLayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import StoreListItem from '@/components/Search/StoreListItem'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import TopBar from '@/components/Vendor/TopBar'
import {useGetAllCategoriesQuery, useGetRecordInteractionQuery} from '@/services/category/category'
import {useGetSearchStoreListingQuery} from '@/services/store'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

const Search = () => {
  const router = useRouter()
  const {id} = router.query
  const {type} = useSelector((state: any) => state.vendor)

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
    listType: type,
    category: Number(id),
    search: searchValue?.length ? searchValue : search
  })

  const {data: categoryData, isLoading: isCategoryLoading} = useGetAllCategoriesQuery({
    type: type
  })

  const [signUpUser, setSignUpUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = JSON.parse(localStorage.getItem('signUpUser')!)
      setSignUpUser(uuid)
    }
  }, [])

  const {data: recommendedData} = useGetRecordInteractionQuery({
    category: categoryData?.data?.find((category: any) => category.id === Number(id))?.slug,
    interactUid: signUpUser
  })

  // useEffect(() => {
  //   setSearch(id as string)
  // }, [id])

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 lg:max-w-[900px]">
        <SkeletonLoaderForPage length={2} />
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={`myEKI | ${categoryData?.data?.find((category: any) => category.id === Number(id))?.name}`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            {' '}
            <div className="flex w-full flex-col gap-8">
              <TopBar title={categoryData?.data?.find((category: any) => category.id === Number(id))?.name} showClip />

              <div className="mt-[60px] w-full">
                <TextInput
                  iconName="carbon:search"
                  iconClassName="text-[#181A20] w-[16px] h-[16x]"
                  placeholder={`Search for a ${type} or vendor`}
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  name={''}
                  value={search}
                  type={'text'}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSearchValue(search)
                    }
                  }}
                />
              </div>

              <div className="flex w-full flex-col">
                {data?.data?.length ? (
                  data?.data?.map((item: any, index: number) => (
                    <div key={index}>
                      <StoreListItem item={item} />
                    </div>
                  ))
                ) : (
                  <RecommendedStores recommendedType="category" />
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default Search
