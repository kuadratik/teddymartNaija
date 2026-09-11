// components/DashboardLayout.tsx
import {useAppSelector} from '@/hooks/reduxHooks'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useActiveUserQuery} from '@/services/auth'
import {CloseOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Avatar, Button, Drawer, Dropdown, Layout, Menu} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocalStorage} from 'react-use'
import ComingSoon from '../Auth/Products/components/ComingSoon'
import useLogout from '../Profile/hooks/useLogout'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '../SharedUI/ModalComponent'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'
import {CustomerLayoutInterface, MobileWrapper} from './Customerlayout'
import {useStoreSwitch} from '../Store/hooks/useStoreSwitch'

const {Header, Content, Footer} = Layout

const switchOptions = [{slug: 'customer', name: 'Customer View'}]

const profileOptions = [
  {value: 'my_profile', label: 'View profile', url: '/vendor/user-profile?tab=personal-information'},
  {value: 'create_new_store', label: 'Create New Store', url: '/vendor/new-store'},
  {value: 'logout', label: 'Logout', url: ''}
]

const VendorNewLayout: React.FC<{children: React.ReactNode} & CustomerLayoutInterface> = ({children, maxWidth}) => {
  const router = useRouter()

  const [menuKey, setMenuKey] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setMenuKey(prev => prev + 1) // Trigger re-render
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuth = isAuthenticatedToken

  // const MenuItems = [
  // ]

  const {type} = useSelector((state: any) => state.vendor)

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const MenuItems = React.useMemo(
    () => [
      {
        id: 1,
        link: '/vendor/dashboard',
        name: 'Dashboard',
        icon: 'material-symbols-light:home-outline'
      },
      {
        id: 2,
        link: `/vendor/${isActiveUser?.type === 'product' ? 'products' : 'add-service'}`,
        name: `${isActiveUser?.type === 'product' ? 'Products' : 'Services'}`,
        icon: 'mdi-light:cart'
      },
      {
        id: 3,
        link: '/vendor/orders',
        name: 'Orders',
        icon: 'material-symbols-light:inventory-rounded'
      },
      {
        id: 4,
        link: '/vendor/shipping',
        name: 'Shipping',
        icon: 'carbon:delivery-parcel'
      },
      {
        id: 5,
        link: '/vendor/payout',
        name: 'Payout',
        icon: 'carbon:delivery-parcel'
      },
      {
        id: 6,
        link: '/messages',
        name: 'Messages',
        icon: 'material-symbols-light:news-outline-sharp'
      },
      {
        id: 7,
        link: '/vendor/reviews',
        name: 'Reviews',
        icon: 'bx:support'
      }
    ],
    [isActiveUser?.type]
  )

  const menuLinksVal = React.useMemo(() => MenuItems.map(item => item.link), [MenuItems])
  // @ts-ignore
  const determineSelectedKey = (path: string) => {
    // Get the menu links to compare
    const menuLinks = menuLinksVal

    // Find the longest matching base path from menu links
    const matchingKey = menuLinks.find(link => path.startsWith(link))

    // If a match is found, return it; otherwise, return the full path
    return matchingKey || path
  }

  const selectedKey = determineSelectedKey(router.pathname)
  // Function to check if the current path matches the menu link, considering sub-paths and query parameters
  const isActive = (link: string) => {
    if (link === '/' && router.asPath === '/') {
      return true
    }
    const regex = new RegExp(`^${link}(/|\\?|$)`)
    return regex.test(router.asPath)
  }

  // const [dropDown, setDropDown] = useState(false)

  const [mobileDropDown, setMobileDropDown] = useState(false)

  const [profileDropdown, setProfileDropdown] = useState(false)

  const [drawerVisible, setDrawerVisible] = useState(false)

  const [comingSoon, showComingSoon] = useState(false)

  const dispatch = useDispatch()

  const showDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user

  const updatedStoreList: any[] = []

  // @ts-ignore
  isAuthenticatedUser?.store?.forEach(data => {
    const {user, ...rest} = data

    if (user.offers_product) {
      updatedStoreList.push({
        ...rest,
        user: {
          ...user,
          offers_product: true,
          offers_service: false // set offers_service to false for clarity in this case
        }
      })
    }

    if (user.offers_service) {
      updatedStoreList.push({
        ...rest,
        user: {
          ...user,
          offers_product: false, // set offers_product to false for clarity in this case
          offers_service: true
        }
      })
    }
  })

  const storepdown = React.useMemo(
    () => (isAuthenticatedUser?.store ? [...updatedStoreList, ...switchOptions] : switchOptions),
    [isAuthenticatedUser?.store]
  )

  // console.log(storepdown)

  // console.log(isAuthenticatedUser?.store)

  const {isLoading, data, isSuccess} = useActiveUserQuery({})

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)

  const allCookies = parseCookies()

  // Assuming you want to retrieve a specific cookie named 'authToken'
  const cookiesToken = allCookies['token']

  const {handleStoreSwitch, dropDown, setDropDown} = useStoreSwitch()

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setCredentials({token: cookiesToken, user: data?.data}))
      if (isActiveUser) {
        const activeStore = data?.data?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          // console.log(activeStore[0], 'here')
          dispatch(setActiveStore({activeUser: activeStore[0]}))
        } else {
          dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
        }
      } else {
        dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
      }

      // Optionally, update local storage

      setToken(cookiesToken)
      setUser(data?.data as any)

      if (!data?.data?.has_store) {
        // Redirect to dashboard or other page
        setTimeout(() => {
          router.push('/')
        }, 0)
        // Example redirect to dashboard
      }
    }
  }, [data])

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }


  return (
    <React.Fragment>
      <Layout style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
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
              <TextComponent as="p" className="text-[10px] font-normal leading-[22px] text-white">
                Find what you love, easily!
              </TextComponent>{' '}
            </Link>
            <div className="hidden lg:block">
              {' '}
              <Menu
                theme="dark"
                key={menuKey}
                className="md:block"
                mode="horizontal"
                overflowedIndicator={null}
                selectedKeys={selectedKey as any}
                style={{backgroundColor: 'black'}}
              >
                {MenuItems?.map(menu => {
                  return (
                    <Menu.Item key={menu.link} style={{marginRight: '10px'}}>
                      {/* {menu.id === 4 || menu.id === 5 ? (
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
                      ) : ( */}
                        <Link
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#717171'}
                          }
                          href={menu.link}
                        >
                          {menu.name}
                        </Link>
                      {/* )} */}
                    </Menu.Item>
                  )
                })}
              </Menu>
            </div>
            <div className="hidden gap-[46px] text-white lg:flex">
              <div className="flex w-full items-center gap-[10px]">
                <TextComponent as="p" className="whitespace-nowrap text-[14px] font-normal leading-[19px] text-white">
                  Switch to
                </TextComponent>
                <div className="flex w-full cursor-pointer items-center justify-center gap-[20px]">
                  <Dropdown
                    trigger={['click']}
                    // className="flex w-full items-center justify-center"
                    overlay={
                      <Menu className="flex flex-col gap-1">
                        {storepdown?.map((option: any, index: any) => (
                          <div
                            key={option.id}
                            onClick={() => {
                              if (option.slug === 'customer') {
                                router.push('/')
                              } else {
                                handleStoreSwitch(option)
                              }
                            }}
                            className={`flex cursor-pointer justify-between gap-2 p-3 hover:bg-gray-200 ${isActiveUser?.name === option.name ? 'bg-gray-200' : ''}`}
                          >
                            {' '}
                            <p className="text-[13px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                              {option.name}
                              {option?.slug == 'customer' ? (
                                ''
                              ) : (
                                <span className="ml-1 text-[10px] italic text-[#6B7280]">
                                  {option?.type === 'product' ? '(Product)' : '(Service)'}
                                </span>
                              )}
                            </p>
                            {isActiveUser?.name === option.name ? (
                              <Icon icon="material-symbols:check" className="text-[20px] text-[#27104E]" />
                            ) : (
                              <></>
                            )}
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
                        {isActiveUser?.name}
                      </TextComponent>
                      <Icon icon={'ep:arrow-down-bold'} className="text-[16px] text-white" />
                    </div>
                  </Dropdown>

                  <Dropdown
                    trigger={['click']}
                    overlay={
                      <Menu className="flex flex-col gap-1">
                        {profileOptions.map((option: any, index: any) => (
                          <div
                            key={option.id}
                            onClick={() => {
                              if (option.value === 'logout') {
                                logoutUserHandler({
                                  logoutFunc: () => {
                                    setProfileDropdown(false)
                                  }
                                })

                                // handleLogout()
                              } else {
                                router.push(option.url)
                                setProfileDropdown(false)
                              }
                              router.push(option.url)
                            }}
                            className={`flex cursor-pointer gap-2 rounded-md p-3 ${option.value === 'logout' ? '!hover:bg-black bg-black' : 'hover:bg-gray-200'} `}
                          >
                            <p
                              className={`text-[14px] font-semibold ${option.value === 'logout' ? 'text-white' : 'text-[#1D1D1D]'} visited:text-[#27104E]`}
                            >
                              {option.label}
                            </p>
                            {option.value === 'logout' && isLoadingLogout && <Spinner />}
                            {/* {isActiveUser?.name === option.name ? (
                            <Icon icon="material-symbols:check" className="text-[20px] text-[#27104E]" />
                          ) : (
                            <></>
                          )} */}
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
                    <div className="flex items-center gap-6 rounded-lg bg-[#000] px-[11px] py-[8px] font-inter text-sm font-medium">
                      <div className="flex items-center gap-1">
                        {' '}
                        <div className="rounded-full bg-white p-[2px]">
                          {isActiveUser?.profile_picture_path ? (
                            <Avatar
                              className="w-full"
                              src={`${process.env.imageBaseUrl}/${isActiveUser?.profile_picture_path}`}
                              size={24}
                            />
                          ) : (
                            <Icon icon="lucide:user" className="text-base text-black" />
                          )}
                        </div>
                        <TextComponent as="p" className="text-[14px] font-normal text-white">
                          Profile
                        </TextComponent>
                      </div>
                      <Icon icon={'ep:arrow-down-bold'} className="text-[16px] text-white" />
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <button
            style={{
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
                    <div className="rounded-[9px] bg-[#F4F4F4]">
                      {isActiveUser?.profile_picture_path ? (
                        <Avatar
                          shape="square"
                          className="w-full"
                          src={`${process.env.imageBaseUrl}/${isActiveUser?.profile_picture_path}`}
                          size={36}
                        />
                      ) : (
                        <div className="p-2">
                          {' '}
                          <Icon icon="mdi:user" className="text-2xl text-black" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <TextComponent as="p" className="text-[16px] font-semibold leading-[12px] text-[#141414]">
                        {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
                      </TextComponent>
                      <Link href="/vendor/user-profile?tab=personal-information" legacyBehavior passHref>
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
                <Menu
                  theme="dark"
                  mode="vertical"
                  selectedKeys={selectedKey as any}
                  style={{backgroundColor: 'transparent'}}
                >
                  {MenuItems?.map(menu => (
                    <Menu.Item
                      onClick={() => {
                        closeDrawer()
                        // if (menu.id === 4 || menu.id === 5) {
                        //   showComingSoon(true)
                        // } else {
                          router.push(menu.link)
                        // }
                      }}
                      key={menu.link}
                      className="hover:border-[1px] hover:border-black"
                      style={{marginRight: '10px'}}
                    >
                      {/* {menu.id === 4 || menu.id === 5 ? (
                        <Button
                          className="!hover:text-white flex !w-full items-center justify-center gap-2 !border-none !p-0 text-[14px] leading-[18.23px]"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#717171'}
                          }
                        >
                          <Icon className="w-[50px] text-[24px]" icon={menu.icon} />
                          <span className="w-full text-left">{menu.name}</span>
                        </Button>
                      ) : ( */}
                        <Link
                          className="!hover:text-white flex items-center justify-center gap-2 text-[14px]"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#717171'}
                          }
                          href={menu.link}
                        >
                          <Icon className="w-[50px] text-[24px]" icon={menu.icon} />

                          <span className="w-full">{menu.name}</span>
                        </Link>
                      {/* )} */}
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
                      className=""
                      overlay={
                        <Menu className="flex flex-col gap-1">
                          {storepdown?.map((option: any, index: any) => (
                            <div
                              key={option.id}
                              onClick={() => {
                                closeDrawer()
                                if (option.slug === 'customer') {
                                  router.push('/')
                                  setMobileDropDown(false)
                                } else {
                                  handleStoreSwitch(option)
                                  setMobileDropDown(false)
                                }
                              }}
                              className={`flex cursor-pointer justify-between gap-2 p-3 hover:bg-gray-200 ${isActiveUser?.name === option.name ? 'bg-gray-200' : ''}`}
                            >
                              {' '}
                              <p className="text-[13px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                                {option.name}
                                {option?.slug == 'customer' ? (
                                  ''
                                ) : (
                                  <span className="ml-1 text-[10px] italic text-[#6B7280]">
                                    {option?.type === 'product' ? '(Product)' : '(Service)'}
                                  </span>
                                )}
                              </p>
                              {isActiveUser?.name === option.name ? (
                                <Icon icon="material-symbols:check" className="text-[20px] text-[#27104E]" />
                              ) : (
                                <></>
                              )}
                            </div>
                          ))}
                        </Menu>
                      }
                      trigger={['click']}
                      open={mobileDropDown}
                      onVisibleChange={visible => {
                        setMobileDropDown(visible)
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
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => {
                          closeDrawer()
                          router.push('/vendor/new-store')
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
                        <span className="">Create New Store</span>
                      </Button>

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
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => {
                          closeDrawer()
                          router.push('/auth/sign-up')
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
                          router.push('/auth/login')
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

        <Content
          style={{flex: 1, marginTop: maxWidth ? '' : '20px'}}
          className={`bg-transparent ${maxWidth ? '' : 'px-[6px] py-0 md:px-[30px] lg:px-[60px]'}`}
        >
          <div className={`${maxWidth ? '' : 'p-[8px] md:p-[20px]'} mb-[60px]`}>{children}</div>
        </Content>

        <Footer style={{textAlign: 'center', backgroundColor: '#fff'}}>{new Date().getFullYear()} © myEki</Footer>
      </Layout>
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
    </React.Fragment>
  )
}

export default VendorNewLayout
