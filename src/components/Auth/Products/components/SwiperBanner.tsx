import {Autoplay, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

// Import Swiper styles
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import 'swiper/css'
import 'swiper/css/pagination'

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

const SwiperBanner = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()

  return (
    <div className="h-[250px] w-full lg:flex lg:h-[400px] lg:w-[71%] lg:items-center lg:gap-5">
      {/* {!isDesktop && <Category open={open} setOpen={setOpen} />} */}

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
                  className={`mt-auto flex h-full w-[45%] flex-col justify-center gap-4 rounded-[13px] ${type === 'product' ? (banner.id === 1 ? 'ml-[200px] lg:ml-[520px]' : banner.id === 2 ? 'ml-[190px] lg:ml-[520px]' : banner.id === 3 ? 'ml-[40px] lg:ml-[100px]' : banner.id === 4 ? 'ml-[2px] bg-black pl-3 lg:pl-6' : banner.id === 5 ? 'ml-[150px] lg:ml-[500px]' : '') : banner.id === 1 ? 'ml-[180px] lg:ml-[550px]' : banner.id === 2 ? 'ml-[150px] lg:ml-[580px]' : banner.id === 3 ? 'ml-[100px]' : banner.id === 4 ? 'ml-[2px] pl-6' : banner.id === 5 ? 'ml-[100px] lg:ml-[500px]' : ''}`}
                >
                  <p
                    style={banner?.textColor ? {color: banner?.textColor} : {}}
                    className="text-[20px] font-bold text-[#878173] drop-shadow-lg lg:pr-10 lg:text-[40px]"
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
      {/* )} */}
    </div>
  )
}

export default SwiperBanner
