import React from 'react'
import {useAppSelector} from './reduxHooks'
import {CurrencyType} from '@/types/store'

interface Props {
  value?: number
  currency?: CurrencyType
}

const FormatNumberCurrency = ({value, currency}: Props) => {
  const {selectedLanguage} = useAppSelector(state => state.country)

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

    // add formatters for GBP, EUR and AUD
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

  const formatter = formatters[currency || selectedLanguage?.value || 'USD']

  return <>{formatter?.format(value ?? 0)}</>
}

export default FormatNumberCurrency
