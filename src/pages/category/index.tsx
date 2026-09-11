import BaseLayout from '@/components/Layout/BaseLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import TopBar from '@/components/Vendor/TopBar'
import {useGetSearchStoreListingQuery} from '@/services/store'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

const Category = () => {
  const router = useRouter()
  const {id} = router.query
  const {type} = useSelector((state: any) => state.vendor)
  const [isLoadingImage, setIsLoadingImage] = useState(true)

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
    <>
      <SEOHead
        title={`myEKI | ${capitalizeOnlyFirstLetter(type)} Category`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            {' '}
            <div className="flex w-full flex-col gap-8">
              <TopBar title="Search by Category" />
              <div className="mt-[60px]">
                {' '}
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
                  {data?.data?.map((item: any, index: number) => (
                    <div className="flex w-full items-center gap-[30px] border-b border-[#E4E4E4] py-2" key={index}>
                      <div className="h-[121px] w-[130px] overflow-hidden rounded-[22px]">
                        <ImageComponent
                          src={
                            item.profile_picture_path
                              ? `${process.env.imageBaseUrl}/${item.profile_picture_path}`
                              : '/assets/default_banner.jpg'
                          }
                          alt="image"
                          className={`h-[121px] w-[130px] rounded-[22px] object-cover`}
                          width={100}
                          height={100}
                        />
                      </div>
                      {/* <div className="flex h-[125px] w-[141px] items-center justify-center overflow-hidden rounded-[22px]">
                        <ImageComponent
                          src={`${process.env.imageBaseUrl}/${item.profile_picture_path}`}
                          width={100}
                          height={100}
                          alt="image"
                          className={`h-full w-full`}
                        />
                      </div> */}

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
                            if (type === 'product') {
                              router.push(`/store/${item.slug}`)
                            } else {
                              router.push(`/service-info/${item.slug}`)
                            }
                          }}
                        >
                          <TextComponent as="span" className="text-[12px] leading-[16px] underline">
                            {type === 'product' ? 'Store' : 'About Me'}
                          </TextComponent>
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default Category
