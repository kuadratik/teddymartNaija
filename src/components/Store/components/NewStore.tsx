import {FormContainer} from '@/components/Auth/Signup/Onboarding'
import StoreActivation from '@/components/Auth/Signup/components/StoreActivation'
import StoreInformation from '@/components/Auth/Signup/components/StoreInformation'
import UploadInformation from '@/components/Auth/Signup/components/UploadInformation'
import VendorTypeComponent from '@/components/Auth/Signup/components/VendorType'
import {resolveVendorType} from '@/components/Auth/Signup/constants'
import useCreateStoreQuery from '@/components/Auth/Signup/hooks/useCreateStore'
import useHandleUploadQuery from '@/components/Auth/Signup/hooks/useHandleUpload'
import {OnboardingType} from '@/components/Auth/Signup/utils'
import {OnboardingSchema} from '@/components/Auth/Signup/utils/schema'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import Spinner from '@/components/SharedUI/Spinner'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetUserStoreQuery} from '@/services/store'
import {Form} from 'antd'
import {useFormik} from 'formik'
import {AnimatePresence} from 'framer-motion'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useLocalStorage} from 'react-use'
import SkeletonStoreInformation from './SkeletonOnboarding'

export interface ISelectedPaymentCountry {
  id: number
  name: string
  emoji: string
  code: string
  currency_code: string
  phonecode: string
  flag?: string
}
const NewStoreComponent = () => {
  const router = useRouter()
  const {store_id} = router.query // Get store_id from URL params
  const {type} = useSelector((state: any) => state.vendor)
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [selectedPaymentCountry, setSelectedPaymentCountry] = useLocalStorage<ISelectedPaymentCountry | null>(
    'selectedCountryOnboardingPayment',
    null
  )
  const {data: userStoreData, isLoading: userStoreLoading} = useGetUserStoreQuery({})
  console.log('🚀 ~ NewStoreComponent ~ userStoreData:', userStoreData)

  const isAuthenticatedUser = useSelector((state: any) => state.auth.user)
  const userStores = userStoreData?.data || []
  const [createdStoreId, setCreatedStoreId] = React.useState<number | undefined>(
    store_id ? Number(store_id) : undefined
  )
  // find the store with id store_id
  const existingStoreByStoreId = userStores.find((s: any) => s.id === createdStoreId)

  // Persist current form step in localStorage to prevent loss during Stripe redirect
  const [currentFormFromStorage, setCurrentFormInStorage] = useLocalStorage<number>(
    `store-onboarding-step-${store_id || 'new'}`,
    1
  )
  const [currentForm, setCurrentForm] = React.useState(currentFormFromStorage || 1)

  const buildDefaultValues = React.useCallback((): OnboardingType => {
    return {
      offers_service: type === 'service',
      offers_product: type === 'product',
      type: type,
      name: '',
      category: [],
      description: '',
      contact_number: '',
      whatsapp_number: '',
      address1: '',
      address2: '',
      state: undefined,
      city: '',
      postal_code: '',
      country: undefined,
      profile_picture_path: undefined,
      banner_path: undefined,
      id: undefined,
      return_url: undefined,
      cancel_url: undefined
    }
  }, [type])

  const mapStoreToInitialValues = React.useCallback((store: any): OnboardingType => {
    return {
      offers_service: store.type === 'service',
      offers_product: store.type === 'product',
      type: store.type,
      name: store.name || '',
      category: store.categories?.map((c: any) => c.id) || [],
      description: store.description || '',
      contact_number: store.contact_number || '',
      whatsapp_number: store.whatsapp_number || '',
      address1: store.address1 || '',
      address2: store.address2 || '',
      state: store.state || undefined,
      city: store.city || '',
      postal_code: store.postal_code || '',
      country: store.country_id || undefined,
      profile_picture_path: store.profile_picture_path || undefined,
      banner_path: store.banner_path || undefined,
      id: store.id,
      return_url: undefined,
      cancel_url: undefined
    }
  }, [])

  const [initialFormValues, setInitialFormValues] = React.useState<OnboardingType>(() => buildDefaultValues())
  const [prefilledStoreId, setPrefilledStoreId] = React.useState<number | null>(null)
  const [isRedirectingToPayment, setIsRedirectingToPayment] = React.useState(false)

  // Update createdStoreId and currentForm when store_id param changes
  useEffect(() => {
    if (store_id) {
      const storeIdNum = Number(store_id)

      if (createdStoreId !== storeIdNum) {
        setCreatedStoreId(storeIdNum)
      }

      // Find the store and adjust the current form based on its saved step when appropriate
      const existingStore = userStores.find((s: any) => s.id === storeIdNum)
      console.log('🚀 ~ NewStoreComponent ~ existingStore:', existingStore?.country)
      if (existingStore?.country) {
        setSelectedPaymentCountry({
          id: existingStore.country.id,
          name: existingStore.country.name,
          emoji: existingStore.country.emoji,
          code: existingStore.country.code,
          currency_code: existingStore.country.currency_code,
          phonecode: existingStore.country.phonecode
        })
      }
      if (existingStore?.step) {
        const nextStep = existingStore.step
        setCurrentForm(prev => {
          const boundedStep = Math.min(Math.max(nextStep, 0), 3)
          const shouldSyncDirectly = createdStoreId !== storeIdNum
          if (shouldSyncDirectly) {
            setCurrentFormInStorage(boundedStep)
            return boundedStep
          }
          const newStep = boundedStep > prev ? boundedStep : prev
          setCurrentFormInStorage(newStep)
          return newStep
        })
      }
    } else {
      setCreatedStoreId(undefined)
      setCurrentForm(1)
      setCurrentFormInStorage(1)
    }
  }, [store_id, userStores, createdStoreId, setCurrentFormInStorage])

  // Sync initial form values only when we have fresh data for a specific store
  useEffect(() => {
    if (!createdStoreId) {
      if (prefilledStoreId !== null) {
        setInitialFormValues(buildDefaultValues())
        setPrefilledStoreId(null)
      }
      return
    }

    if (prefilledStoreId === createdStoreId) {
      return
    }

    const existingStore = userStores.find((s: any) => s.id === createdStoreId)
    if (existingStore) {
      setInitialFormValues(mapStoreToInitialValues(existingStore))
      setPrefilledStoreId(createdStoreId)
    }
  }, [createdStoreId, userStores, buildDefaultValues, mapStoreToInitialValues, prefilledStoreId])

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, [currentForm])

  // Clean up localStorage when navigating away after successful payment
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only clean up if we're not on step 3 (payment step)
      if (currentForm !== 3 && router.pathname.includes('/payment-status')) {
        setCurrentFormInStorage(undefined)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [currentForm, router.pathname, setCurrentFormInStorage])

  // Reset redirecting state when user returns to the page (e.g., from canceled payment)
  useEffect(() => {
    if (isRedirectingToPayment && store_id && router.pathname.includes('/onboarding')) {
      // User is back on the onboarding page, reset the redirecting state
      setIsRedirectingToPayment(false)
    }
  }, [store_id, router.pathname, isRedirectingToPayment])

  // Safety timeout: Reset redirecting state if redirect doesn't happen within 10 seconds
  useEffect(() => {
    if (isRedirectingToPayment) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Payment redirect timeout - resetting state')
        setIsRedirectingToPayment(false)
        // Show error message
        showPlannerToast({
          options: {
            customToast: (
              <div className="rounded bg-red-600 p-4 text-white">
                <strong className="font-bold">Payment Redirect Failed</strong>
                <p>Please try again or contact support.</p>
              </div>
            )
          },
          message: 'error'
        })
      }, 10000) // 10 second timeout

      return () => clearTimeout(timeout)
    }
  }, [isRedirectingToPayment])

  const {isLoading, handleUploadQuery} = useHandleUploadQuery()
  const navigateToPreviousForm = React.useCallback(() => {
    setCurrentForm(prev => {
      const newStep = prev - 1
      setCurrentFormInStorage(newStep)
      return newStep
    })
  }, [setCurrentFormInStorage])
  const {errors, values, handleSubmit, setFieldValue, handleChange, touched, setFieldError} = useFormik<OnboardingType>(
    {
      initialValues: initialFormValues,
      validationSchema: OnboardingSchema[currentForm],
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        const vendorType = 'product'

        // Include store ID if it exists (for updates to existing store)
        const payloadWithId = createdStoreId ? {...val, id: createdStoreId} : val

        if (currentForm === 1) {
          // Step 1: Store Information - create store with basic info
          handleCreateStore({
            payload: {...payloadWithId, type: vendorType},
            step: 1
          })
        } else if (currentForm === 2) {
          // Step 2: Upload step - upload images and update store
          handleUploadQuery({
            payload: {...payloadWithId, type: vendorType},
            step: 2,
            successFunction: handleCreateStore
          })
        } else if (currentForm === 3) {
          // Step 3: Store activation - trigger payment
          // Persist step 3 before redirecting to ensure we stay on step 3 if user returns
          setCurrentFormInStorage(3)
          handleCreateStore({
            payload: {
              ...payloadWithId,
              type: vendorType,
              return_url: `${window.location.origin}/mek/onboarding/payment-status?store_id=${createdStoreId || ''}&store_slug=${
                existingStoreByStoreId?.slug || ''
              }&gateway=${selectedPaymentCountry?.currency_code === 'NGN' ? 'paystack' : 'stripe'}`,
              cancel_url: `${window.location.origin}/mek/onboarding/cancel-payment?store_id=${createdStoreId || ''}&store_slug=${existingStoreByStoreId?.slug || ''}&gateway=${
                selectedPaymentCountry?.currency_code === 'NGN' ? 'paystack' : 'stripe'
              }`
            },
            step: 3
          })
        } else {
          // Move to next step (step 0 - vendor type)
          setCurrentForm(prev => {
            const newStep = prev + 1
            setCurrentFormInStorage(newStep)
            return newStep
          })
        }
      }
    }
  )

  const derivedVendorType = resolveVendorType({...values, type: values.type ?? type})

  const {isLoading: createStoreIsLoading, handleCreateStore} = useCreateStoreQuery({
    setFieldError: setFieldError,
    setCurrentForm: (fn: any) => {
      setCurrentForm((prev: number) => {
        const newStep = typeof fn === 'function' ? fn(prev) : fn
        setCurrentFormInStorage(newStep)
        return newStep
      })
    },
    values: {...values, type: derivedVendorType},
    redirectToDashboard: false,
    onStoreCreated: (storeId: number) => {
      setCreatedStoreId(storeId)
      // Update the form values with the created store ID
      setFieldValue('id', storeId)
      // Update URL with store_id param
      router.push(
        {
          pathname: router.pathname,
          query: {...router.query, store_id: storeId}
        },
        undefined,
        {shallow: true}
      )
    },
    onPaymentRedirect: () => {
      // Set redirecting state when payment redirect is about to happen
      setIsRedirectingToPayment(true)
    }
  })

  // Preserve form values when store data changes (prevent category loss)
  useEffect(() => {
    if (createdStoreId && userStores.length > 0) {
      const existingStore = userStores.find((s: any) => s.id === createdStoreId)
      if (existingStore?.categories && existingStore.categories.length > 0) {
        const categoryIds = existingStore.categories.map((c: any) => c.id)
        // Only update if current categories are empty or undefined
        if (!values.category || values.category.length === 0) {
          setFieldValue('category', categoryIds)
        }
      }
    }
  }, [createdStoreId, userStores, values.category, setFieldValue])

  const steps = [
    {
      title: 'Service Type',
      content: (
        <VendorTypeComponent
          setFieldValue={setFieldValue}
          values={values}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
        />
      )
    },

    {
      title: 'Store Information',
      content: (
        <StoreInformation
          touched={touched}
          setSelectedPaymentCountry={setSelectedPaymentCountry}
          title_header={true}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    },
    {
      title: 'Upload Information',
      content: (
        <UploadInformation
          title_header={true}
          touched={touched}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    },
    {
      title: 'Store Activation',
      content: (
        <StoreActivation
          title_header={true}
          createStoreIsLoading={createStoreIsLoading}
          touched={touched}
          navigateToPreviousForm={navigateToPreviousForm}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    }
  ]

  return (
    <React.Fragment>
      {' '}
      <div className="flex flex-col">
        {userStoreLoading && store_id ? (
          <div className="mb-20 flex w-full">
            <SkeletonStoreInformation step={currentForm} />
          </div>
        ) : (
          <>
            {/* Show redirecting overlay on top of the form */}
            {isRedirectingToPayment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="rounded-lg bg-white p-8 shadow-xl">
                  <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-12 w-12" />
                    <p className="text-center text-lg font-medium text-gray-700">Redirecting to payment gateway...</p>
                    <p className="text-center text-sm text-gray-500">Please wait while we prepare your payment...</p>
                  </div>
                </div>
              </div>
            )}
            <Form size="large" onFinish={handleSubmit} layout="vertical" id="newForm">
              <div>
                {/* <div className="hidden items-center justify-center lg:flex">
              <TopBar title="New Store" />
            </div>{' '} */}
                <AnimatePresence>
                  <>
                    {steps.map((step, index) => {
                      return (
                        <FormContainer isActive={currentForm === index} id={step?.title} key={index}>
                          {step?.content}
                        </FormContainer>
                      )
                    })}
                  </>
                </AnimatePresence>
              </div>

              {currentForm !== 3 && (
                <div className="flex w-full gap-4">
                  {currentForm > 1 && (
                    <CustomButton
                      type={'button'}
                      onClick={navigateToPreviousForm}
                      className="w-full rounded-[10px] border border-black bg-white px-1 py-4 text-[14px] text-black hover:bg-gray-50"
                    >
                      Previous
                    </CustomButton>
                  )}
                  <CustomButton
                    disabled={!values.offers_service && !values.offers_product && currentForm === 0}
                    type={'submit'}
                    className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
                  >
                    {isLoading || createStoreIsLoading ? <Spinner /> : currentForm === 1 ? 'Next' : 'Continue'}
                  </CustomButton>
                </div>
              )}
            </Form>
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default NewStoreComponent
