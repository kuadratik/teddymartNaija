// pages/dashboard.tsx

import Advert from '@/components/Customer/Advert'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import useUpdateBannerProfile from '@/components/Profile/hooks/useUpdateBannerProfile'
import useUpdateProfilePicture from '@/components/Profile/hooks/useUpdateProfilePicture'
import CustomRouteTab from '@/components/SharedUI/CustomTab'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import UserChangePassword from '@/components/Vendor/components/userProfile/changePassword'
import MyProfile from '@/components/Vendor/components/userProfile/Profile'
import UserProfileStoreInformation from '@/components/Vendor/components/userProfile/Storeinformation'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetCountryQuery} from '@/services/countryState'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Skeleton} from 'antd'
import {useRouter} from 'next/router'
import {useEffect, useMemo, useRef, useState} from 'react'
import tw from 'tailwind-styled-components'

const ProfilePage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('')
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(null)
  const [previewBannerImage, setPreviewBannerImage] = useState<string | null>(null)

  // Set active tab based on router query
  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab as string)
    }
  }, [router.query.tab])

  // Function to reset preview states
  const resetPreviews = () => {
    console.log('Resetting preview images')

    // Properly revoke the object URLs to prevent memory leaks
    if (previewProfileImage && previewProfileImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewProfileImage)
    }

    if (previewBannerImage && previewBannerImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewBannerImage)
    }

    setPreviewProfileImage(null)
    setPreviewBannerImage(null)
  }

  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user)
  const isActiveUser = useAppSelector(state => state.auth.activeUser)

  const {isLoading, updateStoreIsLoading, handleUpdateProfilePicture, data} = useUpdateProfilePicture()

  const {
    isLoading: bannerIsLoading,
    updateStoreIsLoading: updateBannerIsloading,
    handleUpdateBannerPicture,
    data: updateBannerData
  } = useUpdateBannerProfile()

  const {data: country} = useGetCountryQuery({
    search: ''
  })

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
      tabBody: (
        <UserProfileStoreInformation
          profileImage={data?.data[0]}
          bannerImage={updateBannerData?.data[0]}
          previewProfileImage={previewProfileImage}
          previewBannerImage={previewBannerImage}
          resetPreviews={resetPreviews}
        />
      ),
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
  const profileInputRef = useRef(null)

  const handleClick = () => {
    if (fileInputRef.current && activeTab === 'store-information') {
      // @ts-ignore
      fileInputRef.current.click()
    }
  }

  // Handle banner image upload with preview
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Revoke previous blob URL if exists to prevent memory leaks
      if (previewBannerImage && previewBannerImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewBannerImage)
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewBannerImage(previewUrl)

      // Store file for submission
      handleUpdateBannerPicture({
        payload: {...isActiveUser, country: isActiveUser.country?.id, banner_path: file}
      })

      // Reset the input value to allow the same file to be selected again
      e.target.value = ''
    }
  }

  // Handle profile image upload with preview
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Revoke previous blob URL if exists to prevent memory leaks
      if (previewProfileImage && previewProfileImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewProfileImage)
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewProfileImage(previewUrl)

      // Store file for submission
      handleUpdateProfilePicture({
        payload: {
          ...isActiveUser,
          country: isActiveUser.country?.id,
          profile_picture_path: file
        }
      })

      // Reset the input value to allow the same file to be selected again
      e.target.value = ''
    }
  }

  return (
    <div className="">
      {' '}
      <div
        style={{
          backgroundImage:
            bannerIsLoading || updateBannerIsloading
              ? ''
              : `url(${
                  previewBannerImage
                    ? previewBannerImage
                    : isActiveUser?.banner_path
                      ? `${process.env.imageBaseUrl}/${isActiveUser?.banner_path}`
                      : '/assets/default_banner.jpg'
                })`,
          backgroundPosition: '80%'
        }}
        className="relative flex h-[250px] w-full items-center justify-center bg-cover bg-no-repeat"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".png, .jpeg, .jpg, .webp"
          className="hidden"
          onChange={handleBannerImageChange}
        />
        {bannerIsLoading || updateBannerIsloading ? (
          <Skeleton.Avatar
            active
            shape="square"
            className="!w-full"
            style={{width: '100%', height: '200px', borderRadius: '10px'}} // Set the desired height
          />
        ) : (
          activeTab === 'store-information' && (
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
          )
        )}

        <label
          htmlFor="profile-picture"
          className="absolute -bottom-[70px] left-[20px] lg:-bottom-[80px] lg:left-[10px]"
        >
          {' '}
          <div className="relative flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-full bg-[#fff] shadow">
            {isLoading || updateStoreIsLoading ? (
              <Skeleton.Avatar active shape={'circle'} size={120} />
            ) : (
              <>
                <ImageComponent
                  src={
                    previewProfileImage
                      ? previewProfileImage
                      : isActiveUser?.profile_picture_path
                        ? `${process.env.imageBaseUrl}/${isActiveUser?.profile_picture_path}`
                        : '/assets/profile_img.jpg'
                  }
                  isLoadingImage={isLoadingImage}
                  setIsLoadingImage={setIsLoadingImage}
                  alt="profile"
                  className={`-z-[9999px] !h-[130px] !w-[130px] cursor-pointer rounded-full object-cover ${isLoadingImage ? 'blur-sm' : ''}`}
                  width={130}
                  height={120}
                />
              </>
            )}
            <input
              type="file"
              id="profile-picture"
              accept=".png, .jpeg, .jpg, .webp"
              className="hidden"
              disabled={activeTab !== 'store-information'}
              onChange={handleProfileImageChange}
              ref={profileInputRef}
            />
          </div>
          {activeTab === 'store-information' && (
            <div className="absolute left-[90px] top-[90px] !z-[9999px] rounded-full bg-black p-2">
              <Icon
                icon={'iconamoon:edit-light'}
                width={20}
                color="black"
                height={20}
                className="cursor-pointer text-3xl !text-white"
              />{' '}
            </div>
          )}
        </label>
        <div className="absolute -bottom-[62px] left-[160px] hidden lg:left-[160px] lg:block">
          {' '}
          <TextComponent as="p" className="text-[24px] font-semibold text-black">
            {isAuthenticatedUser?.first_name} {isAuthenticatedUser?.last_name}
          </TextComponent>
          <TextComponent as="p" className="text-[14px] font-semibold text-[#6B7280]">
            {isAuthenticatedUser?.email}{' '}
          </TextComponent>
        </div>
      </div>
      <div className="mx-auto mt-[140px] hidden w-full lg:block">
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
  return (
    <VendorNewLayout className="!px-0 !pt-0" maxWidth>
      {page}
    </VendorNewLayout>
  )
}

export default ProfilePage
