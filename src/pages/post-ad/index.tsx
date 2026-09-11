import CustomerLayout from '@/components/Layout/Customerlayout'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {CategoryListType} from '@/types/types'
import {postAdValidationSchema} from '@/utils/schemas'
import type {UploadFile, UploadProps} from 'antd'
import {Form, RadioChangeEvent, Upload} from 'antd'
import {useFormik} from 'formik'
import React, {useCallback, useEffect, useRef, useState} from 'react'
// import {typeOptions} from '../vendor'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import CountryInput from '@/components/SharedUI/Input/CountryInput'
import StateInput from '@/components/SharedUI/Input/StateInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
// import FileThumbnail from '@/components/Advert/FileThumbnail'
import NewDragDrop from '@/components/Customer/Advert/NewDragDrop'
import PlansContainer from '@/components/Customer/Advert/PlansContainer'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {fileToBase64} from '@/components/Vendor/utils'
import {useCreateAdvertMutation, useGetAdvertPlansQuery} from '@/services/advertisement'
import {
  useDeleteImageFileMutation,
  useUploadImageFileMutation,
  useUploadVideoFileMutation
} from '@/services/general/general'
import {useRouter} from 'next/router'
import CurrencyInput from 'react-currency-input-field'
import errorToastIcon from '../../../public/assets/error-toast-icon.svg'

const {Dragger} = Upload

interface PromoteOption {
  value: string
  label: string
}

