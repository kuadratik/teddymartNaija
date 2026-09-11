import Spinner from '@/components/SharedUI/Spinner'

const OnboardPending = () => {
  return (
    <div>
      <Spinner className="mx-auto my-4 h-[56px] w-[56px] border-b-2 border-b-black" />
      <h2 className="mb-2 text-center text-2xl font-semibold">Pending Payment</h2>
      <p className="text-center text-gray-600">Processing your payment, please wait…</p>
    </div>
  )
}

export default OnboardPending
