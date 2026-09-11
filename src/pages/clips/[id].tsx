// import NavBar from '@/components/Auth/Products/components/NavBar'
import AddShippingComponent from '@/components/Clips/AddShippingComponent'
import {ClipOrderSchema} from '@/components/Clips/utils/schema'
import YourOrderComponent from '@/components/Clips/YourOrderComponent'
// import CustomerLayout from '@/components/Layout/CustomerLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import Carousel from '@/components/SharedUI/Carousel'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import EmptyClip from '@/components/SharedUI/EmptyClip'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import DeleteCard from '@/components/Vendor/components/DeleteCard'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {useDeleteShippingAddressMutation, useGetAllShippingAddressQuery} from '@/services/shipping'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Form} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useLocalStorage} from 'react-use'
import errorToastIcon from '../../../public/assets/error-toast-icon.svg'

interface Address {
  id: string | number
  address: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
}

const DeliveryPage = () => {
  const router = useRouter()
  const {id, editAddressId} = router.query
  const {selectedLanguage} = useAppSelector(state => state.country)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [shippingAddressId, setShippingAddressId] = useState('')

  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })
  const {data: shippingAddress, isLoading: shippingAddressLoading, refetch} = useGetAllShippingAddressQuery({})
  const [deleteShippingAddress, {isLoading: deleting}] = useDeleteShippingAddressMutation()
  const [selectedAddress, setSelectedAddress] = useLocalStorage<any>('selectedShippingAddress', null)
  const getSingleShippingAddress = shippingAddress?.data?.find((address: any) => address?.id === selectedAddress?.id)

  const user = useAppSelector(state => state.auth.user) // get authenticated user
  // Add a state variable to store prefilled data
  const [prefillData, setPrefillData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })

  // Log when prefillData changes
  useEffect(() => {
    console.log('📝 Updated prefill data:', prefillData)
  }, [prefillData])

  // Add logic to use prefilled personal info from the query params if available
  useEffect(() => {
    if (router.query.prefillPersonalInfo && typeof router.query.prefillPersonalInfo === 'string') {
      try {
        const parsedData = JSON.parse(router.query.prefillPersonalInfo)
        console.log('🔄 Parsed prefill data from query:', parsedData)

        // Update the prefillData state
        setPrefillData({
          first_name: parsedData.first_name || '',
          last_name: parsedData.last_name || '',
          email: parsedData.email || '',
          phone: parsedData.phone || ''
        })

        // If form is already initialized, update the values directly
        if (typeof setFieldValue === 'function') {
          setFieldValue('first_name', parsedData.first_name || '')
          setFieldValue('last_name', parsedData.last_name || '')
          setFieldValue('email', parsedData.email || '')
          setFieldValue('phone', parsedData.phone || '')
        }

        // Clear the query param after using it
        const {prefillPersonalInfo, ...restQuery} = router.query
        router.replace({pathname: router.pathname, query: restQuery}, undefined, {shallow: true})
      } catch (error) {
        console.error('Error parsing prefill personal info:', error)
      }
    }
  }, [router.query.prefillPersonalInfo])

  // Also check if getSingleShippingAddress contains personal info and use that
  useEffect(() => {
    if (getSingleShippingAddress && selectedAddress?.id === getSingleShippingAddress?.id) {
      console.log('📋 Getting data from selected address:', getSingleShippingAddress)

      const addressData = {
        first_name: getSingleShippingAddress.first_name || '',
        last_name: getSingleShippingAddress.last_name || '',
        email: getSingleShippingAddress.email || '',
        phone: getSingleShippingAddress.phone || ''
      }

      setPrefillData(addressData)

      if (typeof setFieldValue === 'function') {
        setFieldValue('first_name', addressData.first_name)
        setFieldValue('last_name', addressData.last_name)
        setFieldValue('email', addressData.email)
        setFieldValue('phone', addressData.phone)

        console.log('🔃 Updated form fields with address data:', addressData)
      }
    }
  }, [getSingleShippingAddress, selectedAddress])

  const initialValues = {
    first_name: prefillData.first_name || capitalizeOnlyFirstLetter(user?.first_name!) || '',
    last_name: prefillData.last_name || capitalizeOnlyFirstLetter(user?.last_name!) || '',
    email: prefillData.email || user?.email || '',
    phone: prefillData.phone || selectedAddress?.phone || ''
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

  const clipProductInfo = data?.data?.products
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const [singleAddressIdEdit, setSingleAddressIdEdit] = useState<any | null>(null)
  const [showLogistics, setShowLogistics] = useState(false)
  const singleAddressId = singleAddressIdEdit || editAddressId
  console.log('🚀 ~ singleAddressId:', singleAddressId)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuthenticated = isAuthenticatedToken

  useEffect(() => {
    if (!isAuthenticated) {
      // Save the current  URL as a query parameter
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }
  }, [isAuthenticated])
  useEffect(() => {
    if (editAddressId) {
      // Option 1: Using window.scrollTo
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      })

      // OR Option 2: Using element.scrollIntoView
      const element = document.documentElement
      element.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  }, [editAddressId]) // Add editAddressId as a dependency
  useEffect(() => {
    if (shippingAddress?.data?.length === 0) {
      router.replace(`/clips/${id}`)
    }
  }, [shippingAddress])

  // When setting selected address, store personal info too
  const updateSelectedAddress = (address: any) => {
    console.log('🔃 Updating selected address with:', address)
    // Always include all personal info fields
    setSelectedAddress({
      ...address,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone
    })
  }

  const handleSelectedAddress = () => {
    // First check if an address is selected

    if (shippingAddress?.data?.length === 0) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Please add a default address'}
              textColor="#FFF"
              message={'You need to select an address to continue'}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      return
    }
    if (!selectedAddress) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Please select a default address'}
              textColor="#FFF"
              message={'You need to select an address to continue'}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      return
    }

    // Then check for other required fields
    if (!values.phone || !values.first_name || !values.last_name) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Please fill all personal information required fields'}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      return
    }
    // throw error if values.phone is greater than 15 characters
    if (values.phone.length > 14) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Phone number most not be greater than 14 characters'}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      return
    }

    // If all checks pass, proceed with the update and navigation
    updateSelectedAddress({
      ...selectedAddress,
      email: values.email,
      phone: values.phone,
      first_name: values.first_name,
      last_name: values.last_name
    })
    router.push(`/clips/shipping/${id}`)
  }

  const handleDeletePayoutDetail = async () => {
    try {
      await deleteShippingAddress({
        shippingAddressId
      }).unwrap()
      setShowDeleteModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Shipping address deleted successfully</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      setShippingAddressId('')
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to delete shipping address!</>}
              image={errorToastIcon}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
      setShippingAddressId('')
    }
  }

  return (
    <>
      <SEOHead
        title={`myEKI | Checkout`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <div className="px-[20px] py-8 lg:px-0 lg:py-0">
        <div className="md:py-8">
          <div className="">
            <div className="flex w-full flex-col gap-8">
              {/* {isDesktop ? <NavBar /> : <TopBar title="Delivery Address" />} */}
              {isLoading ? (
                <SkeletonLoaderForPage />
              ) : (
                <>
                  {clipProductInfo?.length > 0 ? (
                    <div className="flex flex-col justify-between gap-8 md:justify-normal lg:mx-auto lg:w-full lg:max-w-7xl lg:gap-[32px]">
                      {isDesktop && (
                        <div className="mt-[30px] flex w-full items-center justify-between">
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
                              {/* <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-[20px] font-semibold leading-[26px] text-[#6B7280]">Saved Address</h2>
                        </div> */}
                              {shippingAddressLoading ? (
                                <div>
                                  <div className="hidden animate-pulse gap-4 lg:grid lg:grid-cols-3">
                                    {[...Array(3)].map((_, i) => (
                                      <div key={i} className="mb-4 h-[150px] w-full rounded bg-gray-200"></div>
                                    ))}
                                  </div>
                                  <div className="block animate-pulse lg:hidden">
                                    {[...Array(1)].map((_, i) => (
                                      <div key={i} className="mb-4 h-[150px] w-full rounded bg-gray-200"></div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {shippingAddress?.data?.length === 0 ? null : (
                                    <div className="">
                                      <Carousel<Address>
                                        title="Saved Address"
                                        items={shippingAddress?.data || []}
                                        scrollAmount={300}
                                        containerClassName=""
                                        buttonClassName=""
                                        showArrows={shippingAddress?.data.length > 3}
                                        renderItem={(address, index) => (
                                          <div
                                            key={address.id}
                                            className={`space-y-3 rounded-lg border p-4 ${(selectedAddress as Address)?.id === address.id ? 'border-2 border-[#6B7280] bg-white' : ''}`}
                                          >
                                            <TextComponent as="p" className="text-sm capitalize text-gray-600">
                                              {address?.first_name || (user as any)?.first_name}{' '}
                                              {address?.last_name || (user as any)?.last_name}
                                            </TextComponent>
                                            <TextComponent as="p" className="text-sm text-gray-600">
                                              {capitalizeOnlyFirstLetter(address?.address)}
                                            </TextComponent>

                                            <div className="flex items-center justify-between gap-6">
                                              <CustomButton
                                                onClick={() => {
                                                  updateSelectedAddress(address)
                                                  setSingleAddressIdEdit(null)
                                                  router.replace(`/clips/${id}`)
                                                }}
                                                type="button"
                                                className="rounded-[7px] px-3 py-3 text-white"
                                              >
                                                Use Address
                                              </CustomButton>
                                              <button
                                                onClick={() => {
                                                  if ((selectedAddress as Address)?.id === address.id) {
                                                    setSelectedAddress(null)
                                                  }
                                                  setShippingAddressId(address.id as string)
                                                  setShowDeleteModal(true)
                                                }}
                                                type="button"
                                                className=""
                                              >
                                                <Icon
                                                  icon="fluent:delete-12-regular"
                                                  className="h-10 w-10 text-[#FF2D55] hover:opacity-75"
                                                />
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setSelectedAddress(address)
                                                  setSingleAddressIdEdit(address.id)
                                                }}
                                                type="button"
                                                className=""
                                              >
                                                <Icon icon="mynaui:edit" className="h-10 w-10 hover:opacity-75" />
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="mb-5 flex flex-col gap-[10px] lg:mb-0">
                              <h2 className="text-[20px] font-semibold text-[#6B7280]">Personal Information</h2>
                              <Form onFinish={handleSubmit}>
                                <div className="flex w-full flex-col gap-5 rounded-[8px] bg-white p-4 shadow-f1">
                                  <div className="flex w-full flex-col gap-4">
                                    <div className="flex w-full flex-col items-center gap-3 md:flex-row">
                                      <div className="w-full">
                                        <label
                                          htmlFor="firstName"
                                          className="mb-1 block text-sm font-medium text-gray-700"
                                        >
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
                                        <label
                                          htmlFor="firstName"
                                          className="mb-1 block text-sm font-medium text-gray-700"
                                        >
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
                                    <div className="flex w-full flex-col items-center gap-3 md:flex-row">
                                      <div className="w-full">
                                        <PhoneInputWithCountry
                                          errorMessage={''}
                                          title="Phone Number*"
                                          labelClassName="font-semibold text-gray-700"
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
                                        <label
                                          htmlFor="firstName"
                                          className="mb-1 block text-sm font-medium text-gray-700"
                                        >
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
                                </div>
                              </Form>
                            </div>

                            {/* {showAddressForm && <AddShippingComponent />} */}

                            <AddShippingComponent
                              shippingAddress={shippingAddress}
                              refetchAddress={refetch}
                              setSingleAddressIdEdit={setSingleAddressIdEdit}
                              singleAddressIdEdit={singleAddressIdEdit}
                              selectedAddress={selectedAddress}
                              setSelectedAddress={setSelectedAddress}
                              getSingleShippingAddress={getSingleShippingAddress}
                              singleAddressId={singleAddressId}
                              editAddressId={editAddressId}
                              personalInfo={values}
                            />
                          </form>
                        </div>

                        <YourOrderComponent
                          isShowShipping={false}
                          isLoading={false}
                          showLogistics={showLogistics}
                          setShowLogistics={setShowLogistics}
                          selectedAddress={selectedAddress}
                          btnText={'Place Order'}
                          handleSelectedAddress={handleSelectedAddress}
                        />
                      </div>
                    </div>
                  ) : (
                    <EmptyClip />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Delete Shipping Method Modal */}
      {isDesktop && showDeleteModal && (
        <PlannerModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          maskCloseable={true}
          onCloseModal={() => {
            setShowDeleteModal(false)
          }}
          width={400}
        >
          <DeleteCard
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeletePayoutDetail}
            isLoading={deleting}
            message={`Are you sure you want to delete this delivery address ?`}
          />
        </PlannerModal>
      )}

      {!isDesktop && showDeleteModal && (
        <DrawerContainer open={showDeleteModal} onClose={() => setShowDeleteModal(false)} height={300}>
          <DeleteCard
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeletePayoutDetail}
            isLoading={deleting}
            message={`Are you sure you want to delete this delivery address ?`}
          />
        </DrawerContainer>
      )}
    </>
  )
}

DeliveryPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}
export default DeliveryPage
