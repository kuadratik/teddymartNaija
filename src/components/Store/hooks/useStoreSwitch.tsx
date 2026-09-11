import {useAppDispatch} from '@/hooks/reduxHooks'
import {setActiveStore} from '@/redux/apiSlice/authSlice'
import {setSelectedLanguage, setSelectionOccurred} from '@/redux/apiSlice/countrySlice'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useRouter} from 'next/router'
import {useState} from 'react'

export const useStoreSwitch = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [dropDown, setDropDown] = useState(false)

  const handleStoreSwitch = (value: any) => {
    console.log('value123333', value)
    dispatch(setType({type: value?.type === 'product' ? 'product' : 'service'}))
    dispatch(setActiveStore({activeUser: value}))

    // Update the currency based on the store's currency and country
    if (value?.currency && value?.country) {
      const currencyMapping: Record<
        string,
        {key: string; value: 'USD' | 'NGN' | 'CAD'; currencySign: string; name: 'United States' | 'Nigeria' | 'Canada'}
      > = {
        USD: {key: 'us', value: 'USD', currencySign: '$', name: 'United States'},
        NGN: {key: 'ng', value: 'NGN', currencySign: '₦', name: 'Nigeria'},
        CAD: {key: 'ca', value: 'CAD', currencySign: 'C$', name: 'Canada'}
      }

      const selectedCurrency = currencyMapping[value.currency]
      if (selectedCurrency) {
        dispatch(setSelectedLanguage(selectedCurrency))
        dispatch(setSelectionOccurred())
      }
    }

    setDropDown(false)
    // router.push('/vendor/dashboard')
    if (value.active === 0 && value?.payment_status !== 'success') {
      router.push(`/mek/onboarding?store_id=${value.id}`)
      return
    } else if (value.listings_count === 0) {
      router.push('/vendor/products?tab=all')
    } else {
      router.push('/vendor/dashboard')
    }
  }

  return {handleStoreSwitch, dropDown, setDropDown}
}
