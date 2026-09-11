import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllStoreListingQuery} from '@/services/store'
import {useGetAllNavigationQuery} from '@/services/super-admin/nav-bar'
import {Icon} from '@iconify/react'
import {Dropdown, Menu, Space} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import ComingSoon from './ComingSoon'

const normalizeNavValue = (value?: string | null) => (value ? value.toString().trim().toLowerCase() : '')

const isFindVendorNavItem = (item: any) => {
  const normalizedName = normalizeNavValue(item?.name)
  const normalizedIdentifier = normalizeNavValue(item?.identifier ?? item?.slug ?? item?.type ?? item?.key)
  const normalizedPath = normalizeNavValue(item?.path ?? item?.link)

  return (
    normalizedName === 'find a vendor' ||
    normalizedName === 'find vendor' ||
    normalizedName === 'find vendors' ||
    normalizedIdentifier === 'vendor-dropdown' ||
    normalizedPath === '/find-vendor'
  )
}

interface navItems {
  name: string
  link?: string
}

const NewNavigation = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)
  const ReceivedMessage = useSelector((state: any) => state?.chat?.messages)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const {
    data: navigationData,
    isLoading: navigationLoading,
    refetch: navigationRefetch
  } = useGetAllNavigationQuery({
    type: 'bottom'
  })
  console.log('🚀 ~ NewNavigation ~ navigationData:', navigationData)
  const isAuth = isAuthenticatedToken

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user

  const {data, isLoading, refetch} = useGetAllStoreListingQuery({
    listType: 'product',
    currency: selectedLanguage.value,
    sortType: 'alphanumeric'
  })

  const fallbackNavigationItems = React.useMemo(
    () => [
      // {
      //   name: 'Become a MEK Vendor',
      //   path: !isAuth
      //     ? '/auth/sign-up'
      //     : isAuthenticatedUser?.store?.length > 0
      //       ? '/vendor/dashboard'
      //       : '/mek/onboarding'
      // },
      {
        name: 'Find a Vendor',
        path: '/find-vendor'
      },
      // {
      //   name: 'Promote Store',
      //   path: 'promote-store'
      // },
      {
        name: 'Reviews',
        path: ''
      },
      {
        name: 'Messages',
        path: '/messages'
      }

      // {
      //   name: 'Get Listed',
      //   path: '/get-list'
      // },
      // {
      //   name: 'MEK Directory',
      //   path: '/mek-directory'
      // }
    ],
    [isAuthenticatedUser, isAuth]
  )

  const navigationItems = React.useMemo(() => {
    if (navigationData?.data && navigationData.data.length > 0) {
      return [...navigationData.data]
        .filter((item: any) => item.active)
        .sort((a: any, b: any) => Number(a.ordering) - Number(b.ordering))
        .map((item: any) => ({
          ...item,
          name: item.name,
          path: item.link || item.path,
          coming_soon: item.coming_soon,
          subnav: item.subnav
        }))
    }
    return fallbackNavigationItems
  }, [navigationData, fallbackNavigationItems])

  const firstNavItems = [
    {
      name: 'Become a MEK Rider',
      path: ''
    },
    {
      name: 'Find a Vendor',
      path: '/find-vendor'
    },
    {
      name: 'Promote Store',
      path: '/promote-store'
    }
  ]

  const [comingSoon, showComingSoon] = React.useState(false)
  const [dropDown, setDropDown] = React.useState(false)
  const [expandedMobileNav, setExpandedMobileNav] = React.useState<string | null>(null)
  const [selectedNavigationItem, setSelectedNavigationItem] = React.useState('Find a Vendor')

  useEffect(() => {
    setSelectedNavigationItem(
      router.pathname === '/mek/onboarding'
        ? 'Find a Vendor'
        : router.pathname === '/find-vendor'
          ? 'Find a Vendor'
          : router.pathname === '/mek/onboarding'
            ? 'Become a MEK Vendor'
            : 'Find a Vendor'
    )
  }, [router.pathname])

  const transformedRegularItems =
    data?.data?.data && Array.isArray(data?.data?.data)
      ? data?.data?.data
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

  const menuItems = [...transformedRegularItems, transformedViewAllItem]

  const handleMenuClick = ({key}: any) => {
    if (key === 'view-all') {
      router.push('/find-vendor') // Navigate to find vendor page
    } else {
      const clickedItem = data?.data?.data.find((item: any) => item?.id.toString() === key.toString())
      if (clickedItem) {
        router.push(`/store/${clickedItem.slug}`) // Navigate to store page
      } else {
        // console.log('Item not found')
      }
    }
  }

  // Handler for navigation clicks
  const handleSecondNavigationClick = (item: any) => {
    if (item.path) {
      setSelectedNavigationItem(item.name)
      router.push(item.path)
    } else {
      showComingSoon(true)
    }
  }

  const toggleMobileSubnav = (key: string) => {
    setExpandedMobileNav(prev => (prev === key ? null : key))
  }
  return (
    <section className="w-full bg-[#DFE1E5] lg:mx-auto lg:overflow-x-scroll">
      {isDesktop && (
        <div className="flex w-full flex-col items-center gap-2 lg:h-[56px] lg:flex-row lg:justify-evenly lg:overflow-x-scroll">
          <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-center gap-2 px-5 lg:px-[10%] xl:px-0 2xl:max-w-screen-2xl">
            {navigationItems.map((item: any, i: number) => {
              if (isFindVendorNavItem(item)) {
                return (
                  <div className="flex-1" key={i}>
                    <Dropdown
                      overlayClassName="mx-auto mt-1"
                      menu={{
                        items: menuItems,
                        className: 'grid grid-cols-8 w-[90%]',
                        onClick: handleMenuClick
                      }}
                      destroyPopupOnHide
                      trigger={['click']}
                    >
                      <a
                        onClick={e => e.preventDefault()}
                        className={`flex h-[42px] w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${router.pathname === item.path ? 'bg-black text-white' : ''}`}
                      >
                        <Space>
                          <span className="whitespace-nowrap py-4 text-center text-[14px] font-medium leading-[18px]">
                            {item?.name}
                          </span>
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                )
              }

              if (item.subnav && item.subnav.length > 0) {
                return (
                  <div className="flex-1" key={i}>
                    <Dropdown
                      overlayClassName="mx-auto mt-1"
                      overlay={
                        <Menu>
                          {item.subnav.map((sub: any) => (
                            <Menu.Item
                              key={sub.link}
                              onClick={() => {
                                if (sub.coming_soon) {
                                  showComingSoon(true)
                                } else {
                                  router.push(sub.link)
                                }
                              }}
                            >
                              <span className="cursor-pointer text-black hover:text-black">{sub.name}</span>
                            </Menu.Item>
                          ))}
                        </Menu>
                      }
                      destroyPopupOnHide
                      trigger={['click']}
                    >
                      <a
                        onClick={e => e.preventDefault()}
                        className={`flex h-[42px] w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${router.pathname === item.path ? 'bg-black text-white' : ''}`}
                      >
                        <Space>
                          <span className="whitespace-nowrap py-4 text-center text-[14px] font-medium leading-[18px]">
                            {item?.name}
                          </span>
                          <Icon icon="ep:arrow-down-bold" className="text-[10px]" />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                )
              }

              return (
                <button
                  className={`flex h-[42px] flex-1 cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${router.pathname === item.path ? 'bg-black text-white' : 'text-black'}`}
                  key={i}
                  onClick={() => {
                    if (item.coming_soon) {
                      showComingSoon(true)
                    } else if (item.path) {
                      router.push(item.path)
                    } else {
                      showComingSoon(true)
                    }
                  }}
                >
                  <span className="whitespace-nowrap py-4 text-center text-[14px] font-medium leading-[18px]">
                    {item?.name}
                  </span>
                </button>
              )
            })}
          </div>
          {/* <div className="flex h-full w-full flex-row items-center justify-center gap-2 rounded-lg bg-[#DFE1E5] px-[10px]">
            <button
              className={`mx-auto flex h-[42px] w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${router.pathname === '/mek/onboarding' ? 'lg:bg-black lg:text-white' : 'lg:bg-white lg:text-black'}`}
              onClick={() => {
                if (!isAuth) {
                  router.push(`/auth/sign-up?redirect=${encodeURIComponent('/mek/onboarding')}`)
                } else if (isAuthenticatedUser?.store?.length > 0) {
                  router.push('/vendor/dashboard')
                } else {
                  router.push('/mek/onboarding')
                }
              }}
            >
              <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[18px]">
                Become a MEK Vendor
              </p>
            </button>
          </div> */}
          {/* <div className="flex h-full w-full flex-row items-center justify-center gap-2 bg-[#DFE1E5] px-[10px]">
            {secondNavItems.map((item: string, i: number) => (
              <button
                className={`flex h-[42px] cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${item.name === 'Become a MEK Rider' ? 'mx-auto lg:bg-white lg:text-black' : 'w-full'}`}
                key={i}
                onClick={() => {
                  if (item === 'Become a MEK Vendor') {
                    router.push('/vendor/onboarding')
                  } else if (item === 'Get Listed') {
                    router.push('/get-list')
                  } else {
                    showComingSoon(true)
                  }
                }}
              >
                <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[18px]">{item.name}</p>
              </button>
            ))}
            {secondNavItems.map((item: {name: string; path: string}, i: number) => (
              <button
                className={`flex h-[42px] cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${item.name === 'Become a MEK Rider' ? 'mx-auto lg:bg-white lg:text-black' : 'w-full'} ${router.pathname === item.path ? 'bg-black text-white' : ''} `}
                key={i}
                onClick={() => handleSecondNavigationClick(item)}
              >
                <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[18px]">{item.name}</p>
              </button>
            ))}
          </div> */}
          {/* {navigationItems?.map((item: string, i: number) => (
            <button
              className={`flex h-[42px] cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${item === 'Become a MEK Rider' ? 'mx-auto lg:bg-white lg:text-black' : 'w-full'}`}
              key={i}
              onClick={() => {
                if (item === 'Become a MEK Vendor') {
                  router.push('/vendor/onboarding')
                } else {
                  showComingSoon(true)
                }
              }}
            >
              <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[18px]">{item}</p>
            </button>
          ))} */}
        </div>
      )}

      {!isDesktop && (
        <div>
          <Dropdown
            overlay={
              <div className="flex min-w-[280px] flex-col gap-2 rounded-xl bg-white p-3 shadow-lg">
                {navigationItems?.map((item: any, i: number) => {
                  const navKey = item?.id ? `nav-${item.id}` : `nav-${i}`

                  if (isFindVendorNavItem(item)) {
                    return (
                      <button
                        key={`vendor-${navKey}`}
                        className="rounded-lg bg-[#F3F4F6] px-4 py-3 text-center text-[14px] font-semibold leading-[18px] text-[#111827]"
                        onClick={() => {
                          setDropDown(false)
                          setExpandedMobileNav(null)
                          setSelectedNavigationItem(item.name)
                          router.push('/find-vendor')
                        }}
                      >
                        {item.name}
                      </button>
                    )
                  }

                  if (item.subnav && item.subnav.length > 0) {
                    const isExpanded = expandedMobileNav === navKey
                    return (
                      <div key={`submenu-wrapper-${navKey}`} className="flex flex-col">
                        <button
                          className="flex items-center justify-center relative rounded-lg bg-[#E5E7EB] px-4 py-3 text-left text-[14px] font-semibold leading-[18px] text-[#111827]"
                          onClick={() => toggleMobileSubnav(navKey)}
                        >
                          <span>{item.name}</span>
                          <Icon
                            icon="ep:arrow-down-bold"
                            className={`text-[12px] absolute right-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="mt-2 flex flex-col gap-1 rounded-lg bg-[#F9FAFB] p-2">
                            {item.subnav.map((sub: any, index: number) => (
                              <button
                                key={`submenu-${navKey}-${index}`}
                                className="rounded-lg px-3 py-2 text-center text-[13px] font-medium leading-[18px] text-[#1F2937] hover:bg-[#E5E7EB]"
                                onClick={() => {
                                  setDropDown(false)
                                  setExpandedMobileNav(null)
                                  if (sub.coming_soon) {
                                    showComingSoon(true)
                                  } else {
                                    router.push(sub.link)
                                    setSelectedNavigationItem(sub.name)
                                  }
                                }}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <button
                      key={`nav-${navKey}`}
                      className="rounded-lg bg-[#F3F4F6] px-4 py-3 text-center text-[14px] font-semibold leading-[18px] text-[#111827]"
                      onClick={() => {
                        setDropDown(false)
                        setExpandedMobileNav(null)
                        if (item.coming_soon) {
                          showComingSoon(true)
                        } else if (item.path) {
                          setSelectedNavigationItem(item.name)
                          if (item.path === '/auth/sign-up') {
                            router.push(`/auth/sign-up?redirect=${encodeURIComponent('/mek/onboarding')}`)
                          } else {
                            router.push(item.path)
                          }
                        } else {
                          showComingSoon(true)
                        }
                      }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{item.name}</span>
                        {item.name.toLowerCase() === 'messages' && ReceivedMessage?.length > 0 && (
                          <Icon icon="lucide:dot" width="34" height="34" className="text-red-600" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            }
            trigger={['click']}
            open={dropDown}
            onOpenChange={visible => {
              setDropDown(visible)
              if (!visible) {
                setExpandedMobileNav(null)
              }
            }}
          >
            <div className="flex h-[42px] cursor-pointer flex-row items-center justify-between gap-2 px-[36px] py-[9px] font-inter text-sm font-medium text-[#33357D]">
              <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[13px]">
                {selectedNavigationItem}
              </TextComponent>{' '}
              <Image src="/assets/downArrow.svg" alt="down arrow" width={12} height={12} className="" />
            </div>
          </Dropdown>
        </div>
      )}

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
    </section>
  )
}

export default NewNavigation
