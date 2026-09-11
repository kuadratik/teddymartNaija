import AdvertComponent from '@/components/Advert'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import NavTabs from '@/components/SharedUI/NavTabs'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {typeOptions} from '@/pages/vendor'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {Icon} from '@iconify/react'
import {Badge, Button, Dropdown, Menu} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Swiper, SwiperSlide} from 'swiper/react'
import Category from './components/Category'
import RecommendedComponent from './components/Recommend'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
// import required modules
import useLogout from '@/components/Profile/hooks/useLogout'
import Spinner from '@/components/SharedUI/Spinner'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetAllClipsQuery} from '@/services/clips'
import {Autoplay, Pagination} from 'swiper/modules'
import Popularproduct from './components/Popularproduct'
import Reommended from './components/RecommendedStore'
import CountrySelect from '@/components/SharedUI/CountrySelect/CountrySelect'

const tabItems = [
  {id: 'product', title: 'Product', link: ''},
  {id: 'service', title: 'Services', link: ''}
]

const productOneBanner = [
  {
    id: 1,
    image: '/assets/banner2.jpg',
    text: 'Cooking Your Best Starts Here',
    textColor: '#878173',
    btnText: 'Find Store',
    redirect_id: '10'
  },
  {
    id: 2,
    image: '/assets/banner4.jpg',
    textColor: '#BA9369',
    text: 'Beauty Essentials at Your Fingertips!',
    btnText: 'Find Store',
    redirect_id: '4'
  },
  {
    id: 3,
    image: '/assets/banner5.jpg',
    textColor: '#6C3F17',
    text: 'Elevate Your Style',
    btnText: 'Find Store',
    redirect_id: '2'
  },
  {
    id: 4,
    image: '/assets/banner6.jpg',
    textColor: '#FFFFFF',
    text: 'Need the Perfect Gadgets? Look No Further',
    btnText: 'Find Store',
    redirect_id: '1'
  },
  {
    id: 5,
    image: '/assets/banner7.jpg',
    textColor: '#6C361E',
    text: 'Dive into Our Toy Wonderland!',
    btnText: 'Find Store',
    redirect_id: '7'
  }
]

const serviceOneBanner = [
  {
    id: 1,
    image: '/assets/banner3.jpg',
    text: 'Bringing Convenience to Your Home',
    textColor: '#fff',
    btnText: 'Find Store',
    redirect_id: '12'
  },
  {
    id: 2,
    image: '/assets/banner8.jpg',
    textColor: '#ffff',
    text: 'Your Event? Our Expertise',
    btnText: 'Find Store',
    redirect_id: '14'
  },
  {
    id: 3,
    image: '/assets/banner9.jpg',
    textColor: '#ffff',
    text: 'Level Up Your Learning Game',
    btnText: 'Find Store',
    redirect_id: '17'
  },
  {
    id: 4,
    image: '/assets/banner10.jpg',
    textColor: '#ffff',
    text: 'Adventure Awaits, Discover the World with Us',
    btnText: 'Find Store',
    redirect_id: '21'
  },
  {
    id: 5,
    image: '/assets/banner11.jpg',
    textColor: '#ffff',
    text: 'One Mile at a Time',
    btnText: 'Find Store',
    redirect_id: '18'
  }
]

