// components/DashboardLayout.tsx
import {useAppSelector} from '@/hooks/reduxHooks'
import {useHolidayPeriod} from '@/hooks/useHolidayPeriod'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {useGetAllStoreListingQuery} from '@/services/store'
import {useGetAllNavigationQuery} from '@/services/super-admin/nav-bar'
import {CloseOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Badge, Drawer, Dropdown, Grid, Layout, Menu} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useLocalStorage} from 'react-use'
import {twMerge} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import ComingSoon from '../Auth/Products/components/ComingSoon'
import useLogout from '../Profile/hooks/useLogout'
import CustomButton from '../SharedUI/Buttons/Button'
import CountrySelectView from '../SharedUI/CountrySelect/CountrySelectView'
import HeadwayWidget from '../SharedUI/HeadwayWidget'
import PlannerModal from '../SharedUI/ModalComponent'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'
import { useActiveUserQuery } from '@/services/general/general'

export interface CustomerLayoutInterface {
  maxWidth?: boolean
  landingBool?: boolean
  className?: string
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
  className,
  maxWidth = true,
  landingBool = true
}) => {
  const router = useRouter()
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuth = isAuthenticatedToken

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const {redirect} = router.query
  const isHome = router.pathname === '/home' ? '/' : '/home'

  const fallbackMenuItems = [
    {
      id: 6,
      link: '/',
      name: 'Stores'
    },
    {
      id: 0,
      link: '/brands',
      name: 'Brands'
    },
    {
      id: 1,
      link: '/mall',
      name: 'Mall'
    },
    {
      id: 2,
      link: isAuth
        ? isAuthenticatedUser?.store?.length > 0
          ? '/vendor/dashboard'
          : '/mek/onboarding'
        : '/mek/onboarding', // When not authenticated, go to onboarding
      name: 'Vendors'
    },
    {
      id: 3,
      link: '/ads-gallery',
      name: 'Classified Ads'
    },
    {
      id: 4,
      link: '/mek-directory',
      name: 'Directory'
    }
  ]

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess,
    refetch: allClipsRefetch
  } = useGetAllClipsQuery({currency: selectedLanguage.value})
  const {
    data: navigationData,
    isLoading: navigationLoading,
    refetch: navigationRefetch
  } = useGetAllNavigationQuery({
    type: 'top'
  })

  const navItems = React.useMemo(() => {
    if (navigationData?.data && navigationData.data.length > 0) {
      return [...navigationData.data]
        .filter((item: any) => item.active)
        .sort((a: any, b: any) => Number(a.ordering) - Number(b.ordering))
    }
    return fallbackMenuItems
  }, [navigationData, fallbackMenuItems])

  const [menuKey, setMenuKey] = useState(0)

  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery()
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
      allClipsRefetch()
      setUser(activeUserData?.data as any)
    }
  }, [activeUserData, isSuccess, cookiesToken, allClipsRefetch, setToken, setUser])

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
    if (link === '/' && (router.asPath === '/' || router.asPath.includes('/category'))) {
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

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const handleStoreSwitch = (value: any) => {
    dispatch(setActiveStore({activeUser: value}))
    setDropDown(false)
  }

  // console.log(data?.data, 'clipcount')

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()

  const [comingSoon, showComingSoon] = useState(false)

  // if (activeUserisLoading) {
  //   return <SkeletonLoaderForPage length={2} />
  // }
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

  const {data: storeData} = useGetAllStoreListingQuery({
    listType: 'product',
    currency: selectedLanguage.value,
    sortType: 'alphanumeric'
  })

  const transformedRegularItems =
    storeData?.data?.data && Array.isArray(storeData?.data?.data)
      ? storeData?.data?.data
          .map((item: any) => ({
            key: item.id.toString(),
            label: <p className="py-2 text-[14px] font-semibold leading-[18px] text-black">{item.name}</p>
          }))
          .slice(0, 30)
      : []

  const transformedViewAllItem = {
    key: 'view-all',
    label: (
      <div className="flex w-full items-center gap-1">
        <p className="py-2 text-[14px] font-semibold leading-[18px] text-blue-600">View All</p>
        <Icon icon="ic:round-arrow-forward-ios" className="text-blue-600" />
      </div>
    )
  }

  const vendorMenuItems = [...transformedRegularItems, transformedViewAllItem]

  const handleVendorMenuClick = ({key}: any) => {
    if (key === 'view-all') {
      router.push('/find-vendor') // Navigate to find vendor page
    } else {
      const clickedItem = storeData?.data?.data.find((item: any) => item?.id.toString() === key.toString())
      if (clickedItem) {
        router.push(`/store/${clickedItem.slug}`) // Navigate to store page
      } else {
        // console.log('Item not found')
      }
    }
  }

  return (
    <Layout style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden'}}>
      <div className="pb-[75px]">
        <Header
          className="fixed top-0 z-50 flex w-full justify-between px-5 md:px-6 lg:px-5 xl:px-5"
          style={{
            height: '78px',
            backgroundColor: '#000',
            display: '',
            alignItems: 'center'
          }}
        >
          <div className="relative mx-auto flex w-full max-w-screen-xl items-center justify-between xl:left-3 xl:px-0 2xl:max-w-screen-2xl">
            {' '}
            {/* Logo */}
            {isHolidaySeason ? (
              <Link href={isHome} className="!border-none !p-0">
                <Image src={'/assets/xmas-logo-white.svg'} alt="logo" width={140} height={150} />
              </Link>
            ) : (
              <Link href={isHome} className="!border-none !p-0">
                <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={100} />
                <TextComponent as="p" className="text-[10px] font-normal leading-[22px] text-white">
                  Find what you love, easily!
                </TextComponent>{' '}
              </Link>
            )}
            <div className="hidden lg:block">
              <Menu
                key={menuKey}
                theme="dark"
                className="md:block"
                mode="horizontal"
                overflowedIndicator={null}
                selectedKeys={selectedKey}
                style={{backgroundColor: 'black'}}
              >
                {navItems?.map((menu: any) => {
                  if (menu.name.toLowerCase() === 'find a vendor' || menu.name.toLowerCase() === 'vendor-dropdown') {
                    return (
                      <Menu.Item key={menu.link} style={{marginRight: '10px'}}>
                        <Dropdown
                          overlay={
                            <Menu
                              items={vendorMenuItems}
                              onClick={handleVendorMenuClick}
                              className="grid w-[600px] grid-cols-4"
                            />
                          }
                        >
                          <span
                            className="!hover:text-white flex items-center gap-1 py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white hover:opacity-80"
                            style={
                              isActive(menu.link)
                                ? {
                                    fontWeight: '700',
                                    color: 'white',
                                    borderBottom: '3px solid white'
                                  }
                                : {fontWeight: '400', color: '#ffff'}
                            }
                          >
                            {menu.name} <Icon icon="ep:arrow-down-bold" className="text-[10px]" />
                          </span>
                        </Dropdown>
                      </Menu.Item>
                    )
                  }

                  if (menu.subnav && menu.subnav.length > 0) {
                    return (
                      <Menu.Item key={menu.link} style={{marginRight: '10px'}}>
                        <Dropdown
                          overlay={
                            <Menu>
                              {menu.subnav.map((sub: any) => (
                                <Menu.Item
                                  key={sub.link}
                                  onClick={() => {
                                    if (sub.coming_soon) {
                                      showComingSoon(true)
                                    }
                                  }}
                                >
                                  {!sub.coming_soon ? (
                                    <Link href={sub.link} className="text-black hover:text-black">
                                      {sub.name}
                                    </Link>
                                  ) : (
                                    <span className="cursor-pointer text-black hover:text-black">{sub.name}</span>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu>
                          }
                        >
                          <span
                            className="!hover:text-white flex items-center gap-1 py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white hover:opacity-80"
                            style={
                              isActive(menu.link)
                                ? {
                                    fontWeight: '700',
                                    color: 'white',
                                    borderBottom: '3px solid white'
                                  }
                                : {fontWeight: '400', color: '#ffff'}
                            }
                          >
                            {menu.name} <Icon icon="ep:arrow-down-bold" className="text-[10px]" />
                          </span>
                        </Dropdown>
                      </Menu.Item>
                    )
                  }

                  return (
                    <Menu.Item key={menu.link} style={{marginRight: '10px'}}>
                      {!menu.coming_soon ? (
                        <Link
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white hover:opacity-80"
                          style={
                            isActive(menu.link)
                              ? {
                                  fontWeight: '700',
                                  color: 'white',
                                  borderBottom: '3px solid white'
                                }
                              : {fontWeight: '400', color: '#ffff'}
                          }
                          href={
                            menu.id === 2 && !isAuth
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
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white hover:opacity-80"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#ffff'}
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
            <div className="hidden gap-[20px] text-white md:gap-[30px] lg:flex lg:gap-[46px]">
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
                        <TextComponent as="p" className="text-[14px] font-normal capitalize text-white">
                          {isAuthenticatedUser?.first_name} {isAuthenticatedUser?.last_name}
                        </TextComponent>
                        <Icon icon={'ep:arrow-down-bold'} className="text-[16px] text-white" />
                      </div>
                    </Dropdown>
                  )}
                  {isAuth ? (
                    <div className="flex items-center gap-3">
                      <CustomButton
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
                        type="button"
                        disabled={isLoadingLogout}
                        className="!border-none bg-transparent !p-0 text-sm font-semibold text-white"
                      >
                        Logout
                      </CustomButton>
                      <span className="">{isLoadingLogout ? <Spinner className="h-2 w-2 text-black" /> : null}</span>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <CustomButton
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
                          border: 'none',
                          // Force the styles to remain the same on hover
                          transition: 'none' // Disable any transitions
                        }}
                        type="button"
                        className="rounded-lg bg-[#fff] px-6 py-2 text-sm text-black"
                      >
                        <span className="whitespace-nowrap">Sign Up</span>
                      </CustomButton>

                      <CustomButton
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
                        type="button"
                        className="whitespace-nowrap rounded-lg !border-[1px] !border-white bg-[#000] px-6 py-2 text-sm text-white"
                      >
                        Login
                      </CustomButton>
                    </div>
                  )}
                  <div className="">
                    <CustomButton
                      onClick={() => {
                        router.push('/clips')
                      }}
                      type="button"
                      className="flex items-center justify-center !p-0 px-0"
                    >
                      <Badge
                        count={data?.data?.total_items}
                        style={{backgroundColor: '#FFF', color: '#000', fontSize: '16px', fontWeight: 600}}
                      >
                        <Icon icon={'mdi-light:cart'} className="relative text-[28px] text-white" />
                      </Badge>
                    </CustomButton>
                  </div>
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
            <div className="">
              <CustomButton
                onClick={() => {
                  router.push('/clips')
                }}
                type="button"
                className="flex items-center justify-center !p-0 lg:hidden"
              >
                <Badge
                  count={data?.data?.total_items}
                  className="relative"
                  style={{backgroundColor: '#FFF', color: '#000', fontSize: '16px', fontWeight: 600}}
                >
                  <Icon icon={'mdi-light:cart'} className="text-[28px] text-white" />
                </Badge>
              </CustomButton>
            </div>
            {/* <div className="relative ">
              <HeadwayWidget />
            </div> */}
            <div className="lg:hidden">
              <CountrySelectView />
            </div>
            <button
              title="Menu"
              aria-label="Menu"
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
                <Menu theme="light" mode="inline" selectedKeys={selectedKey} style={{backgroundColor: 'transparent'}}>
                  {navItems?.map((menu: any) => {
                    console.log('🚀 ~ CustomerLayout ~ menu:', menu)
                    if (menu.name.toLowerCase() === 'find a vendor' || menu.name.toLowerCase() === 'vendor-dropdown') {
                      return (
                        <Menu.SubMenu
                          key={menu.link}
                          title={
                            <span
                              className="!hover:text-white !w-full py-1 text-[14px] leading-[18.23px]"
                              style={
                                isActive(menu.link)
                                  ? {fontWeight: '700', color: 'black'}
                                  : {fontWeight: '400', color: '#000000'}
                              }
                            >
                              {menu.name}
                            </span>
                          }
                        >
                          {vendorMenuItems.map((item: any) => (
                            <Menu.Item
                              key={item.key}
                              onClick={() => {
                                closeDrawer()
                                handleVendorMenuClick({key: item.key})
                              }}
                            >
                              {item.label}
                            </Menu.Item>
                          ))}
                        </Menu.SubMenu>
                      )
                    }

                    if (menu.subnav && menu.subnav.length > 0) {
                      return (
                        <Menu.SubMenu
                          key={menu.link}
                          title={
                            <span
                              className="!hover:text-white !w-full py-1 text-[14px] leading-[18.23px]"
                              style={
                                isActive(menu.link)
                                  ? {fontWeight: '700', color: 'black'}
                                  : {fontWeight: '400', color: '#000000'}
                              }
                            >
                              {menu.name}
                            </span>
                          }
                        >
                          {menu.subnav.map((sub: any) => (
                            <Menu.Item
                              key={sub.link}
                              onClick={() => {
                                closeDrawer()
                                if (sub.coming_soon) {
                                  showComingSoon(true)
                                }
                              }}
                            >
                              {!sub.coming_soon ? (
                                <Link href={sub.link} className="text-black hover:text-black">
                                  {sub.name}
                                </Link>
                              ) : (
                                <span className="text-black hover:text-black">{sub.name}</span>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.SubMenu>
                      )
                    }

                    return (
                      <Menu.Item
                        key={menu.link}
                        style={
                          isActive(menu.link)
                            ? {marginRight: '10px', backgroundColor: 'black', border: 'none'}
                            : {backgroundColor: 'transparent'}
                        }
                        onClick={() => {
                          closeDrawer()
                          if (!menu.coming_soon) {
                            router.push(menu.link)
                            navigationRefetch()
                          } else {
                            showComingSoon(true)
                          }
                        }}
                      >
                        {!menu.coming_soon ? (
                          <Link
                            className="!hover:text-white block w-full py-1 text-[14px] leading-[18.23px] hover:opacity-70"
                            style={
                              isActive(menu.link)
                                ? {fontWeight: '700', color: 'white'} // Changed to black for mobile visibility
                                : {fontWeight: '400', color: '#000000'}
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
                                ? {fontWeight: '700', color: 'black'}
                                : {fontWeight: '400', color: '#000000'}
                            }
                          >
                            {menu.name}
                          </span>
                        )}
                      </Menu.Item>
                    )
                  })}
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
                    <CustomButton
                      onClick={() => {
                        logoutUserHandler({logoutFunc: closeDrawer})
                      }}
                      disabled={isLoadingLogout}
                      style={{
                        backgroundColor: '#000',
                        color: 'white',
                        border: 'none',
                        // Force the styles to remain the same on hover
                        transition: 'none' // Disable any transitions
                      }}
                      type="button"
                      className="flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#000] p-6 py-3.5 text-base font-medium text-white"
                    >
                      {isLoadingLogout ? (
                        <Spinner className="h-2 w-2 text-black" />
                      ) : (
                        <Icon icon="ic:round-logout" className="text-base" />
                      )}
                      <span className="">Log out</span>
                    </CustomButton>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <CustomButton
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
                        type="button"
                        className="w-full whitespace-nowrap rounded-lg bg-[#fff] px-6 py-2.5 text-sm font-medium text-black"
                      >
                        {/* <Icon icon="ic:round-logout" className="text-base" /> */}
                        <span className="">Sign Up</span>
                      </CustomButton>
                      <CustomButton
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
                        type="button"
                        className="w-full whitespace-nowrap rounded-lg bg-[#000] px-6 py-2.5 text-sm font-medium text-white"
                      >
                        <span className="">Login</span>
                      </CustomButton>
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
        className={`bg-[#F8F8F8] py-0`}
      >
        <div
          className={twMerge('mx-auto w-full max-w-screen-xl lg:mb-16 lg:px-5 xl:px-0 2xl:max-w-screen-2xl', className)}
        >
          {children}
        </div>
      </Content>

      <Footer style={{backgroundColor: '#000'}}>
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-4 px-5 lg:flex-row lg:gap-0 xl:px-0 2xl:max-w-screen-2xl">
          {' '}
          {/* Logo */}
          {isHolidaySeason ? (
            <Link href={isHome} className="!border-none !p-0">
              <Image src={'/assets/xmas-logo-white.svg'} alt="logo" width={140} height={150} />
            </Link>
          ) : (
            <Link href={isHome} className="!border-none !p-0">
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
