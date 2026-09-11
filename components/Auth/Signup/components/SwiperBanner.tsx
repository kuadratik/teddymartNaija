import React, {useMemo} from 'react'
import {Autoplay, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

// Import Swiper styles
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import 'swiper/css'
import 'swiper/css/pagination'

// Move banner data outside component to prevent re-creation on each render
const productOneBanner = [
  {
    id: 1,
    image: '/assets/banner2.jpg',
    text: 'Cooking Your Best Starts Here',
    textColor: '#878173',
    btnText: 'Find Store',
    redirect_id: '10',
    position: 'ml-[200px] lg:ml-[520px]'
  },
  {
    id: 2,
    image: '/assets/banner4.jpg',
    textColor: '#BA9369',
    text: 'Beauty Essentials at Your Fingertips!',
    btnText: 'Find Store',
    redirect_id: '4',
    position: 'ml-[190px] lg:ml-[520px]'
  },
  {
    id: 3,
    image: '/assets/banner5.jpg',
    textColor: '#6C3F17',
    text: 'Elevate Your Style',
    btnText: 'Find Store',
    redirect_id: '2',
    position: 'ml-[40px] lg:ml-[100px]'
  },
  {
    id: 4,
    image: '/assets/banner6.jpg',
    textColor: '#FFFFFF',
    text: 'Need the Perfect Gadgets? Look No Further',
    btnText: 'Find Store',
    redirect_id: '1',
    position: 'ml-[2px] bg-black pl-3 lg:pl-6'
  },
  {
    id: 5,
    image: '/assets/banner7.jpg',
    textColor: '#6C361E',
    text: 'Dive into Our Toy Wonderland!',
    btnText: 'Find Store',
    redirect_id: '7',
    position: 'ml-[150px] lg:ml-[500px]'
  }
]

const serviceOneBanner = [
  {
    id: 1,
    image: '/assets/banner3.jpg',
    text: 'Bringing Convenience to Your Home',
    textColor: '#fff',
    btnText: 'Find Store',
    redirect_id: '12',
    position: 'ml-[180px] lg:ml-[550px]'
  },
  {
    id: 2,
    image: '/assets/banner8.jpg',
    textColor: '#ffff',
    text: 'Your Event? Our Expertise',
    btnText: 'Find Store',
    redirect_id: '14',
    position: 'ml-[150px] lg:ml-[580px]'
  },
  {
    id: 3,
    image: '/assets/banner9.jpg',
    textColor: '#ffff',
    text: 'Level Up Your Learning Game',
    btnText: 'Find Store',
    redirect_id: '17',
    position: 'ml-[100px]'
  },
  {
    id: 4,
    image: '/assets/banner10.jpg',
    textColor: '#ffff',
    text: 'Adventure Awaits, Discover the World with Us',
    btnText: 'Find Store',
    redirect_id: '21',
    position: 'ml-[2px] pl-6'
  },
  {
    id: 5,
    image: '/assets/banner11.jpg',
    textColor: '#ffff',
    text: 'One Mile at a Time',
    btnText: 'Find Store',
    redirect_id: '18',
    position: 'ml-[100px] lg:ml-[500px]'
  }
]
// Navigation handler
interface Banner {
  id: number
  image: string
  text: string
  textColor: string
  btnText: string
  redirect_id: string
  position: string
}

interface SwiperConfig {
  pagination: boolean
  modules: any[]
  autoplay: {
    delay: number
    disableOnInteraction: boolean
  }
  className: string
}
// Map of button text colors for specific banners
interface ButtonTextColorMap {
  [key: number]: string | null
}

const getButtonTextColor = (type: string, id: number): string | null => {
  const buttonTextColorMap: ButtonTextColorMap = {
    4: '#DD9949',
    1: type === 'service' ? '#878173' : null,
    2: type === 'service' ? '#000000' : null,
    3: type === 'service' ? '#000000' : null,
    5: type === 'service' ? '#6C361E' : null
  }

  return buttonTextColorMap[id] ?? null
}

// Swiper configuration - moved outside to prevent recreating on each render
const swiperConfig = {
  pagination: true,
  modules: [Pagination, Autoplay],
  autoplay: {
    delay: 3500,
    disableOnInteraction: false
  },
  className: 'h-full w-full'
}

const SwiperBanner = React.memo(() => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()

  // Memoize banner selection based on type
  const currentBanners = useMemo(() => (type === 'product' ? productOneBanner : serviceOneBanner), [type])

  const handleNavigation = React.useCallback(
    (redirectId: string) => {
      router.push(`/category/${redirectId}?type=${type}`)
    },
    [router, type]
  )

  return (
    <div className="h-[250px] w-full lg:flex lg:h-[400px] lg:w-[71%] lg:items-center lg:gap-5">
      <div className="h-full w-full rounded-[13px]">
        <Swiper {...swiperConfig}>
          {currentBanners.map(banner => {
            const btnColorStyle = getButtonTextColor(type, banner.id)

            return (
              <SwiperSlide
                key={banner.id}
                style={{
                  backgroundImage: `url(${banner.image})`
                }}
                className="flex h-full w-full items-center justify-center rounded-[13px] bg-black/50 bg-cover bg-center"
              >
                <div
                  className={`mt-auto flex h-full w-[45%] flex-col justify-center gap-4 rounded-[13px] ${banner.position}`}
                >
                  <p
                    style={{color: banner.textColor}}
                    className="text-[20px] font-bold drop-shadow-lg lg:pr-10 lg:text-[40px]"
                  >
                    {banner.text}
                  </p>
                  <div>
                    <CustomButton
                      className="flex h-[35px] w-fit cursor-pointer items-center justify-center rounded-[5px] bg-white py-2 shadow-f2"
                      onClick={() => handleNavigation(banner.redirect_id)}
                    >
                      <TextComponent
                        style={btnColorStyle ? {color: btnColorStyle} : {color: banner.textColor}}
                        as="span"
                        className="whitespace-nowrap text-[12px] font-semibold"
                      >
                        {banner.btnText}
                      </TextComponent>
                    </CustomButton>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
})

SwiperBanner.displayName = 'SwiperBanner'

export default SwiperBanner
