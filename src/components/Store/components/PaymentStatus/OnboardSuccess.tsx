import Image from 'next/image'
import React from 'react'

const OnboardSuccess = () => {
  return (
    <div>
      <Image
        src="/assets/payment-status/success-pay.svg"
        alt="Success"
        width={80}
        height={80}
        className="mx-auto mb-4"
      />
      <h2 className="text-center text-2xl font-semibold mb-2">Payment Successful!</h2>
      <p className="text-center text-gray-600">
        Your payment has been processed successfully. You can now proceed to set up your store.
      </p>
    </div>
  )
}

export default OnboardSuccess