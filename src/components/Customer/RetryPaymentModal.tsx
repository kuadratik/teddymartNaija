import React from 'react'
import TextComponent from '../SharedUI/TextComponent'
import PlannerModal from '../SharedUI/ModalComponent'
import CustomButton from '../SharedUI/Buttons/Button'
import {
  useGetAdvertPlansQuery,
  useGetPromotionsPlansQuery,
  useUpdateAdvertMutation,
  useUpdateStorePromotionMutation
} from '@/services/advertisement'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useFormik} from 'formik'
import PlansContainer from './Advert/PlansContainer'
import TitleText from '../Vendor/TitleText'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import CustomToast from '../SharedUI/Toast/CustomToast'
import Spinner from '../SharedUI/Spinner'
import errorToastIcon from '../../../public/assets/error-toast-icon.svg'

interface IRetryPaymentProps {
  showRetry: boolean
  setShowRetry: React.Dispatch<React.SetStateAction<boolean>>
  promotion?: boolean
  advert: number
  price: string
  title: string
  buttonText: string
  promoteCurrency?: string
  setCurrentlyClickedAd?: any
}

const RetryPaymentModal = ({
  showRetry,
  setShowRetry,
  promotion = true,
  advert,
  price,
  title,
  buttonText,
  promoteCurrency,
  setCurrentlyClickedAd
}: IRetryPaymentProps) => {
  console.log('price', price)
  const {selectedLanguage} = useAppSelector(state => state.country)

  const {data: promotionPlans, isLoading: promotionPlansLoading} = useGetPromotionsPlansQuery({
    currency: promoteCurrency ?? selectedLanguage.value
  })

  const {data: advertPlans, isLoading: advertPlansLoading} = useGetAdvertPlansQuery({
    currency: promoteCurrency ?? selectedLanguage.value
  })
  const [updateAdvert, {isLoading: isUpdateAdvertLoading}] = useUpdateAdvertMutation()
  const [updateStorePromotion, {isLoading: isUpdateStorePromotionLoading}] = useUpdateStorePromotionMutation()

  const {values, setFieldValue, setFieldError, errors} = useFormik({
    initialValues: {
      promote_plan_id: 0,
      store_promote_plan_id: 0
    },
    onSubmit: values => {}
  })

  const handleAdvertUpdate = async () => {
    let payload: any = {
      return_url: `${window.location.href}`,
      cancel_url: `${window.location.href}`
    }

    if (promotion) {
      payload['store_promote_plan_id'] = values.store_promote_plan_id
    } else {
      payload['promote_plan_id'] = values.promote_plan_id
      payload['price'] = price || 0
    }

    // console.log('payload', payload)

    try {
      if (promotion) {
        const res = await updateStorePromotion({
          body: {...payload, store_id: advert},
          currency: promoteCurrency ?? selectedLanguage?.value
        })
          .unwrap()
          .then(data => {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>{'Store Promotion in progress!'}</>}
                    textColor="#FFF"
                    message={data?.message}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'message'
            })

            // console.log('data', data)

            if (data?.data?.url) {
              setShowRetry(false)
              window.open(data?.data?.url?.url as string, '_blank')
            } else {
              // setSuccessTitle(data?.data?.listing?.title)
              // setShowSuccess(true)
              setShowRetry(false)
            }
          })
          .catch((err: any) => {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>{err?.data?.message || 'Error promoting store!'}</>}
                    textColor="#FFF"
                    message={err?.data?.message}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'message'
            })

            const errorKeys = Object.keys(err?.data?.errors || {})

            errorKeys.forEach((key: string) => {
              setFieldError(key, 'This field is required')
            })
          })
      } else {
        const res = await updateAdvert({
          body: payload,
          currency: promoteCurrency ?? selectedLanguage?.value,
          advert
        })
          .unwrap()
          .then(data => {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>{'Ad Promotion in progress!'}</>}
                    textColor="#FFF"
                    message={data?.message}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'message'
            })

            // console.log('data', data)

            if (data?.data?.url) {
              setShowRetry(false)
              window.open(data?.data?.url?.url as string, '_blank')
            } else {
              // setSuccessTitle(data?.data?.listing?.title)
              // setShowSuccess(true)
              setShowRetry(false)
            }
          })
          .catch((err: any) => {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>{err?.data?.message || 'Error promoting ad!'}</>}
                    textColor="#FFF"
                    message={err?.data?.message}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'message'
            })

            const errorKeys = Object.keys(err?.data?.errors || {})

            errorKeys.forEach((key: string) => {
              setFieldError(key, 'This field is required')
            })
          })
      }
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to create ad!</>}
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

  return (
    <PlannerModal
      modalOpen={showRetry}
      onCloseModal={() => {
        setShowRetry(false)
        setCurrentlyClickedAd && setCurrentlyClickedAd(null)
        // Object.keys(values).map(key => {
        //   setFieldValue(key, 0)
        // })
      }}
      setModalOpen={setShowRetry}
      maskCloseable={true}
    >
      <TitleText title={title} />
      <PlansContainer
        loading={promotion ? promotionPlansLoading : advertPlansLoading}
        advertPlans={promotion ? promotionPlans?.data : advertPlans?.data || []}
        selectedPlanId={promotion ? values.store_promote_plan_id : values.promote_plan_id}
        onSelectPlan={id => setFieldValue(promotion ? 'store_promote_plan_id' : 'promote_plan_id', id)}
        errorMessage={promotion ? errors.store_promote_plan_id : errors.promote_plan_id}
      />

      <div className="mt-6 flex items-center justify-center">
        <CustomButton
          onClick={() => {
            handleAdvertUpdate()
            // router.push('/vendor/')
          }}
          disabled={isUpdateAdvertLoading || isUpdateStorePromotionLoading}
          type="button"
          className="w-[236px] rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
        >
          {isUpdateAdvertLoading || isUpdateStorePromotionLoading ? <Spinner /> : `${buttonText}`}
        </CustomButton>
      </div>
    </PlannerModal>
  )
}

export default RetryPaymentModal
