import BaseLayout from '@/components/Layout/BaseLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
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
  console.log('id', id)

  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const {data, isLoading, refetch} = useGetSearchStoreListingQuery({
    listType: type,
    search: searchValue?.length ? searchValue : (id as string)
  })

  useEffect(() => {
    setSearch(id as string)
  }, [id])
  return (
    <BaseLayout>
      <div className="flex w-full flex-col gap-8">
        <TopBar title="" showClip service_types />

        <div className="mt-[60px] w-full">
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
          {data?.data?.map((item: any, index: number) => (
            <div className="flex w-full items-center gap-[30px] border-b border-[#E4E4E4] py-2" key={index}>
              <div className="flex h-[125px] w-[141px] min-w-[40%] items-center justify-center overflow-hidden rounded-[22px]">
                <Image
                  src={`${process.env.imageBaseUrl}/${item.profile_picture_path}`}
                  alt="image"
                  preview={false}
                  className="w-full"
                />
              </div>

              <div className="flex w-full flex-col gap-1">
                <TextComponent as="h5" className="leading-20px] text-[16px] font-bold">
                  {item?.name}
                </TextComponent>
                <TextComponent as="p" className="text-[12px] leading-[18px] text-custom_grey">
                  "{item?.description}"
                </TextComponent>
                <CustomButton
                  className="flex items-start justify-start bg-white bg-none px-0 py-0"
                  onClick={() => {
                    router.push(`/store/${item.slug}`)
                  }}
                >
                  <TextComponent as="span" className="text-[12px] leading-[16px] underline">
                    {type === 'product' ? 'Store' : 'Check store'}
                  </TextComponent>
                </CustomButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  )
}

export default Search
