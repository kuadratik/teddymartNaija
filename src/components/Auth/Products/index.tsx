import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import Link from 'next/link'
import Category from './components/Category'
import RecommendedComponent from './components/Recommend'

const LandingPage = () => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex">
          <LogoHeader />
        </div>
        <div className="flex gap-3">
          <CustomButton
            onClick={() => {}}
            type="button"
            className="w-[100px] !border-[1px] !border-[#000000] bg-white px-1 py-2"
          >
            Sign Up
          </CustomButton>
          <CustomButton
            onClick={() => {}}
            type="button"
            className="w-[100px] border-[1px] border-gray-300 bg-white px-2 py-1"
          >
            Login
          </CustomButton>
        </div>
        <div className="flex gap-3">
          <div className="text-[14px] font-medium">
            <span className="font-medium text-[#6B7280]">To advertise a product or service, </span>
            <Link href="/" className="!border-none !p-0 text-sm text-[#000] underline">
              Click here
            </Link>
          </div>
        </div>

        <div className="">Navtabs</div>
        <div className="w-full">
          <TextInput
            iconName="iconamoon:category"
            placeholder="Search for a product or vendor"
            onChange={function (e: any): void {
              throw new Error('Function not implemented.')
            }}
            name={''}
            type={''}
          />
        </div>

        <div className="w-full">
          <Category />
        </div>

        <div className="w-full">
          <RecommendedComponent />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
