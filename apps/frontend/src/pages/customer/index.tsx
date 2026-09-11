// import OrderDetails from '@/components/Customer/dashboard/OrderDetails'
// import OrderHistory from '@/components/Customer/dashboard/OrderHistory'
// import CustomerProfile from '@/components/Customer/dashboard/Profile'
// import SavedProducts from '@/components/Customer/dashboard/SavedProducts'
import Advert from '@/components/Customer/Advert'
import CustomerProfile from '@/components/Customer/CustomerProfile'
import OrderDetails from '@/components/Customer/OrderDetails'
import OrderHistory from '@/components/Customer/OrderHistory'
import SavedItems from '@/components/Customer/SavedItems'
import TransactionHistory from '@/components/Customer/TransactionHistory'
import CustomerLayout from '@/components/Layout/Customerlayout'
import useLogout from '@/components/Profile/hooks/useLogout'
import useUpdateProfilePicture from '@/components/Profile/hooks/useUpdateProfilePicture'
import CustomRouteTab from '@/components/SharedUI/CustomTab'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {capitalizeFirstLetter} from '@/utils/fx'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import React, {useMemo, useState} from 'react'
import tw from 'tailwind-styled-components'

const CustomerPage = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const {isLoading, updateStoreIsLoading, handleUpdateProfilePicture} = useUpdateProfilePicture()
  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const tabsData = useMemo(() => {
    const tabs = [
      {
        tabTitle: (
          <div
            className="flex w-full items-center justify-center gap-3"
            onClick={() => {
              router.push({
                pathname: '/customer',
                query: {tab: 'order-history'}
              })
            }}
          >
            <Icon icon="material-symbols-light:history" className="text-[20px]" />{' '}
            <p className="text-[14px] font-semibold">Order History</p>
          </div>
        ),
        tabBody: router.query?.details ? <OrderDetails /> : <OrderHistory />,
        path: 'order-history'
      },
      {
        tabTitle: (
          <div
            className="flex w-full items-center justify-center gap-3"
            onClick={() => {
              router.push({
                pathname: '/customer',
                query: {tab: 'transaction-history'}
              })
            }}
          >
            <Icon icon="tdesign:money" className="text-[20px]" />{' '}
            <p className="text-[14px] font-semibold">Transaction History</p>
          </div>
        ),
        tabBody: <TransactionHistory />,
        path: 'transaction-history'
      },
      {
        tabTitle: (
          <TabBodyWrapper
            className=""
            onClick={() => {
              router.push({
                pathname: '/customer',
                query: {tab: 'saved-products'}
              })
            }}
          >
            <Icon icon="ph:heart" className="hidden flex-shrink-0 text-[19px] lg:block" />
            <p className="p_">Saved Items</p>
          </TabBodyWrapper>
        ),
        tabBody: <SavedItems />,
        path: 'saved-products'
      },
      {
        tabTitle: (
          <TabBodyWrapper
            className=""
            onClick={() => {
              router.push({
                pathname: '/customer',
                query: {tab: 'adverts'}
              })
            }}
          >
            <Icon icon="icons8:advertising" className="hidden flex-shrink-0 text-[19px] lg:block" />
            <p className="p_">My Adverts</p>
          </TabBodyWrapper>
        ),
        tabBody: <Advert />,
        path: 'adverts'
      },
      {
        tabTitle: (
          <TabBodyWrapper
            className=""
            onClick={() => {
              router.push({
                pathname: '/customer',
                query: {tab: 'profile'}
              })
            }}
          >
            <Icon icon="fa6-regular:user" className="hidden flex-shrink-0 text-[19px] lg:block" />
            <p className="p_">Profile</p>
          </TabBodyWrapper>
        ),
        tabBody: <CustomerProfile />,
        path: 'profile'
      }
    ]

    if (isDesktop) {
      tabs.push({
        tabTitle: (
          <TabBodyWrapper
            className=""
            onClick={() => {
              logoutUserHandler({})
            }}
          >
            <Icon icon="material-symbols-light:logout" className="hidden flex-shrink-0 text-[20px] lg:block" />
            <p className="p_">Logout</p>
          </TabBodyWrapper>
        ),
        tabBody: <div></div>,
        path: ''
      })
    }

    return tabs
  }, [router.query, isDesktop])

  return (
    <>
      <SEOHead
        title={`AfricanDiasporaMart | Customer ${capitalizeFirstLetter(router.query?.tab as string)}`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />

      <div className="flex w-full flex-col gap-6 lg:gap-[34px]">
        <div className="flex h-[300px] w-full items-center justify-center bg-[#EAECEF] py-[42px]">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="relative flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-full bg-[#fff] shadow">
                <Icon icon="mdi:user" className="text-[75px] text-black" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <TextComponent as="p" className="text-[24px] font-semibold text-black capitalize">
                {isAuthenticatedUser?.first_name} {isAuthenticatedUser?.last_name}
              </TextComponent>
              <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
                {isAuthenticatedUser?.email}{' '}
              </TextComponent>
            </div>
          </div>
        </div>
        <div className="mx-auto hidden w-full max-w-7xl lg:block">
          <div className="">
            <CustomRouteTab elements={tabsData} tabPosition="left" className="custom-left-tabs" />
          </div>
        </div>

        <div className="block p-[10px] lg:hidden lg:p-[20px]">
          <div className="px-[10px]">
            <CustomRouteTab elements={tabsData} tabPosition="top" className="" />
          </div>
        </div>
      </div>
    </>
  )
}

export const TabBodyWrapper = styled(tw.div`
flex w-full items-center justify-center gap-3`)`
  .p_ {
    font-size: 14px;
    font-weight: 500;
  }
`

CustomerPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout maxWidth={false}>{page}</CustomerLayout>
}

export default CustomerPage
