import React, {useMemo} from 'react'

import {CurrencyType} from '@/types/store'
import { useAppSelector } from '@/hooks/reduxHooks'

interface Props {
  value?: number
  currency?: CurrencyType
}

// Define formatters outside of the component to avoid recreating them on every render
const CURRENCY_FORMATTERS = {
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

const FormatNumberCurrency = React.memo(({value = 0, currency}: Props) => {
  const {selectedLanguage} = useAppSelector(state => state.country)

  // Get the appropriate formatter based on the currency prop or selectedLanguage
  const formatter = useMemo(() => {
    const currencyKey = currency || selectedLanguage?.value || 'USD'
    return CURRENCY_FORMATTERS[currencyKey] || CURRENCY_FORMATTERS.USD
  }, [currency, selectedLanguage?.value])

  // Format the value - use formatted value directly to avoid unnecessary re-renders
  const formattedValue = formatter.format(value)

  return <>{formattedValue}</>
})

FormatNumberCurrency.displayName = 'FormatNumberCurrency'

export default FormatNumberCurrency
