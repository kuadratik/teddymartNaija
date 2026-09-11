import OrderDetails from '@/components/Customer/dashboard/OrderDetails'
import OrderHistory from '@/components/Customer/dashboard/OrderHistory'
import CustomerProfile from '@/components/Customer/dashboard/Profile'
import SavedProducts from '@/components/Customer/dashboard/SavedProducts'
import CustomerLayout from '@/components/Layout/CustomerLayout'
import useLogout from '@/components/Profile/hooks/useLogout'
import useUpdateProfilePicture from '@/components/Profile/hooks/useUpdateProfilePicture'
import CustomRouteTab from '@/components/SharedUI/CustomTab'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
import {Image, Skeleton, Space, Layout} from 'antd'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useState} from 'react'

const DashboardPage = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const {isLoading, updateStoreIsLoading, handleUpdateProfilePicture} = useUpdateProfilePicture()
  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()
  const router = useRouter()

  const tabsData = [
    {
      tabTitle: (
        <div
          className="flex w-full items-center justify-center gap-3"
          onClick={() => {
            router.push({
              pathname: '/dashboard',
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
              pathname: '/dashboard',
              query: {tab: 'saved-products'}
            })
          }}
        >
          <Icon icon="ph:heart" className="text-[19px]" />
          <p className="text-[14px] font-semibold">Saved Products</p>
        </div>
      ),
      tabBody: <SavedProducts />,
      path: 'saved-products'
    },
    {
      tabTitle: (
        <div
          className="flex w-full items-center justify-center gap-3"
          onClick={() => {
            router.push({
              pathname: '/dashboard',
              query: {tab: 'profile'}
            })
          }}
        >
          <Icon icon="fa6-regular:user" className="text-[19px]" />
          <p className="text-[14px] font-semibold">Profile</p>
        </div>
      ),
      tabBody: <CustomerProfile />,
      path: 'profile'
    },

    {
      tabTitle: (
        <div
          className="flex w-full items-center justify-center gap-3"
          onClick={() => {
            logoutUserHandler()
          }}
        >
          <Icon icon="material-symbols-light:logout" className="text-[20px]" />{' '}
          <p className="text-[14px] font-semibold">Logout</p>
        </div>
      ),
      tabBody: <div></div>,
      path: ''
    }
  ]

  return (
    <div className="flex w-full flex-col gap-[34px] bg-white">
      <div className="flex h-[300px] w-full items-center justify-center bg-[#EAECEF] py-[42px]">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="relative flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-full bg-[#fff] shadow">
              {isLoading || updateStoreIsLoading ? (
                <Skeleton.Avatar active shape={'circle'} size={120} />
              ) : (
                <>
                  <Image
                    src={
                      isActiveUser?.profile_picture_path
                        ? `${process.env.imageBaseUrl}/${isActiveUser?.profile_picture_path}`
                        : '/assets/profile_img.jpg'
                    }
                    onLoadStart={() => {
                      setIsLoadingImage(true)
                    }}
                    onLoad={() => {
                      setIsLoadingImage(false)
                    }}
                    onError={error => {
                      error.currentTarget.src = '/assets/default_banner.jpg'
                      setIsLoadingImage(false)
                    }}
                    alt="profile"
                    preview={false}
                    className={`-z-[9999px] !h-[125px] !w-[130px] cursor-pointer rounded-full object-cover ${isLoadingImage ? 'blur-sm' : ''}`}
                    width={130}
                    height={120}
                  />
                </>
              )}
              {/* <div className="cursor-pointer bg-black bg-opacity-50">
            </div>{' '} */}
              <input
                type="file"
                id="profile-picture"
                accept="..png, .jpeg, .jpg, .webp"
                className="hidden"
                onChange={e => {
                  if (e.target.files) {
                    handleUpdateProfilePicture({
                      payload: {...isActiveUser, profile_picture_path: e.target.files[0]}
                    })
                  }
                }}
              />
            </div>

            <div className="absolute left-[90px] top-[90px] !z-[9999px] rounded-full bg-black p-2">
              {' '}
              <Icon
                icon={'iconamoon:edit-light'}
                width={20}
                color="black"
                height={20}
                className="cursor-pointer text-3xl !text-white"
              />{' '}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <TextComponent as="p" className="text-[24px] font-semibold text-black">
              {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
            </TextComponent>
            <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
              {isAuthenticatedUser?.email}{' '}
            </TextComponent>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl">
        <div className="">
          <CustomRouteTab elements={tabsData} tabPosition="left" className="custom-left-tabs" />
        </div>
      </div>
    </div>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default DashboardPage
