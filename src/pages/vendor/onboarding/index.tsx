import Onboarding from '@/components/Auth/Signup/Onboarding'
import BaseLayout from '@/components/Layout/BaseLayout'
import React from 'react'

const OnboardingPage = () => {
  return (
    <React.Fragment>
      <BaseLayout className="">
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="">
              <Onboarding />{' '}
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default OnboardingPage
