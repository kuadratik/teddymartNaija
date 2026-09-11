import BaseLayout from '@/components/Layout/BaseLayout'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import NavTabs from '@/components/SharedUI/NavTabs'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import ProductListContainer from '@/components/Vendor/ProductListContainer'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {useAppSelector} from '@/hooks/reduxHooks'
import {setActiveStore} from '@/redux/apiSlice/authSlice'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetCountryQuery} from '@/services/countryState'
import {useGetStoreMetricsQuery} from '@/services/store'
import {useGetUserStoreListingsQuery} from '@/services/vendor/vendor'
import {capitalizeFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Dropdown, Image, Menu} from 'antd'
import {useRouter} from 'next/router'
import {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

export interface ITypeProps {
  value: 'product' | 'service'
  label: string
}

export const typeOptions: ITypeProps[] = [
  {value: 'product', label: 'Product'},
  {value: 'service', label: 'Service'}
]

const Vendor = () => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const isAuthenticated = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const {type} = useSelector((state: any) => state.vendor)
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const {data: listingTotalData} = useGetStoreMetricsQuery({params: isActiveUser?.type, userStore: isActiveUser?.slug})
  const router = useRouter()
  const dispatch = useDispatch()

  const [dropDown, setDropDown] = useState(false)
  const [storeDropdown, setStoreDropdown] = useState(false)

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }

  const handleStoreSwitch = (value: any) => {
    dispatch(setActiveStore({activeUser: value}))
    setStoreDropdown(false)
  }

  const tabItems = [
    {id: 1, title: 'Available', link: ''},
    {id: 2, title: 'Unavailable', link: ''}
  ]

  const [active, setActive] = useState(1)

  const {data, isLoading, refetch} = useGetUserStoreListingsQuery({
    listingType: isActiveUser?.type,
    availability: active === 1 ? true : false,
    userStore: isActiveUser?.slug
  })

  const {data: country} = useGetCountryQuery({
    search: ''
  })

  // const countryData =

  const countryData = useMemo(() => {
    return country?.data?.find((country: {id: any}) => country.id == isActiveUser?.country_id)
  }, [country?.data])

  return (
    <>
      <SEOHead
        title={`myEKI | Vendor ${capitalizeFirstLetter(isActiveUser?.type)} `}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <VendorLayout>
        {/* <BaseLayout> */}
        <div className="">
          <div className="w-full">
            {/* <div className="flex w-full justify-between">
                <div>
                  <LogoHeader /> 
                </div>

                <div
                  role="button"
                  className="flex h-[33px] w-[149px] cursor-pointer items-center justify-center rounded-[8px] bg-black"
                  onClick={() => router.push('/')}
                >
                  <TextComponent as="p" className="text-[13px] font-medium leading-[15.23px] text-white">
                    Switch to Customer
                  </TextComponent>
                </div>
              </div> */}

            {/* <div className="flex w-full cursor-pointer items-center justify-center px-6 py-3">
              <Dropdown
                overlay={
                  <Menu className="flex flex-col gap-1">
                    {typeOptions.map((option, index) => (
                      <p
                        key={option.value}
                        onClick={() => {
                          handleChange(option.value)
                        }}
                        className="cursor-pointer rounded-lg p-2 visited:text-[#27104E] hover:bg-[#F5F4F5]"
                      >
                        {option.label}
                      </p>
                    ))}
                  </Menu>
                }
                trigger={['click']}
                open={dropDown}
                onVisibleChange={visible => {
                  setDropDown(visible)
                }}
              >
                <div className="flex h-[24px] flex-row items-center gap-2 font-inter text-sm font-medium text-[#33357D]">
                  <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[17px]">
                    {type}
                  </TextComponent>{' '}
                  <Image src="/assets/downArrow.svg" preview={false} className="font-medium" />
                </div>
              </Dropdown>
            </div> */}
          </div>

          <div className="flex w-full items-center justify-center py-[40px]">
            <div className="flex w-full flex-col items-center justify-center gap-[21px] rounded-[37px] bg-black py-[24px]">
              {/* Avatar */}
              <div className="h-[65px] w-[65px] overflow-hidden rounded-full">
                <Image
                  src={
                    isActiveUser?.profile_picture_path
                      ? `${process.env.imageBaseUrl}/${isActiveUser?.profile_picture_path} `
                      : '/assets/profile_img.jpg'
                  }
                  alt="profile"
                  preview={false}
                  onLoadStart={() => {
                    setIsLoadingImage(true)
                  }}
                  onLoad={() => {
                    setIsLoadingImage(false)
                  }}
                  onError={error => {
                    error.currentTarget.src = '/assets/profile_img.jpg'
                    setIsLoadingImage(false)
                  }}
                  className={`${isLoadingImage ? 'blur-sm' : ''} !h-[65px] !w-[65px] rounded-full object-cover`}
                  width={65}
                  height={65}
                />
              </div>

              <div className="flex flex-col items-center justify-center">
                <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-white">
                  {isActiveUser?.name}
                </TextComponent>
                <div className="flex items-center gap-1">
                  <Icon icon="codicon:location" className="text-[16px] text-white" />
                  <TextComponent as="p" className="text-[12px] font-medium leading-[24px] text-white">
                    {isActiveUser?.address1} {isActiveUser?.city} {isActiveUser?.state} {countryData?.name}
                  </TextComponent>
                </div>
              </div>

              <div className="flex w-full max-w-[200px] items-center justify-between">
                {[
                  {
                    name: `${capitalizeFirstLetter(isActiveUser?.type)}${listingTotalData?.data?.totalListingsCount > 1 ? 's' : ''}`,
                    info: listingTotalData?.data?.totalListingsCount || 0
                  },
                  {name: 'Customers', info: listingTotalData?.data?.totalCustomerCount?.customer_count || 0}
                ].map((item, index) => (
                  <div key={index} className="flex w-full flex-col items-center justify-center">
                    <TextComponent as="p" className="text-[12px] font-medium leading-[24px] text-white">
                      {item.name}
                    </TextComponent>
                    <TextComponent as="p" className="text-[24px] font-bold leading-[32px] text-white">
                      {item.info}
                    </TextComponent>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <NavTabs backgroundColor="#F1F1F1" active={active} setActive={setActive} naveItems={tabItems} />
          </div>
          {isLoading ? (
            <div className="w-full">
              <SkeletonLoaderForPage length={2} />{' '}
            </div>
          ) : (
            <div className="w-full py-5">
              <ProductListContainer products={data?.data?.data || []} available={active === 1 ? true : false} />
            </div>
          )}
        </div>
        {/* </BaseLayout> */}
      </VendorLayout>
    </>
  )
}

Vendor.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default Vendor
