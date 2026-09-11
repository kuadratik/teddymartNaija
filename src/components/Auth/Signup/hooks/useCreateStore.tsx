import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {ISelectedPaymentCountry} from '@/components/Store/components/NewStore'
import {setActiveStore} from '@/redux/apiSlice/authSlice'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useCreateStoreMutation} from '@/services/vendor/vendor'
import {useRouter} from 'next/router'
import {useDispatch} from 'react-redux'
import {useLocalStorage} from 'react-use'
import {OnboardingType} from '../utils'

const useCreateStoreQuery = ({
  setFieldError,
  setCurrentForm,
  values,
  redirectToDashboard = true,
  onStoreCreated,
  onPaymentRedirect
}: {
  setFieldError: any
  setCurrentForm: any
  values: any
  redirectToDashboard?: boolean
  onStoreCreated?: (storeId: number) => void
  onPaymentRedirect?: () => void
}) => {
  const [createStore, {isLoading}] = useCreateStoreMutation()
  const router = useRouter()
  const [selectedPaymentCountry, setSelectedPaymentCountry] = useLocalStorage<ISelectedPaymentCountry | null>(
    'selectedCountryOnboardingPayment',
    null
  )

  const dispatch = useDispatch()

  const getSuccessMessage = (step: number) => {
    const messages: Record<number, string> = {
      1: 'Basic Information Saved Successfully',
      2: 'Store Details Created Successfully',
      3: 'Store Created Successfully'
      // Add more steps as needed
    }
    return messages[step] || 'Store Created Successfully'
  }

  const handleCreateStore = async ({payload, step}: {payload: OnboardingType; step: number}) => {
    try {
      // Transform payload to match API expectations
      const apiPayload = {
        ...payload,
        categories: payload.category, // Map category array to categories
        country_id: payload.country // Map country to country_id
      }
      console.log('🚀 ~ handleCreateStore ~ apiPayload:', apiPayload?.id)

      await createStore({body: apiPayload as any, step})
        .unwrap()
        .then((res: any) => {
          const createdStore = res?.data?.store

          // Enhanced payment URL extraction with better logging
          let paymentUrl = null

          if (step === 3) {
            // Try multiple paths for payment URL
            if (selectedPaymentCountry?.currency_code === 'NGN') {
              // Paystack URLs
              paymentUrl =
                res?.data?.payment_info?.url ||
                res?.data?.payment?.url ||
                res?.data?.payment_info?.authorization_url ||
                res?.data?.payment?.authorization_url
            } else {
              // Stripe URLs
              paymentUrl =
                res?.data?.payment_info?.authorization_url ||
                res?.data?.payment_info?.url ||
                res?.data?.payment?.authorization_url ||
                res?.data?.payment?.url
            }

            console.log('🚀 Payment URL extraction:', {
              step,
              currency: selectedPaymentCountry?.currency_code,
              paymentUrl,
              payment_info: res?.data?.payment_info,
              payment: res?.data?.payment
            })
          }

          dispatch(setActiveStore({activeUser: createdStore}))

          // Call the callback with the store ID
          if (createdStore?.id && onStoreCreated) {
            onStoreCreated(createdStore.id)
          }

          if (values.type === 'product') {
            dispatch(setType({type: 'product'}))
          } else if (values.type === 'service') {
            dispatch(setType({type: 'service'}))
          }

          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{getSuccessMessage(step)}</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          // Step 3: Redirect to payment URL
          if (step === 3 && paymentUrl) {
            // Notify parent component that payment redirect is happening
            if (onPaymentRedirect) {
              onPaymentRedirect()
            }
            console.log('🚀 Redirecting to payment URL:', paymentUrl)
            setTimeout(() => {
              window.location.href = paymentUrl
            }, 1000)
          } else if (step === 3 && !paymentUrl) {
            // Payment URL missing - show error and stay on step 3
            console.error('❌ Payment URL not found in API response')
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title="Payment URL not available. Please try again."
                    textColor="#FFF"
                    message={''}
                    backgroundColor="#DC2626"
                  />
                )
              },
              message: 'error'
            })
            // Don't advance the form if payment URL is missing
            return
          } else if (redirectToDashboard) {
            setTimeout(() => {
              router.push('/vendor/dashboard')
            }, 1000)
          } else {
            // Proceed to next step
            setTimeout(() => {
              setCurrentForm((prev: number) => prev + 1)
            }, 1000)
          }
        })
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast altText={''} title={err?.data?.message} textColor="#FFF" message={''} backgroundColor="#000" />
          )
        },
        message: 'message'
      })

      if (err?.data?.errors?.address2 && err?.data?.errors?.address2[0].includes('The address2 field is required.')) {
        setFieldError('address2', 'Required')
        setCurrentForm(1)
      }
      if (err?.data?.errors?.address1 && err?.data?.errors?.address1[0].includes('The address1 field is required.')) {
        setFieldError('address1', 'Required')
        setCurrentForm(1)
      }
      if (
        err?.data?.errors?.postal_code &&
        err?.data?.errors?.postal_code[0].includes('The postal code field is required.')
      ) {
        setFieldError('postal_code', 'Required')
        setCurrentForm(1)
      }
      if (err?.data?.errors?.name && err?.data?.errors?.name[0].includes('taken')) {
        setFieldError('name', 'Store name is taken')
        setCurrentForm(1)
      }
    }
  }
  return {isLoading, handleCreateStore}
}

export default useCreateStoreQuery
