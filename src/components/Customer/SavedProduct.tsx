import useUpdateProfile from '@/components/Profile/hooks/useUpdateProfile'
import {VendorPersonalType} from '@/components/Profile/utils'
import {vendorPersonalInfoValidationSchema} from '@/components/Profile/utils/schema'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import DetailsCard from '@/components/Store/components/DetailsCard'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Listing} from '@/types/store'
import {Button, Form, Input} from 'antd'
import {useFormik} from 'formik'
import React from 'react'
import useWishlist from './hooks/useWishlist'
import Image from 'next/image'

const SavedProducts = () => {
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {type} = useAppSelector(state => state.vendor)

  const {wishListData, isWishListLoading} = useWishlist()
  console.log(wishListData)

  if (isWishListLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div>
      {wishListData?.data?.length > 0 ? (
        <div className="mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-6 lg:gap-4 lg:grid-cols-4">
          {wishListData?.data?.map((listing: Listing, id: number) => {
            return (
              <div key={id}>
                <DetailsCard
                  listing={listing}
                  store_name={listing?.store?.name}
                  store_slug={listing?.store?.slug}
                  deleteMode={true}
                  // savedMode={true}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <>
          {' '}
          <div className="flex w-full flex-col items-center justify-center gap-4 p-10">
            <Image src="/assets/new-empty-state.svg" alt="empty" width={157} height={157} />
            <TextComponent as="p" className="text-[14px] leading-[18px] text-[#6B7280]">
              Nothing to see here
            </TextComponent>
          </div>
        </>
      )}
      {/* <div className="mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-6">
        {wishListData?.data?.length > 0 ? (
          wishListData?.data?.map((listing: Listing, id: number) => {
            return (
              <div key={id}>
                <DetailsCard
                  listing={listing}
                  store_name={listing?.store?.name}
                  store_slug={listing?.store?.slug}
                  deleteMode={true}
                  // savedMode={true}
                />
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 lg:w-[800px]">
            <Image src="/assets/new-empty-state.svg" alt="empty" width={157} height={157} />
            <TextComponent as="p" className="text-[14px] leading-[18px] text-[#6B7280]">
              Nothing to see here
            </TextComponent>
          </div>
        )}
      </div> */}
    </div>
  )
}

export default SavedProducts
