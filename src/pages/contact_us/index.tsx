import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import React from 'react'
import Image from 'next/image'
import Spinner from '@/components/SharedUI/Spinner'
import useLogout from '@/components/Profile/hooks/useLogout'
import {useRouter} from 'next/router'
import {Badge, Button, Form} from 'antd'
import {Icon} from '@iconify/react'
import {useGetAllClipsQuery} from '@/services/clips'
import Link from 'next/link'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useFormik} from 'formik'
import * as yup from 'yup'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'

interface IContactProps {
  full_name: string
  email: string
  message: string
}

const initialValues: IContactProps = {
  full_name: '',
  email: '',
  message: ''
}

const TermsofUse = () => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const has_store = isAuthenticatedUser?.has_store

  const isAuth = isAuthenticatedToken
  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()
  const router = useRouter()

  const {data} = useGetAllClipsQuery({})

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<IContactProps>({
      initialValues: initialValues,
      validationSchema: yup.object().shape({
        full_name: yup.string().required('required'),
        email: yup.string().required('required'),
        message: yup.string().required('required')
      }),
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        console.log(val)
      }
    })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#F4F4F4]">
      {isDesktop && (
        <div className="fixed top-0 z-50 flex h-[78px] w-full items-center bg-[#222222]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <Link href="/" className="!border-none !p-0">
              <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={80} height={76} />
            </Link>

            <div className="flex items-center gap-3">
              {isAuth ? (
                <div className="flex gap-4">
                  {has_store && (
                    <CustomButton
                      onClick={() => {
                        router.push('/vendor')
                      }}
                      type="button"
                      className="w-[180px] whitespace-nowrap rounded-[10px] !border-[1px] !border-[#000000] bg-white px-1 py-2"
                    >
                      Switch to Vendor
                    </CustomButton>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        logoutUserHandler()
                      }}
                      disabled={isLoadingLogout}
                      type="button"
                      className="bg-transparent text-sm font-semibold text-white"
                    >
                      <span>Logout</span>
                    </button>
                    <span className="">{isLoadingLogout ? <Spinner className="h-2 w-2" /> : null}</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <CustomButton
                    onClick={() => {
                      router.push('auth/sign-up')
                    }}
                    type="button"
                    className="h-[44px] w-[129px] rounded-[10px] bg-white px-1 py-2"
                  >
                    Sign Up
                  </CustomButton>
                  <CustomButton
                    onClick={() => {
                      router.push('auth/login')
                    }}
                    type="button"
                    className="w-[100px] rounded-[10px] border-[1px] border-white bg-[#222222] px-2 py-1 text-white"
                  >
                    Login
                  </CustomButton>
                </div>
              )}

              <Button
                onClick={() => {
                  router.push('/clips')
                }}
                type="text"
                className="flex-center"
                size="large"
                icon={
                  <Badge
                    count={data?.data?.total_product_count}
                    style={{backgroundColor: '#FFF', color: '#000', fontSize: '16px', fontWeight: 600}}
                  >
                    <Icon icon={'mdi-light:cart'} className="text-[28px] text-white" />
                  </Badge>
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-[140px] flex h-full w-full items-center justify-center md:px-40">
        <div className="flex h-[510px] w-[80%] gap-4 font-medium text-black">
          <Image src={'assets/contact_img.jpg'} className="hidden xl:block" alt={''} width={800} height={700} />
          <div className="w-full rounded-md border-[1.5px] border-gray-200 p-6">
            <TextComponent as="p" className="text-center text-[24px] font-semibold leading-[32px] text-[#141414]">
              We’re Here to Help!{' '}
            </TextComponent>
            <TextComponent
              as="p"
              className="mt-[8px] text-center text-[14px] font-normal leading-[21px] text-[#808080]"
            >
              Have questions, feedback, or need support? We’d love to hear from you! Please fill out the form below, and
              our team will get back to you as soon as possible.{' '}
            </TextComponent>

            <Form size="large" onFinish={handleSubmit} className="mt-[10px]" layout="vertical" id="">
              <div className={`flex w-full flex-col gap-2`}>
                <TextInput
                  errorMessage={errors.full_name ? errors.full_name : ''}
                  value={values.full_name ?? ''}
                  placeholder="Full Name"
                  onChange={handleChange}
                  name={'full_name'}
                  type={'text'}
                  className="!bg-transparent"
                />
                <TextInput
                  errorMessage={errors.email ? errors.email : ''}
                  value={values.full_name ?? ''}
                  placeholder="Email"
                  onChange={handleChange}
                  name={'email'}
                  type={'email'}
                  className="!bg-transparent"
                />
                <TextAreaInput
                  className="!bg-transparent"
                  title={''}
                  //   maxLength={500}
                  onChange={handleChange}
                  name={'message'}
                  row={4}
                  value={values.message}
                  placeholder={'Message'}
                  errorMessage={errors && errors.message ? errors.message : ''}
                />
              </div>
              <CustomButton
                type={'submit'}
                className="mt-[20px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                {/* {isLoading || createStoreIsLoading ? <Spinner /> : 'Continue'} */}
                Send Message
              </CustomButton>
            </Form>
          </div>
        </div>
      </div>

      {isDesktop && (
        <div className="mt-[50px] flex h-[78px] w-full bg-[#222222]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <Link href="/" className="!border-none !p-0">
              <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={80} height={76} />{' '}
            </Link>
            <div className="flex items-center gap-8">
              <button
                onClick={() => {
                  router.push('/contact_us')
                }}
                // disabled={isLoadingLogout}
                type="button"
                className="bg-transparent text-sm font-semibold text-white underline"
              >
                <span>Contact Us</span>
              </button>

              <button
                onClick={() => {
                  router.push('/privacy_policy')
                }}
                // disabled={isLoadingLogout}
                type="button"
                className="bg-transparent text-sm font-semibold text-white underline"
              >
                <span>Privacy Policy</span>
              </button>
              <button
                onClick={() => {
                  router.push('/terms_of_use')
                }}
                // disabled={isLoadingLogout}
                type="button"
                className="bg-transparent text-sm font-semibold text-white underline"
              >
                <span>Terms of Service</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TermsofUse
