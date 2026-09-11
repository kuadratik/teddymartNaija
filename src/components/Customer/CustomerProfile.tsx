import useUpdateProfile from '@/components/Profile/hooks/useUpdateProfile'
import {VendorPersonalType} from '@/components/Profile/utils'
import {vendorPersonalInfoValidationSchema} from '@/components/Profile/utils/schema'
import TextInput from '@/components/SharedUI/Input/TextInput'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useCopyToClipboard} from '@/hooks/useCopyToClipboard'
import {Icon} from '@iconify/react'
import {Form} from 'antd'
import {useFormik} from 'formik'
import CustomButton from '../SharedUI/Buttons/Button'

const CustomerProfile = () => {
  const {handleCopy} = useCopyToClipboard()
  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const initialValues = {
    first_name: isAuthenticatedUser?.first_name ?? '',
    last_name: isAuthenticatedUser?.last_name ?? '',
    email: isAuthenticatedUser?.email ?? '',
    referral_code: isAuthenticatedUser?.referral_code ?? ''
  }
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  // * mutation
  console.log('🚀 ~ CustomerProfile ~ baseUrl:', baseUrl)
  const {updateVendorProfileHandler, isLoading} = useUpdateProfile()

  const {values, handleChange, handleSubmit, touched, resetForm, errors, setFieldValue, setErrors} =
    useFormik<VendorPersonalType>({
      initialValues: initialValues,
      validationSchema: vendorPersonalInfoValidationSchema,
      validateOnMount: false,
      validateOnBlur: false,
      validateOnChange: false,
      enableReinitialize: true,
      onSubmit(values: any) {
        updateVendorProfileHandler(values, resetForm)
      }
    })

  return (
    <div>
      <TextComponent as="p" className="border-b-2 border-gray-200 pb-2 text-[20px] font-semibold text-black">
        Edit Information{' '}
      </TextComponent>

      <Form onFinish={handleSubmit} className="mt-[24px]">
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <TextInput
              errorMessage={errors.first_name ? errors.first_name : ''}
              placeholder=""
              title="First Name"
              value={values.first_name}
              onChange={handleChange}
              labelClassName="!text-black"
              name={'first_name'}
              type={'text'}
              className={`border-[1px] ${errors.first_name ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            />
            <TextInput
              labelClassName="!text-black"
              title="Last Name"
              errorMessage={errors.last_name ? errors.last_name : ''}
              placeholder=""
              value={values.last_name}
              onChange={handleChange}
              name={'last_name'}
              type={'text'}
              className={`border-[1px] ${errors.last_name ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            />
          </div>
          <TextInput
            errorMessage={errors.email ? errors.email : ''}
            placeholder=""
            title="Email"
            value={values.email}
            onChange={handleChange}
            labelClassName="!text-black"
            name={'email'}
            type={'email'}
            className={`border-[1px] ${errors.email ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
          />
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div
              onClick={() => {
                handleCopy(
                  `${baseUrl}/auth/sign-up?redirect=%2Fpost-ad&referral_code=${isAuthenticatedUser?.referral_code}&referralType=ad_lister`,
                  {
                    successTitle: 'Ad referral link copied successfully!'
                  }
                )
              }}
              className="relative w-full cursor-pointer"
            >
              <Icon
                icon="solar:copy-bold-duotone"
                width="24"
                height="24"
                className="absolute right-3 top-[38px] z-20"
              />
              <TextInput
                errorMessage={''}
                placeholder=""
                title="Classified Ad Referral Link"
                value={`${baseUrl}/auth/sign-up?redirect=%2Fpost-ad&referral_code=${isAuthenticatedUser?.referral_code}&referralType=ad_lister`}
                // value={`${baseUrl}/auth/sign-up?redirect=%2Fads%2Fgallery`}
                disabled={true}
                onChange={() => {}}
                labelClassName="!text-black"
                name={''}
                type={'text'}
                className={`border-[1px] ${errors.first_name ? 'border-red-600' : 'border-gray-200'} cursor-pointer bg-[#F5F5F5] pr-10`}
              />
            </div>
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <div
                onClick={() => {
                  handleCopy(`${isAuthenticatedUser?.referral_code}`, {
                    successTitle: 'Referral code link copied successfully!'
                  })
                }}
                className="relative w-full cursor-pointer"
              >
                <Icon
                  icon="solar:copy-bold-duotone"
                  width="24"
                  height="24"
                  className="absolute right-3 top-[38px] z-20"
                />
                <TextInput
                  errorMessage={errors.referral_code ? errors.referral_code : ''}
                  placeholder=""
                  title="Referral Code"
                  disabled={true}
                  value={values.referral_code}
                  onChange={handleChange}
                  labelClassName="!text-black"
                  name={'referral_code'}
                  type={'referral_code'}
                  className={`border-[1px] ${errors.referral_code ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
                />
              </div>
            </div>
          </div>
          {/*============= Please do not remove this ========== */}
          <div
            onClick={() => {
              handleCopy(
                `${baseUrl}/auth/sign-up?redirect=%2F&referral_code=${isAuthenticatedUser?.referral_code}&referralType=customer`,
                {
                  successTitle: 'Customer referral link copied successfully!'
                }
              )
            }}
            className="relative w-full cursor-pointer"
          >
            <Icon icon="solar:copy-bold-duotone" width="24" height="24" className="absolute right-3 top-[38px] z-20" />
            <TextInput
              errorMessage={''}
              placeholder=""
              title="Customer Referral Link"
              value={`${baseUrl}/auth/sign-up?redirect=%2F&referral_code=${isAuthenticatedUser?.referral_code}&referralType=customer`}
              disabled={true}
              onChange={() => {}}
              labelClassName="!text-black"
              name={''}
              type={'text'}
              className={`border-[1px] ${errors.first_name ? 'border-red-600' : 'border-gray-200'} cursor-pointer bg-[#F5F5F5] pr-10`}
            />
          </div>
          <div className="hidden w-full flex-col gap-4 md:flex-row">
            <div
              onClick={() => {
                handleCopy(
                  `${baseUrl}/auth/sign-up?redirect=%2Fpost-ad&referral_code=${isAuthenticatedUser?.referral_code}&referralType=ad_lister`,
                  {
                    successTitle: 'Ad referral link copied successfully!'
                  }
                )
              }}
              className="relative w-full cursor-pointer"
            >
              <Icon
                icon="solar:copy-bold-duotone"
                width="24"
                height="24"
                className="absolute right-3 top-[38px] z-20"
              />
              <TextInput
                errorMessage={''}
                placeholder=""
                title="Classified Ad Referral Link"
                value={`${baseUrl}/auth/sign-up?redirect=%2Fpost-ad&referral_code=${isAuthenticatedUser?.referral_code}&referralType=ad_lister`}
                // value={`${baseUrl}/auth/sign-up?redirect=%2Fads%2Fgallery`}
                disabled={true}
                onChange={() => {}}
                labelClassName="!text-black"
                name={''}
                type={'text'}
                className={`border-[1px] ${errors.first_name ? 'border-red-600' : 'border-gray-200'} cursor-pointer bg-[#F5F5F5] pr-10`}
              />
            </div>
          </div>
          <div className="hidden w-full flex-col gap-4 md:flex-row">
            <div
              onClick={() => {
                handleCopy(
                  `${baseUrl}/auth/sign-up?redirect=%2Fget-list&referral_code=${isAuthenticatedUser?.referral_code}&referralType=business_owner`,
                  {
                    successTitle: 'Directory referral link copied successfully!'
                  }
                )
              }}
              className="relative w-full cursor-pointer"
            >
              <Icon
                icon="solar:copy-bold-duotone"
                width="24"
                height="24"
                className="absolute right-3 top-[38px] z-20"
              />
              <TextInput
                errorMessage={''}
                placeholder=""
                title="Directory Referral Link"
                value={`${baseUrl}/auth/sign-up?redirect=%2Fget-list&referral_code=${isAuthenticatedUser?.referral_code}&referralType=business_owner`}
                disabled={true}
                onChange={() => {}}
                labelClassName="!text-black"
                name={''}
                type={'text'}
                className={`border-[1px] ${errors.first_name ? 'border-red-600' : 'border-gray-200'} cursor-pointer bg-[#F5F5F5] pr-10`}
              />
            </div>
            {/* fix this */}
            <div
              onClick={() => {
                handleCopy(
                  `${baseUrl}/auth/sign-up?redirect=%2Fmek%2Fonboarding&referral_code=${isAuthenticatedUser?.referral_code}&referralType=vendor`,
                  {
                    successTitle: 'Vendor referral link copied successfully!'
                  }
                )
              }}
              className="relative w-full cursor-pointer"
            >
              <Icon
                icon="solar:copy-bold-duotone"
                width="24"
                height="24"
                className="absolute right-3 top-[38px] z-20"
              />
              <TextInput
                errorMessage={''}
                placeholder=""
                title="Vendor Referral Link"
                value={`${baseUrl}/auth/sign-up?redirect=%2Fmek%2Fonboarding&referral_code=${isAuthenticatedUser?.referral_code}&referralType=vendor`}
                disabled={true}
                onChange={() => {}}
                labelClassName="!text-black"
                name={''}
                type={'text'}
                className={`border-[1px] ${errors.first_name ? 'border-red-600' : 'border-gray-200'} cursor-pointer bg-[#F5F5F5] pr-10`}
              />
            </div>
          </div>
          {/*============= Please do not remove this ========== */}{' '}
        </div>
        <div className="mt-[34px]">
          {' '}
          <CustomButton
            type="submit"
            title="Update"
            disabled={isLoading}
            className="w-[96px] whitespace-nowrap bg-black px-7 py-3.5 text-white"
          >
            {isLoading ? <Spinner className="text-white" /> : 'Update'}
          </CustomButton>
        </div>
      </Form>
    </div>
  )
}

export default CustomerProfile
