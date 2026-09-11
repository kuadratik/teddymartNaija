import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppSelector} from '@/hooks/reduxHooks'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useMagicLoginMutation} from '@/services/auth'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useLocalStorage} from 'react-use'
import * as yup from 'yup'

const MagicLogin = () => {
  // Validation schema
  const validationSchema = yup.object({
    token: yup.string().required('Token is required')
  })

  const [formValues, setFormValues] = useState({
    token: ''
  })
  const [validationErrors, setValidationErrors] = useState<{token?: string}>({})
  const dispatch = useDispatch()

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const [
    magicLogin,
    {
      isLoading: magicLoginLoading,
      isSuccess: magicLoginSuccess,
      isError: magicLoginError,
      error: magicLoginErrorResponse
    }
  ] = useMagicLoginMutation()
  const router = useRouter()
  const {token: tokenQuery, redirect, store: storeSlug} = router.query

  // Prefill the token input when component mounts or tokenQuery changes
  useEffect(() => {
    if (tokenQuery && typeof tokenQuery === 'string') {
      setFormValues(prev => ({...prev, token: tokenQuery}))
    }
  }, [tokenQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value
    }))
    // Clear validation errors when user types
    setValidationErrors({})
  }

  const validateForm = async () => {
    try {
      await validationSchema.validate(formValues, {abortEarly: false})
      return true
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: {token?: string} = {}
        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path as 'token'] = err.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = await validateForm()
    if (!isValid) return

    try {
      const response = await magicLogin({
        token: formValues.token
      }).unwrap()
      const {token, user} = response?.data
      dispatch(setCredentials({token: token, user: user}))

      // Set active store based on the store slug from magic link if available
      if (storeSlug && typeof storeSlug === 'string') {
        const selectedStore = user?.store.find((item: {slug: string}) => item.slug === storeSlug)
        if (selectedStore) {
          dispatch(setActiveStore({activeUser: selectedStore}))
        } else if (isActiveUser) {
          const activeStore = user?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
          if (activeStore.length) {
            dispatch(setActiveStore({activeUser: activeStore[0]}))
          } else {
            dispatch(setActiveStore({activeUser: user?.store[0]}))
          }
        } else {
          dispatch(setActiveStore({activeUser: user?.store[0]}))
        }
      } else if (isActiveUser) {
        const activeStore = user?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          dispatch(setActiveStore({activeUser: activeStore[0]}))
        } else {
          dispatch(setActiveStore({activeUser: user?.store[0]}))
        }
      } else {
        dispatch(setActiveStore({activeUser: user?.store[0]}))
      }

      // Optionally, update local storage
      setToken(token)
      setUser(user as any)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Login Successful! Redirecting to your dashboard...'}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'Please try again'
      })
      setTimeout(() => {
        router.push((redirect as string) || '/vendor/dashboard')
      }, 0)
    } catch (error: any) {
      console.error('Error during magic login:', error)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={error?.data.message || <>An Error occurred!</>}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'Please try again'
      })
    }
  }

  return (
    <React.Fragment>
      <SEOHead
        title={`AfricanDiasporaMart | Magic Login`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="h-full px-2">
        <div className="flex h-full w-full flex-col items-center justify-center lg:my-6">
          <div className="flex w-full items-center justify-center">
            <form
              className="w-full max-w-sm rounded border bg-white px-8 py-10 shadow-md *:mx-auto"
              onSubmit={handleSubmit}
            >
              <TextInput
                type="text"
                name="token"
                placeholder="Token"
                className="w-full"
                onChange={handleChange}
                value={formValues.token}
                errorMessage={
                  validationErrors.token || (magicLoginErrorResponse as any)?.data.errors.token.map((erro: any) => erro)
                }
                required
              />
              <CustomButton
                disabled={magicLoginLoading}
                type="submit"
                className="mt-5 w-full bg-black py-2.5 text-white"
              >
                {magicLoginLoading ? <Spinner /> : 'Login'}
              </CustomButton>
            </form>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

MagicLogin.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default MagicLogin
