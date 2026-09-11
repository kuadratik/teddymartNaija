import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import StoreListItem from '@/components/Search/StoreListItem'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import DetailsCard from '@/components/Store/components/DetailsCard'
import TopBar from '@/components/Vendor/TopBar'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetSearchStoreListingNewQuery, useGetSearchStoreListingQuery} from '@/services/store'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

const SearchPage = () => {
  const router = useRouter()
  const {id} = router.query
  const {type} = useSelector((state: any) => state.vendor)
  const {selectedLanguage} = useAppSelector(state => state.country)

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  // const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
  //   listType: type,
  //   search: searchValue?.length ? searchValue : (id as string),
  //   uuid: JSON.parse(clipUuid)
  // })

  const {data, isLoading, refetch} = useGetSearchStoreListingNewQuery({
    listType: type,
    search: searchValue?.length ? searchValue : (id as string),
    uuid: JSON.parse(clipUuid),
    currency: selectedLanguage.value
  })

  useEffect(() => {
    setSearch(id as string)
  }, [id])
  // useEffect(() => {
  //   if (type) {
  //     router.push(`/search?type=${type}`)
  //   }
  // }, [type])

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
        title={`myEKI | Search-${type}`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col gap-8">
              <TopBar title="" showClip service_types />
              <div className="">
                <div className="w-full rounded-lg border-[1.5px] border-gray-100">
                  <TextInput
                    iconName="carbon:search"
                    iconClassName="text-[#181A20] w-[16px] h-[16x]"
                    placeholder="Search for a product or vendor"
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
                <div
                  className={`flex w-full flex-col ${data?.data?.length ? 'md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-4' : ''}`}
                >
                  {data?.data?.length ? (
                    data?.data?.map((item: any, index: number) => (
                      <div key={index} className="mt-10">
                        {/* <StoreListItem item={item} /> */}
                        <DetailsCard listing={item} />
                      </div>
                    ))
                  ) : (
                    <RecommendedStores />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}
SearchPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default SearchPage
