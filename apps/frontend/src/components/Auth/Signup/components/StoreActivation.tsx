import CustomButton from '@/components/SharedUI/Buttons/Button'
import ProgressBar from '@/components/SharedUI/ProgressBar'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
import {VendorOnboardingProps} from '../utils'
import { ISelectedPaymentCountry } from '@/components/Store/components/NewStore'
import { useLocalStorage } from 'react-use'

const StoreActivation = (props: VendorOnboardingProps) => {
  const {title_header, values, navigateToPreviousForm, createStoreIsLoading} = props
  const {selectedLanguage} = useAppSelector(state => state.country)
  const [selectedPaymentCountry, setSelectedPaymentCountry] = useLocalStorage<ISelectedPaymentCountry | null>(
    'selectedCountryOnboardingPayment',
    null
  )
  console.log("🚀 ~ StoreActivation ~ selectedPaymentCountry:", selectedPaymentCountry)

  // Determine payment gateway based on currency
  const paymentGateway = selectedPaymentCountry?.currency_code === 'NGN' ? 'paystack' : 'stripe'

  // Determine admin fee based on currency
  const adminFees: Record<string, {amount: number; display: string}> = {
    NGN: {amount: 5000, display: '₦ 5000'},
    USD: {amount: 5, display: '$ 5'},
    CAD: {amount: 5, display: '$ 5'}
  }

  const adminFee = adminFees[selectedPaymentCountry?.currency_code || 'USD'] || adminFees.USD

  // Get country name from the form values
  const getCountryName = () => {
    return selectedPaymentCountry?.name || selectedLanguage.name
  }

  // Get country flag
  const getCountryFlag = () => {
    // Handle both cases at runtime to satisfy TypeScript's type system.
    const emojiOrMap = selectedPaymentCountry?.emoji

    if (typeof emojiOrMap === 'string' && emojiOrMap.length > 0) {
      return emojiOrMap
    }

    const flags: Record<string, string> = (emojiOrMap && typeof emojiOrMap === 'object') ? (emojiOrMap as Record<string, string>) : {}
    return flags[selectedPaymentCountry?.name || selectedLanguage.name] || '🌍'
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

        <div className="mt-8 flex justify-center gap-3 lg:gap-5">
          <CustomButton
            type={'button'}
            onClick={navigateToPreviousForm}
            className="w-[30%] rounded-[10px] border border-black bg-white px-1 py-4 text-[14px] text-black hover:bg-gray-50"
          >
            Previous
          </CustomButton>
          <CustomButton
            type="submit"
            disabled={createStoreIsLoading}
            className={`w-[70%] rounded-[10px] bg-[#000000] px-8 py-4 text-[16px] font-medium text-white hover:bg-gray-800 ${createStoreIsLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {createStoreIsLoading ? <Spinner /> : 'Make Payment'}
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default StoreActivation
