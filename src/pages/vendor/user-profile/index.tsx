// pages/dashboard.tsx

import useUpdateProfilePicture from '@/components/Profile/hooks/useUpdateProfilePicture'
import CustomRouteTab from '@/components/SharedUI/CustomTab'
import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import TextComponent from '@/components/SharedUI/TextComponent'
import UserChangePassword from '@/components/Vendor/components/userProfile/ChangePassword'
import PayoutPage from '@/components/Vendor/components/userProfile/Payout'
import MyProfile from '@/components/Vendor/components/userProfile/Profile'
import UserProfileStoreInformation from '@/components/Vendor/components/userProfile/StoreInformation'
import {useAppSelector} from '@/hooks/reduxHooks'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Button, Skeleton, Image} from 'antd'
import {useState} from 'react'
import tw from 'tailwind-styled-components'

const ProfilePage = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const {isLoading, updateStoreIsLoading, handleUpdateProfilePicture} = useUpdateProfilePicture()

  const tabsData = [
    {
      tabTitle: (
        <TabBodyWrapper>
          <Icon icon="fa6-regular:user" className="text-[19px]" />
          <p className="p_">My Profile</p>
        </TabBodyWrapper>
      ),
      tabBody: <MyProfile />,
      path: 'my-profile'
    },
    {
      tabTitle: (
        <TabBodyWrapper>
          <Icon icon="mingcute:bulb-line" className="text-[19px]" />
          <p className="p_">Store Information</p>
        </TabBodyWrapper>
      ),
      tabBody: <UserProfileStoreInformation />,
      path: 'store-information'
    },
    {
      tabTitle: (
        <TabBodyWrapper>
          <Icon icon="flowbite:lock-outline" className="text-[20px]" />
          <p className="p_">Payout Information</p>
        </TabBodyWrapper>
      ),
      tabBody: <PayoutPage />,
      path: 'payout-information'
    },
    {
      tabTitle: (
        <TabBodyWrapper>
          <Icon icon="flowbite:lock-outline" className="text-[20px]" /> <p className="p_">Password</p>
        </TabBodyWrapper>
      ),
      tabBody: <UserChangePassword />,
      path: 'password'
    }
  ]

  return (
    <div>
      {' '}
      <div
        style={{
          backgroundImage: `url(${
            isActiveUser?.banner_path
              ? `${process.env.imageBaseUrl}/${isActiveUser?.banner_path}`
              : '/assets/default_banner.jpg'
          })`,
          backgroundPosition: '80%'
        }}
        className="relative flex h-[200px] w-full items-center justify-center rounded-lg bg-cover bg-no-repeat"
      >
        <button
          style={{
            background: 'rgba(0, 0, 0, 0.6)', // Darker semi-transparent background
            backdropFilter: 'blur(10px)', // Blur effect
            WebkitBackdropFilter: 'blur(10px)', // For Safari support
            border: '1px solid rgba(255, 255, 255, 0.3)' // Optional border for better look
          }}
          className="!hover:text-white relative rounded-md !border-none bg-[#0000006B] p-3 text-[12px] text-white hover:bg-transparent"
        >
          {' '}
          Change Banner
        </button>

        <label htmlFor="profile-picture" className="absolute -bottom-[80px] left-10">
          {' '}
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
        </label>
        <div className="absolute -bottom-[70px] left-48">
          {' '}
          <TextComponent as="p" className="text-[24px] font-semibold text-black">
            {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
          </TextComponent>
          <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
            {isAuthenticatedUser?.email}{' '}
          </TextComponent>
        </div>
      </div>
      <div className="mt-[140px]">
        <CustomRouteTab elements={tabsData} tabPosition="left" className="custom-left-tabs" />
      </div>
    </div>
  )
}

const TabBodyWrapper = styled(tw.div`
flex w-full items-center justify-center gap-3`)`
  .p_ {
    font-size: 14px;
    font-weight: 500;
  }
`

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default ProfilePage
