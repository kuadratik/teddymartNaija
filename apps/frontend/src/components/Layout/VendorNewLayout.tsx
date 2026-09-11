// components/DashboardLayout.tsx
import {useAppSelector} from '@/hooks/reduxHooks'
import {useHolidayPeriod} from '@/hooks/useHolidayPeriod'
import {logout, setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {setSelectedLanguage, setSelectionOccurred} from '@/redux/apiSlice/countrySlice'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useLoginMutation} from '@/services/auth'
import {useActiveUserQuery} from '@/services/general/general'
import {useGetUserStoreQuery} from '@/services/store'
import {IUserStoreDatum} from '@/types/userStore'
import {CloseOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Avatar, Button, Drawer, Dropdown, Layout, Menu, Tooltip} from 'antd'
import {useFormik} from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocalStorage} from 'react-use'
import {twJoin} from 'tailwind-merge'
import * as Yup from 'yup'
import {VendorLoginType} from '../Auth/Login/utils'
import ComingSoon from '../Auth/Products/components/ComingSoon'
import useLogout from '../Profile/hooks/useLogout'
import CustomButton from '../SharedUI/Buttons/Button'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import PlannerModal from '../SharedUI/ModalComponent'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'
import {useStoreSwitch} from '../Store/hooks/useStoreSwitch'
import {CustomerLayoutInterface, MobileWrapper} from './Customerlayout'

const {Header, Content, Footer} = Layout

const switchOptions = [{slug: 'customer', name: 'Customer View'}]

const profileOptions = [
  {value: 'my_profile', label: 'View profile', url: '/vendor/user-profile?tab=personal-information'},
  {value: 'create_new_store', label: 'Create New Store', url: '/vendor/new-store'},
  {value: 'logout', label: 'Logout', url: ''}
]

