import NavTabs from '@/components/SharedUI/NavTabs'
import React from 'react'

const profileNavItems = [
  {
    id: 1,
    title: 'Info'
    // link: '/admissions/dashboard',
    // subLinks: ['']
  },
  {
    id: 2,
    title: 'Password'
    // link: '/admissions/dashboard',
    // subLinks: ['']
  }
]

const LoginIndex = () => {
  return (
    <div>
      <NavTabs naveItems={profileNavItems} backgroundColor="#F8F9FD" active={1} />
    </div>
  )
}

export default LoginIndex
