import {ISelectedCategory} from '@/components/Auth/Products/components/AllCategory'
import FindVendorContent from '@/components/Auth/Products/components/FindVendorContent'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import CustomerLayout from '@/components/Layout/Customerlayout'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetGroupedAlphaNumericStoreListingQuery} from '@/services/store'
import styled from '@emotion/styled'
import {Dropdown, Menu} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import tw from 'tailwind-styled-components'
import {typeOptions} from '../vendor'

const FindVendor = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const [dropDown, setDropDown] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {data, isLoading, refetch} = useGetGroupedAlphaNumericStoreListingQuery({
    currency: selectedLanguage.value,
    store_type: type
  })
  const [selectedCategories, setSelectedCategories] = useState<ISelectedCategory[]>([])
  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }

  return (
    <>
      <SEOHead
        title={`myEKI | Find Vendors`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />

      <div className="flex w-full flex-col">
        {/* <Category open={open} setOpen={setOpen} /> */}
        <div className="flex w-full flex-col-reverse lg:flex-col">
          <NewNavigation />
          <div className="w-full max-w-7xl lg:mx-auto">
            <SearchWrapper className="">
              <div className="container">
                <div className="second-container">
                  <Dropdown
                    overlay={
                      <Menu className="flex flex-col gap-1">
                        {typeOptions.map((option, index) => (
                          <p
                            key={option.value}
                            onClick={() => {
                              handleChange(option.value)
                            }}
                            className="cursor-pointer rounded-lg p-2 visited:text-[#27104E] hover:bg-gray-100"
                          >
                            {option.label}
                          </p>
                        ))}
                      </Menu>
                    }
                    trigger={['click']}
                    open={dropDown}
                    onOpenChange={visible => {
                      setDropDown(visible)
                    }}
                  >
                    <div className="flex h-[24px] cursor-pointer flex-row items-center gap-2 font-inter text-sm font-medium text-[#33357D]">
                      <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[13px]">
                        {type}
                      </TextComponent>{' '}
                      <Image src="/assets/downArrow.svg" alt="down arrow" width={12} height={12} className="" />
                    </div>
                  </Dropdown>
                </div>

                <TextInput
                  iconName="iconamoon:category"
                  iconClick={() => {
                    setOpen(true)
                  }}
                  iconClassName="cursor-pointer hidden"
                  className="pl-[100px] lg:pl-[125px]"
                  placeholder={`Search for a vendor`}
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
            </SearchWrapper>
          </div>
        </div>
        <div className="w-full max-w-7xl px-[16px] lg:mx-auto lg:px-[40px] xl:px-[0px]">
          <FindVendorContent
            searchTerm={search}
            setSearchTerm={setSearch}
            isLoading={isLoading}
            data={data?.data}
            refetch={refetch}
            type={type}
          />
        </div>
      </div>
    </>
  )
}
FindVendor.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

const SearchWrapper = styled(tw.div`
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
`
export default FindVendor