const VendorNewLayout: React.FC<{children: React.ReactNode} & CustomerLayoutInterface> = ({
  children,
  maxWidth,
  className
}) => {
  const [loginUser, {isLoading: loginLoading, error, isError}] = useLoginMutation()
  const {selectedLanguage, selectionOccurred} = useAppSelector(state => state.country)

  // Debug: Check localStorage directly
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const storedCountry = localStorage.getItem('country')
  //     console.log('💾 localStorage country:', storedCountry)
  //     console.log('🏴 Redux selectedLanguage:', selectedLanguage)
  //   }
  // }, [selectedLanguage])

  console.log('🚀 ~ VendorNewLayout ~ selectedLanguage:', selectedLanguage)
  const {data: userStoreData, isLoading: userStoreLoading} = useGetUserStoreQuery({currency: selectedLanguage.value})
  const allUserStores = userStoreData?.data || []
  console.log('🚀 ~ VendorNewLayout ~ allUserStores:', allUserStores)

  // Filter stores based on the selected currency/country
  const userStores = React.useMemo(() => {
    const filtered = allUserStores.filter((store: any) => store.currency === selectedLanguage.value)
    console.log('🔍 Store filtering:', {
      selectedCurrency: selectedLanguage.value,
      totalStores: allUserStores.length,
      filteredStoresCount: filtered.length,
      allStoreCurrencies: allUserStores.map((s: any) => ({name: s.name, currency: s.currency})),
      filteredStoresList: filtered.map((s: any) => ({name: s.name, currency: s.currency}))
    })
    return filtered
  }, [allUserStores, selectedLanguage.value])

  const router = useRouter()
  const {pathname} = router
  const isHolidaySeason = useHolidayPeriod()

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

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token from Redux

  // CRITICAL: Check the actual cookie token for authentication
  // The cookie is the source of truth for session validity
  const allCookiesForAuth = parseCookies()
  const cookiesTokenForAuth = allCookiesForAuth['token']

  // User is only authenticated if BOTH Redux state AND cookie token exist
  const isAuth = Boolean(isAuthenticatedToken && cookiesTokenForAuth)

  // const MenuItems = [
  // ]

  const {type} = useSelector((state: any) => state.vendor)

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  // const user = useAppSelector(state => state.auth.user)

  const MenuItems = React.useMemo(
    () => [
      {id: 1, link: '/vendor/dashboard', name: 'Dashboard', icon: 'material-symbols-light:home-outline'},
      {id: 2, link: `/vendor/products`, name: `Products`, icon: 'mdi-light:cart'},
      {id: 3, link: '/vendor/orders', name: 'Orders', icon: 'material-symbols-light:inventory-rounded'},
      {id: 4, link: '/vendor/shipping', name: 'Shipping', icon: 'carbon:delivery-parcel'},
      {id: 5, link: '/vendor/payout', name: 'Payout', icon: 'tdesign:money'},
      {id: 6, link: '/messages', name: 'Messages', icon: 'material-symbols-light:news-outline-sharp'},
      {id: 7, link: '/vendor/reviews', name: 'Reviews', icon: 'bx:support'}
    ],
    [isActiveUser?.type]
  )

  const menuLinksVal = React.useMemo(() => MenuItems.map(item => item.link), [MenuItems])

  const handleLoginUser = async ({payload}: {payload: VendorLoginType}) => {
    try {
      const response = await loginUser(payload).unwrap()
      router.push('/vendor/payout')

      resetForm()
    } catch (err: any) {
      console.log('err', err)
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The provided credentials are invalid.')) {
        setFieldError('password', 'Password is invalid')
      }
      if (err?.data?.errors?.password) {
        setFieldError('password', err.data.errors.password[0])
      }
      if (err?.data?.errors?.email && err?.data?.errors?.email[0].includes('The selected email is invalid.')) {
        setFieldError('email', 'Email is invalid')
      }
    }
  }
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
  const [showConfirm, setShowConfirm] = useState(false)

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        // bank: '',
        password: ''
      },
      validationSchema: Yup.object().shape({
        // bank: Yup.string().required('Bank name is required'),
        password: Yup.string().required('Password is required')
      }),
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: async val => {
        handleLoginUser({payload: {email: isAuthenticatedUser?.email || '', password: val.password}})
      }
    }
  )

  const dispatch = useDispatch()

  // Handle mismatch: Redux has token but cookie doesn't exist
  // This can happen when cookie expires or is manually deleted
  useEffect(() => {
    if (isAuthenticatedToken && !cookiesTokenForAuth) {
      console.log('⚠️ Auth mismatch: Redux token exists but cookie is missing. Clearing stale state...')
      // Clear stale Redux state
      dispatch(logout())
      // Remove stale localStorage data
      localStorage.removeItem('authUser')
      localStorage.removeItem('authToken')
      localStorage.removeItem('auth')
      // Redirect to login
      router.push('/auth/login')
    }
  }, [isAuthenticatedToken, cookiesTokenForAuth, dispatch, router])

  const showDrawer = () => setDrawerVisible(true)
  const closeDrawer = () => setDrawerVisible(false)

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  // console.log('🚀 ~ isAuthenticatedUser:', isAuthenticatedUser)

  // Create the store dropdown list, filtered by currency
  const storepdown = React.useMemo(() => {
    const updatedStoreList: any[] = []

    // @ts-ignore - Filter by currency first, then process
    userStores?.forEach(data => {
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

    return userStores?.length > 0 ? [...updatedStoreList, ...switchOptions] : switchOptions
  }, [userStores, selectedLanguage.value])

  // console.log(isAuthenticatedUser?.store)

  const {isLoading, data, isSuccess} = useActiveUserQuery()

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()

  const [token, setToken] = useLocalStorage<string | null>('authToken', null)
  const [user, setUser] = useLocalStorage<string | null>('authUser', null)

  const allCookies = parseCookies()

  // Assuming you want to retrieve a specific cookie named 'authToken'
  const cookiesToken = allCookies['token']

  const {handleStoreSwitch, dropDown, setDropDown} = useStoreSwitch()
  // Helper function to get store status
  const getStoreStatus = (store: IUserStoreDatum) => {
    if (store.active === 0 && store?.payment_status !== 'success') {
      return {
        label: 'Inactive',
        color: 'red', // or whatever color scheme you use
        variant: 'danger' // adjust based on your UI framework
      }
    }
    return {
      label: 'Active',
      color: 'green',
      variant: 'success'
    }
  }
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setCredentials({token: cookiesToken, user: data?.data}))

      let storeToSet = null

      if (isActiveUser) {
        const activeStore = data?.data?.store.filter((item: {id: any}) => item.id === isActiveUser?.id)
        if (activeStore.length) {
          storeToSet = activeStore[0]
          dispatch(setActiveStore({activeUser: activeStore[0]}))
        } else {
          storeToSet = data?.data?.store[0]
          dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
        }
      } else {
        storeToSet = data?.data?.store[0]
        dispatch(setActiveStore({activeUser: data?.data?.store[0]}))
      }

      // Sync currency with the active store only if user hasn't manually chosen one yet
      if (storeToSet?.currency && !selectionOccurred) {
        const currencyMapping: Record<
          string,
          {
            key: string
            value: 'USD' | 'NGN' | 'CAD'
            currencySign: string
            name: 'United States' | 'Nigeria' | 'Canada'
          }
        > = {
          USD: {key: 'us', value: 'USD', currencySign: '$', name: 'United States'},
          NGN: {key: 'ng', value: 'NGN', currencySign: '₦', name: 'Nigeria'},
          CAD: {key: 'ca', value: 'CAD', currencySign: 'C$', name: 'Canada'}
        }

        const selectedCurrency = currencyMapping[storeToSet.currency]
        if (selectedCurrency) {
          if (selectedCurrency.value !== selectedLanguage.value) {
            dispatch(setSelectedLanguage(selectedCurrency))
          }
          dispatch(setSelectionOccurred())
        }
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
  }, [cookiesToken, data, dispatch, isActiveUser, router, selectionOccurred, selectedLanguage.value])

  // Ensure the active store matches the selected currency
  useEffect(() => {
    // Only run if we have stores loaded
    if (allUserStores.length > 0) {
      // Filter stores by current currency
      const storesInCurrentCurrency = allUserStores.filter((store: any) => store.currency === selectedLanguage.value)

      console.log('🔄 Currency sync check:', {
        selectedCurrency: selectedLanguage.value,
        activeStoreCurrency: isActiveUser?.currency,
        storesInCurrentCurrency: storesInCurrentCurrency.length,
        activeStoreId: isActiveUser?.id,
        activeStoreName: isActiveUser?.name
      })

      // Check if we have stores in the selected currency
      if (storesInCurrentCurrency.length > 0) {
        // Check if the current active store's currency matches the selected currency
        if (!isActiveUser || isActiveUser.currency !== selectedLanguage.value) {
          // Find the first store that matches the selected currency
          const matchingStore = storesInCurrentCurrency[0]

          console.log('✅ Switching to matching store:', matchingStore.name, 'Currency:', matchingStore.currency)

          // Switch to the matching store
          dispatch(setActiveStore({activeUser: matchingStore}))
          dispatch(setType({type: matchingStore?.type === 'product' ? 'product' : 'service'}))
        } else {
          console.log('✓ Active store already matches currency')
        }
      } else {
        console.log('⚠️ No stores found for currency:', selectedLanguage.value)
        console.log(
          'Available currencies:',
          allUserStores.map((s: any) => s.currency)
        )
      }
    }
  }, [selectedLanguage.value, allUserStores, dispatch, isActiveUser])

  // If the user is not authenticated, redirect to login (client-side) after initial loading finishes
  useEffect(() => {
    if (!isLoading && !isAuth) {
      router.replace('/auth/login')
    }
  }, [isLoading, isAuth, router])

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between xl:px-0 2xl:max-w-screen-2xl">
        <SkeletonLoaderForPage length={2} />
      </div>
    )
  }

  if (!isAuth) {
    return (
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between xl:px-0 2xl:max-w-screen-2xl">
        <SkeletonLoaderForPage length={2} />
      </div>
    )
  }

  return (
    <React.Fragment>
      <Layout style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Header
          className="flex justify-between px-6 md:px-8 lg:px-6"
          style={{
            height: '78px',
            backgroundColor: '#000',
            display: '',

            alignItems: 'center'
          }}
        >
          <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between xl:px-0 2xl:max-w-screen-2xl">
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
                <TextComponent as="p" className="text-[10px] font-normal leading-[16px] text-white">
                  Find what you love, easily!
                </TextComponent>{' '}
              </Link>
            )}
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
                      {menu.id === 5 ? (
                        <span
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#d1d1d1'}
                          }
                          onClick={() => {
                            // showComingSoon(true)
                            if (pathname !== '/vendor/payout') {
                              router.push(menu.link)
                              return
                            }
                          }}
                        >
                          {menu.name}
                        </span>
                      ) : (
                        <Link
                          className="!hover:text-white py-1 text-[14px] leading-[18.23px] hover:border-b-[3px] hover:border-white"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#d1d1d1'}
                          }
                          href={menu.link}
                        >
                          {menu.name}
                        </Link>
                      )}
                    </Menu.Item>
                  )
                })}
              </Menu>
            </div>
            <div className="hidden gap-[20px] text-white md:gap-[35px] lg:flex lg:gap-[46px]">
              <div className="flex w-full items-center gap-[10px]">
                <TextComponent as="p" className="whitespace-nowrap text-[14px] font-normal leading-[19px] text-white">
                  Switch to
                </TextComponent>
                <div className="flex w-full cursor-pointer items-center justify-center gap-[20px]">
                  <Dropdown
                    trigger={['click']}
                    // className="flex w-full items-center justify-center"
                    overlay={
                      <Menu className="flex flex-col gap-1" style={{maxHeight: '500px', overflowY: 'auto'}}>
                        {userStores?.map((option, index: any) => {
                          const status = getStoreStatus(option)
                          console.log('🚀 ~ VendorNewLayout ~ status:', status)

                          return (
                            <Tooltip
                              title={status.label === 'Inactive' && 'Unpaid Store'}
                              placement="left"
                              key={option.id}
                            >
                              <div
                                onClick={() => {
                                  if (option.slug === 'customer') {
                                    router.push('/')
                                  } else {
                                    handleStoreSwitch(option)
                                  }
                                }}
                                className={`relative flex cursor-pointer justify-between gap-2 p-3 hover:bg-gray-200 ${isActiveUser?.name === option.name ? 'bg-gray-200' : ''}`}
                              >
                                {status.label === 'Inactive' && (
                                  <div
                                    className={`absolute h-2 w-2 animate-pulse rounded-full text-xs font-[500] text-white shadow-lg ${
                                      status.variant === 'danger'
                                        ? 'bg-red-500'
                                        : status.variant === 'success'
                                          ? 'bg-green-500'
                                          : 'bg-gray-500'
                                    }`}
                                  />
                                )}
                                <p className="px-4 text-[13px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                                  {option.name}
                                  {option?.slug == 'customer' ? '' : null}
                                </p>
                                {isActiveUser?.name === option.name ? (
                                  <Icon icon="material-symbols:check" className="text-[20px] text-[#27104E]" />
                                ) : (
                                  <></>
                                )}
                              </div>
                            </Tooltip>
                          )
                        })}
                        <div
                          onClick={() => {
                            router.push('/')
                          }}
                          className={`relative flex cursor-pointer justify-between gap-2 p-3 hover:bg-gray-200`}
                        >
                          <p className="px-4 text-[13px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                            Customer View
                          </p>
                        </div>
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
            style={{backgroundColor: 'transparent', border: 'none', color: '#fff'}}
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
                        if (menu.id === 5) {
                          if (pathname !== '/vendor/payout') {
                            router.push(menu.link)
                            return
                          }
                        } else {
                          router.push(menu.link)
                        }
                      }}
                      key={menu.link}
                      className="hover:border-[1px] hover:border-black"
                      style={{marginRight: '10px'}}
                    >
                      {menu.id === 5 ? (
                        <button
                          className="!hover:text-white flex items-center justify-center gap-2 text-[14px]"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#000000'}
                          }
                        >
                          <Icon className="w-[50px] text-[24px]" icon={menu.icon} />

                          <span className="w-full">{menu.name}</span>
                        </button>
                      ) : (
                        <Link
                          className="!hover:text-white flex items-center justify-center gap-2 text-[14px]"
                          style={
                            isActive(menu.link)
                              ? {fontWeight: '700', color: 'white'}
                              : {fontWeight: '400', color: '#000000'}
                          }
                          href={menu.link}
                        >
                          <Icon className="w-[50px] text-[24px]" icon={menu.icon} />

                          <span className="w-full">{menu.name}</span>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu>
              </MobileWrapper>
            </div>

            {/* Logout Button at the Bottom */}
            <div style={{padding: '16px', marginTop: 'auto'}}>
              <div className="flex flex-col gap-3">
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
                        <Menu className="flex flex-col gap-1" style={{maxHeight: '500px', overflowY: 'auto'}}>
                          {storepdown?.map((option: any, index: any) => {
                            const status = getStoreStatus(option)
                            return (
                              <Tooltip
                                title={status.label === 'Inactive' && 'Unpaid Store'}
                                placement="left"
                                key={option.id}
                              >
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
                                  {status.label === 'Inactive' && (
                                    <div
                                      className={`absolute left-2 h-2 w-2 animate-pulse rounded-full text-xs font-[500] text-white shadow-lg ${
                                        status.variant === 'danger'
                                          ? 'bg-red-500'
                                          : status.variant === 'success'
                                            ? 'bg-green-500'
                                            : 'bg-gray-500'
                                      }`}
                                    />
                                  )}
                                  <p className="text-[13px] font-semibold text-[#1D1D1D] visited:text-[#27104E]">
                                    {option.name}{' '}
                                  </p>
                                  {isActiveUser?.name === option.name ? (
                                    <Icon icon="material-symbols:check" className="text-[20px] text-[#27104E]" />
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </Tooltip>
                            )
                          })}
                        </Menu>
                      }
                      trigger={['click']}
                      open={mobileDropDown}
                      onVisibleChange={visible => {
                        setMobileDropDown(visible)
                      }}
                    >
                      <div className="p flex cursor-pointer flex-row items-center gap-2 rounded-lg bg-[#D4D4D4] px-[11px] py-[8px] font-inter text-sm font-medium">
                        <TextComponent as="p" className="whitespace-nowrap text-[14px] font-normal text-black">
                          {isAuthenticatedUser?.first_name} {isAuthenticatedUser?.last_name}
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

        {isActiveUser?.active === 0 && isActiveUser?.payment_status !== 'success' ? (
          <div className="mt-10 flex min-h-full flex-1 items-center justify-center px-4">
            <div className="flex max-w-md flex-col items-center gap-6 text-center">
              {/* Icon/Illustration */}
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-orange-400 opacity-20" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
                  <Icon icon="mdi:store-off-outline" className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <TextComponent as="h2" className="text-2xl font-bold text-gray-900">
                  Store Inactive
                </TextComponent>
                <TextComponent as="p" className="text-base leading-relaxed text-gray-600">
                  Your store is currently inactive. Activate your store now to unlock your dashboard and start managing
                  your products.
                </TextComponent>
              </div>

              {/* Activate Button */}
              <button
                onClick={() => {
                  /* Handle activation */
                  router.push(`/mek/onboarding?store_id=${isActiveUser.id}`)
                }}
                className="group relative overflow-hidden rounded-lg bg-black px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon icon="mdi:store-check-outline" className="h-5 w-5" />
                  Activate Store
                </span>
                {/* Hover effect */}
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>

              {/* Additional help text */}
              {/* <TextComponent as="p" className="text-xs text-gray-500">
                Need help?{' '}
                <span className="cursor-pointer font-semibold text-black underline hover:text-gray-700">
                  Contact Support
                </span>
              </TextComponent> */}
            </div>
          </div>
        ) : (
          <Content
            style={{flex: 1, marginTop: maxWidth ? undefined : '20px'}}
            className={`bg-transparent ${maxWidth ? '' : 'py-0 md:px-8 lg:px-16'}`}
          >
            <div className={twJoin(`mx-auto mb-16 max-w-screen-xl px-5 pt-10 xl:px-0 2xl:max-w-screen-2xl`, className)}>
              {children}
            </div>
          </Content>
        )}

        <Footer style={{textAlign: 'center', backgroundColor: '#fff'}}>{new Date().getFullYear()} © AfricanDiasporaMart</Footer>
      </Layout>
      <PlannerModal
        modalOpen={comingSoon}
        setModalOpen={showComingSoon}
        onCloseModal={() => showComingSoon(false)}
        modalStyles={{content: {backgroundColor: 'black'}}}
      >
        <ComingSoon onClose={() => showComingSoon(false)} />
      </PlannerModal>
    </React.Fragment>
  )
}

export default VendorNewLayout
