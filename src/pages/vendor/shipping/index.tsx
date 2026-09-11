import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import VendorLayout from '@/components/Vendor/VendorLayout'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Select, Button, Form, Input, Tooltip} from 'antd'
import {useEffect, useState} from 'react'
import SelectedOptions from '@/components/Vendor/components/SelectedOptions'
import {Icon} from '@iconify/react'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {
  useGetShippingConfigurationsQuery,
  useRemoveShippingLocationMutation,
  useRemoveShippingMethodMutation,
  useSaveShippingConfigurationMutation
} from '@/services/vendor/configure-shipping'
import Spinner from '@/components/SharedUI/Spinner'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {formatWithCommas, getCurrencySign} from '@/utils/fx'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import DeleteCard from '@/components/Vendor/components/DeleteCard'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import Link from 'next/link'

const shippingMethods = [
  {id: 1, name: 'store pick-up'},
  {id: 2, name: 'vendor-fulfilled shipping'}
  // {id: 3, name: 'MEK Rider'}
]

const Shipping = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showDeleteMethodModal, setShowDeleteMethodModal] = useState(false)
  const [showDeleteLocationModal, setShowDeleteLocationModal] = useState(false)
  const [currentMethod, setCurrentMethod] = useState('')
  const [currentLocation, setCurrentLocation] = useState<{id: number | string; name: string}>({id: '', name: ''})

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  // const isAuthenticated = useAppSelector(state => state.auth.token) // get authenticated token
  // const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  // const {type} = useSelector((state: any) => state.vendor)

  const [loadingIcons, setLoadingIcons] = useState<{[key: string]: boolean}>({})

  const [selectedShippingMethod, setSelectedShippingMethod] = useState<{name: string; id: number}[]>([])
  const [locations, setLocations] = useState<{value: string; id: number | string; amount: string}[]>([
    {id: 1, value: '', amount: ''}
  ])
  const [savedShippingMethod, setSavedShippingMethod] = useState<{name: string; id: number}[]>([])
  const [pickupTime, setPickupTime] = useState<string | null>(null)
  const [pickupStoreLocation, setPickupStoreLocation] = useState<string | null>(null)
  const [pickupId, setPickupId] = useState<number | null>(null)
  const [hasStoreMethods, setHasStoreMethods] = useState<boolean>(false)

  const {data, isLoading} = useGetShippingConfigurationsQuery({userStore: isActiveUser.slug})
  const [saveShippingConfiguration] = useSaveShippingConfigurationMutation()
  const [removeShippingMethod, {isLoading: removingMethod}] = useRemoveShippingMethodMutation()
  const [removeShippingLocation, {isLoading: removingLocation}] = useRemoveShippingLocationMutation()

  const resetFields = () => {
    setLocations([{id: 'my1', value: '', amount: ''}])
    setPickupTime('')
    setPickupStoreLocation('')
    setPickupId(null)
  }

  useEffect(() => {
    resetFields()
    if (data?.data.storeMethodTypes && data?.data.storeMethods) {
      const hasStoreMethods = Object.keys(data.data.storeMethods).length > 0
      const storeMethodTypes = data.data.storeMethodTypes.map((method: string, idx: number) => ({
        name: method,
        id: idx + 1
      }))

      // Update selected shipping methods
      setSavedShippingMethod(storeMethodTypes || [])
      setSelectedShippingMethod(storeMethodTypes || [])
      setHasStoreMethods(hasStoreMethods)

      // If storeMethods are present
      if (hasStoreMethods) {
        const storeMethods = Object.keys(data.data.storeMethods)

        storeMethods.forEach(method => {
          if (method === 'store pick-up') {
            const storePickup = data.data.storeMethods['store pick-up'][0]
            setPickupTime(storePickup?.pick_up_time || '')
            setPickupStoreLocation(storePickup?.location || '')
            setPickupId(storePickup?.id || null)
          }
          if (method === 'vendor-fulfilled shipping') {
            const vendorLocations = data.data.storeMethods['vendor-fulfilled shipping']
            if (vendorLocations && vendorLocations.length > 0) {
              setLocations(
                vendorLocations.map((loc: any, idx: any) => ({
                  id: loc.id ? loc.id : `my${idx}`,
                  value: loc.location || '',
                  amount: loc.amount || ''
                }))
              )
            }
          }
        })
      } else {
        // Reset to initial states if no shipping methods are configured
        resetFields()
      }
    }
  }, [data])

  const addLocation = () => {
    setLocations([...locations, {id: `my${locations.length + 1}`, value: '', amount: ''}])
  }

  const handleAmountChange = (id: string | number, formattedValue: string) => {
    const updatedLocations = locations.map(location =>
      location.id === id ? {...location, amount: formattedValue} : location
    )
    setLocations(updatedLocations)
  }

  const handleShippingChange = (method: {name: string; id: number}) => {
    setSelectedShippingMethod(prev => (prev.some(item => item.name === method.name) ? prev : [...prev, method]))
  }

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        pick_up_time: pickupTime,
        pick_up_location: pickupStoreLocation
      },
      validationSchema: Yup.object().shape({
        pick_up_time: Yup.string().required('Pick up time is required'),
        pick_up_location: Yup.string().required('Pick Up Store location is required')
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async (methodType, loc) => {
        handleSave(methodType, loc)
      }
    }
  )

  const handleSave = async (methodType: string, loc: any) => {
    const uniqueKey = methodType === 'store pick-up' ? 'pickup' : loc.id

    // Show spinner for the specific icon
    setLoadingIcons(prev => ({...prev, [uniqueKey]: true}))

    const fulfilledPayload = {
      id: typeof loc?.id === 'number' ? loc.id : null,
      store_id: isActiveUser.id,
      method_type: methodType,
      fulfilled_amount: loc?.amount.replace(/,/g, ''),
      fulfilled_location: loc?.value
    }

    const pickUpPayload = {
      ...values,
      id: pickupId,
      store_id: isActiveUser.id,
      method_type: 'store pick-up'
    }

    const payload = methodType === 'store pick-up' ? pickUpPayload : fulfilledPayload

    console.log('payload', payload)

    try {
      await saveShippingConfiguration({body: payload}).unwrap()

      // Reset spinner state
      setLoadingIcons(prev => ({...prev, [uniqueKey]: false}))

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  {methodType === 'store pick-up' ? 'Pick Up' : 'Vendor fulfilled shipping'} Location saved successfully
                </>
              }
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (err) {
      setLoadingIcons(prev => ({...prev, [uniqueKey]: false}))

      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>{(err as any)?.data?.message}</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  const handleRemoveShippingMethod = async (methodType: string) => {
    const payload = {
      store_id: isActiveUser.id,
      method_type: methodType
    }
    try {
      await removeShippingMethod({
        body: payload
      }).unwrap()

      setShowDeleteMethodModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Shipping method deleted successfully</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Delete shipping method!</>}
              image={errorToastIcon}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const handleRemoveShippingLocation = async (locationId: number | string) => {
    try {
      await removeShippingLocation({
        locationId
      }).unwrap()
      setShowDeleteLocationModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Location deleted successfully</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to Delete location!</>}
              image={errorToastIcon}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  if (isLoading) {
    return <SkeletonLoaderForPage />
  }

  return (
    <>
      <SEOHead
        title={`myEKI | Vendor Shipping `}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. "
      />
      <VendorLayout>
        <div className="max-w-8xl mx-auto w-full md:px-10">
          <h1 className="mb-6 text-[24px] font-semibold">Shipping</h1>
          <div className="mx-auto w-full rounded-[12px] bg-white md:p-4">
            <Form className="flex w-full flex-col gap-6" onFinish={handleSubmit} layout="vertical">
              {/* Shipping Method Selection */}
              <div className="mb-4 border border-[#EAECEF] bg-[#FCFCFC] px-4 py-2">
                <p className="mb-2">Shipping method</p>
                <Select
                  id="select-category shipping"
                  title="Shipping Method"
                  size="large"
                  placeholder="Select Shipping Method"
                  style={{width: '100%', borderRadius: '8px', padding: 0}}
                  notFoundContent={<span className="my-0 py-0 text-xs text-white">No data found</span>}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div className="h-auto" id="shipping">
                        {shippingMethods.map(option => (
                          <div
                            key={option.id}
                            className="flex cursor-pointer flex-row items-center justify-between gap-[10px] p-2"
                            onClick={e => {
                              e.preventDefault()
                              e.stopPropagation()

                              // if it not there add it
                              if (!selectedShippingMethod.find(method => method.name === option.name)) {
                                handleShippingChange(option)
                              }

                              // // Toggle selection for the shipping method
                              // if (selectedShippingMethod.find(method => method.name === option.name)) {
                              //   // If already selected, remove it
                              //   setSelectedShippingMethod(
                              //     selectedShippingMethod.filter(method => method.name !== option.name)
                              //   )
                              // } else {
                              //   // If not selected, add it
                              //   handleShippingChange(option)
                              // }
                            }}
                          >
                            <div className="flex gap-4">
                              <p className="text-[14px] capitalize leading-[17px]">{option.name}</p>
                              {selectedShippingMethod.find(method => method.name === option.name) && (
                                <Icon icon="akar-icons:check" className="text-[16px] text-[#0077B5]" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                />

                {savedShippingMethod.length > 0 && (
                  <div className="mt-2 flex flex-row flex-wrap">
                    {savedShippingMethod.map((method, idx) => (
                      <SelectedOptions
                        key={method.id}
                        text={method.name}
                        width="w-fit"
                        method={method}
                        height="h-[38px]"
                        className="rounded-[7px]"
                        onRemove={() => {
                          setCurrentMethod(method.name)
                          setShowDeleteMethodModal(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Store Pick-up Section */}
              {selectedShippingMethod.find(method => method.name === 'store pick-up') && (
                <div className="mb-4 border border-[#EAECEF] bg-[#FCFCFC] px-4 py-4">
                  <h3 className="text-[20px] font-semibold">Configuration for Store Pick-up (SPU)</h3>
                  <p className="text-sm font-normal text-[#6B7280]">Indicate an ETA and your business address</p>
                  <div className="mt-5 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <TextInput
                      placeholder={`e.g. 48 hours, 3 days`}
                      onChange={e => {
                        if (e.target.value.length <= 75) {
                          handleChange(e)
                        }
                      }}
                      name={'pick_up_time'}
                      type={'text'}
                      value={values.pick_up_time}
                      errorMessage={errors && errors.pick_up_time ? errors.pick_up_time : ''}
                      title={'How soon after payment can customers expect their order to be ready for store pickup?*'}
                      labelClassName="text-xm font-semibold text-black normal-case "
                      className="flex-1"
                    />
                    <TextInput
                      onChange={e => {
                        if (e.target.value.length <= 75) {
                          handleChange(e)
                        }
                      }}
                      name={'pick_up_location'}
                      type={'text'}
                      value={values.pick_up_location}
                      errorMessage={touched.pick_up_location && errors.pick_up_location ? errors.pick_up_location : ''}
                      title={'Please provide your store location*'}
                      labelClassName="text-xm font-semibold text-black normal-case"
                      className="flex-1"
                      placeholder=""
                    />

                    <Tooltip
                      placement="bottom"
                      title={'Save'}
                      color="#fff"
                      overlayInnerStyle={{color: '#000', textAlign: 'center', width: '50px', fontSize: '12px'}}
                    >
                      <div
                        onClick={() => handleSave('store pick-up', null)}
                        className="ml-auto flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md bg-[#C0FDB8] md:mt-6 md:w-[70px]"
                      >
                        {loadingIcons['pickup'] ? (
                          <Spinner className="border-[#049629]" />
                        ) : (
                          <Icon icon="ic:outline-save" className="text-[16px] text-[#049629]" />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}

              {/* Vendor-Fulfilled Shipping Section */}
              {selectedShippingMethod.find(method => method.name === 'vendor-fulfilled shipping') && (
                <div className="mb-8 border border-[#EAECEF] bg-[#FCFCFC] px-4 py-4">
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-[20px] font-semibold">Configuration for Vendor-fulfilled Shipping (VFS)</h3>
                      <p className="text-sm font-normal text-[#6B7280]">
                        Complete and create shipping cost for all your destinations
                      </p>
                    </div>
                    <Button onClick={addLocation} className="h-[42px] !w-[180] cursor-pointer bg-[#34C759] text-white">
                      Add another location
                    </Button>
                  </div>

                  {locations.map((loc, index) => (
                    <div key={loc.id} className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
                      <div className="flex-1">
                        <p className="text-xm font-semibold text-black">Location*</p>
                        <Input
                          placeholder="Type location"
                          onChange={e => {
                            const newLocations = [...locations]
                            newLocations[index].value = e.target.value
                            setLocations(newLocations)
                          }}
                          name={'shipping_location'}
                          type={'text'}
                          value={loc.value}
                          classNames={{
                            input: `w-full rounded-[8px] border ${errors && errors.amount ? 'border-red-600' : 'border-gray-300'} bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-xm font-semibold text-black">Amount*</p>
                        <Input
                          addonBefore={getCurrencySign(isActiveUser.currency)}
                          title="Amount*"
                          placeholder="Amount*"
                          name="amount"
                          type="text"
                          value={loc.amount}
                          onChange={e => handleAmountChange(loc.id, formatWithCommas(e.target.value))}
                          // onChange={e => {
                          //   const newLocations = [...locations]
                          //   newLocations[index].amount = e.target.value
                          //   setLocations(newLocations)
                          // }}
                          classNames={{
                            input: `w-full rounded-[8px] border ${errors && errors.amount ? 'border-red-600' : 'border-gray-300'} bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`
                          }}
                        />
                      </div>

                      <div className="flex min-w-[100px] items-center justify-end gap-3 md:justify-start">
                        <Tooltip
                          placement="bottom"
                          title={'Save'}
                          color="#fff"
                          overlayInnerStyle={{color: '#000', textAlign: 'center', width: '50px', fontSize: '12px'}}
                        >
                          <div
                            onClick={() => handleSave('vendor-fulfilled shipping', loc)}
                            className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md bg-[#C0FDB8] md:mt-6"
                          >
                            {loadingIcons[loc.id] ? (
                              <Spinner className="border-[#049629]" />
                            ) : (
                              <Icon icon="ic:outline-save" className="text-[16px] text-[#049629]" />
                            )}
                          </div>
                        </Tooltip>

                        {locations.length > 1 &&
                          typeof loc.id == 'number' &&
                          locations.filter(item => typeof item.id === 'number').length > 1 && (
                            <Tooltip
                              placement="bottom"
                              title={'Delete'}
                              color="#fff"
                              overlayInnerStyle={{color: '#000', textAlign: 'center', width: '60px', fontSize: '12px'}}
                            >
                              <div className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md bg-[#FFEEEE] md:mt-6">
                                <Icon
                                  icon="mdi:delete"
                                  onClick={() => {
                                    setCurrentLocation({id: loc.id, name: loc.value})
                                    setShowDeleteLocationModal(true)
                                  }}
                                  className="text-[16px] text-red-600"
                                />
                              </div>
                            </Tooltip>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Form>
          </div>

          {hasStoreMethods && (
            <div className="flex">
              <Link
                href={'/vendor/products/add-product'}
                className="ml-auto mt-5 h-[42px] !w-[180] cursor-pointer bg-black px-3 py-2 text-white hover:text-white"
              >
                Continue to Add Product
              </Link>
            </div>
          )}
        </div>

        {/* Delete Shipping Method Modal */}
        {isDesktop && showDeleteMethodModal && (
          <PlannerModal
            modalOpen={showDeleteMethodModal}
            setModalOpen={setShowDeleteMethodModal}
            maskCloseable={true}
            onCloseModal={() => {
              setShowDeleteMethodModal(false)
            }}
            width={400}
          >
            <DeleteCard
              onCancel={() => setShowDeleteMethodModal(false)}
              onConfirm={() => handleRemoveShippingMethod(currentMethod)}
              isLoading={removingMethod}
              message={`Are you sure you want to remove this shipping method - ${currentMethod}?`}
            />
          </PlannerModal>
        )}

        {!isDesktop && showDeleteMethodModal && (
          <DrawerContainer open={showDeleteMethodModal} onClose={() => setShowDeleteMethodModal(false)} height={300}>
            <DeleteCard
              onCancel={() => setShowDeleteMethodModal(false)}
              onConfirm={() => handleRemoveShippingMethod(currentMethod)}
              isLoading={removingMethod}
              message={`Are you sure you want to remove this shipping method - ${currentMethod}?`}
            />
          </DrawerContainer>
        )}

        {/* Delete Location Modal */}
        {isDesktop && showDeleteLocationModal && (
          <PlannerModal
            modalOpen={showDeleteLocationModal}
            setModalOpen={setShowDeleteLocationModal}
            maskCloseable={true}
            onCloseModal={() => {
              setShowDeleteLocationModal(false)
            }}
            width={400}
          >
            <DeleteCard
              onCancel={() => setShowDeleteLocationModal(false)}
              onConfirm={() => handleRemoveShippingLocation(currentLocation.id)}
              isLoading={removingLocation}
              message={`Are you sure you want to delete ${currentLocation.name}?`}
            />
          </PlannerModal>
        )}

        {!isDesktop && showDeleteLocationModal && (
          <DrawerContainer
            open={showDeleteLocationModal}
            onClose={() => setShowDeleteLocationModal(false)}
            height={300}
          >
            <DeleteCard
              onCancel={() => setShowDeleteLocationModal(false)}
              onConfirm={() => handleRemoveShippingLocation(currentLocation.id)}
              isLoading={removingLocation}
              message={`Are you sure you want to delete ${currentLocation.name}?`}
            />
          </DrawerContainer>
        )}
      </VendorLayout>
    </>
  )
}

Shipping.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default Shipping
