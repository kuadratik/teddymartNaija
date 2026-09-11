// pages/dashboard.tsx

import Advert from '@/components/Customer/Advert'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import useUpdateBannerProfile from '@/components/Profile/hooks/useUpdateBannerProfile'
import useUpdateProfilePicture from '@/components/Profile/hooks/useUpdateProfilePicture'
import CustomRouteTab from '@/components/SharedUI/CustomTab'
import TextComponent from '@/components/SharedUI/TextComponent'
import UserChangePassword from '@/components/Vendor/components/userProfile/changePassword'
// import UserChangePassword from '@/components/Vendor/components/userProfile/ChangePassword'
// import PayoutPage from '@/components/Vendor/components/userProfile/Payout'
import MyProfile from '@/components/Vendor/components/userProfile/Profile'
import UserProfileStoreInformation from '@/components/Vendor/components/userProfile/Storeinformation'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetCountryQuery} from '@/services/countryState'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Button, Skeleton, Image} from 'antd'
import {useRouter} from 'next/router'
import {useMemo, useRef, useState} from 'react'
import tw from 'tailwind-styled-components'

const ProfilePage = () => {
  const router = useRouter()

  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const {isLoading, updateStoreIsLoading, handleUpdateProfilePicture} = useUpdateProfilePicture()

  const {
    isLoading: bannerIsLoading,
    updateStoreIsLoading: updateBannerIsloading,
    handleUpdateBannerPicture
  } = useUpdateBannerProfile()

  const {data: country} = useGetCountryQuery({
    search: ''
  })

  // const countryData =

  const countryData = useMemo(() => {
    return country?.data?.find((country: {id: any}) => country.id == isActiveUser?.country_id)
  }, [country?.data])

  const tabsData = [
    {
      tabTitle: (
        <TabBodyWrapper
          className=""
          onClick={() => {
            router.push({
              pathname: '/vendor/user-profile',
              query: {tab: 'personal-information'}
            })
          }}
        >
          <Icon icon="fa6-regular:user" className="text-[19px]" />
          <p className="p_">Personal Information</p>
        </TabBodyWrapper>
      ),
      tabBody: <MyProfile />,
      path: 'personal-information'
    },
    {
      tabTitle: (
        <TabBodyWrapper
          className=""
          onClick={() => {
            router.push({
              pathname: '/vendor/user-profile',
              query: {tab: 'store-information'}
            })
          }}
        >
          <Icon icon="mingcute:bulb-line" className="text-[19px]" />
          <p className="p_">Store Information</p>
        </TabBodyWrapper>
      ),
      tabBody: <UserProfileStoreInformation />,
      path: 'store-information'
    },
    {
      tabTitle: (
        <TabBodyWrapper
          onClick={() => {
            router.push({
              pathname: '/vendor/user-profile',
              query: {tab: 'adverts'}
            })
          }}
        >
          <Icon icon="uiw:pay" className="text-[20px]" />
          <p className="p_">My Adverts</p>
        </TabBodyWrapper>
      ),
      tabBody: <Advert />,
      path: 'adverts'
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

  const fileInputRef = useRef(null)

  const handleClick = () => {
    if (fileInputRef.current) {
      // @ts-ignore
      fileInputRef.current.click()
    }
  }

  // const activeUser = {...isActiveUser, country: isActiveUser.country?.id}

  // console.log(activeUser)

  return (
    <div className="">
      {' '}
      <div
        style={{
          backgroundImage:
            bannerIsLoading || updateBannerIsloading
              ? ''
              : `url(${
                  isActiveUser?.banner_path
                    ? `${process.env.imageBaseUrl}/${isActiveUser?.banner_path}`
                    : '/assets/default_banner.jpg'
                })`,
          backgroundPosition: '80%'
        }}
        className="relative flex h-[200px] w-full items-center justify-center rounded-lg bg-cover bg-no-repeat"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".png, .jpeg, .jpg, .webp"
          className="hidden"
          onChange={e => {
            if (e.target.files) {
              handleUpdateBannerPicture({
                payload: {...isActiveUser, country: isActiveUser.country?.id, banner_path: e.target.files[0]}
              })
            }

            // Reset the input value to allow the same file to be selected again
            e.target.value = ''
          }}
        />
        {bannerIsLoading || updateBannerIsloading ? (
          <Skeleton.Avatar
            active
            shape="square"
            className="!w-full rounded-md"
            style={{width: '100%', height: '200px', borderRadius: '10px'}} // Set the desired height
          />
        ) : (
          <button
            onClick={handleClick}
            style={{
              background: 'rgba(0, 0, 0, 0.6)', // Darker semi-transparent background
              backdropFilter: 'blur(10px)', // Blur effect
              WebkitBackdropFilter: 'blur(10px)', // For Safari support
              border: '1px solid rgba(255, 255, 255, 0.3)' // Optional border for better look
            }}
            className="!hover:text-white relative rounded-md !border-none bg-[#0000006B] p-3 text-[12px] text-white hover:bg-transparent"
          >
            Change Banner
          </button>
        )}

        <label
          htmlFor="profile-picture"
          className="absolute -bottom-[70px] left-[20px] lg:-bottom-[80px] lg:left-[150px]"
        >
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
              accept=".png, .jpeg, .jpg, .webp"
              className="hidden"
              onChange={e => {
                if (e.target.files) {
                  handleUpdateProfilePicture({
                    payload: {
                      ...isActiveUser,
                      country: isActiveUser.country?.id,
                      profile_picture_path: e.target.files[0]
                    }
                  })
                }

                // Reset the input value to allow the same file to be selected again
                e.target.value = ''
              }}
            />
          </div>
          <div className="absolute left-[90px] top-[90px] !z-[9999px] rounded-full bg-black p-2">
            <Icon
              icon={'iconamoon:edit-light'}
              width={20}
              color="black"
              height={20}
              className="cursor-pointer text-3xl !text-white"
            />{' '}
          </div>
        </label>
        <div className="absolute -bottom-[62px] left-[160px] hidden lg:left-[305px] lg:block">
          {' '}
          <TextComponent as="p" className="text-[24px] font-semibold text-black">
            {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
          </TextComponent>
          <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
            {isAuthenticatedUser?.email}{' '}
          </TextComponent>
          {/* <div className="flex items-center gap-1">
            <Icon icon="codicon:location" className="text-[16px] text-[#6B7280]" />
            <TextComponent as="p" className="text-[12px] font-medium leading-[24px] text-[#6B7280]">
              {isActiveUser?.address1} {isActiveUser?.city} {isActiveUser?.state} {countryData?.name}
            </TextComponent>
          </div> */}
        </div>
      </div>
      {/* <div className="mt-[140px]">
        <CustomRouteTab elements={tabsData} tabPosition="left" className="custom-left-tabs" />
      </div> */}
      <div className="mx-auto mt-[140px] hidden w-full px-[130px] lg:block">
        <div className="">
          <CustomRouteTab elements={tabsData} tabPosition="left" className="custom-left-tabs" />
        </div>
      </div>
      <div className="mt-[100px] block p-[10px] lg:hidden lg:p-[20px]">
        <div className="px-[10px]">
          <CustomRouteTab elements={tabsData} tabPosition="top" className="" />
        </div>
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
  return <VendorNewLayout maxWidth>{page}</VendorNewLayout>
}

export default ProfilePage
