import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import useVerifyPayment from '@/components/Customer/hooks/useVerifyPayment'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import SEOHead from '@/components/SharedUI/SEOHead'
import ActivatePayment from '@/components/Store/components/PaymentStatus/ActivatePayment'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useRouter} from 'next/router'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'

const extractGatewayToken = (value?: string | null) => {
  if (!value) {
    return {gatewayValue: value ?? '', embeddedToken: null}
  }

  const tokenDelimiters = ['?token=', '&token=']

  for (const delimiter of tokenDelimiters) {
    const delimiterIndex = value.indexOf(delimiter)
    if (delimiterIndex !== -1) {
      const gatewayValue = value.slice(0, delimiterIndex)
      const embeddedToken = value.slice(delimiterIndex + delimiter.length) || null
      return {gatewayValue, embeddedToken}
    }
  }

  return {gatewayValue: value, embeddedToken: null}
}

const OnboardingPaymentStatusPage = () => {
  const router = useRouter()
  const {store_id, reference, token, gateway} = router.query
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const {isLoading: isVerifyPaymentLoading, verifyPaymentHandler, isSuccess, error} = useVerifyPayment()
  const isAuthenticated = isAuthenticatedToken
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const hasAttemptedVerificationRef = useRef(false)
  const lastVerificationTokenRef = useRef<string | null>(null)
  const normalizedReference = Array.isArray(reference) ? reference[0] : reference
  const normalizedToken = Array.isArray(token) ? token[0] : token
  const rawGatewayValue = Array.isArray(gateway) ? gateway[0] : gateway
  const {gatewayValue: gatewayWithoutToken, embeddedToken} = useMemo(
    () => extractGatewayToken(rawGatewayValue),
    [rawGatewayValue]
  )
  const verificationToken = normalizedReference ?? normalizedToken ?? embeddedToken ?? undefined
  const normalizedGateway = gatewayWithoutToken
  const normalizedStoreId = Array.isArray(store_id) ? store_id[0] : store_id
  const resolvedGateway = normalizedGateway === 'paystack' ? 'paystack' : 'stripe'
  const tokenRemovedRef = useRef(false)

  const clearTokenFromUrl = useCallback(() => {
    if (typeof window === 'undefined' || !router.isReady) {
      return
    }

    const currentQuery = {...router.query}
    if ('token' in currentQuery) {
      delete currentQuery.token
    }

    const sanitizeGatewayValue = (value: string | string[]) => {
      if (Array.isArray(value)) {
        return value.map(item => extractGatewayToken(item).gatewayValue)
      }
      return extractGatewayToken(value).gatewayValue
    }

    if (currentQuery.gateway) {
      currentQuery.gateway = sanitizeGatewayValue(currentQuery.gateway as string | string[])
    }

    router.replace(
      {
        pathname: router.pathname,
        query: currentQuery
      },
      undefined,
      {shallow: true}
    )
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push('/')
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }
  }, [isAuthenticated])
  useEffect(() => {
    if (!router.isReady || !verificationToken) {
      if (router.isReady && !verificationToken && !hasAttemptedVerificationRef.current) {
        setVerificationStatus('failed')
      }
      return
    }

    if (lastVerificationTokenRef.current === verificationToken) {
      return
    }

    hasAttemptedVerificationRef.current = true
    lastVerificationTokenRef.current = verificationToken
    setVerificationStatus('pending')

    verifyPaymentHandler({
      token: verificationToken,
      gateway: resolvedGateway
    })
  }, [verificationToken, resolvedGateway, router.isReady, verifyPaymentHandler])

  useEffect(() => {
    if (!hasAttemptedVerificationRef.current) {
      return
    }

    if (isVerifyPaymentLoading) {
      setVerificationStatus('pending')
      return
    }

    if (isSuccess) {
      setVerificationStatus('success')
      // if (!tokenRemovedRef.current && resolvedGateway === 'stripe' && (normalizedToken || embeddedToken)) {
      //   clearTokenFromUrl()
      //   tokenRemovedRef.current = true
      // }
      return
    }

    if (error) {
      setVerificationStatus('failed')
    }
  }, [isVerifyPaymentLoading, isSuccess, error, resolvedGateway, normalizedToken, embeddedToken, clearTokenFromUrl])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!verificationStatus || verificationStatus !== 'pending') {
      return
    }

    const handleRouteChangeStart = (url: string) => {
      if (url !== router.asPath) {
        router.events.emit(
          'routeChangeError',
          new Error('Route change aborted while payment verification is in progress.'),
          url,
          router.asPath
        )
        throw new Error('Route change aborted while payment verification is in progress.')
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [router, verificationStatus])

  const onboardingRetryUrl = normalizedStoreId ? `/mek/onboarding?store_id=${normalizedStoreId}` : '/mek/onboarding'
  if (!isAuthenticated) {
    return <></>
  }

  return (
    <React.Fragment>
      <SEOHead
        title={`AfricanDiasporaMart | Onboarding`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="">
        <NewNavigation />
        <div className="lg:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="">
              <ActivatePayment title_header={true} verificationStatus={verificationStatus} />
              {verificationStatus === 'success' && (
                <div className="relative bottom-8 flex justify-center">
                  <CustomButton
                    type={'button'}
                    onClick={() => router.push('/vendor/dashboard')}
                    className="w-[90%] rounded-[10px] border border-black bg-white px-1 py-4 text-[14px] text-black hover:bg-gray-50 md:w-[30%]"
                  >
                    Go to Dashboard
                  </CustomButton>
                </div>
              )}
              {verificationStatus === 'failed' && (
                <div className="relative bottom-8 flex justify-center">
                  <CustomButton
                    type={'button'}
                    onClick={() => router.push(onboardingRetryUrl)}
                    className="w-[90%] rounded-[10px] border border-black bg-white px-1 py-4 text-[14px] text-black hover:bg-gray-50 md:w-[30%]"
                  >
                    Try again
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

OnboardingPaymentStatusPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={true}>
      {page}
    </CustomerLayout>
  )
}

export default OnboardingPaymentStatusPage
