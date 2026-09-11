import React from 'react'
import Image from 'next/image'
import TextComponent from '../SharedUI/TextComponent'
import CustomButton from '../SharedUI/Buttons/Button'
import {useRouter} from 'next/router'
import {useAppSelector} from '@/hooks/reduxHooks'

const ServiceInfoPage = () => {
  const router = useRouter()
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  return (
    <div className="flex flex-col gap-6">
      <Image
        src="/assets/service.png"
        alt="Styled Image"
        layout="responsive" // Makes the image responsive
        width={100} // Percentage of the parent width
        height={195}
      />
      <div className="px-[20px] lg:px-20">
        {' '}
        <div>
          {' '}
          <TextComponent as="h1" className="mt-2 text-[20px] font-bold text-[#1C1C1C]">
            Service Description{' '}
          </TextComponent>
          <TextComponent as="p" className="mt-2 text-[14px] font-normal leading-[22px] text-[#1F1F1F]">
            Babs Auto Sales provides a variety of vehicle maintenance options. Services include (but not limited to):
            Scheduled Maintenance Diagnostic Testing Wheel alignments Wheel balancing Brakes Oil change Engine tune-up
            Tire change (rotation and balancing) Suspension Batteries, Starter{' '}
          </TextComponent>
        </div>
        <CustomButton
          // disabled={!type}
          type="submit"
          onClick={() => {
            if (isAuthenticatedToken) {
              // confirmOpenModal()
            } else {
              router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
            }
          }}
          className={` ${true ? 'bg-[#000000]' : 'bg-[#B9B9B9]'} mt-[50px] w-full rounded-[10px] px-1 py-4 text-[14px] text-white`}
        >
          {'Send a Message'}
        </CustomButton>
      </div>
    </div>
  )
}

export default ServiceInfoPage
