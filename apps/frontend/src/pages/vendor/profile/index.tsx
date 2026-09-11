import BaseLayout from '@/components/Layout/BaseLayout'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import useLogout from '@/components/Profile/hooks/useLogout'
import ProfileHeader from '@/components/Profile/ProfileHeader'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {Icon} from '@iconify/react'
import Link from 'next/link'

const ProfileIndex = () => {
  const {logoutUserHandler, isLoading} = useLogout()

  return (
    <>
      <SEOHead
        title={`myEKI | Profile`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <VendorLayout>
        <div>
          <ProfileHeader imageUrl="/assets/Avatar.png" />

          <BaseLayout className="mt-2">
            <div className="flex flex-col gap-3">
              <Link
                href="/vendor/profile/edit-personal"
                className="flex w-full items-center justify-between border-b-[0.2px] border-gray-200 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-[12px] border bg-black">
                    <Icon icon={'solar:user-bold'} className="text-[24px] text-white" />
                  </div>
                  <TextComponent as="h5" className="text-[14px] font-semibold leading-[19px] text-[#1f1f1f]">
                    Edit Personal Information
                  </TextComponent>
                </div>
                <div>
                  <Icon icon={'ic:round-chevron-right'} className="text-[20px] text-gray-600" />
                </div>
              </Link>

              <Link
                href="/vendor/profile/edit-store"
                className="flex w-full items-center justify-between border-b-[0.2px] border-gray-200 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-[12px] border bg-black">
                    <Icon icon={'solar:user-bold'} className="text-[24px] text-white" />
                  </div>
                  <TextComponent as="h5" className="text-[14px] font-semibold leading-[19px] text-[#1f1f1f]">
                    Edit Store Information
                  </TextComponent>
                </div>
                <div>
                  <Icon icon={'ic:round-chevron-right'} className="text-[20px] text-gray-600" />
                </div>
              </Link>
              <Link href="/vendor/profile/change-password" className="flex w-full items-center justify-between py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-[12px] border bg-black">
                    <Icon icon={'ri:lock-line'} className="text-[24px] text-white" />
                  </div>
                  <TextComponent as="h5" className="text-[14px] font-semibold leading-[19px] text-[#1f1f1f]">
                    Change Password
                  </TextComponent>
                </div>
                <div>
                  <Icon icon={'ic:round-chevron-right'} className="text-[20px] text-gray-600" />
                </div>
              </Link>
              <div
                onClick={() => {
                  logoutUserHandler({})
                }}
                role="button"
                className="flex w-full cursor-pointer items-center justify-between py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-[12px] border bg-black">
                    <Icon icon={'carbon:logout'} className="text-[24px] text-white" />
                  </div>
                  <TextComponent as="h5" className="text-[14px] font-semibold leading-[19px] text-[#1f1f1f]">
                    Logout
                  </TextComponent>
                </div>
              </div>
            </div>
          </BaseLayout>
        </div>
      </VendorLayout>
    </>
  )
}

ProfileIndex.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default ProfileIndex
