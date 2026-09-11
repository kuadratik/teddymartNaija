import {useAppSelector} from '@/hooks/reduxHooks'
import useWindowResize from '@/hooks/useWindowResize'
import {
  useGetAdvertPlansQuery,
  useGetPromotionsPlansQuery,
  useUpdateAdvertMutation,
  useUpdateStorePromotionMutation
} from '@/services/advertisement'
import {isIOS} from '@/utils/fx'
import {useFormik} from 'formik'
import React, {useState} from 'react'
import {useLocalStorage} from 'react-use'
import CustomButton from '../SharedUI/Buttons/Button'
import PlannerModal from '../SharedUI/ModalComponent'
import Spinner from '../SharedUI/Spinner'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import TitleText from '../Vendor/TitleText'
import PlansContainer from './Advert/PlansContainer'

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
  adsRefetch: () => void
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
  adsRefetch,
  setCurrentlyClickedAd
}: IRetryPaymentProps) => {
  console.log('🚀 ~ adsRefetch:', adsRefetch())
  const [showPopupBlockedModal, setShowPopupBlockedModal] = useState(false)
  const [popupUrl, setPopupUrl] = useState<string | null>(null)
  const {selectedLanguage} = useAppSelector(state => state.country)

  const {data: promotionPlans, isLoading: promotionPlansLoading} = useGetPromotionsPlansQuery({
    currency: promoteCurrency ?? selectedLanguage.value
  })

  const {data: advertPlans, isLoading: advertPlansLoading} = useGetAdvertPlansQuery({
    currency: promoteCurrency ?? selectedLanguage.value
  })
  const [updateAdvert, {isLoading: isUpdateAdvertLoading}] = useUpdateAdvertMutation()
  const [updateStorePromotion, {isLoading: isUpdateStorePromotionLoading, isSuccess}] =
    useUpdateStorePromotionMutation()
  const [adStatus, setAdStatus] = useLocalStorage<string | null>('adStatus', null)
  const {width} = useWindowResize()

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

    try {
      if (promotion) {
        const res = await updateStorePromotion({
          body: {...payload, store_id: advert},
          currency: promoteCurrency ?? selectedLanguage?.value
        }).unwrap()

        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>{'Store Promotion in progress!'}</>}
                textColor="#FFF"
                message={res?.message}
                backgroundColor="#000"
              />
            )
          },
          message: 'message'
        })
        adsRefetch()

        setAdStatus(res?.data)
        if (res?.data?.url) {
          setShowRetry(false)
          return res.data.url.url
        } else {
          setShowRetry(false)
        }
        adsRefetch()
      } else {
        const res = await updateAdvert({
          body: payload,
          currency: promoteCurrency ?? selectedLanguage?.value,
          advert
        }).unwrap()

        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>{'Ad Promotion in progress!'}</>}
                textColor="#FFF"
                message={res?.message}
                backgroundColor="#000"
              />
            )
          },
          message: 'message'
        })
        adsRefetch()
        setAdStatus(res?.data)
        if (res?.data?.url) {
          setShowRetry(false)
          return res.data.url.url
        } else {
          setShowRetry(false)
        }
      }
      adsRefetch()
    } catch (err: any) {
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
    }
  }

  const handleButtonClick = async () => {
    const url = await handleAdvertUpdate()
    if (url) {
      const newWindow = window.open(url, '_blank')
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        setPopupUrl(url)
        if (isIOS()) {
          setShowPopupBlockedModal(true)
        } else {
          alert('Please allow pop-ups for this site to proceed with the payment.')
        }
      }
    }
  }

  const handlePopupBlockedModalClose = () => {
    setShowPopupBlockedModal(false)
    if (popupUrl) {
      window.open(popupUrl, '_blank')
    }
  }

  return (
    <>
      <PlannerModal
        modalOpen={showRetry}
        onCloseModal={() => {
          setShowRetry(false)
          setCurrentlyClickedAd && setCurrentlyClickedAd(null)
        }}
        setModalOpen={setShowRetry}
        maskCloseable={true}
      >
        <TitleText title={title} />
        <PlansContainer
          payment={null}
          loading={promotion ? promotionPlansLoading : advertPlansLoading}
          advertPlans={promotion ? promotionPlans?.data : advertPlans?.data || []}
          selectedPlanId={promotion ? values.store_promote_plan_id : values.promote_plan_id}
          onSelectPlan={id => setFieldValue(promotion ? 'store_promote_plan_id' : 'promote_plan_id', id)}
          errorMessage={promotion ? errors.store_promote_plan_id : errors.promote_plan_id}
        />

        <div className="mt-6 flex items-center justify-center">
          <CustomButton
            onClick={handleButtonClick}
            disabled={isUpdateAdvertLoading || isUpdateStorePromotionLoading}
            type="button"
            className="w-[236px] rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
          >
            {isUpdateAdvertLoading || isUpdateStorePromotionLoading ? <Spinner /> : `${buttonText}`}
          </CustomButton>
        </div>
      </PlannerModal>

      {showPopupBlockedModal && width < 1024 && (
        <PlannerModal
          modalOpen={showPopupBlockedModal}
          onCloseModal={() => setShowPopupBlockedModal(false)}
          setModalOpen={setShowPopupBlockedModal}
          maskCloseable={true}
        >
          <TitleText title="Continue to Payment" />
          <div className="p-4">
            <p className="text-center font-[500]">To complete your purchase, please proceed to the payment page.</p>
            <div className="mt-4 flex justify-center">
              <CustomButton
                onClick={handlePopupBlockedModalClose}
                type="button"
                className="w-[236px] rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
              >
                OK
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      )}
    </>
  )
}

export default RetryPaymentModal
