import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import useContactUsQuery from '@/hooks/useContactUs'
import {Form} from 'antd'
import {useFormik} from 'formik'
import Image from 'next/image'
import React from 'react'
import * as yup from 'yup'

interface IContactProps {
  fullname: string
  email: string
  message: string
}

const initialValues: IContactProps = {
  fullname: '',
  email: '',
  message: ''
}

const ContactUsPage = () => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const {contactUsHandler, isLoading} = useContactUsQuery()

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<IContactProps>({
      initialValues: initialValues,
      validationSchema: yup.object().shape({
        fullname: yup.string().required('required'),
        email: yup.string().required('required'),
        message: yup.string().required('required')
      }),
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        contactUsHandler(val, resetForm)
      }
    })

  return (
    <>
      <SEOHead
        title={`myEKI | Contact Us`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="mt-10 flex h-full w-full items-center justify-center lg:mt-20">
          <div className="flex h-[510px] gap-4 font-medium text-black lg:w-[80%]">
            <Image
              src={'assets/contact_img.jpg'}
              className="hidden rounded xl:block"
              alt={''}
              width={800}
              height={700}
            />
            <div className="w-full rounded-md border-gray-200 lg:border-[1.5px] lg:p-6">
              <TextComponent as="p" className="text-center text-[24px] font-semibold leading-[32px] text-[#141414]">
                We’re Here to Help!{' '}
              </TextComponent>
              <TextComponent
                as="p"
                className="mt-[8px] text-center text-[14px] font-normal leading-[21px] text-[#808080]"
              >
                Have questions, feedback, or need support? We’d love to hear from you! Please fill out the form below,
                and our team will get back to you as soon as possible.{' '}
              </TextComponent>

              <Form size="large" onFinish={handleSubmit} className="mt-[10px]" layout="vertical" id="">
                <div className={`flex w-full flex-col gap-2`}>
                  <TextInput
                    errorMessage={errors.fullname ? errors.fullname : ''}
                    value={values.fullname ?? ''}
                    placeholder="Full Name"
                    onChange={handleChange}
                    name={'fullname'}
                    type={'text'}
                    className="!bg-transparent"
                  />
                  <TextInput
                    errorMessage={errors.email ? errors.email : ''}
                    value={values.email ?? ''}
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
                  {isLoading ? <Spinner /> : 'Send Message'}
                </CustomButton>
              </Form>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

ContactUsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default ContactUsPage
