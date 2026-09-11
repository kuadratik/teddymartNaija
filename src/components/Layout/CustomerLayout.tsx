// components/DashboardLayout.tsx
import {Layout, Menu, Drawer, Button, Dropdown, Avatar, Badge} from 'antd'
import {MenuOutlined} from '@ant-design/icons'
import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import {Icon} from '@iconify/react'
import {useAppSelector} from '@/hooks/reduxHooks'
import React from 'react'
import {useDispatch} from 'react-redux'
import {setActiveStore} from '@/redux/apiSlice/authSlice'
import TextComponent from '../SharedUI/TextComponent'
import useLogout from '../Profile/hooks/useLogout'
import Spinner from '../SharedUI/Spinner'
import {useGetAllClipsQuery} from '@/services/clips'
import CountrySelect from '../SharedUI/CountrySelect/CountrySelect'
import CustomButton from '../SharedUI/Buttons/Button'

const {Header, Content, Footer} = Layout

const MenuItems = [
  {
    id: 1,
    link: '/vendor/dashboard',
    name: 'Dashboard'
  },
  {
    id: 2,
    link: '/vendor/products',
    name: 'Products'
  },
  {
    id: 3,
    link: '/vendor/orders',
    name: 'Orders'
  },
  {
    id: 4,
    link: '/vendor/messages',
    name: 'Messages'
  },
  {
    id: 5,
    link: '/vendor/reviews',
    name: 'Reviews'
  }
]

const switchOptions = [{slug: 'my_profile', name: 'My Profile'}]

const profileOptions = [
  {value: 'edit_store_info', label: 'Edit Store Information', url: '/vendor/user-profile?tab=store-information'},
  {value: 'change_password', label: 'Change Password', url: '/vendor/user-profile?tab=password'},
  {value: 'create_new_store', label: 'Create New Store', url: '/vendor/user-profile'},
  {value: 'logout', label: 'Logout', url: '/vendor/user-profile'}
]

const CustomerLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const router = useRouter()

  const {data, isLoading, isFetching} = useGetAllClipsQuery({})
  console.log('clips', data)

  // Function to check if the current path matches the menu link, considering sub-paths and query parameters
  const isActive = (link: string) => {
    // Check if the current path starts with the menu link
    return router.asPath.startsWith(link)
  }

  const [dropDown, setDropDown] = useState(false)

  const [profileDropdown, setProfileDropdown] = useState(false)

  const [drawerVisible, setDrawerVisible] = useState(false)

  const dispatch = useDispatch()

  const showDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const storepdown = React.useMemo(
    () => (isAuthenticatedUser?.store ? [...switchOptions, ...isAuthenticatedUser?.store] : switchOptions),
    [isAuthenticatedUser?.store]
  )

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuth = isAuthenticatedToken

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const handleStoreSwitch = (value: any) => {
    dispatch(setActiveStore({activeUser: value}))
    setDropDown(false)
  }

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()

  return (
    <Layout style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden'}}>
      <Header
        className="flex justify-between px-6 md:px-[80px]"
        style={{
          height: '78px',
          backgroundColor: '#000',
          display: '',

          alignItems: 'center'
        }}
      >
        <div className="flex w-full items-center justify-between">
          {' '}
          {/* Logo */}
          <Link href="/" className="!border-none !p-0">
            <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={100} />
          </Link>
          <div className="hidden gap-[46px] text-white md:flex">
            <div className="flex w-full items-center gap-[10px]">
              {isAuth && (
                <TextComponent as="p" className="whitespace-nowrap text-[14px] font-normal leading-[19px] text-white">
                  Switch to
                </TextComponent>
              )}
              <div className="flex w-full cursor-pointer items-center justify-center gap-[20px]">
                {isAuth && (
                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu className="flex flex-col gap-1">
                        {storepdown.map((option: any, index: any) => (
                          <div
                            key={option.id}
                            onClick={() => {
                              if (option.slug === 'my_profile') {
                                handleStoreSwitch(option)
                                router.push('/dashboard')
                              } else {
                                handleStoreSwitch(option)
                                router.push('vendor/dashboard')
                              }
                            }}
                            className={`flex cursor-pointer justify-between gap-2 p-3 hover:bg-gray-200`}
                          >
                            {' '}
                            <p className="text-[12px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                              {option.name}

                              {option?.slug == 'my_profile' ? (
                                ''
                              ) : (
                                <span className="ml-1 text-[8px] text-[#6B7280]">
                                  {option?.user?.offers_product ? '(Product)' : '(Service)'}
                                </span>
                              )}
                            </p>
                          </div>
                        ))}
                      </Menu>
                    }
                    // trigger={['click']}
                    open={dropDown}
                    onVisibleChange={visible => {
                      setDropDown(visible)
                    }}
                  >
                    <div className="p flex flex-row items-center gap-2 rounded-lg bg-[#262626] px-[11px] py-[8px] font-inter text-sm font-medium">
                      <TextComponent as="p" className="text-[14px] font-normal text-white">
                        {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
                      </TextComponent>
                      <Icon icon={'ep:arrow-down-bold'} className="text-[16px] text-white" />
                    </div>
                  </Dropdown>
                )}

                {isAuth ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        logoutUserHandler()
                      }}
                      disabled={isLoadingLogout}
                      type="button"
                      className="bg-transparent text-sm font-semibold text-white"
                    >
                      <span>Logout</span>
                    </button>
                    <span className="">{isLoadingLogout ? <Spinner className="h-2 w-2 text-black" /> : null}</span>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <CustomButton
                      onClick={() => {
                        router.push('auth/sign-up')
                      }}
                      type="button"
                      className="h-[44px] w-[129px] rounded-[10px] bg-white px-1 py-2 text-black"
                    >
                      Sign Up
                    </CustomButton>
                    <CustomButton
                      onClick={() => {
                        router.push('auth/login')
                      }}
                      type="button"
                      className="w-[100px] rounded-[10px] border-[1px] border-white bg-[#222222] px-2 py-1 text-white"
                    >
                      Login
                    </CustomButton>
                  </div>
                )}
                <Button
                  onClick={() => {
                    router.push('/clips')
                  }}
                  type="text"
                  className="flex-center !p-0"
                  size="large"
                  icon={
                    <Badge
                      count={data?.data?.total_items}
                      style={{backgroundColor: '#FFF', color: '#000', fontSize: '16px', fontWeight: 600}}
                    >
                      <Icon icon={'mdi-light:cart'} className="text-[28px] text-white" />
                    </Badge>
                  }
                />

                <CountrySelect />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <Button
          className="mobile-menu-button"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{
            display: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fff'
          }}
        />

        {/* Menu for Larger Screens */}

        {/* Drawer for Mobile Screens */}
        {/* <Drawer title="Menu" placement="right" onClose={closeDrawer} visible={drawerVisible} bodyStyle={{padding: 0}}>
          <Menu mode="vertical" selectedKeys={[router.pathname]}>
            <Menu.Item key="/dashboard">
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/users">
              <Link href="/users">Users</Link>
            </Menu.Item>
            <Menu.Item key="/settings">
              <Link href="/settings">Settings</Link>
            </Menu.Item>
          </Menu> 
        </Drawer> */}
      </Header>

      <Content style={{flex: 1, width: '100%', overflowX: 'hidden'}} className="py-0">
        <div className="bg-white pb-[60px]">{children}</div>
      </Content>

      <Footer style={{backgroundColor: '#000'}}>
        {/* {isDesktop && (
          <div className="mt-[50px] flex h-[78px] w-full bg-[#222222]">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
              <Link href="/" className="!border-none !p-0">
                <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={76} />{' '}
              </Link>
              <div className="flex items-center gap-8">
                <Link href={'/contact-us'} className="bg-transparent text-sm font-semibold text-white hover:underline">
                  <span>Contact Us</span>
                </Link>

                <Link
                  href={'/privacy-policy'}
                  className="bg-transparent text-sm font-semibold text-white hover:underline"
                >
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  href={'/terms-of-service'}
                  className="bg-transparent text-sm font-semibold text-white hover:underline"
                >
                  <span>Terms of Service</span>
                </Link>
              </div>
            </div>
          </div>
        )} */}

        <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row lg:gap-0">
          {' '}
          {/* Logo */}
          <Link href="/" className="!border-none !p-0">
            <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={100} />
          </Link>
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8">
            <Link href={'/contact-us'} className="bg-transparent text-sm font-semibold text-white hover:underline">
              <span>Contact Us</span>
            </Link>

            <Link href={'/privacy-policy'} className="bg-transparent text-sm font-semibold text-white hover:underline">
              <span>Privacy Policy</span>
            </Link>
            <Link
              href={'/terms-of-service'}
              className="bg-transparent text-sm font-semibold text-white hover:underline"
            >
              <span>Terms of Service</span>
            </Link>
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default CustomerLayout
