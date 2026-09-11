import LoginComponent from '@/components/Auth/Login'
import BaseLayout from '@/components/Layout/BaseLayout'
import NavTabs from '@/components/SharedUI/NavTabs'
import React from 'react'

const LoginIndex = () => {
  return (
    <React.Fragment>
      <BaseLayout className="">
        <div className="md:my-8">
          {' '}
          <LoginComponent />
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

export default LoginIndex
