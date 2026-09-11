import CustomerLayout from '@/components/Layout/Customerlayout'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {CategoryListType} from '@/types/types'
import {postAdValidationSchema} from '@/utils/schemas'
import {RadioChangeEvent, Upload} from 'antd'
import {useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
// import {typeOptions} from '../vendor'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
// import FileThumbnail from '@/components/Advert/FileThumbnail'
import PostAdForm from '@/components/Customer/Advert/PostAdForm'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import TitleText from '@/components/Vendor/TitleText'
import useWindowResize from '@/hooks/useWindowResize'
import {useGetSingleAdsGalleryQuery} from '@/services/Adsgallery'
import {useGetAdvertPlansQuery, useUpdateAdvertMutation} from '@/services/advertisement'
import {isIOS} from '@/utils/fx'
import {useRouter} from 'next/router'
import {useLocalStorage} from 'react-use'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'

const {Dragger} = Upload

interface PromoteOption {
  value: string
  label: string
}

const EditAdPage = () => {
  const router = useRouter()
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik({
    initialValues: {
      // type: 'product',
      title: '',
      category_id: 0,
      price: '',
      quantity: null,
      description: '',
      state: undefined,
      country_id: undefined,
      phone_number: '',
      is_available: true,
      promote_plan_id: 0,
      media: []
    },
    validationSchema: postAdValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: val => {
      // console.log('values', val)
    }
  })
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {id} = router.query

  const {
    data: adsInfo,
    isLoading: adsIsLoading,
    isFetching: adsIsFetching
  } = useGetSingleAdsGalleryQuery({params: {advert: id}})

  const [showPopupBlockedModal, setShowPopupBlockedModal] = useState(false)
  const [popupUrl, setPopupUrl] = useState<string | null>(null)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuthenticated = isAuthenticatedToken

  useEffect(() => {
    if (!isAuthenticated) {
      // Save the current  URL as a query parameter
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }
  }, [isAuthenticated])

  const {data: advertPlans, isLoading: advertPlansLoading} = useGetAdvertPlansQuery({currency: selectedLanguage.value})

  const {data, isLoading} = useGetAllCategoriesQuery({
    type: ''
  })

  const allCategories = [
    ...(data?.data || []).map((category: CategoryListType) => ({
      label: category.name,
      value: category.id
    }))
  ]

  const [updateAdvert, {isLoading: isUpdateAdvertLoading, error}] = useUpdateAdvertMutation()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [adStatus, setAdStatus] = useLocalStorage<string | null>('adStatus', null)
  const [showCategory, setShowCategory] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successTitle, setSuccessTitle] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showType, setShowType] = useState(false)
  const [priceOptions, setPriceOptions] = useState([
    {label: '', value: ''},
    {label: 'Please Contact', value: ''}
  ])
  const {width} = useWindowResize()
  const [selectedPrice, setSelectedPrice] = useState(0)

  const onChange = (e: RadioChangeEvent) => {
    setFieldValue('category_id', e.target.value)
    setShowCategory(false)
  }

  const onTypeChange = (e: RadioChangeEvent) => {
    setFieldValue('type', e.target.value)
    setShowType(false)
  }

  const promoteOptions: PromoteOption[] = [{value: 'free', label: 'Free'}]

  // states
  const [uploadedFiles, setUploadedFiles] = useState<{id: string; file: string}[] | null>(null)
  const [fileList, setFileList] = useState<any[]>([])

  useEffect(() => {
    if (adsInfo) {
      setFieldValue('title', adsInfo?.data?.title)
      setFieldValue('description', adsInfo?.data?.description)
      setFieldValue('category_id', adsInfo?.data?.category_id)
      setFieldValue('quantity', adsInfo?.data?.quantity || null)
      setFieldValue('phone_number', adsInfo?.data?.phone_number ?? '')
      setFieldValue('country_id', adsInfo?.data?.country_id)
      setFieldValue('state', adsInfo?.data?.state ?? '')
      setFieldValue('is_available', adsInfo?.data?.is_available ?? 1)
      setFieldValue('promote_plan_id', adsInfo?.data?.promote_plan_id ?? 0)
      setFieldValue('country_code', adsInfo?.data?.country_code ?? '')

      // Handle media prefill for NewDragDrop

      // Add price-related fields
      if (!adsInfo?.data?.price_on_request) {
        setFieldValue('price', adsInfo?.data?.price ?? '')
        setFieldValue('selectedPrice', 0)
      } else {
        setFieldValue('selectedPrice', 1)
      }
      setFieldValue('price_on_request', adsInfo?.data?.price_on_request ?? false)
    }
  }, [adsInfo])

  const handleAdvertUpdate = async () => {
    let payload: any = {
      title: values.title,
      description: values.description,
      category_id: values.category_id,
      phone_number: values.phone_number,
      country_id: values.country_id,
      state: values.state,
      media: uploadedFiles?.map(f => f.file) || [],
      is_available: values.is_available,
      ...(!adsInfo?.data.payment && {
        promote_plan_id: values.promote_plan_id,
        country_code: selectedLanguage?.key,
        return_url: `${window.location.origin}/customer?tab=adverts`,
        cancel_url: `${window.location.origin}/customer?tab=adverts`
      })
    }

    // Add quantity only if it's not null
    if (values.quantity) {
      payload.quantity = values.quantity
    }

    if (selectedPrice === 0) {
      payload['price'] = values.price
      payload['price_on_request'] = false
    } else {
      payload['price_on_request'] = true
    }

    console.log('payload', payload)

    try {
      const res = await updateAdvert({
        body: payload,
        advert: id!.toString(),
        currency: selectedLanguage?.value
      })
        .unwrap()
        .then(data => {
          setAdStatus(data?.data)
          if (data?.data?.url) {
            setSuccessTitle(data?.data?.listing?.title)
            setProcessingPayment(true)
            setShowSuccess(true)
            const newWindow = window.open(data?.data?.url?.url as string, '_blank')
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
              setPopupUrl(data?.data?.url?.url as string)
              if (isIOS()) {
                setShowPopupBlockedModal(true)
              } else {
                alert('Please allow pop-ups for this site to proceed with the payment.')
              }
            }
          } else {
            setSuccessTitle(data?.data?.listing?.title)
            setShowSuccess(true)
          }
        })
        .catch((err: any) => {
          window.scrollTo({top: 0, behavior: 'smooth'})

          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{err?.data?.message || 'Error creating ad!'}</>}
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
  const handlePopupBlockedModalClose = () => {
    setShowPopupBlockedModal(false)
    if (popupUrl) {
      window.open(popupUrl, '_blank')
    }
  }
  if (!isAuthenticated) return null // Prevent rendering until authentication is verified
  return (
    <div className="flex w-full flex-col">
      {/* <NewNavigation /> */}
      <div className="flex w-full items-center justify-center bg-[#F8F8F8] lg:py-[48px]">
        <div className="mx-auto w-full bg-white px-5 py-[46px] lg:max-w-[1094px] lg:rounded-[13px]">
          <PostAdForm
            adsInfo={adsInfo}
            advertPlans={advertPlans}
            advertPlansLoading={advertPlansLoading}
            allCategories={allCategories}
            error={error}
            errors={errors}
            payment={adsInfo?.data?.payment!}
            fileList={fileList}
            handleAdvertCreation={handleAdvertUpdate}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isCreateAdvertLoading={isUpdateAdvertLoading}
            priceOptions={priceOptions}
            dragListener={true}
            isEdit={true}
            selectedLanguage={selectedLanguage}
            selectedPrice={selectedPrice}
            setFieldValue={setFieldValue}
            setFileList={setFileList}
            setSelectedPrice={setSelectedPrice}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
            values={values}
          />
        </div>

        {showSuccess && (
          <PlannerModal
            modalOpen={showSuccess}
            onCloseModal={() => {
              Object.keys(values).map(key => {
                setFieldValue(key, '')
              })
              setFileList([])
              setUploadedFiles(null)
              resetForm()
              window.scrollTo({
                top: 0, // Scroll to the top
                behavior: 'smooth' // Smooth scrolling effect
              })
              setShowSuccess(false)
            }}
            setModalOpen={setShowSuccess}
            maskCloseable={true}
            width={380}
          >
            <div className="flex flex-col items-center justify-center gap-[19px]">
              <TextComponent as="p" className="text-center text-[20px] font-medium leading-[22px]">
                {successTitle} {processingPayment ? 'is being processed' : 'Has been posted'}
              </TextComponent>
              <Icon icon={'icon-park-outline:success'} className="text-[79px]" />
              <TextComponent as="span" className="text-center text-[13px] font-medium leading-[27px]">
                Check out myEKI&apos;s Ads Gallery {processingPayment ? 'after successful payment' : ''}
              </TextComponent>
              <CustomButton
                onClick={() => {
                  router.push('/customer?tab=adverts')
                  setShowSuccess(false)
                }}
                type="button"
                className="w-[236px] rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
              >
                Ok, thanks
              </CustomButton>
            </div>
          </PlannerModal>
        )}
      </div>
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
    </div>
  )
}

EditAdPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout maxWidth={false}>{page}</CustomerLayout>
}

export default EditAdPage
