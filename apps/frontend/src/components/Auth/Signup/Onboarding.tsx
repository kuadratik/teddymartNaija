import CustomButton from '@/components/SharedUI/Buttons/Button'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import Spinner from '@/components/SharedUI/Spinner'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Form} from 'antd'
import {useFormik} from 'formik'
import {AnimatePresence, motion} from 'framer-motion'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import StoreActivation from './components/StoreActivation'
import StoreInformation from './components/StoreInformation'
import UploadInformation from './components/UploadInformation'
import VendorTypeComponent from './components/VendorType'
import {STORE_ACTIVATION_CANCEL_URL, STORE_ACTIVATION_REDIRECT_URL, resolveVendorType} from './constants'
import useCreateStoreQuery from './hooks/useCreateStore'
import useHandleUploadQuery from './hooks/useHandleUpload'
import {OnboardingType} from './utils'
import {OnboardingSchema} from './utils/schema'

const initialValues = {
  offers_service: false,
  offers_product: false,
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

const Onboarding = () => {
  const router = useRouter()
  const {store_id} = router.query // Get store_id from URL params
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const userStores = isAuthenticatedUser?.store || []

  const isAuthenticated = isAuthenticatedToken
  useEffect(() => {
    if (!isAuthenticated) {
      // Save the current  URL as a query parameter
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null // Prevent rendering until authentication is verified

  const [currentForm, setCurrentForm] = React.useState(1)
  const [createdStoreId, setCreatedStoreId] = React.useState<number | undefined>(
    store_id ? Number(store_id) : undefined
  )

  // Update createdStoreId and currentForm when store_id param changes
  useEffect(() => {
    if (store_id) {
      const storeIdNum = Number(store_id)
      setCreatedStoreId(storeIdNum)

      // Find the store and set the current form based on its step
      const existingStore = userStores.find((s: any) => s.id === storeIdNum)
      if (existingStore?.step) {
        // Set to the next incomplete step (current step + 1)
        // If step is 1, go to step 2 to upload images
        // If step is 2, go to step 3 for activation
        const nextStep = existingStore.step < 3 ? existingStore.step : existingStore.step
        setCurrentForm(nextStep)
      }
    }
  }, [store_id, userStores])

  // Prefill form based on existing store data if going back to a completed step
  const getInitialValuesFromStore = () => {
    if (createdStoreId && userStores.length > 0) {
      const existingStore = userStores.find((s: any) => s.id === createdStoreId)
      if (existingStore) {
        return {
          offers_service: existingStore.type === 'service',
          offers_product: existingStore.type === 'product',
          type: existingStore.type,
          name: existingStore.name || '',
          category: existingStore.categories?.map((c: any) => c.id) || [],
          description: existingStore.description || '',
          contact_number: existingStore.contact_number || '',
          whatsapp_number: existingStore.whatsapp_number || '',
          address1: existingStore.address1 || '',
          address2: existingStore.address2 || '',
          state: existingStore.state || undefined,
          city: existingStore.city || '',
          postal_code: existingStore.postal_code || '',
          country: existingStore.country_id || undefined,
          profile_picture_path: existingStore.profile_picture_path || undefined,
          banner_path: existingStore.banner_path || undefined,
          id: existingStore.id,
          return_url: undefined,
          cancel_url: undefined
        }
      }
    }

    return initialValues
  }

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, [currentForm])

  const {isLoading, handleUploadQuery} = useHandleUploadQuery()

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<OnboardingType>({
      initialValues: getInitialValuesFromStore(),
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
          handleCreateStore({
            payload: {
              ...payloadWithId,
              type: vendorType,
              return_url: STORE_ACTIVATION_REDIRECT_URL,
              cancel_url: STORE_ACTIVATION_CANCEL_URL
            },
            step: 3
          })
        } else {
          // Move to next step (step 0 - vendor type)
          setCurrentForm(prev => prev + 1)
        }
      }
    })

  const derivedVendorType = resolveVendorType(values)

  const {isLoading: createStoreIsLoading, handleCreateStore} = useCreateStoreQuery({
    setFieldError: setFieldError,
    setCurrentForm: setCurrentForm,
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
          touched={touched}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
      )
    }
  ]

  const navigateToPreviousForm = React.useCallback(() => {
    setCurrentForm(prev => prev - 1)
  }, [])

  return (
    <React.Fragment>
      {' '}
      {isAuthenticated ? (
        <div className="my-6 flex flex-col">
          <Form size="large" onFinish={() => handleSubmit()} layout="vertical" id="onboardingForm">
            <div>
              <div className="flex items-center justify-center">
                <LogoHeader onClick={() => (currentForm === 0 ? router.back() : navigateToPreviousForm())} />
              </div>{' '}
              <AnimatePresence>
                {steps.map((step, index) => {
                  return (
                    <FormContainer isActive={currentForm === index} id={step?.title}>
                      {step?.content}
                    </FormContainer>
                  )
                })}
              </AnimatePresence>
            </div>

            {currentForm !== 3 && (
              <div className="flex w-full gap-4">
                {currentForm > 0 && (
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
        </div>
      ) : null}
    </React.Fragment>
  )
}

/**Renders the children when isActive is true */
export const FormContainer: React.FC<React.PropsWithChildren<{isActive: boolean; id: string | undefined}>> = ({
  isActive,
  id,
  children
}) => {
  return (
    <>
      {isActive ? (
        <motion.div
          key={id}
          className="mx-auto"
          layoutId={id}
          layout="position"
          initial={{opacity: 0, x: -100}}
          animate={{opacity: 1, x: 0}}
          exit={{opacity: 0, x: 200}}
          transition={{duration: 0.25}}
        >
          {children}
        </motion.div>
      ) : null}
    </>
  )
}

export default Onboarding
