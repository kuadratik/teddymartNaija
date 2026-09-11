import NavBar from '@/components/Auth/Products/components/NavBar'
import ClipsComponent from '@/components/Clips'
import AddShippingComponent from '@/components/Clips/AddShippingComponent'
import {ClipOrderSchema} from '@/components/Clips/utils/schema'
import YourOrderComponent from '@/components/Clips/YourOrderComponent'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/CustomerLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import SEOHead from '@/components/SharedUI/SEOHead'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import TopBar from '@/components/Vendor/TopBar'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllClipsQuery} from '@/services/clips'
import {useAddToShippingAddressMutation, useGetAllShippingAddressQuery} from '@/services/shipping'
import {sliceText} from '@/utils/fx'
import {Checkbox, Form, Image} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {PayPalButton} from 'react-paypal-button-v2'

const DeliveryPage = () => {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const {data, isLoading, isFetching, isSuccess: allClipsIsSuccess} = useGetAllClipsQuery({})
  const {data: shippingAddress, isLoading: shippingAddressLoading} = useGetAllShippingAddressQuery({})
  const [addShippingAddress, {isLoading: addShippingAddressLoading}] = useAddToShippingAddressMutation()

  const user = useAppSelector(state => state.auth.user) // get authenticated user

  const initialValues = {
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
    phone: ''
  }

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    handleChange,
    resetForm,
    touched
    // setFieldError,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ClipOrderSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      console.log(val)
    }
  })

  console.log('shippingAddress', shippingAddress)
  const clipProductInfo = data?.data?.products
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: 'James Honda',
      address: '996 Koby Station Apt. 667, Oklahoma City, South Dakota',
      country: 'US',
      state: 'South Dakota',
      city: 'Oklahoma City'
    },
    {
      id: 2,
      name: 'James Honda',
      address: '996 Koby Station Apt. 667, Oklahoma City, South Dakota',
      country: 'US',
      state: 'South Dakota',
      city: 'Oklahoma City'
    },
    {
      id: 3,
      name: 'James Honda',
      address: '1246 Virgil Street Pensacola, FL 3250 Mo. 012-345-6789',
      country: 'US',
      state: 'South Dakota',
      city: 'Oklahoma City'
    }
  ])

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showLogistics, setShowLogistics] = useState(false)

  return (
    <>
      <SEOHead
        title={`myEKI | Checkout`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <div className="px-0 py-8 lg:px-0 lg:py-0">
        <div className="md:py-8">
          <div className="">
            <div className="flex w-full flex-col gap-8">
              {/* {isDesktop ? <NavBar /> : <TopBar title="Delivery Address" />} */}

              <div className="flex flex-col justify-between gap-8 md:justify-normal lg:mx-auto lg:w-full lg:max-w-7xl lg:gap-[72px]">
                {isDesktop && (
                  <div className="mt-[60px] flex w-full items-center justify-between">
                    <h3 className="text-[24px] font-semibold leading-[31px] text-[#1D1d1d]">Delivery Address</h3>
                    <CustomButton
                      className="h-[37px] w-[110px] rounded-[8px]"
                      onClick={() => {
                        router.back()
                      }}
                    >
                      <TextComponent as="p" className="whitespace-nowrap text-white">
                        Back
                      </TextComponent>
                    </CustomButton>
                  </div>
                )}

                <div className="w-full lg:flex lg:gap-[56px]">
                  <div className="w-full">
                    <form className="space-y-8">
                      <div className="flex flex-col gap-[17px]">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-[20px] font-semibold leading-[26px] text-[#6B7280]">Saved Address</h2>
                          <div>
                            <CustomButton
                              className="h-[37px] rounded-[8px] px-5 py-2 text-white"
                              onClick={() => {
                                setShowAddressForm(true)
                              }}
                            >
                              New Address
                            </CustomButton>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {shippingAddress?.data?.map((address: any) => (
                            <div key={address.id} className="space-y-3 rounded-lg border p-4">
                              <div className="flex gap-2">
                                <TextComponent as="span" className="">
                                  Address:
                                </TextComponent>
                                <TextComponent as="p" className="text-sm text-gray-600">
                                  {address.address}
                                </TextComponent>
                              </div>

                              <div className="flex gap-2">
                                <div className="">
                                  <TextComponent as="span" className="">
                                    Country:
                                  </TextComponent>
                                  <TextComponent as="p" className="ml-2 inline-block text-sm text-gray-600">
                                    {' '}
                                    {address.country}
                                  </TextComponent>
                                  ,{' '}
                                  <TextComponent as="span" className="">
                                    State:
                                  </TextComponent>
                                  <TextComponent as="p" className="ml-2 inline-block text-sm text-gray-600">
                                    {address.state}
                                  </TextComponent>
                                  ,{' '}
                                  <TextComponent as="span" className="">
                                    City:
                                  </TextComponent>
                                  <TextComponent as="p" className="ml-2 inline-block text-sm text-gray-600">
                                    {address.city}
                                  </TextComponent>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-6">
                                <CustomButton type="button" className="rounded-[7px] px-3 py-3 text-white">
                                  Use Address
                                </CustomButton>
                                <button type="button" className="">
                                  <Image src="/assets/delete.svg" alt="item" preview={false} className="h-[30px]" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-[40px]">
                        <h2 className="text-[20px] font-semibold leading-[26px] text-[#6B7280]">
                          Personal Information
                        </h2>
                        <Form onFinish={handleSubmit}>
                          <div className="flex w-full flex-col gap-5 bg-white">
                            <div className="flex w-full flex-col gap-4">
                              <div className="flex w-full items-center gap-3">
                                <div className="w-full">
                                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                                    First Name*
                                  </label>
                                  <TextInput
                                    placeholder="First Name"
                                    onChange={handleChange}
                                    name={'first_name'}
                                    type={'text'}
                                    value={values.first_name}
                                    errorMessage={errors.first_name ? errors.first_name : ''}
                                  />
                                </div>

                                <div className="w-full">
                                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                                    Last Name*
                                  </label>
                                  <TextInput
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                    name={'last_name'}
                                    type={'text'}
                                    value={values.last_name}
                                    errorMessage={errors.last_name ? errors.last_name : ''}
                                  />
                                </div>
                              </div>
                              <div className="flex w-full items-center gap-3">
                                <div className="w-full">
                                  <PhoneInputWithCountry
                                    errorMessage={errors.phone ? errors.phone : ''}
                                    title="Phone Number*"
                                    inputProps={{
                                      name: 'phone',
                                      id: 'phone'
                                    }}
                                    placeholder={`Phone Number`}
                                    disabled={false}
                                    fontSize={14}
                                    color={'#3D3D3D'}
                                    value={values.phone}
                                    onChange={e => {
                                      setFieldValue('phone', e)
                                    }}
                                  />
                                </div>

                                <div className="w-full">
                                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                                    Email*
                                  </label>
                                  <TextInput
                                    value={values.email}
                                    errorMessage={errors.email ? errors.email : ''}
                                    placeholder="Email"
                                    onChange={handleChange}
                                    name={'email'}
                                    type={'email'}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* <div className="flex w-full items-center gap-4">
                              <CustomButton
                                type="submit"
                                className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
                              >
                                {addShippingAddressLoading ? <Spinner /> : 'Save'}
                              </CustomButton>
                            </div> */}
                          </div>
                        </Form>
                      </div>

                      {showAddressForm && <AddShippingComponent />}
                    </form>
                  </div>
                  <YourOrderComponent showLogistics={showLogistics} setShowLogistics={setShowLogistics} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

DeliveryPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default DeliveryPage
