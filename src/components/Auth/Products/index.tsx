import TextInput from '@/components/SharedUI/Input/TextInput'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {typeOptions} from '@/pages/vendor/dashboard'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {Dropdown, Menu} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Category from './components/Category'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
// import required modules
import useLogout from '@/components/Profile/hooks/useLogout'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import styled from '@emotion/styled'
import tw from 'tailwind-styled-components'
import NewAdvert from './components/NewAdvert'
import NewNavigation from './components/NewNavigation'
import Popularproduct from './components/Popularproduct'
import Recommended from './components/Recommended'
import SwiperBanner from './components/SwiperBanner'
import TeddyAdvert from './components/TeddyAdvert'

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

  // console.log('type', type)

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const {data: allCategory} = useGetAllCategoriesQuery({
    type: type
  })

  return (
    <MainWrapper className="">
      {/* removed header */}
      <div className="flex w-full flex-col">
        <Category open={open} setOpen={setOpen} />
        <div className="flex w-full flex-col-reverse lg:flex-col">
          <NewNavigation />
          <div className="w-full max-w-7xl lg:mx-auto">
            <SearchWrapper className="">
              <div className="container">
                <div className="second-container">
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
                      </TextComponent>
                      <Image src="/assets/downArrow.svg" alt="down arrow" width={12} height={12} className="" />
                    </div>
                  </Dropdown>
                </div>

                <TextInput
                  iconName="iconamoon:category"
                  iconClick={() => {
                    setOpen(true)
                  }}
                  iconClassName="cursor-pointer"
                  className="pl-[100px] lg:pl-[125px]"
                  placeholder={`Search for a ${type} or vendor`}
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  name={''}
                  value={search}
                  type={'text'}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      router.push('/search?id=' + search + `&type=${type}`)
                    }
                  }}
                />
              </div>
            </SearchWrapper>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl lg:mx-auto">
        <div className="px-4">
          <Popularproduct />
          <div className="mt-[40px] flex w-full flex-col gap-6 lg:flex-row">
            <SwiperBanner />
            <div className="w-full lg:w-[29%]">
              <TopDealComponent />
            </div>
          </div>
          <Recommended />
        </div>
        <div className="mt-[40px]">
          <NewAdvert />
          {/* <OldAdvert /> */}
        </div>
        <div className="mt-[40px]">
          <TeddyAdvert />
        </div>
      </div>
    </MainWrapper>
  )
}

const TopDealComponent = () => {
  const url = new URL(window.location.href)
  const topDealUrl = `${url?.origin + '/store/elegante-collections?type=product'}`
  const {selectedLanguage} = useAppSelector(state => state.country)

  return (
    <TopDealWrapper>
      <div className="flex justify-between gap-4">
        <p className="text-[20px]">
          <span className="font-bold">Top Deal</span> of the <span className="font-bold">Day</span>
        </p>
        <div className="rounded-[42px] bg-[#FF2D55] px-5 py-[6px] text-center font-bold text-white">50% off</div>{' '}
      </div>
      <div className="h-[222px] min-w-[206px] overflow-hidden rounded-[4px] lg:h-[322px]">
        <ImageComponent
          src={`/assets/ank.jpg`}
          alt="product-image"
          className={`rounded-[4px] object-cover`}
          width={206}
          height={222}
        />
      </div>{' '}
      <TextComponent as="p" className="mt-4 font-medium leading-[12px] text-[#000]">
        Geometric Hollandais Fabric{' '}
      </TextComponent>
      <div className="mt-[2px]">
        <Link href={topDealUrl} className="!text-[#6B7280] hover:!text-[#6B7280] hover:underline">
          Elegante Collection
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <TextComponent as="p" className="text-[20px] font-bold leading-[12px] text-[#1C1C1C]">
            <FormatNumberCurrency
              value={selectedLanguage.value === 'NGN' ? 5000 : 45}
              currency={selectedLanguage.value}
            />
          </TextComponent>
          <TextComponent as="p" className="text-[14px] font-bold leading-[12px] text-[#6B7280] line-through">
            <FormatNumberCurrency
              value={selectedLanguage.value === 'NGN' ? 10000 : 90}
              currency={selectedLanguage.value}
            />
          </TextComponent>
        </div>
      </div>
    </TopDealWrapper>
  )
}

const TopDealWrapper = tw.div`flex h-[400px] flex-col gap-2 border-[1.5px] rounded-[8px]  border-[#EDEDED] p-4 bg-white`

export const MainWrapper = tw.div`flex w-full flex-col gap-8 lg:items-center lg:justify-center`

export const SearchWrapper = styled(tw.div`
mx-auto flex items-center justify-center bg-black px-3 py-[25px] md:mt-5 lg:rounded-[12px] lg:px-0`)`
  .container {
    position: relative;
    width: 100%;
    margin: 0 auto;

    @media (min-width: 1024px) {
      max-width: 735px;
    }
  }

  .second-container {
    position: absolute;
    left: 0.5rem;
    top: 10px;
    z-index: 40;
    display: flex;
    height: 20px;
    width: 80px;
    align-items: flex-start;
    justify-content: flex-start;
    border-right: 1px solid #d1d5db; /* border-r-gray-300 */
    padding-right: 0.25rem; /* pr-1 */

    @media (min-width: 1024px) {
      left: 1rem; /* 4 in Tailwind (16px) */
      top: 50%;
      width: 87px;
      transform: translateY(-50%);
      padding-right: 13px;
    }
  }
`

export default LandingPage
