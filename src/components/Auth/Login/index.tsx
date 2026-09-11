import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Form} from 'antd'
import {useFormik} from 'formik'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {VendorLoginType} from './utils'
import {loginValidationSchema} from './utils/schema'
import useLoginQuery from './hooks/useLogin'
import Spinner from '@/components/SharedUI/Spinner'

const initialValues = {
  email: '',
  password: ''
}

const LoginComponent = () => {
  const {isLoading, handleLoginUser} = useLoginQuery()

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} =
    useFormik<VendorLoginType>({
      initialValues: initialValues,
      validationSchema: loginValidationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        handleLoginUser({payload: val, setFieldError})
      }
    })

  const router = useRouter()

  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <LogoHeader
            onClick={() => {
              router.back()
            }}
          />
        </div>
        <div className="my-[34px] flex flex-col items-center justify-center gap-2">
          <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
            Welcome Back! 👋{' '}
          </TextComponent>
        </div>
        <Form onFinish={handleSubmit} layout="vertical" size={'large'}>
          <div className="mb-[24px] flex flex-col gap-5">
            {' '}
            <TextInput
              placeholder="Email"
              errorMessage={errors.email ? errors.email : ''}
              onChange={handleChange}
              name={'email'}
              value={values.email}
              type={'email'}
            />
            <TextInput
              errorMessage={errors.password ? errors.password : ''}
              iconClick={() => {
                setShowConfirm(prev => !prev)
              }}
              iconName={!showConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'}
              placeholder="Password"
              onChange={handleChange}
              type={showConfirm ? 'text' : 'password'}
              name={'password'}
              value={values.password}
            />
          </div>

          <CustomButton
            disabled={isLoading}
            type="submit"
            className="mt-[24px] w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
          >
            {isLoading ? <Spinner /> : 'Login'}
          </CustomButton>
        </Form>

        <div className="mt-[24px] flex items-center justify-center gap-3">
          <div className="text-[14px] font-medium">
            <span className="font-medium text-[#6B7280]">I don't have an account? </span>
            <Link href="/auth/sign-up" className="!border-none !p-0 text-sm text-[#000] underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginComponent
