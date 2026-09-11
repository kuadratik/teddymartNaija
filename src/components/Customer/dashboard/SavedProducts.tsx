import useUpdateProfile from '@/components/Profile/hooks/useUpdateProfile'
import {VendorPersonalType} from '@/components/Profile/utils'
import {vendorPersonalInfoValidationSchema} from '@/components/Profile/utils/schema'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import DetailsCard from '@/components/Store/components/DetailsCard'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetPopularNewQuery} from '@/services/general/general'
import {Listing} from '@/types/store'
import {Button, Form, Input} from 'antd'
import {useFormik} from 'formik'
import React from 'react'

const SavedProducts = () => {
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {type} = useAppSelector(state => state.vendor)

  const {data, isLoading} = useGetPopularNewQuery({
    listingType: type,
    currency: selectedLanguage.value
  })

  console.log('🚀 ~ SavedProducts ~ data:', data)

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div>
      <div className="mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-6">
        {data?.data?.map((listing: Listing, id: number) => {
          return (
            <div key={id}>
              <DetailsCard listing={listing} store_name={listing?.store?.name} store_slug={listing?.store?.slug} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SavedProducts
