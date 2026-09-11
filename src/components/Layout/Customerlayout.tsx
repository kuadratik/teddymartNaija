// components/DashboardLayout.tsx
import {useAppSelector} from '@/hooks/reduxHooks'
import {useHolidayPeriod} from '@/hooks/useHolidayPeriod'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useActiveUserQuery} from '@/services/auth'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {CloseOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Badge, Button, Drawer, Dropdown, Grid, Layout, Menu} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useLocalStorage} from 'react-use'
import tw from 'tailwind-styled-components'
import ComingSoon from '../Auth/Products/components/ComingSoon'
import useLogout from '../Profile/hooks/useLogout'
import CountrySelectView from '../SharedUI/CountrySelect/CountrySelectView'
import HeadwayWidget from '../SharedUI/HeadwayWidget'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '../SharedUI/ModalComponent'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'

export interface CustomerLayoutInterface {
  maxWidth?: boolean
  landingBool?: boolean
}

const {useBreakpoint} = Grid

const {Header, Content, Footer} = Layout

const switchOptions = [{slug: 'my_profile', name: 'My Profile'}]

const profileOptions = [
  {value: 'edit_store_info', label: 'Edit Store Information', url: '/vendor/user-profile?tab=store-information'},
  {value: 'change_password', label: 'Change Password', url: '/vendor/user-profile?tab=password'},
  {value: 'create_new_store', label: 'Create New Store', url: '/vendor/user-profile'},
  {value: 'logout', label: 'Logout', url: '/vendor/user-profile'}
]

