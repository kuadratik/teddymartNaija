import ProgressBar from '@/components/SharedUI/ProgressBar'
import TextComponent from '@/components/SharedUI/TextComponent'
import OnBoardFailed from '@/components/Store/components/PaymentStatus/OnBoardFailed'
import OnboardPending from '@/components/Store/components/PaymentStatus/OnboardPending'
import OnboardSuccess from '@/components/Store/components/PaymentStatus/OnboardSuccess'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'

interface IProps {
  title_header?: boolean
  verificationStatus?: 'pending' | 'success' | 'failed'
}
const ActivatePayment = ({title_header, verificationStatus}: IProps) => {
  const {selectedLanguage} = useAppSelector(state => state.country)

  // Determine payment gateway based on currency
  const paymentGateway = selectedLanguage.value === 'NGN' ? 'paystack' : 'stripe'

  // Determine admin fee based on currency
  const adminFees: Record<string, {amount: number; display: string}> = {
    NGN: {amount: 5000, display: '₦ 5000'},
    USD: {amount: 5, display: '$ 5'},
    CAD: {amount: 5, display: '$ 5'}
  }

  const adminFee = adminFees[selectedLanguage.value] || adminFees.USD

  // Get country name from the form values
  const getCountryName = () => {
    return selectedLanguage.name
  }

  // Get country flag
  const getCountryFlag = () => {
    const flags: Record<string, string> = {
      Nigeria: '🇳🇬',
      Canada: '🇨🇦',
      'United States': '🇺🇸'
    }
    return flags[selectedLanguage.name] || '🌍'
  }

  return (
    <div className="mb-[80px]">
      {title_header && (
        <div className="mt-[50px]">
          <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
            Complete Your Store Setup
          </TextComponent>
          <TextComponent as="p" className="mt-2 text-[14px] leading-[20px] text-[#6B7280]">
            Before you can start selling, you'll need to pay a one-time admin fee to activate your store on myEKI. The
            fee and payment method depend on your store location. Once payment is successful, your store will be
            automatically approved and you'll gain access to your dashboard.
          </TextComponent>
          <div className="mt-6">
            <ProgressBar currentStep={3} totalSteps={3} />
          </div>
        </div>
      )}
      <div className={`${title_header ? 'mt-[32px]' : ''}`}>
        {verificationStatus && (
          <div className="mx-auto mb-6 flex w-full justify-center px-6 lg:w-[400px]">
            {verificationStatus === 'pending' && <OnboardPending />}
            {verificationStatus === 'success' && <OnboardSuccess />}
            {verificationStatus === 'failed' && <OnBoardFailed />}
          </div>
        )}
        <div className="rounded-[12px] bg-[#F9FAFB] p-6">
          {/* Admin Fee */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <TextComponent as="span" className="text-[16px] font-medium text-[#141414]">
              Admin Fee
            </TextComponent>
            <div className="flex items-center gap-2">
              <TextComponent as="span" className="text-[18px] font-bold text-[#10B981]">
                {adminFee.display}
              </TextComponent>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <TextComponent as="span" className="text-[16px] font-medium text-[#141414]">
              Payment Method
            </TextComponent>
            <div className="flex items-center gap-2">
              {paymentGateway === 'stripe' ? (
                <div className="flex items-center gap-1">
                  <Icon icon="logos:stripe" className="text-[24px]" />
                  <span className="text-[14px] font-medium text-[#635BFF]">stripe</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Icon icon="simple-icons:paystack" className="text-[24px] text-[#00C3F7]" />
                  <span className="text-[14px] font-medium text-[#00C3F7]">PAYSTACK</span>
                </div>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="flex items-center justify-between pt-4">
            <TextComponent as="span" className="text-[16px] font-medium text-[#141414]">
              Country
            </TextComponent>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">{getCountryFlag()}</span>
                <TextComponent as="span" className="text-[14px] font-medium text-[#141414]">
                  {getCountryName()}
                </TextComponent>
              </div>
            </div>
          </div>
        </div>

        {/* Make Payment Button */}
      </div>
    </div>
  )
}

export default ActivatePayment
