import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import PayoutContainer from '@/components/Vendor/components/payout/PayoutContainer'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useRequestPayoutOTPMutation, useVerifyPayoutOTPMutation} from '@/services/vendor/payout'
import {Input} from 'antd'
import {OTPProps} from 'antd/es/input/OTP'
import {useRouter} from 'next/router'
import {useCallback, useEffect, useRef, useState} from 'react'

const PayoutPage = () => {
  const isActiveUser = useAppSelector(state => state.auth.activeUser)
  console.log('🚀 ~ PayoutPage ~ isActiveUser:', isActiveUser?.slug)
  const [formValues, setFormValues] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialRequestMadeRef = useRef(false) // Add this ref to track initial request
  const IDLE_TIMEOUT = 10 * 60 * 1000 // 10 minutes in milliseconds

  const [
    requestPayoutOTP,
    {
      isLoading: isLoadingRequestPayoutOTP,
      isSuccess: isSuccessRequestPayoutOTP,
      isError: isErrorRequestPayoutOTP,
      error: errorRequestPayoutOTP
    }
  ] = useRequestPayoutOTPMutation()
  const [
    verifyPayoutOTP,
    {
      isLoading: isLoadingVerifyPayoutOTP,
      isSuccess: isSuccessVerifyPayoutOTP,
      isError: isErrorVerifyPayoutOTP,
      error: errorVerifyPayoutOTP
    }
  ] = useVerifyPayoutOTPMutation()
  const onChange: OTPProps['onChange'] = text => {
    console.log('onChange:', text)
  }

  const onInput: OTPProps['onInput'] = value => {
    console.log('onInput:', value)
  }

  const sharedProps: OTPProps = {
    onChange,
    onInput
  }

  // Reset the idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    idleTimerRef.current = setTimeout(() => {
      if (isActiveUser) {
        requestPayoutOTP({userStore: isActiveUser.slug})
          .unwrap()
          .then((res: any) => {
            console.log('Idle timeout - Request OTP Success:', res)
            setIsModalOpen(true)
          })
          .catch((err: any) => {
            console.error('Idle timeout - Request OTP Error:', err)
          })
      }
    }, IDLE_TIMEOUT)
  }, [isActiveUser, requestPayoutOTP])

  // Set up event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']

    // Event handler
    const handleUserActivity = () => {
      resetIdleTimer()
    }

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity)
    })

    // Initialize the idle timer without requesting OTP
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    idleTimerRef.current = setTimeout(() => {
      if (isActiveUser) {
        requestPayoutOTP({userStore: isActiveUser.slug})
          .unwrap()
          .then((res: any) => {
            console.log('Idle timeout - Request OTP Success:', res)
            setIsModalOpen(true)
          })
          .catch((err: any) => {
            console.error('Idle timeout - Request OTP Error:', err)
          })
      }
    }, IDLE_TIMEOUT)

    // Cleanup
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity)
      })
    }
  }, [resetIdleTimer])

  // Single initial OTP request
  useEffect(() => {
    if (isActiveUser && !initialRequestMadeRef.current) {
      initialRequestMadeRef.current = true
      requestPayoutOTP({userStore: isActiveUser.slug})
        .unwrap()
        .then((res: any) => {
          console.log('Request OTP Success:', res)
        })
        .catch((err: any) => {
          console.error('Request OTP Error:', err)
          initialRequestMadeRef.current = false // Reset in case of error
        })
    }
  }, [isActiveUser, requestPayoutOTP])

  useEffect(() => {
    if (isSuccessRequestPayoutOTP) {
      setIsModalOpen(true)
    }
  }, [isSuccessRequestPayoutOTP])

  useEffect(() => {
    if (isSuccessVerifyPayoutOTP) {
      setIsModalOpen(false)
      resetIdleTimer()
    }
  }, [isSuccessVerifyPayoutOTP, resetIdleTimer])

  if (isLoadingRequestPayoutOTP) {
    return <SkeletonLoaderForPage />
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-[24px] font-semibold">Payout</h1>

      {isModalOpen ? (
        <PlannerModal
          modalOpen={isModalOpen}
          onCloseModal={() => {
            router.push('/vendor/dashboard')
            setIsModalOpen(false)
          }}
          className="rounded-lg"
          setModalOpen={setIsModalOpen}
          title=""
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-lg font-semibold">Payout OTP Sent</h2>
            <p className="text-center text-gray-500">An OTP has been sent to your registered email.</p>
            <div className="w-full">
              <div className="hidden w-full justify-center lg:flex">
                <Input.OTP
                  formatter={str => str}
                  value={formValues}
                  length={6}
                  size="large"
                  className="flex justify-center"
                  onChange={value => {
                    const digits = value.replace(/\D/g, '').slice(0, 6)
                    setFormValues(digits)
                  }}
                  inputMode="numeric"
                />
              </div>
              <div className="w-full lg:hidden">
                <TextInput
                  name="otp"
                  type="number"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={formValues}
                  onChange={e => {
                    // Only allow digits and limit to 6 characters
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setFormValues(digits)
                  }}
                  pattern="[0-9]*"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
              {errorVerifyPayoutOTP && (
                <p className="pt-1 text-center text-xs italic text-red-500">
                  {(errorVerifyPayoutOTP as any)?.data?.message || 'An error occurred'}
                </p>
              )}
            </div>
            <div className="w-full lg:mx-auto lg:w-[90%]">
              <CustomButton
                type="button"
                disabled={formValues.length < 6}
                onClick={() => {
                  verifyPayoutOTP({userStore: isActiveUser.slug, body: {otp: formValues}})
                    .unwrap()
                    .then((res: any) => {
                      showPlannerToast({
                        options: {
                          customToast: (
                            <CustomToast
                              altText={''}
                              title={<>OTP verified successfully.!</>}
                              textColor="#FFF"
                              message={''}
                              backgroundColor="#000"
                            />
                          )
                        },
                        message: 'message'
                      })
                      setFormValues('')
                    })
                    .catch((err: any) => {
                      console.error('Verify OTP Error:', err)
                      showPlannerToast({
                        options: {
                          customToast: (
                            <CustomToast
                              altText={''}
                              title={<>{err?.data?.message}!</>}
                              textColor="#FFF"
                              message={''}
                              backgroundColor="#000"
                            />
                          )
                        },
                        message: `${err?.data?.message}`
                      })
                    })
                }}
                className="mt-4 rounded bg-black px-4 py-3 text-white hover:bg-gray-600"
              >
                {isLoadingVerifyPayoutOTP ? <Spinner /> : 'Verify OTP'}
              </CustomButton>
              <div className="flex justify-center pt-3 text-center">
                <button
                  className="flex items-center justify-center gap-3 text-sm font-semibold text-gray-800 hover:text-gray-600"
                  onClick={() => {
                    if (isActiveUser) {
                      requestPayoutOTP({userStore: isActiveUser.slug})
                        .unwrap()
                        .then((res: any) => {
                          console.log('Request OTP Success:', res)
                          showPlannerToast({
                            options: {
                              customToast: (
                                <CustomToast
                                  altText={''}
                                  title={<>OTP has been sent again!</>}
                                  textColor="#FFF"
                                  message={''}
                                  backgroundColor="#000"
                                />
                              )
                            },
                            message: 'OTP sent successfully'
                          })
                          setFormValues('')
                        })
                        .catch((err: any) => {
                          console.error('Request OTP Error:', err)
                          showPlannerToast({
                            options: {
                              customToast: (
                                <CustomToast
                                  altText={''}
                                  title={<>{err?.data?.message || 'Failed to send OTP'}</>}
                                  textColor="#FFF"
                                  message={''}
                                  backgroundColor="#000"
                                />
                              )
                            },
                            message: 'Failed to send OTP'
                          })
                        })
                    }
                  }}
                  disabled={isLoadingRequestPayoutOTP}
                >
                  Resend
                  {isLoadingRequestPayoutOTP && <Spinner className="text-gray-800" />}
                </button>
              </div>
            </div>
          </div>
        </PlannerModal>
      ) : (
        <PayoutContainer />
      )}
    </div>
  )
}

PayoutPage.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default PayoutPage