const LandingPage = () => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const has_store = isAuthenticatedUser?.has_store

  const isAuth = isAuthenticatedToken

  const {type} = useSelector((state: any) => state.vendor)
  const dispatch = useDispatch()
  const [dropDown, setDropDown] = useState(false)

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const {data, isLoading, isFetching} = useGetAllClipsQuery({})

  const {data: allCategory} = useGetAllCategoriesQuery({
    type: type
  })

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* {isDesktop && (
        <div className="fixed top-0 z-50 flex h-[78px] w-full items-center bg-[#222222]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <Link href="/" className="!border-none !p-0">
              <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={76} />
            </Link>

            <div className="flex items-center gap-3">
              {isAuth ? (
                <div className="flex gap-4">
                  {has_store && (
                    <CustomButton
                      onClick={() => {
                        router.push('/vendor')
                      }}
                      type="button"
                      className="w-[180px] whitespace-nowrap rounded-[10px] !border-[1px] !border-[#000000] bg-white px-1 py-2"
                    >
                      Switch to Vendor
                    </CustomButton>
                  )}

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
                    <span className="">{isLoadingLogout ? <Spinner className="h-2 w-2" /> : null}</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <CustomButton
                    onClick={() => {
                      router.push('auth/sign-up')
                    }}
                    type="button"
                    className="h-[44px] w-[129px] rounded-[10px] bg-white px-1 py-2"
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
                className="flex-center"
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
      )}
      <div className="flex w-full flex-col items-center justify-center gap-8">
        {!isDesktop ? (
          isAuth && !has_store ? (
            <div className="flex w-full justify-between">
              <div>
                <LogoHeader />
              </div>

              <div className="flex flex-row gap-2">
                <div
                  role="button"
                  className="flex h-[33px] w-[149px] cursor-pointer items-center justify-center rounded-[8px] bg-black"
                  onClick={() => router.push('/vendor')}
                >
                  <TextComponent as="p" className="text-[13px] font-medium leading-[15.23px] text-white">
                    Switch to Vendor
                  </TextComponent>
                </div>

                <CountrySelect />
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <div>
                {' '}
                <LogoHeader />
              </div>
              {isAuth ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      logoutUserHandler()
                    }}
                    disabled={isLoadingLogout}
                    type="button"
                    className="bg-transparent text-sm font-semibold text-black"
                  >
                    <span>Logout</span>
                  </button>
                  <span className="">{isLoadingLogout ? <Spinner className="h-2 w-2 text-black" /> : null}</span>
                </div>
              ) : (
                <></>
              )}
            </div>
          )
        ) : null}

        {!isDesktop &&
          (isAuth ? (
            <></>
          ) : (
            <div className="flex gap-3">
              <CustomButton
                onClick={() => {
                  router.push('auth/sign-up')
                }}
                type="button"
                className="w-[100px] !border-[1px] !border-[#000000] bg-white px-1 py-2"
              >
                Sign Up
              </CustomButton>
              <CustomButton
                onClick={() => {
                  router.push('auth/login')
                }}
                type="button"
                className="w-[100px] border-[1px] border-gray-300 bg-white px-2 py-1"
              >
                Login
              </CustomButton>
            </div>
          ))}
        {!isDesktop && !has_store && (
          <div className="flex gap-3">
            <div className="text-[14px] font-medium">
              <span className="font-medium text-[#6B7280]">To advertise a product or service, </span>
              <Link href={'/vendor/onboarding'} className="!border-none !p-0 text-sm text-[#000] underline">
                Click here
              </Link>
            </div>
          </div>
        )}
      </div> */}

      {/* {!isDesktop && (
        <div className="flex items-center justify-center">
          <NavTabs backgroundColor="#F1F1F1" active={type} setActive={handleChange} naveItems={tabItems} />
        </div>
      )} */}
      {isDesktop && <Category open={open} setOpen={setOpen} />}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center rounded-[12px] bg-black md:mt-5 lg:py-[25px]">
        <div className="w-full border-[1px] border-gray-50 lg:relative lg:mx-auto lg:max-w-[735px] lg:border-none">
          {isDesktop && (
            <div className="absolute left-4 top-1/2 z-40 flex h-[20px] w-[87px] -translate-y-1/2 items-start justify-start border-r border-r-gray-300 pr-[13px]">
              <Dropdown
                overlay={
                  <Menu className="flex flex-col gap-1">
                    {typeOptions.map((option, index) => (
                      <p
                        key={option.value}
                        onClick={() => {
                          handleChange(option.value)
                        }}
                        className="cursor-pointer rounded-lg p-2 visited:text-[#27104E] hover:bg-gray-100"
                      >
                        {option.label}
                      </p>
                    ))}
                  </Menu>
                }
                trigger={['click']}
                open={dropDown}
                onOpenChange={visible => {
                  setDropDown(visible)
                }}
              >
                <div className="flex h-[24px] cursor-pointer flex-row items-center gap-2 font-inter text-sm font-medium text-[#33357D]">
                  <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[13px]">
                    {type}
                  </TextComponent>{' '}
                  <Image src="/assets/downArrow.svg" alt="down arrow" width={12} height={12} className="" />
                </div>
              </Dropdown>
            </div>
          )}
          <TextInput
            iconName="iconamoon:category"
            iconClick={() => {
              setOpen(true)
            }}
            iconClassName="cursor-pointer"
            className="lg:pl-[125px]"
            placeholder={`Search for a ${type} or vendor`}
            onChange={e => {
              setSearch(e.target.value)
            }}
            name={''}
            value={search}
            type={'text'}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                router.push('/catalog?q=' + search + `&type=${type}`)
              }
            }}
          />
        </div>
      </div>

      <div className="w-full max-w-7xl lg:mx-auto lg:flex lg:h-[400px] lg:items-center lg:gap-5">
        {!isDesktop && <Category open={open} setOpen={setOpen} />}

        {isDesktop && (
          <div className="h-full w-full rounded-[13px]">
            <Swiper
              pagination={true}
              modules={[Pagination, Autoplay]}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false
              }}
              className="h-full w-full"
            >
              {(type === 'product' ? productOneBanner : serviceOneBanner).map((banner: any, i) => {
                return (
                  <SwiperSlide
                    style={{
                      backgroundImage: `url(${banner?.image})`
                    }}
                    key={banner?.id}
                    className="flex h-full w-full items-center justify-center rounded-[13px] bg-black/50 bg-cover bg-center"
                  >
                    <div
                      className={`mt-auto flex h-full w-[45%] flex-col justify-center gap-4 rounded-[13px] ${type === 'product' ? (banner.id === 1 ? 'ml-[630px]' : banner.id === 2 ? 'ml-[580px]' : banner.id === 3 ? 'ml-[100px]' : banner.id === 4 ? 'ml-[2px] bg-black pl-6' : banner.id === 5 ? 'ml-[600px]' : '') : banner.id === 1 ? 'ml-[550px]' : banner.id === 2 ? 'ml-[580px]' : banner.id === 3 ? 'ml-[100px]' : banner.id === 4 ? 'ml-[2px] pl-6' : banner.id === 5 ? 'ml-[600px]' : ''}`}
                    >
                      <p
                        style={banner?.textColor ? {color: banner?.textColor} : {}}
                        className="pr-10 text-[40px] font-bold text-[#878173] drop-shadow-lg"
                      >
                        {banner?.text}
                      </p>
                      <div className="">
                        <CustomButton
                          className="flex h-[35px] w-fit cursor-pointer items-center justify-center rounded-[5px] bg-white py-2 shadow-f2"
                          onClick={() => {
                            router.push(`/category/${banner?.redirect_id}?type=${type}`)
                          }}
                        >
                          <TextComponent
                            style={
                              banner?.textColor
                                ? {
                                    color:
                                      banner?.id === 4
                                        ? '#DD9949'
                                        : banner?.id === 1 && type === 'service'
                                          ? '#878173'
                                          : (banner.id === 2 || banner.id === 3) && type === 'service'
                                            ? '#000000'
                                            : banner.id === 4 && type === 'service'
                                              ? '#DD9949'
                                              : banner.id === 5 && type === 'service'
                                                ? '#6C361E'
                                                : banner?.textColor
                                  }
                                : {}
                            }
                            as="span"
                            className={`whitespace-nowrap text-[12px] font-semibold`}
                          >
                            {banner?.btnText}
                          </TextComponent>
                        </CustomButton>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}
      </div>

      <div className="w-full lg:mx-auto lg:max-w-7xl">
        <Popularproduct />
      </div>

      <div className="w-full lg:mx-auto lg:max-w-7xl">
        <Reommended />
      </div>

      <div className="w-full lg:mx-auto lg:max-w-7xl">
        <RecommendedComponent />
      </div>

      {isDesktop && (
        <div className="mt-[103px] flex gap-10">
          {' '}
          <AdvertComponent />
          <AdvertComponent />
        </div>
      )}
    </div>
  )
}

export default LandingPage
