import Signup from '@/components/Auth/Signup/Signup'
import BaseLayout from '@/components/Layout/BaseLayout'
import React from 'react'

const SignUpIndex = () => {
  return (
    <React.Fragment>
      <BaseLayout className="">
        <Signup />
      </BaseLayout>
    </React.Fragment>
  )
}

export default SignUpIndex
