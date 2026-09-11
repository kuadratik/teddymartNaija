// components/DashboardLayout.tsx
import {Layout, Menu, Drawer, Button, Dropdown, Avatar} from 'antd'
import {MenuOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import TextComponent from './TextComponent'
import {Icon} from '@iconify/react'
import {useAppSelector} from '@/hooks/reduxHooks'
import React from 'react'
import {useDispatch} from 'react-redux'
import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {useActiveUserQuery} from '@/services/auth'
import {useLocalStorage} from 'react-use'
import SkeletonLoaderForPage from './Loader/SkeletonLoaderForPage'

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

const switchOptions = [{slug: 'customer', name: 'Customer View'}]

const profileOptions = [
  {value: 'edit_store_info', label: 'Edit Store Information', url: '/vendor/user-profile?tab=store-information'},
  {value: 'change_password', label: 'Change Password', url: '/vendor/user-profile?tab=password'},
  {value: 'create_new_store', label: 'Create New Store', url: '/vendor/user-profile'},
  {value: 'logout', label: 'Logout', url: '/vendor/user-profile'}
]

const StoreFrontLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const router = useRouter()

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
    () => (isAuthenticatedUser?.store ? [...isAuthenticatedUser?.store, ...switchOptions] : switchOptions),
    [isAuthenticatedUser?.store]
  )

  const {isLoading, data, isSuccess} = useActiveUserQuery({})

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const handleStoreSwitch = (value: any) => {
    dispatch(setActiveStore({activeUser: value}))
    setDropDown(false)
  }

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setCredentials({token: token, user: data?.data}))
      if (isActiveUser) {
        const activeStore = data?.data?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          dispatch(setActiveStore({activeUser: activeStore[0]}))
        } else {
          dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
        }
      } else {
        dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
      }

      // Optionally, update local storage

      setToken(token)
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
          </Link>
          <Menu theme="dark" mode="horizontal" selectedKeys={[router.pathname]} style={{backgroundColor: 'black'}}>
            {MenuItems?.map(menu => {
              return (
                <Menu.Item key={menu.link} style={{marginRight: '10px'}}>
                  <Link
                    className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white"
                    style={
                      isActive(menu.link) ? {fontWeight: '700', color: 'white'} : {fontWeight: '400', color: '#717171'}
                    }
                    href={menu.link}
                  >
                    {menu.name}
                  </Link>
                </Menu.Item>
              )
            })}
          </Menu>
          <div className="hidden gap-[46px] text-white md:flex">
            <div className="flex w-full items-center gap-[10px]">
              <TextComponent as="p" className="whitespace-nowrap text-[14px] font-normal leading-[19px] text-white">
                Switch to
              </TextComponent>
              <div className="flex w-full cursor-pointer items-center justify-center gap-[46px]">
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu className="flex flex-col gap-1">
                      {storepdown.map((option: any, index: any) => (
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
                          <p className="text-[12px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                            {option.name}
                            {option?.slug == 'customer' ? (
                              ''
                            ) : (
                              <span className="ml-1 text-[8px] text-[#6B7280]">
                                {option?.user?.offers_product ? '(Product)' : '(Service)'}
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
                            router.push(option.url)
                            setProfileDropdown(false)
                          }}
                          className={`flex cursor-pointer gap-2 rounded-md p-3 ${option.value === 'logout' ? '!hover:bg-black bg-black' : 'hover:bg-gray-200'} `}
                        >
                          <p
                            className={`text-[14px] font-semibold ${option.value === 'logout' ? 'text-white' : 'text-[#1D1D1D]'} visited:text-[#27104E]`}
                          >
                            {option.label}
                          </p>
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
                      <div className="rounded-full bg-white p-1">
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

      <Content style={{flex: 1, marginTop: '6px'}} className="px-[10px] py-0 md:px-[85px]">
        <div className="p-[8px] md:p-[20px]">{children}</div>
      </Content>

      <Footer style={{textAlign: 'center', backgroundColor: '#fff'}}>2024 © myEki</Footer>
    </Layout>
  )
}

export default StoreFrontLayout
