import Signup from '@/components/Auth/Signup/Signup'
import BaseLayout from '@/components/Layout/BaseLayout'
import React from 'react'

const SignUpIndex = () => {
  return (
    <React.Fragment>
      <BaseLayout className="">
        <div className="md:my-8">
          {' '}
          <Signup />
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default SignUpIndex