const CustomerLayout: React.FC<{children: React.ReactNode} & CustomerLayoutInterface> = ({
  children,
  maxWidth = true,
  landingBool = true
}) => {
  const router = useRouter()

  const {redirect} = router.query

  const MenuItems = [
    {
      id: 1,
      link: '/',
      name: 'Mall'
    },
    {
      id: 2,
      link: '/post-ad',
      name: 'Post Ad'
    },
    {
      id: 3,
      link: '/ads-gallery',
      name: 'Ads Gallery'
    },
    {
      id: 4,
      link: '/messages',
      name: 'Messages'
    },
    {
      id: 5,
      link: '/reviews',
      name: 'Reviews'
    }
  ]

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({currency: selectedLanguage.value})
  console.log('🚀 ~ data:', data?.data?.total_items)

  const [menuKey, setMenuKey] = useState(0)

  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery({})
  const isHolidaySeason = useHolidayPeriod()
  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)

  const allCookies = parseCookies()

  // Assuming you want to retrieve a specific cookie named 'authToken'
  const cookiesToken = allCookies['token']

  useEffect(() => {
    if (activeUserData && isSuccess) {
      dispatch(setCredentials({token: cookiesToken, user: activeUserData?.data}))
      // Optionally, update local storage
      setToken(cookiesToken)
      setUser(activeUserData?.data as any)
    }
  }, [activeUserData])

  useEffect(() => {
    const handleResize = () => {
      setMenuKey(prev => prev + 1) // Trigger re-render
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Function to check if the current path matches the menu link, considering sub-paths and query parameters
  const isActive = (link: string) => {
    if (link === '/' && router.asPath === '/') {
      return true
    }
    const regex = new RegExp(`^${link}(/|\\?|$)`)
    return regex.test(router.asPath)
  }

  const [dropDown, setDropDown] = useState(false)

  const screens = useBreakpoint()

  const [profileDropdown, setProfileDropdown] = useState(false)

  const [drawerVisible, setDrawerVisible] = useState(false)

  const dispatch = useDispatch()

  const showDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user

  const storepdown = React.useMemo(
    () =>
      isAuthenticatedUser?.store?.length ? [...switchOptions, {slug: 'vendor', name: 'Vendor View'}] : switchOptions,
    [isAuthenticatedUser?.store]
  )

  const mobileStorepdown = React.useMemo(
    () => (isAuthenticatedUser?.store?.length ? [{slug: 'vendor', name: 'Vendor View'}] : switchOptions),
    [isAuthenticatedUser?.store]
  )

  // ...isAuthenticatedUser?.store

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuth = isAuthenticatedToken

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const handleStoreSwitch = (value: any) => {
    dispatch(setActiveStore({activeUser: value}))
    setDropDown(false)
  }

  // console.log(data?.data, 'clipcount')

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()

  const [comingSoon, showComingSoon] = useState(false)

  if (activeUserisLoading) {
    return <SkeletonLoaderForPage length={2} />
  }
  // @ts-ignore
  const determineSelectedKey = path => {
    // Split by `/` or `?` to get the base path
    const basePath = path.split(/[/?]/)[1]

    // Rebuild the base path with a leading slash
    const rootPath = `/${basePath}`

    // Check if this base path matches any main menu link
    const menuLinks = ['/ads-gallery', '/', '/post-ad', '/messages', '/reviews']
    if (menuLinks.includes(rootPath)) {
      return rootPath
    }

    // Default to returning the full path if no base path match
    return path
  }

  const selectedKey = determineSelectedKey(router.pathname)

  return (
    <Layout style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden'}}>
      <div className="pb-[75px]">
        <Header
          className="fixed top-0 z-50 flex w-full justify-between px-6 lg:px-[80px]"
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
            {isHolidaySeason ? (
              <Link href="/" className="!border-none !p-0">
                <Image src={'/assets/xmas-logo-white.svg'} alt="logo" width={140} height={150} />
                {/* <TextComponent as="p" className="text-[10px] font-normal leading-[22px] text-white">
                  Find what you love, easily!
                </TextComponent>{' '} */}
              </Link>
            ) : (
              <Link href="/" className="!border-none !p-0">
                <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={100} />
                <TextComponent as="p" className="text-[10px] font-normal leading-[22px] text-white">
                  Find what you love, easily!
                </TextComponent>{' '}
              </Link>
            )}
            <div className="hidden lg:block">
              {' '}
              <Menu
                key={menuKey}
                theme="dark"
                className="md:block"
                mode="horizontal"
                overflowedIndicator={null}
                selectedKeys={selectedKey}
                style={{backgroundColor: 'black'}}
              >
                {MenuItems?.map(menu => {
                  return (
                    <Menu.Item key={menu.link} style={{marginRight: '10px'}}>
                      {menu.id !== 5 ? (
                        <Link
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#717171'}
                          }
                          href={
                            (menu.id === 2 && !isAuth) || (menu.id === 4 && !isAuth)
                              ? {
                                  pathname: '/auth/login',
                                  query: {redirect: menu.link}
                                }
                              : menu.link
                          }
                        >
                          {menu.name}
                        </Link>
                      ) : (
                        <span
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#717171'}
                          }
                          onClick={() => {
                            showComingSoon(true)
                          }}
                        >
                          {menu.name}
                        </span>
                      )}
                    </Menu.Item>
                  )
                })}
              </Menu>
            </div>
            <div className="hidden gap-[46px] text-white lg:flex">
              <div className="flex w-full items-center gap-[10px]">
                {isAuth && isAuthenticatedUser?.store?.length > 0 && (
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
                                  setDropDown(false)
                                  // handleStoreSwitch(option)
                                  router.push('/customer')
                                } else {
                                  // handleStoreSwitch(option)
                                  setDropDown(false)

                                  router.push('/vendor/dashboard')
                                }
                              }}
                              className={`flex cursor-pointer justify-between gap-2 p-3 hover:bg-gray-200`}
                            >
                              {' '}
                              <p className="text-[13px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                                {option.name}

                                {/* {option?.slug == 'my_profile' ? (
                                ''
                              ) : (
                                <span className="ml-1 text-[8px] text-[#6B7280]">
                                  {option?.user?.offers_product ? '(Product)' : '(Service)'}
                                </span>
                              )} */}
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
                      <Button
                        onClick={() => {
                          logoutUserHandler({})
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: 'none',
                          // Force the styles to remain the same on hover
                          transition: 'none' // Disable any transitions
                        }}
                        htmlType="button"
                        disabled={isLoadingLogout}
                        className="!border-none bg-transparent !p-0 text-sm font-semibold text-white"
                      >
                        Logout
                      </Button>
                      <span className="">{isLoadingLogout ? <Spinner className="h-2 w-2 text-black" /> : null}</span>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          // router.push((redirect as string) || '/auth/sign-up')
                          if (redirect) {
                            router.push(`/auth/sign-up?redirect=${encodeURIComponent(redirect as string)}`)
                          } else {
                            router.push('/auth/sign-up')
                          }

                          // router.push('/auth/sign-up')
                        }}
                        style={{
                          backgroundColor: '#fff',
                          color: 'black',
                          border: 'none',
                          // Force the styles to remain the same on hover
                          transition: 'none' // Disable any transitions
                        }}
                        htmlType="button"
                        className="whitespace-nowrap rounded-lg bg-[#fff] px-7 py-[22px] text-black"
                      >
                        Sign Up
                      </Button>

                      <Button
                        onClick={() => {
                          // router.push((redirect as string) || '/auth/login')
                          if (redirect) {
                            router.push(`/auth/login?redirect=${encodeURIComponent(redirect as string)}`)
                          } else {
                            router.push('/auth/login')
                          }
                        }}
                        style={{
                          backgroundColor: '#000',
                          color: 'white',
                          // Force the styles to remain the same on hover
                          transition: 'none' // Disable any transitions
                        }}
                        htmlType="button"
                        className="whitespace-nowrap rounded-lg !border-[1px] !border-white bg-[#000] px-7 py-[22px] text-white"
                      >
                        Login
                      </Button>
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
                  {/*  */}
                  <CountrySelectView />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="relative">
            <HeadwayWidget />
          </div>
          <div className="flex items-center gap-3">
            {' '}
            <Button
              onClick={() => {
                router.push('/clips')
              }}
              type="text"
              className="flex-center mt-1 block !p-0 lg:hidden"
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
            {/* <div className="relative ">
              <HeadwayWidget />
            </div> */}
            <div className="lg:hidden">
              <CountrySelectView />
            </div>
            <button
              style={{
                // display: 'none',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff'
              }}
              onClick={showDrawer}
              className="block lg:hidden"
            >
              {' '}
              <Icon icon="tabler:menu-4" className="!text-[40px] text-white" />
            </button>
          </div>

          {/* Menu for Larger Screens */}

          {/* Drawer for Mobile Screens */}
          <Drawer
            width={300}
            title=""
            placement="right"
            onClose={closeDrawer}
            className="!bg-[#f9f9f9] p-4"
            visible={drawerVisible}
            bodyStyle={{padding: 0, display: 'flex', flexDirection: 'column', height: '100%'}} // Make drawer content fill the entire height
            closeIcon={<CloseOutlined style={{fontSize: '20px', position: 'absolute', left: '16px', top: '20px'}} />}
          >
            {/* Main Content */}
            <div className="flex flex-grow flex-col gap-6">
              {isAuth && (
                <MobileWrapper className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-[9px] bg-[#F4F4F4] p-3">
                      <Icon icon="mdi:user" className="text-2xl text-black" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <TextComponent as="p" className="text-[16px] font-semibold leading-[12px] text-[#141414]">
                        {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
                      </TextComponent>
                      <Link href="/customer" legacyBehavior passHref>
                        <a
                          onClick={() => {
                            closeDrawer()
                          }}
                          className="text-[13px] font-semibold text-[#6B7280] hover:text-[#6B7280] hover:underline"
                        >
                          View Profile
                        </a>
                      </Link>
                    </div>
                  </div>
                </MobileWrapper>
              )}
              <MobileWrapper className="p-3">
                <Menu theme="dark" mode="vertical" selectedKeys={selectedKey} style={{backgroundColor: 'transparent'}}>
                  {MenuItems?.map(menu => (
                    <Menu.Item
                      className="hover:border-[1px] hover:border-black"
                      key={menu.link}
                      style={{marginRight: '10px'}}
                      onClick={() => {
                        closeDrawer()
                        if (menu.id === 1 || menu.id === 2 || menu.id === 3 || menu.id === 4) {
                          router.push(menu.link)
                        } else {
                          showComingSoon(true)
                        }
                      }}
                    >
                      {menu.id === 1 || menu.id === 2 || menu.id === 3 || menu.id === 4 ? (
                        <Link
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px]"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#717171'}
                          }
                          href={menu.link}
                        >
                          {menu.name}
                        </Link>
                      ) : (
                        <span
                          className="!hover:text-white !w-full py-1 text-[14px] leading-[18.23px]"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#717171'}
                          }
                        >
                          {menu.name}
                        </span>
                      )}
                    </Menu.Item>
                  ))}
                </Menu>
              </MobileWrapper>
            </div>

            {/* Logout Button at the Bottom */}
            <div style={{padding: '16px', marginTop: 'auto'}}>
              <div className="flex flex-col gap-3">
                {' '}
                <div className="flex items-center gap-4">
                  {isAuth && isAuthenticatedUser?.store?.length > 0 && (
                    <TextComponent
                      as="p"
                      className="whitespace-nowrap text-[14px] font-normal leading-[19px] text-black"
                    >
                      Switch to
                    </TextComponent>
                  )}
                  {isAuth && isAuthenticatedUser?.store?.length > 0 && (
                    <Dropdown
                      trigger={['click']}
                      overlay={
                        <Menu className="flex flex-col gap-1">
                          {mobileStorepdown.map((option: any, index: any) => (
                            <div
                              key={option.id}
                              onClick={() => {
                                closeDrawer()
                                if (option.slug === 'my_profile') {
                                  // handleStoreSwitch(option)
                                  router.push('/customer')
                                  setProfileDropdown(false)
                                } else {
                                  // handleStoreSwitch(option)
                                  router.push('/vendor/dashboard')
                                  setProfileDropdown(false)
                                }
                              }}
                              className={`flex cursor-pointer justify-between gap-2 p-3 hover:bg-gray-200`}
                            >
                              {' '}
                              <p className="text-[13px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                                {option.name}

                                {/* {option?.slug == 'my_profile' ? (
                                ''
                              ) : (
                                <span className="ml-1 text-[8px] text-[#6B7280]">
                                  {option?.user?.offers_product ? '(Product)' : '(Service)'}
                                </span>
                              )} */}
                              </p>
                            </div>
                          ))}
                        </Menu>
                      }
                      // trigger={['click']}
                      open={profileDropdown}
                      onVisibleChange={visible => {
                        setProfileDropdown(visible)
                      }}
                    >
                      <div className="p flex flex-row items-center gap-2 rounded-lg bg-[#D4D4D4] px-[11px] py-[8px] font-inter text-sm font-medium">
                        <TextComponent as="p" className="whitespace-nowrap text-[14px] font-normal text-black">
                          {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
                        </TextComponent>
                        <Icon icon={'ep:arrow-down-bold'} className="text-[16px] text-black" />
                      </div>
                    </Dropdown>
                  )}
                </div>
                <div>
                  {isAuth ? (
                    <Button
                      onClick={() => {
                        logoutUserHandler({logoutFunc: closeDrawer})
                      }}
                      loading={isLoadingLogout}
                      style={{
                        backgroundColor: '#000',
                        color: 'white',
                        border: 'none',
                        // Force the styles to remain the same on hover
                        transition: 'none' // Disable any transitions
                      }}
                      htmlType="button"
                      className="w-full whitespace-nowrap rounded-lg bg-[#000] p-6 py-[24px] text-base font-medium text-white"
                    >
                      <Icon icon="ic:round-logout" className="text-base" />
                      <span className="">Log out</span>
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => {
                          closeDrawer()
                          if (redirect) {
                            router.push(`/auth/sign-up?redirect=${encodeURIComponent(redirect as string)}`)
                          } else {
                            router.push('/auth/sign-up')
                          }
                        }}
                        style={{
                          backgroundColor: '#fff',
                          color: 'black',
                          border: '1px solid black',
                          // Force the styles to remain the same on hover
                          transition: 'none' // Disable any transitions
                        }}
                        htmlType="button"
                        className="w-full whitespace-nowrap rounded-lg bg-[#fff] p-6 py-[24px] text-base font-medium text-black"
                      >
                        {/* <Icon icon="ic:round-logout" className="text-base" /> */}
                        <span className="">Sign Up</span>
                      </Button>
                      <Button
                        onClick={() => {
                          closeDrawer()
                          if (redirect) {
                            router.push(`/auth/login?redirect=${encodeURIComponent(redirect as string)}`)
                          } else {
                            router.push('/auth/login')
                          }
                        }}
                        style={{
                          backgroundColor: '#000',
                          color: 'white',
                          border: 'none',
                          // Force the styles to remain the same on hover
                          transition: 'none' // Disable any transitions
                        }}
                        htmlType="button"
                        className="w-full whitespace-nowrap rounded-lg bg-[#000] p-6 py-[25px] text-base font-medium text-white"
                      >
                        <span className="">Login</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Drawer>
        </Header>
      </div>

      <Content
        style={{
          flex: 1,
          width: '100%',
          overflowX: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '6px'
        }}
        className={`bg-[#F8F8F8] py-0 ${maxWidth ? 'px-[10px] py-0 md:px-[85px]' : ''}`}
      >
        <div
          className={`${landingBool ? 'mb-[60px]' : 'lg:mb-[60px]'} w-full ${maxWidth ? 'max-w-7xl p-[8px] md:p-[20px] lg:p-0' : ''} `}
        >
          {children}
        </div>
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
          {isHolidaySeason ? (
            <Link href="/" className="!border-none !p-0">
              <Image src={'/assets/xmas-logo-white.svg'} alt="logo" width={140} height={150} />
              {/* <TextComponent as="p" className="text-[10px] font-normal leading-[22px] text-white">
                  Find what you love, easily!
                </TextComponent>{' '} */}
            </Link>
          ) : (
            <Link href="/" className="!border-none !p-0">
              <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={100} />
              <TextComponent as="p" className="text-[10px] font-normal leading-[22px] text-white">
                Find what you love, easily!
              </TextComponent>{' '}
            </Link>
          )}
          <div className="flex flex-row items-center gap-4 lg:gap-8">
            {[
              {
                id: 1,
                link: '/contact-us',
                name: 'Contact Us'
              },
              {
                id: 2,
                link: '/privacy-policy',
                name: 'Privacy Policy'
              },
              {
                id: 3,
                link: '/terms-of-service',
                name: 'Terms of Service'
              }
            ].map(menu => {
              return (
                <Link
                  key={menu.id}
                  href={menu.link}
                  className="bg-transparent text-[10px] font-semibold text-white hover:underline lg:text-sm"
                >
                  {menu.name}
                </Link>
              )
            })}
          </div>
        </div>
      </Footer>

      <PlannerModal
        modalOpen={comingSoon}
        setModalOpen={showComingSoon}
        onCloseModal={() => showComingSoon(false)}
        modalStyles={{
          content: {
            backgroundColor: 'black'
          }
        }}
      >
        <ComingSoon onClose={() => showComingSoon(false)} />
      </PlannerModal>
    </Layout>
  )
}

export const MobileWrapper = tw.div`rounded-[15px] border-[1px] border-[#EAECEF] bg-white`

export default CustomerLayout