const PostAdPage = () => {
  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik({
    initialValues: {
      // type: 'product',
      title: '',
      category_id: 0,
      price: '',
      quantity: '',
      description: '',
      state: undefined,
      country_id: undefined,
      phone_number: '',
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

  const router = useRouter()

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

  const [uploadFile, {isLoading: isUploadLoading}] = useUploadImageFileMutation()
  const [uploadVideo, {isLoading: isUploadVideoLoading}] = useUploadVideoFileMutation()
  const [deleteFile, {isLoading: isDeleteFileLoading}] = useDeleteImageFileMutation()
  const [createAdvert, {isLoading: isCreateAdvertLoading, error}] = useCreateAdvertMutation()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const onPictureChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
    setFileList(newFileList)
  }

  const stopsContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef(null)

  // const onPreview = async (file: UploadFile) => {
  //   let src = file.url as string
  //   if (!src) {
  //     src = await new Promise(resolve => {
  //       const reader = new FileReader()
  //       reader.readAsDataURL(file.originFileObj as FileType)
  //       reader.onload = () => resolve(reader.result as string)
  //     })
  //   }
  //   const image = new Image()
  //   image.src = src
  //   const imgWindow = window.open(src)
  //   imgWindow?.document.write(image.outerHTML)
  // }

  const [showCategory, setShowCategory] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successTitle, setSuccessTitle] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showType, setShowType] = useState(false)
  const [priceOptions, setPriceOptions] = useState([
    {label: '', value: ''},
    {label: 'Please Contact', value: ''}
  ])
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

  const memoizedSetUploadedFiles = useCallback((files: {id: string; file: string}[] | null) => {
    setUploadedFiles(files)
  }, [])

  const memoizedSetFileList = useCallback((list: any[]) => {
    setFileList(list)
  }, [])

  const handleDelete = (uid: string) => {
    setFileList(prev => {
      if (prev) {
        return prev.filter(f => f.uid !== uid)
      } else {
        return []
      }
    })
    setUploadedFiles(prev => {
      if (prev) {
        return prev?.filter(f => f.id !== uid)
      } else {
        return null
      }
    })
  }

  const handleUpload = async (file: UploadFile) => {
    const newFile = await fileToBase64(file.originFileObj as File)
    let payload = {
      images: [newFile]
    }

    // console.log('payload', payload)

    try {
      const res = await uploadFile({
        body: payload
      })
        .unwrap()
        .then(data => {
          setUploadedFiles(prev => {
            if (prev) {
              return [...prev, {file: data.data[0], id: file.uid}]
            } else {
              return [{file: data.data[0], id: file.uid}]
            }
          })
          setFileList(prev => {
            return [...prev, file]
          })
        })
        .catch((err: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{err?.data?.message || 'Error uploading image!'}</>}
                  textColor="#FFF"
                  message={err?.data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to upload file!</>}
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

  const handleVideoUpload = async (file: UploadFile) => {
    const newFile = await fileToBase64(file.originFileObj as File)
    let payload = {
      videos: [newFile]
    }

    // console.log('payload', payload)

    try {
      const res = await uploadVideo({
        body: payload
      })
        .unwrap()
        .then(data => {
          setUploadedFiles(prev => {
            if (prev) {
              return [...prev, {file: data.data[0], id: file.uid}]
            } else {
              return [{file: data.data[0], id: file.uid}]
            }
          })
          setFileList(prev => {
            return [...prev, file]
          })
        })
        .catch((err: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{err?.data?.message || 'Error uploading image!'}</>}
                  textColor="#FFF"
                  message={err?.data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to upload file!</>}
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

  const handleFileDelete = async (uid: string) => {
    let payload = {
      paths: [`teddymart/${uploadedFiles?.find(f => f.id === uid)?.file}` || '']
    }

    // console.log('payload', payload)

    try {
      const res = await deleteFile({
        body: payload
      })
        .unwrap()
        .then(data => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{data?.message || 'File deleted successfully!'}</>}
                  textColor="#FFF"
                  message={data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          handleDelete(uid)
        })
        .catch((err: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{err?.data?.message || 'Error deleting file!'}</>}
                  textColor="#FFF"
                  message={err?.data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to delete file!</>}
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

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    directory: false,
    method: undefined,
    accept: 'image/*, video/mp4',
    onChange(info) {
      const {status} = info.file
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        if (info?.file?.type?.startsWith('video')) {
          const videoElement: any = videoRef.current

          if (videoElement) {
            videoElement.src = URL.createObjectURL(info?.file?.originFileObj as any)
            videoElement.onloadedmetadata = () => {
              if (videoElement.duration > 90) {
                showPlannerToast({
                  options: {
                    customToast: (
                      <CustomToast
                        altText={''}
                        title={<>Video too long!</>}
                        image={errorToastIcon}
                        textColor="#fff"
                        message={'Please upload a video that is less than 1 minute, 30 seconds long.'}
                        backgroundColor="#000"
                      />
                    )
                  },
                  message: 'Oops, Something went wrong'
                })
                return
              } else {
                // handleVideoUpload(info.file as UploadFile)
              }
            }
          }

          handleVideoUpload(info.file as UploadFile)
        } else {
          handleUpload(info.file as UploadFile)
        }
      } else if (status === 'error') {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>Failed to upload file!</>}
                image={errorToastIcon}
                textColor="#fff"
                message={'Please check and try again.'}
                backgroundColor="#000"
              />
            )
          },
          message: 'Oops, Something went wrong'
        })
      }
    },
    onDrop(e) {
      // console.log('Dropped files', e.dataTransfer.files)
    },
    onRemove(file) {
      handleDelete(file.uid)
    }
  }

  const handleAdvertCreation = async () => {
    let payload: any = {
      title: values.title,
      description: values.description,
      category_id: values.category_id,
      quantity: values.quantity,
      phone_number: values.phone_number,
      country_id: values.country_id,
      state: values.state,
      media: uploadedFiles?.map(f => f.file) || [],
      promote_plan_id: values.promote_plan_id,
      country_code: selectedLanguage?.key,
      return_url: `${window.location.origin}/customer?tab=adverts`,
      cancel_url: `${window.location.origin}/customer?tab=adverts`
    }

    if (selectedPrice === 0) {
      payload['price'] = values.price
      payload['price_on_request'] = false
    } else {
      payload['price_on_request'] = true
    }

    console.log('payload', payload)

    try {
      const res = await createAdvert({
        body: payload,
        currency: selectedLanguage?.value
      })
        .unwrap()
        .then(data => {
          // showPlannerToast({
          //   options: {
          //     customToast: (
          //       <CustomToast
          //         altText={''}
          //         title={<>{data?.message || 'Ad created successfully!'}</>}
          //         textColor="#FFF"
          //         message={data?.message}
          //         backgroundColor="#000"
          //       />
          //     )
          //   },
          //   message: 'message'
          // })

          // console.log('data', data)

          if (data?.data?.url) {
            setSuccessTitle(data?.data?.listing?.title)
            setProcessingPayment(true)
            setShowSuccess(true)
            window.open(data?.data?.url?.url as string, '_blank')
          } else {
            setSuccessTitle(data?.data?.listing?.title)
            setShowSuccess(true)
          }
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
  if (!isAuthenticated) return null // Prevent rendering until authentication is verified
  return (
    <div className="flex w-full flex-col">
      {/* <NewNavigation /> */}
      <div className="flex w-full items-center justify-center bg-[#F8F8F8] lg:py-[48px]">
        <div className="mx-auto w-full bg-white px-5 py-[46px] lg:max-w-[1094px] lg:rounded-[13px]">
          <Form
            className="mx-auto flex w-full max-w-[644px] flex-col items-center justify-center gap-[47px]"
            onFinish={handleSubmit}
            layout="vertical"
          >
            <TextComponent as="h1" className="text-[24px] font-bold leading-[31px] text-[#141414]">
              Post your Ad on myEKI! It is Quick and Easy.
            </TextComponent>

            <div className="flex w-full flex-col gap-[34px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                1. Ad Details
              </TextComponent>

              <div className="flex w-full flex-col gap-4">
                <TextInput
                  placeholder={`Ad Title*`}
                  onChange={e => {
                    if (e.target.value.length <= 75) {
                      handleChange(e)
                    }
                  }}
                  name={'title'}
                  type={'text'}
                  value={values.title}
                  errorMessage={
                    (error as any)?.data?.errors?.title
                      ? (error as any)?.data?.errors?.title.map((err: any) => err)
                      : ''
                  }
                />

                <SelectInput
                  placeholder="Category*"
                  data={allCategories}
                  value={values.category_id ? allCategories.find(cat => cat.value === values.category_id)?.value : null}
                  onChange={e => {
                    setFieldValue('category_id', e)
                  }}
                  disabled={false}
                  notFoundContent={'Category not found'}
                  errorMessage={(error as any)?.data?.errors?.category_id ? 'The category field is required' : ''}
                />

                <TextInput
                  placeholder={`Quantity`}
                  onChange={e => {
                    const value = e.target.value

                    if (value === '' || /^[0-9]+\.?([0-9]+)?$/.test(value)) {
                      handleChange(e)
                    }
                  }}
                  name={'quantity'}
                  type={'text'}
                  value={values.quantity}
                  errorMessage={
                    (error as any)?.data?.errors?.quantity
                      ? (error as any)?.data?.errors?.quantity.map((err: any) => err)
                      : ''
                  }
                />
                <TextAreaInput
                  placeholder={'Description*'}
                  maxLength={500}
                  onChange={handleChange}
                  name={'description'}
                  row={4}
                  value={values.description}
                  errorMessage={
                    (error as any)?.data?.errors?.description
                      ? (error as any)?.data?.errors?.description.map((err: any) => err)
                      : ''
                  }
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-[34px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                2. Price*
              </TextComponent>

              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col gap-[22px]">
                  {priceOptions.map((price, index) => (
                    <div key={index} className="flex w-full items-center gap-4">
                      <div
                        className="h-6 w-6 cursor-pointer rounded-full border-[2px] border-custom_grey p-1"
                        onClick={() => {
                          setSelectedPrice(index)
                        }}
                      >
                        {selectedPrice === index && <div className="h-full w-full rounded-full bg-custom_grey"></div>}
                      </div>
                      {index === 0 ? (
                        <div className="relative flex !w-full flex-1 flex-col">
                          <p className="absolute right-8 top-2 z-20 text-lg font-semibold text-[#6B7280]">
                            {selectedLanguage?.currencySign}
                          </p>

                          <CurrencyInput
                            id={'price'}
                            name={'price'}
                            placeholder={'Price*'}
                            className={`w-full rounded-[8px] border ${errors && errors.price ? 'border-red-600' : 'border-gray-300'} bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`}
                            value={values.price}
                            decimalsLimit={2}
                            onValueChange={(value: string | undefined, name?: string) => {
                              setFieldValue('price', value)
                            }}
                            disabled={false}
                            // required={required}
                            groupSeparator=","
                            maxLength={7}
                            max={7}
                          />
                          {(error as any)?.data?.errors?.price ? (
                            <TextComponent as="span" className="text-[13px] leading-[16px] text-red-600">
                              The price field is required
                            </TextComponent>
                          ) : (
                            ''
                          )}
                        </div>
                      ) : (
                        <TextComponent as="span" className="text-[13px] leading-[16px] text-[#6B7280]">
                          {price.label}
                        </TextComponent>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-[9px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                3. Media*
              </TextComponent>
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col gap-[9px]">
                  <TextComponent as="span" className="text-[14px] leading-[18px] text-[#6B7280]">
                    Include at least 1 to 3 photos for this Ad. The first photo will be used as the primary image. You
                    can rearrange the order of your photos by a simple drag and drop.
                  </TextComponent>
                  {(error as any)?.data?.errors?.media ? (
                    <TextComponent as="span" className="text-[13px] leading-[16px] text-red-600">
                      The media field is required
                    </TextComponent>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <NewDragDrop
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                fileList={fileList}
                setFileList={setFileList}
              />
              {/* <NewDragDrop
                uploadedFiles={uploadedFiles}
                setUploadedFiles={memoizedSetUploadedFiles}
                fileList={fileList}
                setFileList={memoizedSetFileList}
              /> */}
            </div>

            <div className="flex w-full flex-col gap-[34px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                4. Location*
              </TextComponent>

              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col gap-[22px]">
                  <CountryInput
                    placeholder={'Country'}
                    errorMessage={(error as any)?.data?.errors?.country_id ? 'The country field is required' : ''}
                    className={`border-[1px] ${errors.country_id ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
                    value={values?.country_id ?? undefined}
                    onChange={value => {
                      setFieldValue('country_id', value)
                    }}
                  />

                  <StateInput
                    className={`border-[1px] ${errors.state ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
                    errorMessage={
                      (error as any)?.data?.errors?.state
                        ? (error as any)?.data?.errors?.state.map((err: any) => err)
                        : ''
                    }
                    //   @ts-ignore
                    countryId={values.country_id}
                    value={values.state ?? undefined}
                    onChange={value => {
                      setFieldValue('state', value)
                    }}
                    placeholder="State/Province"
                    disabled={!values.country_id}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-[34px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                5. Contact Information*
              </TextComponent>

              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col gap-[22px]">
                  <PhoneInputWithCountry
                    errorMessage={
                      (error as any)?.data?.errors?.phone_number
                        ? (error as any)?.data?.errors?.phone_number.map((err: any) => err)
                        : ''
                    }
                    title=""
                    inputProps={{
                      name: 'phone_number',
                      id: 'phone_number'
                    }}
                    placeholder={''}
                    disabled={false}
                    fontSize={14}
                    color={'#3D3D3D'}
                    value={values.phone_number}
                    onChange={e => {
                      setFieldValue('phone_number', e)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-[34px]">
              <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
                6. Promote your Ad!*
              </TextComponent>

              <PlansContainer
                loading={advertPlansLoading}
                advertPlans={advertPlans?.data || []}
                selectedPlanId={values.promote_plan_id}
                onSelectPlan={id => setFieldValue('promote_plan_id', id)}
                errorMessage={(error as any)?.data?.errors?.promote_plan_id ? 'Please select a plan' : ''}
              />
            </div>

            <CustomButton
              onClick={() => {
                handleAdvertCreation()
              }}
              disabled={isCreateAdvertLoading}
              type="button"
              className="w-full rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
            >
              {isCreateAdvertLoading ? <Spinner /> : 'Post Ad'}
            </CustomButton>
          </Form>
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
    </div>
  )
}

PostAdPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout maxWidth={false}>{page}</CustomerLayout>
}

export default PostAdPage
