import Onboarding from '@/components/Auth/Signup/Onboarding'
import BaseLayout from '@/components/Layout/BaseLayout'
import React from 'react'

const OnboardingPage = () => {
  return (
    <React.Fragment>
      <BaseLayout className="">
        <div className="">
          <Onboarding />{' '}
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default OnboardingPage
