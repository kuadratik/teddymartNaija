import VendorLogo from '@/components/Auth/Products/components/Logo'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps, Modal} from 'antd'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'
import {useSuperAdminLogoutMutation} from '@/services/auth'

interface SuperAdminHeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({activeTab = 'brands', onTabChange}) => {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState(activeTab)
  const {admin} = useSuperAdminAuth()
  const userName = admin ? `${admin.first_name} ${admin.last_name}` : 'Admin'
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const [superAdminLogout] = useSuperAdminLogoutMutation()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Map route to tab key
  const routeToTab = (path: string) => {
    if (path.startsWith('/super-admin/dashboard/brands')) return 'brands'
    if (path.startsWith('/super-admin/dashboard/users')) return 'users'
    if (path.startsWith('/super-admin/dashboard')) return 'navigation'
    return activeTab
  }

  // Update currentTab based on route on mount and on route changes
  React.useEffect(() => {
    const setFromRoute = (url: string) => setCurrentTab(routeToTab(url))
    setFromRoute(router.pathname)

    const handleRouteChange = (url: string) => setFromRoute(url)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await superAdminLogout().unwrap()
      router.push('/super-admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if the API call fails, redirect to login
      router.push('/super-admin/login')
    } finally {
      setIsLoggingOut(false)
      setLogoutModalOpen(false)
    }
  }

  const userMenuItems: MenuProps['items'] = [
    // {
    //   key: '1',
    //   label: 'Profile',
    //   onClick: () => {
    //     // Handle profile navigation
    //   }
    // },
    // {
    //   key: '2',
    //   label: 'Settings',
    //   onClick: () => {
    //     // Handle settings navigation
    //   }
    // },
    // {
    //   type: 'divider'
    // },
    {
      key: '3',
      label: 'Logout',
      danger: true,
      onClick: () => {
        setLogoutModalOpen(true)
      }
    }
  ]

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-2 z-50 w-full">
      <div className="mx-auto w-full max-w-screen-xl rounded-full border-b border-gray-100 bg-white px-4 py-3 lg:px-5 2xl:max-w-screen-2xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div
            onClick={() => {
              router.push('/super-admin/dashboard')
            }}
            className="flex cursor-pointer items-center gap-1"
          >
            <VendorLogo />
            <div className="flex flex-col">
              <p className="text-[19px] font-bold leading-tight">myEKI</p>
              <p className="text-[10px] font-normal text-gray-500">Admin</p>
            </div>
          </div>

          {/* Center Navigation - hidden on mobile */}
          <nav className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => {
                handleTabClick('navigation')
                router.push('/super-admin/dashboard')
              }}
              className={`rounded-full px-4 py-2 text-[14px] font-normal transition-colors ${
                currentTab === 'navigation' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Navigation Bar
            </button>
            <button
              onClick={() => {
                handleTabClick('brands')
                router.push('/super-admin/dashboard/brands')
              }}
              className={`rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${
                currentTab === 'brands' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Brands
            </button>
            <button
              onClick={() => {
                handleTabClick('users')
                router.push('/super-admin/dashboard/users')
              }}
              className={`rounded-full px-4 py-2 text-[14px] font-normal transition-colors ${
                currentTab === 'users' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              User Management
            </button>
          </nav>

          {/* Right Section - User Info */}
          <div className="flex items-center gap-3">
            {/* Initials visible on mobile */}
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-[14px] font-medium text-gray-900 lg:hidden">
              {userInitials}
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDEDED] p-4">
                <TextComponent as="span" className="text-[14px] font-medium text-gray-900">
                  {userInitials}
                </TextComponent>
              </div>
              <Dropdown menu={{items: userMenuItems}} placement="bottomRight" trigger={['click']}>
                <button className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[14px] font-normal text-gray-700 hover:bg-gray-50">
                  {userName.split(' ')[0]}
                  <Icon icon="heroicons:chevron-down" className="text-base text-gray-600" />
                </button>
              </Dropdown>
            </div>
            {/* Mobile Menu Button moved to far right */}
            <div className="flex lg:hidden">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              >
                <Icon icon="heroicons:bars-3" className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Drawer */}
        <aside
          className={`absolute right-0 top-0 h-full w-72 transform bg-white shadow-lg transition-transform ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <VendorLogo />
              <div className="flex flex-col">
                <p className="text-sm font-semibold">myEKI</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2 text-gray-600">
              <Icon icon="heroicons:x" className="text-xl" />
            </button>
          </div>
          <div className="px-4 py-4">
            <button
              onClick={() => {
                handleTabClick('navigation')
                router.push('/super-admin/dashboard')
                setMobileOpen(false)
              }}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm font-normal transition-colors ${
                currentTab === 'navigation' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Navigation Bar
            </button>
            <button
              onClick={() => {
                handleTabClick('brands')
                setMobileOpen(false)
              }}
              className={`mt-2 w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                currentTab === 'brands' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Brands
            </button>
            <button
              onClick={() => {
                handleTabClick('users')
                router.push('/super-admin/dashboard/users')
                setMobileOpen(false)
              }}
              className={`mt-2 w-full rounded-lg px-4 py-2 text-left text-sm font-normal transition-colors ${
                currentTab === 'users' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              User Management
            </button>
          </div>
        </aside>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={[
          <button
            key="cancel"
            onClick={() => setLogoutModalOpen(false)}
            className="mr-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>,
          <button
            key="logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        ]}
      >
        <p>Are you sure you want to logout from the admin panel?</p>
      </Modal>
    </header>
  )
}

export default SuperAdminHeader
