// import NavBar from '@/components/Auth/Products/components/NavBar'
import YourOrderComponent from '@/components/Clips/YourOrderComponent'
import CustomerLayout from '@/components/Layout/Customerlayout'
// import CustomerLayout from '@/components/Layout/CustomerLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import EmptyClip from '@/components/SharedUI/EmptyClip'
import SkeletonLoaderForList from '@/components/SharedUI/Loader/SkeletonLoaderForList'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {useCreatePaymentMutation, useGetShippingMethodsQuery} from '@/services/shipping'
import {ISelectedShippingAddress} from '@/types/shippingResponse'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Radio} from 'antd'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useLocalStorage} from 'react-use'

// src/types/storeMethods.ts

const ShippingPage = () => {
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {id} = router.query
  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })
  const clipProductInfo = data?.data?.products

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const {data: shippingMethod, isLoading: shippingMethodLoading} = useGetShippingMethodsQuery({
    clipId: id?.toString() ?? '',
    currency: selectedLanguage.value
  })
  // Instead of an object, use an array
  const [selectedShippingAmount, setSelectedShippingAmount] = useState<
    Array<{
      store_slug: string
      amount: number
    }>
  >([])
  const [createPayment, {isLoading: createPaymentLoading, error: createPaymentError}] = useCreatePaymentMutation()
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const [showStoreShipping, setShowStoreShipping] = useState<string[]>(() => {
    // Try to get stored values from localStorage
    const stored = localStorage.getItem('shippingStoreStates')
    if (stored) {
      return JSON.parse(stored)
    }
    // If no stored value, return empty array
    return []
  })

  const [selectedOption, setSelectedOption] = useState<string>('') // For tracking selected value
  const [showLogistics, setShowLogistics] = useState(false)
  const [selectedShippingMethods, setSelectedShippingMethods] = useState<
    Array<{
      store_id: number
      shipping_method_id: number
    }>
  >([])

  const user = useAppSelector(state => state.auth.user) // get authenticated user
  const [selectedAddress, setSelectedAddress] = useLocalStorage<ISelectedShippingAddress | null>(
    'selectedShippingAddress',
    null
  )
  const selectedPaymentGateway = selectedLanguage.value === 'NGN' ? 'paystack' : 'paypal'

  const handleShippingMethodAmountSelect = (store_slug: string, amount: number, methodType: string) => {
    if (methodType === 'vendor-fulfilled shipping') {
      setSelectedShippingAmount(prev => {
        // Remove any existing amount for this store
        const filtered = prev.filter(item => item?.store_slug?.toLowerCase() !== store_slug?.toLowerCase())
        // Add the new amount
        return [
          ...filtered,
          {
            store_slug: store_slug,
            amount: amount
          }
        ]
      })
    } else {
      setSelectedShippingAmount(prev => {
        // Just remove the amount for this store
        return prev.filter(item => item?.store_slug?.toLowerCase() !== store_slug?.toLowerCase())
      })
    }
  }
  // At the top of your component, initialize the state using localStorage

  // Use useEffect to update localStorage whenever showStoreShipping changes
  useEffect(() => {
    localStorage.setItem('shippingStoreStates', JSON.stringify(showStoreShipping))
  }, [showStoreShipping])

  // Use another useEffect to ensure all stores are open when data is loaded
  useEffect(() => {
    if (shippingMethod?.data) {
      const storeIds = shippingMethod.data.map(store => store.store_id.toString())
      setShowStoreShipping(prevState => {
        // Only add store IDs that aren't already in the state
        const newStoreIds = storeIds.filter(id => !prevState.includes(id))
        if (newStoreIds.length === 0) return prevState
        return [...prevState, ...newStoreIds]
      })
    }
  }, [shippingMethod?.data])

  useEffect(() => {
    if (!isAuthenticatedToken) {
      // Check if the user is logged in
      router.push('/')
    }
  }, [isAuthenticatedToken])
  const getStoreAmount = (store_slug: string) => {
    const storeAmount = selectedShippingAmount?.find(
      item => item?.store_slug?.toLowerCase() === store_slug?.toLowerCase()
    )
    return storeAmount ? storeAmount?.amount : null
  }
  const toggleStoreShipping = (storeId: string) => {
    setShowStoreShipping(prev => (prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]))
  }

  const handleShippingMethodSelect = (storeId: number, methodId: number) => {
    setSelectedShippingMethods(prev => {
      // Remove any existing selection for this store
      const filtered = prev.filter(item => item?.store_id !== storeId)
      // Add the new selection
      return [
        ...filtered,
        {
          store_id: storeId,
          shipping_method_id: methodId
        }
      ]
    })
  }
  const validateShippingMethods = () => {
    const storesWithShippingMethods = shippingMethod?.data?.filter(store => store.storeMethodTypes.length > 0) || []

    return storesWithShippingMethods.every(store => selectedShippingMethods?.some(sm => sm.store_id === store.store_id))
  }
  const handleSelectedAddress = async () => {
    if (!validateShippingMethods()) {
      // Show error message
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Please select shipping methods for all stores!</>}
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
    let payload = {
      payment_gateway: selectedPaymentGateway,
      currency_code: selectedLanguage.value,
      first_name: selectedAddress?.first_name,
      last_name: selectedAddress?.last_name,
      email: selectedAddress?.email,
      phone: selectedAddress?.phone,
      shipping_address_id: selectedAddress?.id,
      store_shipping_methods: selectedShippingMethods,
      return_url: `${window.location.origin}/clips/payment/successful`,
      cancel_url: `${window.location.origin}`
    }
    try {
      const response = await createPayment({
        cart: id?.toString() ?? '',
        currency: selectedLanguage.value,
        body: payload
      }).unwrap()

      if (response?.data.url) {
        window.open(response.data.url, '_blank')
      }

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Payment Initiated successfully!</>}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (error: any) {
      console.log('🚀 ~ handleSelectedAddress ~ error:', error)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={error?.data?.message || 'Something went wrong!'}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  return (
    <>
      <SEOHead
        title={`myEKI | Shipping`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <div className="px-0 py-8 lg:px-0 lg:py-0">
        <div className="md:py-8">
          <div className="">
            <div className="flex w-full flex-col gap-8">
              {/* {isDesktop ? <NavBar /> : <TopBar title="Delivery Address" />} */}
              {isLoading ? (
                <SkeletonLoaderForPage />
              ) : (
                <>
                  {clipProductInfo?.length > 0 ? (
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
                                <h2 className="text-[20px] font-semibold leading-[26px] text-[#6B7280]">
                                  Shipping Information
                                </h2>
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className={`border-primary-500 space-y-3 rounded-lg border bg-white p-4`}>
                                  <TextComponent as="p" className="text-sm capitalize text-gray-600">
                                    {selectedAddress?.first_name} {selectedAddress?.last_name}
                                  </TextComponent>
                                  <TextComponent as="p" className="text-sm text-gray-600">
                                    {capitalizeOnlyFirstLetter(selectedAddress?.address!)}
                                  </TextComponent>

                                  <div className="flex items-center justify-between gap-6">
                                    <CustomButton
                                      onClick={() => {
                                        router.push(`/clips/${id}?editAddressId=${selectedAddress?.id}`)
                                      }}
                                      type="button"
                                      className="rounded-[7px] px-3 py-3 text-white"
                                    >
                                      Edit Address
                                    </CustomButton>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-[10px] pb-5">
                              <h2 className="text-[20px] font-semibold leading-[26px] text-[#6B7280]">
                                Select Shipping Method
                              </h2>
                              <h2 className="text-[13px] font-[500] text-[#6B7280]">
                                Please select a shipping method for each vendor you’ve shopped from to ensure timely and
                                efficient delivery of your items.
                              </h2>
                              <>
                                {shippingMethodLoading ? (
                                  <SkeletonLoaderForList length={4} />
                                ) : (
                                  <>
                                    {shippingMethod?.data?.map(store => (
                                      <div key={store.store_id} className="">
                                        <div
                                          onClick={() => toggleStoreShipping(store?.store_id.toString())}
                                          className={`hover: mb-4 flex cursor-pointer items-center justify-between rounded-[8px] p-2 hover:bg-gray-200 ${
                                            !showStoreShipping.includes(store?.store_id.toString()) ? 'bg-gray-200' : ''
                                          }`}
                                        >
                                          <h4 className="text-[15px] font-semibold text-[#6B7280]">
                                            {store.store_name}
                                          </h4>
                                          <Icon
                                            icon={
                                              !showStoreShipping.includes(store?.store_id.toString())
                                                ? 'ph:caret-up'
                                                : 'ph:caret-down'
                                            }
                                            className="inline h-[16px] w-[16px] text-[#6B7280]"
                                          />
                                        </div>

                                        {showStoreShipping.includes(store?.store_id.toString()) && (
                                          <div className="">
                                            <Radio.Group
                                              value={
                                                selectedShippingMethods.find(sm => sm.store_id === store.store_id)
                                                  ?.shipping_method_id
                                              }
                                              onChange={e =>
                                                handleShippingMethodSelect(store.store_id, Number(e.target.value))
                                              }
                                              className="grid w-full gap-4 md:grid-cols-2"
                                            >
                                              {store.storeMethodTypes.map(methodType => (
                                                <div key={methodType} className="w-full">
                                                  <h4 className="mb-2 text-sm capitalize text-gray-600">
                                                    {methodType}
                                                  </h4>
                                                  <div className="flex flex-col gap-y-3">
                                                    {(store as any)?.storeMethods[methodType]?.map((method: any) => {
                                                      return (
                                                        <div
                                                          key={method.id}
                                                          onClick={() => {
                                                            handleShippingMethodSelect(store.store_id, method.id)
                                                            handleShippingMethodAmountSelect(
                                                              (store as any)?.store_slug,
                                                              method?.amount,
                                                              method?.method_type
                                                            )
                                                          }}
                                                          className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] border border-gray-200 p-2 hover:border-gray-400"
                                                        >
                                                          <Radio value={method.id} className="w-fit" />
                                                          <div className="flex w-full items-center justify-between gap-4">
                                                            <div className="flex w-full items-center justify-between gap-2">
                                                              <div className="">
                                                                <h3 className="text-[13px] font-[500] text-black">
                                                                  {capitalizeOnlyFirstLetter(method.location)}
                                                                </h3>
                                                                {method.pick_up_time && (
                                                                  <p className="text-sm text-gray-500">
                                                                    Pickup time: {method.pick_up_time}
                                                                  </p>
                                                                )}
                                                              </div>
                                                              {method.pick_up_time && (
                                                                <p className="text-[16px] font-semibold text-black">
                                                                  Free
                                                                </p>
                                                              )}
                                                            </div>
                                                            {method.amount && (
                                                              <p className="text-[16px] font-semibold text-black">
                                                                <FormatNumberCurrency value={method.amount} />
                                                              </p>
                                                            )}
                                                          </div>
                                                        </div>
                                                      )
                                                    })}
                                                  </div>
                                                </div>
                                              ))}
                                            </Radio.Group>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </>
                                )}
                              </>
                            </div>
                          </form>
                        </div>
                        <YourOrderComponent
                          isShowShipping={true}
                          getStoreAmount={getStoreAmount}
                          isLoading={createPaymentLoading}
                          showLogistics={showLogistics}
                          setShowLogistics={setShowLogistics}
                          selectedAddress={selectedAddress}
                          btnText={'Pay Now'}
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
    </>
  )
}

ShippingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default ShippingPage
