import {OnboardingType} from './utils'

const resolveAppBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '')
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  return ''
}

const APP_BASE_URL = resolveAppBaseUrl()

export const STORE_ACTIVATION_REDIRECT_URL = `${APP_BASE_URL}/mek/onboarding/payment-status`
export const STORE_ACTIVATION_CANCEL_URL = `${APP_BASE_URL}/mek/onboarding/cancel-payment`

export const resolveVendorType = (
  formValues: Pick<OnboardingType, 'type' | 'offers_product' | 'offers_service'>
): string | undefined => {
  if (formValues.type) return formValues.type
  if (formValues.offers_product) return 'product'
  if (formValues.offers_service) return 'service'
  return undefined
}
