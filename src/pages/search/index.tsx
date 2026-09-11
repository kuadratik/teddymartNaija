import BaseLayout from '@/components/Layout/BaseLayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import StoreListItem from '@/components/Search/StoreListItem'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '@/components/SharedUI/TextComponent'
import TopBar from '@/components/Vendor/TopBar'
import {useGetSearchStoreListingQuery} from '@/services/store'
import {Image} from 'antd'
import {useRouter} from 'next/router'
import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

const Search = () => {
  const router = useRouter()
  const {id} = router.query
  const {type} = useSelector((state: any) => state.vendor)

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
    listType: type,
    search: searchValue?.length ? searchValue : (id as string),
    uuid: JSON.parse(clipUuid)
  })

  useEffect(() => {
    setSearch(id as string)
  }, [id])

  if (isLoading) {
    return (
      <div className="mx-auto lg:max-w-[900px] mt-10">
        <SkeletonLoaderForPage length={2} />
      </div>
    )
  }

  return (
    <BaseLayout>
      <div className="md:my-8">
        <div className="mx-auto max-w-[900px]">
          <div className="flex w-full flex-col gap-8">
            <TopBar title="" showClip service_types />
            <div className="mt-[60px]">
              <div className="w-full">
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
              <div className="flex w-full flex-col">
                {data?.data?.length ? (
                  data?.data?.map((item: any, index: number) => (
                    <div key={index}>
                      <StoreListItem item={item} />
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
  )
}

export default Search
