import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import TextComponent from '@/components/SharedUI/TextComponent'
import SEOHead from '@/components/SharedUI/SEOHead'
import {Form} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import * as Yup from 'yup'
import Spinner from '@/components/SharedUI/Spinner'
import Image from 'next/image'
import VendorLogo from '@/components/Auth/Products/components/Logo'
import {useSuperAdminLoginMutation} from '@/services/auth'

const initialValues = {
  email: '',
  password: ''
}

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email is required'),
  password: Yup.string().required('Password is required')
})

const SuperAdminLoginPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [superAdminLogin] = useSuperAdminLoginMutation()

  const {values, handleSubmit, handleChange} = useFormik({
    initialValues: initialValues,
    validationSchema: loginValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async val => {
      setIsLoading(true)
      setAuthError('')
      try {
        const response = await superAdminLogin(val).unwrap()
        if (response.success) {
          router.replace('/super-admin/dashboard')
        } else {
          setAuthError(response.message || 'Login failed')
        }
      } catch (error: any) {
        console.error('Login error:', error)
        setAuthError(error?.data?.message || 'Login failed')
      } finally {
        setIsLoading(false)
      }
    }
  })

  return (
    <>
      <SEOHead
        title="Admin Login | AfricanDiasporaMart"
        description="Secure login portal for AfricanDiasporaMart platform administrators. Access the admin dashboard to manage brands, users, and platform operations."
      />
      <div>
        {/* Logo Header */}
        <div className="fixed left-1/2 top-0 z-50 w-full max-w-screen-xl -translate-x-1/2 transform rounded-full border-b border-gray-100 bg-white px-4 py-3 lg:px-5 2xl:max-w-screen-2xl">
          <div className="flex items-center gap-1 p-4">
            <VendorLogo />
            <div className="flex flex-col">
              <p className="text-[19px] font-bold leading-tight">AfricanDiasporaMart</p>
              <p className="text-[10px] font-normal text-gray-500">Admin</p>
            </div>
          </div>
        </div>
        <div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
          <div className="mx-auto w-full max-w-[490px]">
            {/* Login Form */}
            <div className="flex flex-col">
              <div className="mb-2 text-center">
                <TextComponent as="h1" className="text-[32px] font-semibold leading-[40px] text-[#141414]">
                  Login
                </TextComponent>
              </div>
              <div className="mb-8 text-center">
                <TextComponent as="p" className="text-[14px] font-normal leading-[20px] text-gray-500">
                  Please enter your login details to have access to your account
                </TextComponent>
              </div>

              <Form onFinish={handleSubmit} layout="vertical" size={'large'}>
                <div className="mb-6 flex flex-col gap-5">
                  <TextInput
                    placeholder="Email"
                    onChange={handleChange}
                    name={'email'}
                    value={values.email}
                    type={'email'}
                    className={`rounded-full ${authError ? 'border-red-600' : ''}`}
                  />
                  <TextInput
                    iconClick={() => {
                      setShowPassword(prev => !prev)
                    }}
                    iconName={!showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'}
                    placeholder="Password"
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    name={'password'}
                    value={values.password}
                    className={`rounded-full ${authError ? 'border-red-600' : ''}`}
                  />
                </div>

                {authError && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-center">
                    <TextComponent as="p" className="text-sm font-medium text-red-600">
                      {authError}
                    </TextComponent>
                  </div>
                )}

                <CustomButton
                  disabled={isLoading}
                  type="submit"
                  className="mt-6 w-full rounded-full bg-[#000000] px-1 py-4 text-[16px] font-medium text-white hover:bg-gray-800"
                >
                  {isLoading ? <Spinner /> : 'Login'}
                </CustomButton>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SuperAdminLoginPage
