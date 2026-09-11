import BaseLayout from '@/components/Layout/BaseLayout'
import ProfileHeader from '@/components/Profile/ProfileHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {Icon} from '@iconify/react'
import Link from 'next/link'

const ProfileIndex = () => {
  return (
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
          </div>
        </BaseLayout>
      </div>
    </VendorLayout>
  )
}

export default ProfileIndex
