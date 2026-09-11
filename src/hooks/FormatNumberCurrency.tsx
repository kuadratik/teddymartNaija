import React from 'react'

interface Props {
  value?: number
}

const FormatNumberCurrency = ({value}: Props) => {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD', // Set the currency to Canadian Dollars
    currencyDisplay: 'symbol', // Show only the dollar sign ($)
    minimumFractionDigits: 2
  })

  return <>{formatter.format(value ?? 0)}</>
}

export default FormatNumberCurrency
