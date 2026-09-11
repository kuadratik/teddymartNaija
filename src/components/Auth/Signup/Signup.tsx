import BaseLayout from '@/components/Layout/BaseLayout'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import TextComponent from '@/components/SharedUI/TextComponent'
import VendorSignupForm from './components/SignupForm'

const Signup = () => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <LogoHeader />
        </div>
        <div className="mt-[29px] flex flex-col gap-2">
          <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-[#141414]">
            Hi There! 👋{' '}
          </TextComponent>
          <p className="text-[14px] font-normal text-[#6B7280]">Welcome! Sign up or Login</p>
        </div>
        {/* Form */}
        <div className="mt-[29px]">
          <VendorSignupForm />
        </div>
      </div>
    </div>
  )
}

export default Signup
