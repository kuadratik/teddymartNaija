import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {Icon} from '@iconify/react'
import {Badge, Button} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import useLogout from '../Profile/hooks/useLogout'
import CustomButton from '../SharedUI/Buttons/Button'
import CountrySelect from '../SharedUI/CountrySelect/CountrySelect'
import LogoHeader from '../SharedUI/LogoHeader'
import NavTabs from '../SharedUI/NavTabs'
import Spinner from '../SharedUI/Spinner'
import TextComponent from '../SharedUI/TextComponent'
const tabItems = [
  {id: 'product', title: 'Product', link: ''},
  {id: 'service', title: 'Services', link: ''}
]
const HeaderComponent = () => {
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const isSmallDesktop = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const has_store = isAuthenticatedUser?.has_store
  const {data, isLoading, isFetching} = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })
  const pathName = router.asPath
  const isAuth = isAuthenticatedToken

  const {type} = useSelector((state: any) => state.vendor)
  const dispatch = useDispatch()
  const [dropDown, setDropDown] = useState(false)

  const {logoutUserHandler, isLoading: isLoadingLogout} = useLogout()
  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }
  return (
    <div className="my-8 flex flex-col items-center justify-center gap-8 px-[20px] lg:my-0 lg:px-0">
      {isDesktop && (
        <div className="fixed top-0 z-50 flex h-[78px] w-full items-center bg-[#222222]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <Link href="/" className="!border-none !p-0">
              <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={100} height={76} />
            </Link>

            <div className="flex items-center gap-3">
              {isAuth ? (
                <div className="flex gap-4">
                  {pathName.includes('/vendor') ? (
                    <>
                      {' '}
                      <div
                        role="button"
                        className="flex h-[33px] w-[149px] cursor-pointer items-center justify-center rounded-[8px] bg-black"
                        onClick={() => router.push('/')}
                      >
                        <TextComponent as="p" className="text-[13px] font-medium leading-[15.23px] text-white">
                          Switch to Customer
                        </TextComponent>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        logoutUserHandler({})
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
                    count={data?.data?.total_product_count}
                    style={{backgroundColor: '#fff', color: '#000', fontSize: '16px', fontWeight: 600}}
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
      {isSmallDesktop && (
        <div className="fixed top-0 z-50 flex h-[78px] w-full items-center bg-[#222222]">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
            <Link href="/" className="!border-none !p-0">
              <Image src={'/assets/WhiteLogo.svg'} alt="logo" width={90} height={70} />
            </Link>

            <div className="flex items-center gap-2">
              {isAuth ? (
                <div className="flex gap-3">
                  {pathName.includes('/vendor') ? (
                    <div
                      role="button"
                      className="flex h-[30px] w-[130px] cursor-pointer items-center justify-center rounded-[6px] bg-black"
                      onClick={() => router.push('/')}
                    >
                      <TextComponent as="p" className="text-[12px] font-medium leading-[14px] text-white">
                        Switch to Customer
                      </TextComponent>
                    </div>
                  ) : (
                    has_store && (
                      <CustomButton
                        onClick={() => {
                          router.push('/vendor')
                        }}
                        type="button"
                        className="w-[160px] whitespace-nowrap rounded-[8px] !border-[1px] !border-[#000000] bg-white px-2 py-1 text-sm"
                      >
                        Switch to Vendor
                      </CustomButton>
                    )
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        logoutUserHandler({})
                      }}
                      disabled={isLoadingLogout}
                      type="button"
                      className="bg-transparent text-xs font-semibold text-white"
                    >
                      <span>Logout</span>
                    </button>
                    <span className="">{isLoadingLogout ? <Spinner className="h-1.5 w-1.5" /> : null}</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <CustomButton
                    onClick={() => {
                      router.push('auth/sign-up')
                    }}
                    type="button"
                    className="h-[38px] w-[110px] rounded-[8px] bg-white px-1 py-1 text-sm"
                  >
                    Sign Up
                  </CustomButton>
                  <CustomButton
                    onClick={() => {
                      router.push('auth/login')
                    }}
                    type="button"
                    className="h-[38px] w-[85px] rounded-[8px] border-[1px] border-white bg-[#222222] px-2 py-1 text-sm text-white"
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
                size="middle"
                icon={
                  <Badge
                    count={data?.data?.total_product_count}
                    style={{backgroundColor: '#fff', color: '#000', fontSize: '14px', fontWeight: 600}}
                  >
                    <Icon icon={'mdi-light:cart'} className="text-[24px] text-white" />
                  </Badge>
                }
              />

              <CountrySelect />
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col items-center justify-center gap-8">
        {!isDesktop && !isSmallDesktop ? (
          isAuth && has_store ? (
            <div className="flex w-full justify-between">
              <div>
                <LogoHeader />
              </div>

              <div className={`flex flex-row gap-2 ${isTablet ? 'md:flex-wrap' : ''}`}>
                {pathName.includes('/vendor') ? (
                  <div
                    role="button"
                    className={`flex h-[33px] cursor-pointer items-center justify-center rounded-[8px] bg-black px-3 ${
                      isTablet ? 'w-auto text-sm' : 'w-[149px]'
                    }`}
                    onClick={() => router.push('/')}
                  >
                    <TextComponent
                      as="p"
                      className="whitespace-nowrap text-[13px] font-medium leading-[15.23px] text-white"
                    >
                      Switch to Customer
                    </TextComponent>
                  </div>
                ) : (
                  <div
                    role="button"
                    className={`flex h-[33px] cursor-pointer items-center justify-center rounded-[8px] bg-black px-3 ${
                      isTablet ? 'w-auto text-sm' : 'w-[149px]'
                    }`}
                    onClick={() => router.push('/vendor')}
                  >
                    <TextComponent
                      as="p"
                      className="whitespace-nowrap text-[13px] font-medium leading-[15.23px] text-white"
                    >
                      Switch to Vendor
                    </TextComponent>
                  </div>
                )}

                <Button
                  onClick={() => {
                    router.push('/clips')
                  }}
                  type="text"
                  className="flex-center"
                  size={isTablet ? 'middle' : 'large'}
                  icon={
                    <Badge
                      count={data?.data?.total_product_count}
                      style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        fontSize: isTablet ? '14px' : '16px',
                        fontWeight: 600
                      }}
                    >
                      <Icon
                        icon={'mdi-light:cart'}
                        className={isTablet ? 'text-[24px] text-black' : 'text-[28px] text-black'}
                      />
                    </Badge>
                  }
                />
                {!isTablet && <CountrySelect />}
              </div>
            </div>
          ) : (
            <div
              className={`fixed top-0 z-50 flex w-full items-center justify-between bg-white px-5 py-5 ${isTablet ? 'md:px-8' : ''}`}
            >
              <div>
                {' '}
                <LogoHeader />
              </div>
              {isAuth ? (
                <div className={`flex items-center gap-2 ${isTablet ? 'md:gap-4' : ''}`}>
                  <button
                    onClick={() => {
                      logoutUserHandler({})
                    }}
                    disabled={isLoadingLogout}
                    type="button"
                    className="bg-transparent text-sm font-semibold text-black"
                  >
                    <span>Logout</span>
                  </button>
                  <span>{isLoadingLogout ? <Spinner className="h-2 w-2 text-black" /> : null}</span>

                  <Button
                    onClick={() => {
                      router.push('/clips')
                    }}
                    type="text"
                    className="flex-center"
                    size={isTablet ? 'middle' : 'large'}
                    icon={
                      <Badge
                        count={data?.data?.total_product_count}
                        style={{
                          backgroundColor: '#000',
                          color: '#fff',
                          fontSize: isTablet ? '14px' : '16px',
                          fontWeight: 600
                        }}
                      >
                        <Icon
                          icon={'mdi-light:cart'}
                          className={isTablet ? 'text-[24px] text-black' : 'text-[28px] text-black'}
                        />
                      </Badge>
                    }
                  />
                  <CountrySelect />
                </div>
              ) : (
                <div className="flex items-center">
                  <Button
                    onClick={() => {
                      router.push('/clips')
                    }}
                    type="text"
                    className="flex-center"
                    size={isTablet ? 'middle' : 'large'}
                    icon={
                      <Badge
                        count={data?.data?.total_product_count}
                        style={{
                          backgroundColor: '#000',
                          color: '#fff',
                          fontSize: isTablet ? '14px' : '16px',
                          fontWeight: 600
                        }}
                      >
                        <Icon
                          icon={'mdi-light:cart'}
                          className={isTablet ? 'text-[24px] text-black' : 'text-[28px] text-black'}
                        />
                      </Badge>
                    }
                  />
                  <CountrySelect />
                </div>
              )}
            </div>
          )
        ) : null}
        {/* mobile devices */}
        {pathName !== '/' ? null : (
          <>
            {!isDesktop &&
              (isAuth ? (
                <></>
              ) : (
                <div className="mt-16 flex gap-3">
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
                  <Link href={'/mek/onboarding'} className="!border-none !p-0 text-sm text-[#000] underline">
                    Click here
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {pathName !== '/' ? null : (
        <>
          {!isDesktop && (
            <div className="flex items-center justify-center">
              <NavTabs backgroundColor="#F1F1F1" active={type} setActive={handleChange} naveItems={tabItems} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HeaderComponent
