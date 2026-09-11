import Image from 'next/image'

const OnBoardFailed = () => {
  return (
    <div>
      <Image
        src="/assets/payment-status/payment-failed.svg"
        alt="Failed"
        width={80}
        height={80}
        className="mx-auto mb-4"
      />
      <h2 className="mb-2 text-center text-2xl font-semibold">Payment Failed</h2>
      <p className="text-center text-gray-600">Payment unsuccessful. Please try again.</p>
    </div>
  )
}

export default OnBoardFailed
