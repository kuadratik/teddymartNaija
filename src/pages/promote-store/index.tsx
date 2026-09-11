import CustomerLayout from '@/components/Layout/Customerlayout'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import TitleText from '@/components/Vendor/TitleText'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {CategoryListType} from '@/types/types'
import {postAdValidationSchema} from '@/utils/schemas'
import {Checkbox, Image, Radio, RadioChangeEvent, Select, Upload} from 'antd'
import {useFormik} from 'formik'
import React, {useEffect, useRef, useState} from 'react'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import CountryInput from '@/components/SharedUI/Input/CountryInput'
import StateInput from '@/components/SharedUI/Input/StateInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import {Icon} from '@iconify/react'
import {capitalizeFirstLetter} from '@/utils/fx'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useRouter} from 'next/router'
import {VendorStoreInformationType} from '@/components/Profile/utils'
import {
  useCreateStorePromotionMutation,
  useGetAdvertPlansQuery,
  useGetPromotionsPlansQuery
} from '@/services/advertisement'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import errorToastIcon from '../../../public/assets/error-toast-icon.svg'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import PlansContainer from '@/components/Customer/Advert/PlansContainer'
import {useGetUserStoreQuery} from '@/services/store'
import Link from 'next/link'
import {useStoreSwitch} from '@/components/Store/hooks/useStoreSwitch'

