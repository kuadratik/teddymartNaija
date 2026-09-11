import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import {languageList} from '@/components/SharedUI/CountrySelect/CountrySelectView'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {setSelectedLanguage, setSelectionOccurred} from '@/redux/apiSlice/countrySlice'
import {useMagicLinkMutation} from '@/services/auth'
import {useGetAllStoreListingQuery} from '@/services/store'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import * as Yup from 'yup'

const setCookie = (name: string, value: string, days: number) => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + days)
  const encodedValue = encodeURIComponent(value)
  document.cookie = `${name}=${encodedValue};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict;Secure`
}
const MagicLink = () => {
  const [formValues, setFormValues] = useState({
    country: '',
    store: ''
  })
  const [formErrors, setFormErrors] = useState({
    country: '',
    store: ''
  })
  const {selectedLanguage} = useAppSelector(state => state.country)
  console.log('🚀 ~ MagicLink ~ selectedLanguage:', selectedLanguage)
  const {type} = useSelector((state: any) => state.vendor)
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')

  // Validation schema
  const validationSchema = Yup.object().shape({
    country: Yup.string().required('Country is required'),
    store: Yup.string().required('Store is required')
  })

  const {data, isLoading, refetch} = useGetAllStoreListingQuery({
    listType: type,
    currency: selectedLanguage.value,
    search: search,
    sortType: 'alphanumeric'
  })
  const [
    magicLink,
    {isLoading: magicLinkLoading, isSuccess: magicLinkSuccess, isError: magicLinkError, error: magicLinkErrorResponse}
  ] = useMagicLinkMutation()
  console.log('🚀 ~ MagicLink ~ magicLinkErrorResponse:', magicLinkErrorResponse)
  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value
    }))

    if (name === 'country') {
      const selectedCountry = languageList.find(country => country.value === value)
      if (selectedCountry) {
        handleCountrySelect(selectedCountry)
      }
    }
  }
  useEffect(() => {
    const selectedCountry = languageList.find(country => country.value === selectedLanguage.value)
    if (selectedCountry) {
      setFormValues(prev => ({
        ...prev,
        country: selectedCountry.value
      }))
    }
  }, [selectedLanguage?.value])

  const handleCountrySelect = (country: (typeof languageList)[0]) => {
    dispatch(setSelectedLanguage(country as any))
    dispatch(setSelectionOccurred())
    setCookie('selectedLanguage', country.value, 30)
    // router.push('/')
  }

  const handleSearchSelect = (value: string) => {
    setSearch(value)
    refetch()
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // Validate the form data
      await validationSchema.validate(formValues, {abortEarly: false})

      // Reset form errors if validation passes
      setFormErrors({
        country: '',
        store: ''
      })

      // Submit form if validation passes
      const response = await magicLink({
        store: formValues.store
      }).unwrap()

      setTimeout(() => {
        // Pass the selected store slug in the redirect URL
        const redirectUrl = new URL(response?.data, window.location.origin)
        redirectUrl.searchParams.append('store', formValues.store)
        router.push(redirectUrl.toString())
      }, 0)
    } catch (error: any) {
      // Handle Yup validation errors
      if (error instanceof Yup.ValidationError) {
        const newErrors = {country: '', store: ''}
        error.inner.forEach(validationError => {
          if (validationError.path) {
            newErrors[validationError.path as keyof typeof newErrors] = validationError.message
          }
        })
        setFormErrors(newErrors)
        return
      }

      console.error('Error during magic Link:', error)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={error?.data?.message || <>An Error occurred!</>}
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

  const countryOptions = languageList.map(country => ({
    value: country.value,
    label: country.name
  }))

  const storeOptions =
    data?.data?.data.map((store: any) => ({
      value: store.slug,
      label: store.name
    })) || []

  return (
    <React.Fragment>
      <SEOHead
        title={`AfricanDiasporaMart | Magic Link`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout className="h-full px-2">
        <div className="flex h-full w-full flex-col items-center justify-center lg:my-6">
          <div className="flex w-full items-center justify-center">
            <form
              className="flex w-full max-w-sm flex-col gap-y-5 rounded border bg-white px-8 py-10 shadow-md *:mx-auto"
              onSubmit={e => {
                e.preventDefault()
                handleSubmit(e)
              }}
            >
              <div className="w-full">
                <SelectInput
                  data={countryOptions}
                  placeholder="Select Store Country"
                  value={formValues.country || undefined}
                  onChange={handleSelectChange('country')}
                  className="w-full"
                  errorMessage={formErrors.country}
                />
              </div>
              <div className="w-full">
                <SelectInput
                  data={storeOptions}
                  placeholder="Select Store"
                  handleSearchSelect={handleSearchSelect}
                  value={formValues.store || undefined}
                  onChange={handleSelectChange('store')}
                  className="w-full"
                  errorMessage={
                    formErrors.store || (magicLinkErrorResponse as any)?.data.errors.store.map((erro: any) => erro)
                  }
                />
              </div>
              <CustomButton disabled={magicLinkLoading} type="submit" className="w-full bg-black py-2.5 text-white">
                {magicLinkLoading ? <Spinner /> : 'Submit'}
              </CustomButton>
            </form>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}
MagicLink.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}
export default MagicLink
