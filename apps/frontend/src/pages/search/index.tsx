import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import DetailsCard from '@/components/Store/components/DetailsCard'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetSearchStoreListingQuery} from '@/services/store'

import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

const SearchPage = () => {
  const router = useRouter()
  const {id} = router.query
  const {type} = useSelector((state: any) => state.vendor)
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const [clipUuid, setClipUuid] = useState<any>(null)
  const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
    listType: type as 'product' | 'service',
    category: undefined, // Use parsed categoryId
    search: searchValue?.length ? searchValue : search,
    currency: selectedLanguage.value
  })


  useEffect(() => {
    setSearch(id as string)
  }, [id])

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
        title={`AfricanDiasporaMart | Search-${type}`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col gap-8 pt-10">
              <div className="">
                <div className="w-full rounded-lg bg-black p-4">
                  <div className="mx-auto flex w-full items-center justify-between gap-2 lg:w-[700px]">
                    <TextInput
                      iconName="carbon:search"
                      iconClassName="text-[#181A20] w-[16px] h-[16x]"
                      placeholder={`Search...`}
                      onChange={e => {
                        setSearch(e.target.value)
                        // Reset searchValue immediately when search input is cleared
                        if (e.target.value === '') {
                          setSearchValue('')
                        }
                      }}
                      name=""
                      value={search}
                      type="text"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          setSearchValue(search)
                        }
                      }}
                    />
                  </div>
                </div>
                {search && (
                  <h1 className="mt-5 font-bold">
                    <span className="text-gray-600">Search results</span> : {search}
                  </h1>
                )}
                <div
                  className={`flex w-full flex-col ${data?.data?.length ? 'md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-4' : ''}`}
                >
                  {data?.data?.length ? (
                    data?.data?.map((item: any, index: number) => (
                      <div key={item?.id || index} className="mt-10">
                        {/* <StoreListItem item={item} /> */}
                        <DetailsCard index={index} listing={item} />
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
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default SearchPage
