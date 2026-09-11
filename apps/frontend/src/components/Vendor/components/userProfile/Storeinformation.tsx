import {StoreInformationProfileSchema, StoreInformationSchema} from '@/components/Auth/Signup/utils/schema'
import useUpdateStoreInformation from '@/components/Profile/hooks/useUpdateStoreInformation'
import {VendorStoreInformationType} from '@/components/Profile/utils'
import CheckboxMultipleSelect from '@/components/SharedUI/Input/CheckboxMultipleSelect'
import CountryInput from '@/components/SharedUI/Input/CountryInput'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetUserStoreQuery} from '@/services/store'
import {Alert, Button, Form} from 'antd'
import {useFormik} from 'formik'
import {useEffect, useRef, useState} from 'react'

const UserProfileStoreInformation = ({
  bannerImage,
  profileImage,
  previewProfileImage,
  previewBannerImage,
  resetPreviews
}: {
  bannerImage: string | undefined
  profileImage: string | undefined
  previewProfileImage: string | null
  previewBannerImage: string | null
  resetPreviews: () => void
}) => {
  // Track if we've detected image changes during this session
  const [imagesUpdated, setImagesUpdated] = useState(false)
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const {selectedLanguage} = useAppSelector(state => state.country)

  console.log('🚀 ~ isActiveUser:', isActiveUser)
  const {data: userStoreData, isLoading: userStoreLoading} = useGetUserStoreQuery({currency: selectedLanguage.value})
  const allUserStores = userStoreData?.data || []
  console.log('🚀 ~ UserProfileStoreInformation ~ allUserStores:', allUserStores)

  const getActiveUserStore = allUserStores.find((store: any) => store.id === isActiveUser?.id)
  console.log('🚀 ~ UserProfileStoreInformation ~ getActiveUserStore:', getActiveUserStore)

  // Track the last images we've seen to compare
  const lastImagesRef = useRef({profile: null as string | null, banner: null as string | null})
  // Fetch categories
  const {data: categoriesData, isLoading: categoriesLoading} = useGetAllCategoriesQuery({
    type: 'store'
  })
  // Only set imagesUpdated once when images change
  useEffect(() => {
    // Check if either image is new compared to our last reference
    if (
      (previewProfileImage && previewProfileImage !== lastImagesRef.current.profile) ||
      (previewBannerImage && previewBannerImage !== lastImagesRef.current.banner)
    ) {
      // Update our reference
      lastImagesRef.current = {profile: previewProfileImage, banner: previewBannerImage}

      // Set flag that images were updated
      setImagesUpdated(true)
    }
  }, [previewProfileImage, previewBannerImage])

  // * mutation hooks
  const {updateVendorProfileHandler, isLoading, isSuccess} = useUpdateStoreInformation()

  // Keep track of previous isSuccess value
  const prevSuccessRef = useRef(false)

  // Only reset on successful update transition
  useEffect(() => {
    // Check if we've just transitioned from !isSuccess to isSuccess
    if (isSuccess && !prevSuccessRef.current && imagesUpdated) {
      console.log('Update successfully completed, clearing previews')

      if (typeof resetPreviews === 'function') {
        resetPreviews()
      }

      // Reset our flag and refs
      setImagesUpdated(false)
      lastImagesRef.current = {profile: null, banner: null}
    }

    // Update our previous success ref
    prevSuccessRef.current = isSuccess
  }, [isSuccess, imagesUpdated, resetPreviews])

  // Create a ref to always have the latest user data
  const activeUserRef = useRef(isActiveUser)

  // Keep the ref updated with the latest Redux state
  useEffect(() => {
    activeUserRef.current = isActiveUser
  }, [isActiveUser])

  const initialValues = {
    name: getActiveUserStore?.name ?? '',
    description: getActiveUserStore?.description ?? '',
    contact_number: getActiveUserStore?.contact_number ?? '',
    whatsapp_number: getActiveUserStore?.whatsapp_number ?? '',
    address1: getActiveUserStore?.address1 ?? '',
    address2: getActiveUserStore?.address2 ?? '',
    state: getActiveUserStore?.state ?? undefined,
    city: getActiveUserStore?.city ?? '',
    postal_code: getActiveUserStore?.postal_code ?? '',
    country_id: getActiveUserStore?.country_id ?? undefined,
    type: getActiveUserStore?.type ?? '',
    categories: getActiveUserStore?.categories.map((category: any) => category.id) ?? []
  }

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched} =
    useFormik<VendorStoreInformationType>({
      initialValues: initialValues,
      validationSchema: StoreInformationProfileSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        console.log('Form submitted, images updated status:', imagesUpdated)

        // Use the ref to get the most current user data
        const currentUser = activeUserRef.current

        updateVendorProfileHandler(
          {
            ...val,
            slug: currentUser?.slug,
            banner_path: bannerImage || isActiveUser?.banner_path,
            profile_picture_path: profileImage || isActiveUser?.profile_picture_path
          },
          () => {
            console.log('Update handler callback executed')
            resetForm()
          }
        )
      }
    })

  // Use the imagesUpdated state for showing notification
  const showImageNotification = imagesUpdated

  return (
    <div>
      <TextComponent as="p" className="border-b-2 border-gray-200 pb-2 text-[20px] font-semibold text-black">
        Edit Store Information
      </TextComponent>

      {showImageNotification && (
        <Alert
          message="Images Updated"
          description="You've updated your images. Remember to click Update below to save changes permanently."
          type="info"
          showIcon
          className="mb-4 mt-4"
        />
      )}

      <Form onFinish={handleSubmit} className="mt-[24px]">
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TextInput
              className={`border-[1px] ${errors.name ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={errors.name ? errors.name : ''}
              value={values.name ?? ''}
              placeholder="Store Name"
              onChange={e => {
                if (e.target.value.length <= 50) {
                  handleChange(e)
                }
              }}
              name={'name'}
              type={'text'}
              labelClassName="!text-black"
              title={'Store Name*'}
            />
          </div>
          <div className="w-full">
            <div className="pb-1">
              <label className="text-sm font-[500] capitalize text-[#33373d]">Category*</label>
            </div>
            <CheckboxMultipleSelect
              className={`border-[1px] ${errors.categories ? 'border-red-600' : 'border-gray-200'}`}
              backgroundColor="#FFFFFF"
              placeholder="Fashion & Apparel, Beauty & Personal Care... +2"
              value={values.categories}
              isLoading={categoriesLoading}
              onChange={value => {
                setFieldValue('categories', value)
              }}
              options={
                categoriesData?.data?.map((category: any) => ({
                  label: category.name,
                  value: category.id
                })) || []
              }
              size="large"
              maxTagCount="responsive"
            />
            {errors.categories && <p className="mt-1 text-xs text-red-600">{errors.categories}</p>}
          </div>
          <TextAreaInput
            labelClassName="!text-black"
            className={`border-[1px] ${errors.description ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            errorMessage={errors.description ? errors.description : ''}
            value={values.description}
            title={'Store Description*'}
            maxLength={200}
            onChange={handleChange}
            name={'description'}
            row={4}
            placeholder={''}
          />

          <div className="flex w-full flex-col gap-4 md:flex-row">
            <PhoneInputWithCountry
              backgroundColor="#F5F5F5"
              className={`border-[1px] ${errors.contact_number ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              errorMessage={errors.contact_number ? errors.contact_number : ''}
              title="Store Contact Number*"
              inputProps={{name: 'contact_number', id: 'contact_number'}}
              placeholder={''}
              disabled={false}
              fontSize={14}
              color={'#3D3D3D'}
              value={values.contact_number}
              onChange={e => {
                setFieldValue('contact_number', e)
              }}
            />
            <PhoneInputWithCountry
              backgroundColor="#F5F5F5"
              className={`border-[1px] ${errors.whatsapp_number ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              errorMessage={errors.whatsapp_number ? errors.whatsapp_number : ''}
              title="WhatsApp Number*"
              inputProps={{name: 'whatsapp_number', id: 'whatsapp_number'}}
              placeholder={''}
              disabled={false}
              fontSize={14}
              color={'#3D3D3D'}
              value={values.whatsapp_number}
              onChange={e => {
                setFieldValue('whatsapp_number', e)
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            {' '}
            <TextInput
              className={`border-[1px] ${errors.address1 ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              placeholder="Store Address 1"
              errorMessage={errors.address1 ? errors.address1 : ''}
              value={values.address1}
              onChange={handleChange}
              name={'address1'}
              labelClassName="!text-black"
              type={'text'}
              title={'Store Address 1*'}
            />{' '}
            <TextInput
              title={'Store Address 2'}
              className={`border-[1px] ${errors.address2 ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              placeholder="Store Address 2"
              errorMessage={errors.address2 ? errors.address2 : ''}
              value={values.address2}
              onChange={handleChange}
              name={'address2'}
              labelClassName="!text-black"
              type={'text'}
            />
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="w-full">
              <div className={`pb-1`}>
                <label className="text-sm font-[500] capitalize !text-black">Country*</label>
              </div>{' '}
              <CountryInput
                placeholder={'Country'}
                disabled={true}
                errorMessage={errors.country_id ? errors.country_id : ''}
                className={`border-[1px] py-1 ${errors.country_id ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
                value={values?.country_id ?? undefined}
                onChange={value => {
                  setFieldValue('country_id', value)
                }}
              />
            </div>
            <div className="w-full">
              {' '}
              
              <TextInput
                className={`border-[1px] opacity-50 ${errors.state ? 'border-red-600' : 'border-gray-200'} bg-white`}
                placeholder="State/Province"
                errorMessage={errors.state ? errors.state : ''}
                value={values.state}
                onChange={handleChange}
                name={'state'}
                disabled={true}
                labelClassName="!text-black"
                type={'text'}
                title={'State*'}
              />{' '}
              {/* <StateInput
                className={`border-[1px] ${errors.state ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
                disabled={true}
                errorMessage={errors.state ? errors.state : ''}
                //   @ts-ignore
                countryId={values.country}
                value={values.state ?? undefined}
                onChange={value => {
                  setFieldValue('state', value)
                }}
                placeholder="State/Province"
              /> */}
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            {' '}
            <TextInput
              title="City*"
              className={`border-[1px] ${errors.city ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              placeholder="City"
              errorMessage={errors.city ? errors.city : ''}
              value={values.city}
              onChange={handleChange}
              name={'city'}
              type={'text'}
            />
            <TextInput
              title="Postal Code"
              className={`border-[1px] ${errors.postal_code ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              placeholder="Postal Code"
              errorMessage={errors.postal_code ? errors.postal_code : ''}
              value={values.postal_code}
              onChange={handleChange}
              name={'postal_code'}
              type={'text'}
            />
          </div>
        </div>
        <div className="mt-[34px]">
          {' '}
          <Button htmlType="submit" type="primary" className="whitespace-nowrap bg-black px-7 py-[22px] text-white">
            {isLoading ? (
              <span className="!w-full px-7">
                {' '}
                <Spinner className="h-2 w-2" />
              </span>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default UserProfileStoreInformation
