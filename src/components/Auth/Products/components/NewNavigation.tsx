import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllStoreListingQuery} from '@/services/store'
import {Icon} from '@iconify/react'
import {Dropdown, Menu, Space} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import ComingSoon from './ComingSoon'

interface navItems {
  name: string
  link?: string
}

const NewNavigation = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)
  const {selectedLanguage} = useAppSelector(state => state.country)

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuth = isAuthenticatedToken

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user

  // console.log(isAuthenticatedUser?.store?.length)

  const {data, isLoading, refetch} = useGetAllStoreListingQuery({
    listType: type,
    currency: selectedLanguage.value,
    sortType: 'alphanumeric'
  })

  const navigationItems = React.useMemo(
    () => [
      {
        name: 'Become a MEK Vendor',
        path: !isAuth
          ? '/auth/sign-up'
          : isAuthenticatedUser?.store?.length > 0
            ? '/vendor/dashboard'
            : '/mek/onboarding'
      },
      {
        name: 'Find a Vendor',
        path: '/find-vendor'
      },
      {
        name: 'Promote Store',
        path: 'promote-store'
      },
      {
        name: 'Become a MEK Rider',
        path: ''
      },
      {
        name: 'Get Listed',
        path: '/get-list'
      },
      {
        name: 'MEK Directory',
        path: '/mek-directory'
      }
    ],
    [isAuthenticatedUser, isAuth]
  )

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

  // const secondNavItems: string[] = ['Get Listed', 'Mek Directory']

  const secondNavItems: {name: string; path: string}[] = [
    {name: 'Get Listed', path: '/get-list'},
    {name: 'MEK Directory', path: '/mek-directory'}
  ]

  const [comingSoon, showComingSoon] = React.useState(false)
  const [dropDown, setDropDown] = React.useState(false)
  const [selectedNavigationItem, setSelectedNavigationItem] = React.useState('Become a MEK Vendor')

  useEffect(() => {
    setSelectedNavigationItem(
      router.pathname === '/mek/onboarding'
        ? 'Become a MEK Vendor'
        : router.pathname === '/get-list'
          ? 'Get Listed'
          : router.pathname === '/mek-directory'
            ? 'MEK Directory'
            : router.pathname === '/find-vendor'
              ? 'Find a Vendor'
              : router.pathname === '/mek/onboarding'
                ? 'Become a MEK Vendor'
                : 'Become a MEK Rider'
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
        router.push(`/store/${clickedItem.slug}?type=${type}`) // Navigate to store page
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
  return (
    <section className="w-full lg:mx-auto lg:overflow-x-scroll">
      {isDesktop && (
        <div className="flex w-full flex-col items-center gap-2 lg:h-[56px] lg:flex-row lg:justify-evenly lg:overflow-x-scroll">
          <div className="flex h-full w-full flex-row items-center justify-center gap-2 bg-[#DFE1E5] px-[10px]">
            {firstNavItems.map((item, i: number) => {
              return item?.name.toLowerCase() === 'find a vendor' ? (
                <Dropdown
                  overlayClassName="w-[70%] mx-auto mt-1"
                  menu={{
                    items: menuItems,
                    className: 'grid grid-cols-8',
                    onClick: handleMenuClick
                  }}
                  destroyPopupOnHide
                  trigger={['click']}
                  key={i}
                >
                  <a
                    onClick={e => e.preventDefault()}
                    className={`flex h-[42px] cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${router.pathname === item.path ? 'bg-black text-white' : ''}`}
                  >
                    <Space>
                      <span className="whitespace-nowrap py-4 text-center text-[14px] font-medium leading-[18px]">
                        {item?.name}
                      </span>
                    </Space>
                  </a>
                </Dropdown>
              ) : (
                <button
                  className={`flex h-[42px] w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${router.pathname === item.path ? 'bg-black text-white' : ''} `}
                  key={i}
                  onClick={() => {
                    if (item?.path !== '') {
                      // console.log('🚀 ~ {firstNavItems.map ~ item?.path:', item?.path)
                      router.push(item?.path)
                    } else {
                      showComingSoon(true)
                    }
                  }}
                >
                  <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[18px]">{item?.name}</p>
                </button>
              )
            })}
          </div>
          <div className="flex h-full w-full flex-row items-center justify-center gap-2 rounded-lg bg-[#DFE1E5] px-[10px]">
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
          </div>
          <div className="flex h-full w-full flex-row items-center justify-center gap-2 bg-[#DFE1E5] px-[10px]">
            {/* {secondNavItems.map((item: string, i: number) => (
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
            ))} */}
            {secondNavItems.map((item: {name: string; path: string}, i: number) => (
              <button
                className={`flex h-[42px] cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${item.name === 'Become a MEK Rider' ? 'mx-auto lg:bg-white lg:text-black' : 'w-full'} ${router.pathname === item.path ? 'bg-black text-white' : ''} `}
                key={i}
                onClick={() => handleSecondNavigationClick(item)}
              >
                <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[18px]">{item.name}</p>
              </button>
            ))}
          </div>
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
              <Menu className="flex flex-col gap-1">
                {navigationItems?.map((item, i: number) => (
                  <button
                    className={`flex h-[42px] w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-[8px] px-[36px] py-[9px] hover:bg-black hover:text-white ${item?.name === 'Become a MEK Rider' && 'lg:bg-white lg:text-black'} ${router.pathname === item.path ? 'bg-black text-white' : ''}`}
                    key={i}
                    onClick={() => {
                      setDropDown(false)
                      setSelectedNavigationItem(item?.name)

                      if (item?.path !== '') {
                        console.log(item?.path)
                        if (item?.path === '/auth/sign-up') {
                          router.push(`/auth/sign-up?redirect=${encodeURIComponent('/mek/onboarding')}`)
                        } else {
                          router.push(item?.path)
                        }
                      } else {
                        showComingSoon(true)
                      }
                    }}
                  >
                    <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[18px]">
                      {' '}
                      {item?.name}
                    </p>
                  </button>
                ))}
              </Menu>
            }
            trigger={['click']}
            open={dropDown}
            onOpenChange={visible => {
              setDropDown(visible)
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
