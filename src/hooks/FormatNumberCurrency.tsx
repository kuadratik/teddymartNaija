import {CurrencyType} from '@/types/store'
import {useAppSelector} from './reduxHooks'

// Add a function to get only the currency symbol
export const getOnlyCurrencyFormatter = (currency?: CurrencyType) => {
  const currencySymbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    CAD: '$',
    GBP: '£',
    EUR: '€',
    AUD: '$'
  }

  return currencySymbols[currency || 'USD'] || '$'
}

// New function that takes only currency parameter
export const getNumberFormatter = (currency: CurrencyType) => {
  const formatters = {
    NGN: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    }),
    CAD: new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    }),
    GBP: new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    }),
    EUR: new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    }),
    AUD: new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    })
  }

  return formatters[currency]
}

interface Props {
  value?: number
  currency?: CurrencyType
}

const FormatNumberCurrency = ({value, currency}: Props) => {
  const {selectedLanguage} = useAppSelector(state => state.country)

  const formatter = currency ? getNumberFormatter(currency) : getNumberFormatter(selectedLanguage?.value || 'USD')

  return <>{formatter?.format(value ?? 0)}</>
}

export default FormatNumberCurrency