const PromoteStorePage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik({
    initialValues: {
      store_id: 0,
      store_promote_plan_id: 0
    },
    validationSchema: postAdValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: val => {}
  })
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {type} = useAppSelector(state => state.vendor)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated token
  // console.log('🚀 ~ isAuthenticatedUser', isAuthenticatedUser)
  const isAuth = isAuthenticatedToken

  const isAuthenticated = isAuthenticatedToken

  const {data: promotionPlans, isLoading: promotionPlansLoading} = useGetPromotionsPlansQuery({
    currency: selectedLanguage.value
  })
  const [createStorePromotion, {isLoading: isCreateStorePromotionLoading}] = useCreateStorePromotionMutation()
  const {data: userStoreData, isLoading: userStoreLoading} = useGetUserStoreQuery({currency: selectedLanguage.value})
  // console.log('🚀 ~ file: index.tsx ~ line 52 ~ PromoteStorePage ~ userStoreData', userStoreData)

  useEffect(() => {
    if (!isAuthenticated) {
      // Save the current  URL as a query parameter
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
    }

    if (!isAuthenticatedUser?.has_store) {
      router.push('/mek/onboarding')
    }
  }, [isAuthenticated, isAuthenticatedUser?.has_store])

  if (!isAuthenticated) return null // Prevent rendering until authentication is verified

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [showSuccess, setShowSuccess] = useState(false)
  const [showStore, setShowStore] = useState(false)

  const promoteOptions = [
    {value: '0.5', label: '$0.5(7 Days)'},
    {value: '1', label: '$1(14 Days)'}
  ]

  const [selectedPromote, setSelectedPromote] = useState(0)

  const storeList = React.useMemo(
    () => (isAuthenticatedUser?.has_store ? [...isAuthenticatedUser?.store] : []),
    [isAuthenticatedUser?.store]
  )

  // create a variable of the storeList that just takes the store name and id as label nd value also add an object with label "Select Store" with the value of 0 which would represent the default value
  const storeListOptions = [
    ...(userStoreData?.data || []).map((store: VendorStoreInformationType) => ({
      label: store.name,
      value: store.id
    }))
  ]

  // create function that returns a store from the given id
  const getStoreById = (id: number) => {
    return (userStoreData?.data || []).find((store: VendorStoreInformationType) => store.id === id)
  }

  const onStoreChange = (e: RadioChangeEvent) => {
    setFieldValue('store_id', e.target.value)
    setShowStore(false)
  }

  const handlePromotionCreation = async () => {
    let payload: any = {
      ...values,
      return_url: `${window.location.origin}/vendor/user-profile?tab=adverts`,
      cancel_url: `${window.location.origin}/promote-store`
    }

    // console.log('payload', payload)

    try {
      const res = await createStorePromotion({
        body: payload,
        currency: selectedLanguage?.value
      })
        .unwrap()
        .then(data => {
          // console.log('data', data)

          if (data?.data?.url) {
            window.open(data?.data?.url?.url as string, '_blank')
          } else {
            // setSuccessTitle(data?.data?.listing?.title)
          }
          setShowSuccess(true)
        })
        .catch((err: any) => {
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

            if (key === 'no_product_found') {
              handleStoreSwitch(getStoreById(values.store_id))
              router.push('/vendor/products/add-product')
            }
          })
        })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to create store promotion!</>}
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

  const {handleStoreSwitch} = useStoreSwitch()

  return (
    <div className="flex w-full flex-col">
      <NewNavigation />
      <div className="flex w-full flex-col items-center justify-center bg-[#F8F8F8] lg:gap-[57px] lg:py-[48px]">
        <div className="mx-auto w-full bg-white px-5 py-[46px] lg:max-w-[1094px] lg:rounded-[13px]">
          <div className="mx-auto flex w-full max-w-[644px] flex-col items-center justify-center gap-[47px]">
            <TextComponent as="h1" className="text-[24px] font-bold leading-[31px] text-[#141414] lg:text-center">
              Ready for More Customers? Promote your Store on myEki and Watch your Sales Grow!
            </TextComponent>

            <div className="flex w-full flex-col gap-[34px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                1. Store*
              </TextComponent>

              <div className="flex w-full flex-col gap-4">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    // setShowStore(true)
                  }}
                >
                  <SelectInput
                    placeholder="Select Store"
                    data={storeListOptions}
                    value={
                      values.store_id ? storeListOptions.find(list => list.value === values.store_id)?.value : null
                    }
                    onChange={e => {
                      setFieldValue('store_id', e)
                    }}
                    disabled={false}
                    notFoundContent={
                      <div className="flex h-[150px] flex-col items-center justify-center gap-2">
                        <Icon icon={'nonicons:not-found-16'} className="text-[50px] text-gray-400" />
                        <Link className="text-black" href={'/mek/onboarding'}>
                          No registered Store in this country,{' '}
                          <span className="text-blue-500 underline">click here</span> to create a new store
                        </Link>
                      </div>
                    }
                    errorMessage={typeof errors.store_id === 'string' ? errors.store_id : ''}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-[34px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                2. Promote your Store!*
              </TextComponent>

              <PlansContainer
                loading={promotionPlansLoading}
                advertPlans={promotionPlans?.data || []}
                selectedPlanId={values.store_promote_plan_id}
                onSelectPlan={id => setFieldValue('store_promote_plan_id', id)}
                errorMessage={errors.store_promote_plan_id}
              />
            </div>

            <CustomButton
              onClick={() => {
                handlePromotionCreation()
              }}
              disabled={isCreateStorePromotionLoading}
              type="button"
              className="w-full rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
            >
              {isCreateStorePromotionLoading ? <Spinner /> : 'Promote Store'}
            </CustomButton>
          </div>
        </div>

        <div className="flex h-[439px] w-full flex-row gap-4 lg:mx-auto lg:max-w-7xl">
          <div className="h-full w-full rounded-[8px] bg-[url('/assets/banner-advert.jpg')] bg-cover bg-center">
            <div className="w-[341px] p-12">
              <h3 className="pb-5 text-[27px] font-semibold leading-[32px] text-white">
                Ready to Grow? Get on myEki today!
              </h3>
              <CustomButton
                className="flex h-[30px] w-[152px] cursor-pointer items-center justify-center rounded-[5px] bg-white py-2"
                onClick={() => {
                  if (isAuth) {
                    router.push('/vendor/dashboard')
                    // if (isAuthenticatedUser?.offers_product) {
                    //   dispatch(setType({type: 'product'}))
                    //   setTimeout(() => {
                    //     router.push('/vendor/dashboard')
                    //   }, 0)
                    // } else if (isAuthenticatedUser?.offers_service) {
                    //   dispatch(setType({type: 'service'}))
                    //   setTimeout(() => {
                    //     router.push('/vendor/dashboard')
                    //   }, 0)
                    // } else {
                    //   {
                    //     router.push('/mek/onboarding')
                    //   }
                    // }
                  } else {
                    router.push('/mek/onboarding')
                  }
                }}
              >
                <TextComponent as="span" className="whitespace-nowrap text-[9px] font-semibold text-black">
                  Become a MEK Vendor
                </TextComponent>
              </CustomButton>
            </div>
          </div>
        </div>

        {isDesktop && showStore && (
          <PlannerModal
            modalOpen={showStore}
            onCloseModal={() => {
              setShowStore(false)
            }}
            setModalOpen={setShowStore}
            maskCloseable={true}
          >
            <TitleText title={`Store List`} />
            <Radio.Group value={values.store_id} onChange={onStoreChange} className="flex flex-col gap-[22px]">
              {storeList.map((store, index) => (
                <Radio key={index} value={store?.id}>
                  {store.name}
                </Radio>
              ))}
            </Radio.Group>
          </PlannerModal>
        )}

        {!isDesktop && showStore && (
          <DrawerContainer open={showStore} onClose={() => setShowStore(false)} title={`Store List`} height={250}>
            <Radio.Group value={values.store_id} onChange={onStoreChange} className="flex flex-col gap-[22px]">
              {storeList.map((store, index) => (
                <Radio key={index} value={store?.id}>
                  {store.name}
                </Radio>
              ))}
            </Radio.Group>
          </DrawerContainer>
        )}

        {showSuccess && (
          <PlannerModal
            modalOpen={showSuccess}
            onCloseModal={() => {
              // Object.keys(values).map(key => {
              //   setFieldValue(key, 0)
              // })
              // resetForm()
              setShowSuccess(false)
            }}
            setModalOpen={setShowSuccess}
            maskCloseable={true}
            width={380}
          >
            <div className="flex flex-col items-center justify-center gap-[19px]">
              <TextComponent as="p" className="text-center text-[20px] font-medium leading-[22px]">
                {storeList?.find((store: VendorStoreInformationType) => (store?.id ? store.id === values.store_id : ''))
                  ?.name || ''}{' '}
                promotion is currently being processed!
              </TextComponent>
              <Icon icon={'icon-park-outline:success'} className="text-[79px]" />
              <TextComponent as="span" className="text-center text-[13px] font-medium leading-[27px]">
                Check out the <b>My Promotions</b> section in your vendor profile page after successful payment.
              </TextComponent>
              <CustomButton
                onClick={() => {
                  setShowSuccess(false)
                  handleStoreSwitch(getStoreById(values.store_id))
                  router.push('/vendor/user-profile?tab=adverts')
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
    </div>
  )
}

PromoteStorePage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout maxWidth={false}>{page}</CustomerLayout>
}

export default PromoteStorePage
