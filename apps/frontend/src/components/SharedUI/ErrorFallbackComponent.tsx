import Image from 'next/image'
import {useRouter} from 'next/router'
import CustomButton from './Buttons/Button'

type ErrorFallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({error, resetErrorBoundary}) => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div role="alert" className="flex min-h-screen flex-col items-center justify-center">
      <Image src="/assets/errorboundary.svg" alt="error" priority width={500} height={500} />
      <p className="pb-2">
        <strong>Something went wrong.</strong>
      </p>
      <div className="">
        <CustomButton onClick={handleGoBack} className="w-full bg-primary-40 py-3 text-white hover:opacity-60">
          Go Back
        </CustomButton>
      </div>
    </div>
  )
}

export default ErrorFallback
