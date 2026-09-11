import CustomerLayout from '@/components/Layout/Customerlayout'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {CategoryListType} from '@/types/types'
import {postAdValidationSchema} from '@/utils/schemas'
import type {UploadFile, UploadProps} from 'antd'
import {RadioChangeEvent, Upload} from 'antd'
import {useFormik} from 'formik'
import React, {useCallback, useEffect, useRef, useState} from 'react'
// import {typeOptions} from '../vendor'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
// import FileThumbnail from '@/components/Advert/FileThumbnail'
import PostAdForm from '@/components/Customer/Advert/PostAdForm'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import TitleText from '@/components/Vendor/TitleText'
import {fileToBase64} from '@/components/Vendor/utils'
import useWindowResize from '@/hooks/useWindowResize'
import {useCreateAdvertMutation, useGetAdvertPlansQuery} from '@/services/advertisement'
import {
  useDeleteImageFileMutation,
  useUploadImageFileMutation,
  useUploadVideoFileMutation
} from '@/services/general/general'
import {isIOS} from '@/utils/fx'
import {useRouter} from 'next/router'
import {useLocalStorage} from 'react-use'
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
  const [showPopupBlockedModal, setShowPopupBlockedModal] = useState(false)
  const {width} = useWindowResize()
  const [popupUrl, setPopupUrl] = useState<string | null>(null)
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
  const [adStatus, setAdStatus] = useLocalStorage<string | null>('adStatus', null)
  console.log('🚀 ~ PostAdPage ~ adStatus:', adStatus)
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
      is_available: values.is_available,
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
            advertPlans={advertPlans}
            advertPlansLoading={advertPlansLoading}
            allCategories={allCategories}
            error={error}
            isEdit={false}
            errors={errors}
            fileList={fileList}
            handleAdvertCreation={handleAdvertCreation}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            payment={null}
            isCreateAdvertLoading={isCreateAdvertLoading}
            priceOptions={priceOptions}
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

PostAdPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout maxWidth={false}>{page}</CustomerLayout>
}

export default PostAdPage
