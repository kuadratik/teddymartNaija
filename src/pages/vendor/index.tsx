import BaseLayout from '@/components/Layout/BaseLayout'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import NavTabs from '@/components/SharedUI/NavTabs'
import TextComponent from '@/components/SharedUI/TextComponent'
import ProductListContainer, {IProductListType} from '@/components/Vendor/ProductListContainer'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {useAppSelector} from '@/hooks/reduxHooks'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetStoreMetricsQuery} from '@/services/store'
import {useGetUserStoreListingsQuery} from '@/services/vendor/vendor'
import {capitalizeFirstLetter} from '@/utils/fx'
import {DownOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Dropdown, Image, Menu, Select} from 'antd'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useSelector} from 'react-redux'
import {useLocalStorage} from 'react-use'

export interface ITypeProps {
  value: 'product' | 'service'
  label: string
}

export const typeOptions: ITypeProps[] = [
  {value: 'product', label: 'Product'},
  {value: 'service', label: 'Service'}
]

const Vendor = () => {
  const isAuthenticated = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const {type} = useSelector((state: any) => state.vendor)

  const {data: listingTotalData} = useGetStoreMetricsQuery({params: type})
  console.log('listingTotalData', listingTotalData)

  const router = useRouter()
  const dispatch = useDispatch()

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
  }

  const tabItems = [
    {id: 1, title: 'Available', link: ''},
    {id: 2, title: 'Unavailable', link: ''}
  ]
  const [active, setActive] = useState(1)

  const {data, isLoading, refetch} = useGetUserStoreListingsQuery({
    listingType: type,
    availability: active === 1 ? true : false
  })
  console.log('data', data)

  console.log(isAuthenticatedUser)

  return (
    <VendorLayout>
      <BaseLayout>
        <div>
          <div className="w-full bg-white">
            <div className="flex w-full items-center justify-between">
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
            </div>

            <div className="flex w-full items-center justify-center px-6 py-3">
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
              >
                <div className="flex h-[24px] flex-row items-center gap-2 font-inter text-sm font-medium text-[#33357D]">
                  <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[17px]">
                    {type}
                  </TextComponent>{' '}
                  <Image src="/assets/downArrow.svg" preview={false} className="font-medium" />
                </div>
              </Dropdown>
            </div>
          </div>

          <div className="flex w-full items-center justify-center py-[40px]">
            <div className="flex w-full flex-col items-center justify-center gap-[21px] rounded-[37px] bg-black py-[24px]">
              {/* Avatar */}
              <div className="flex h-[59px] w-[59px] items-center justify-center overflow-hidden rounded-full bg-white">
                <Image src={'/assets/Avatar.png'} width={38} height={38} alt="profile" />
              </div>

              <div className="flex flex-col items-center justify-center">
                <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-white">
                  {isAuthenticatedUser?.store?.name}
                </TextComponent>
                <div className="flex items-center gap-1">
                  <Icon icon="codicon:location" className="text-[16px] text-white" />
                  <TextComponent as="p" className="text-[12px] font-medium leading-[24px] text-white">
                    {isAuthenticatedUser?.store?.address1} {isAuthenticatedUser?.store?.city}{' '}
                    {isAuthenticatedUser?.store?.state}
                  </TextComponent>
                </div>
              </div>

              <div className="flex w-full max-w-[200px] items-center justify-between">
                {[
                  {name: `${capitalizeFirstLetter(type)}`, info: listingTotalData?.data?.totalListingsCount || 0},
                  {name: 'Customers', info: 0}
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

          <div className="w-full py-5">
            <ProductListContainer products={data?.data?.data || []} available={active === 1 ? true : false} />
          </div>
        </div>
      </BaseLayout>
    </VendorLayout>
  )
}

export default Vendor
