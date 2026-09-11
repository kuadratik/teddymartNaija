import {useRouter} from 'next/router'

import {Autoplay, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'

// Import Swiper styles
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useSelector} from 'react-redux'
import 'swiper/css'
import 'swiper/css/pagination'

const productOneBanner = [
  {
    id: 1,
    image: '/assets/ad-banner-2.png',
    text: 'Looking to make some extra cash?',
    textColor: '#000000',
    btnText: 'Post Ad',
    redirect_id: '10'
  },
  {
    id: 2,
    image: '/assets/ad-banner-1.png',
    textColor: '#000000',
    text: 'Looking to make some extra cash?',
    btnText: 'Post Ad',
    redirect_id: '4'
  }
  // {
  //   id: 3,
  //   image: '/assets/ads_img.jpeg',
  //   textColor: '#6C3F17',
  //   text: 'Elevate Your Style',
  //   btnText: 'Post Ad',
  //   redirect_id: '2'
  // }
]

const AdsBanner = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()

  return (
    <div className="h-[300px] w-full lg:flex lg:h-[500px] lg:items-center lg:gap-5">
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
          {productOneBanner.map((banner: any, i) => {
            return (
              <SwiperSlide
                style={{
                  backgroundImage: `url(${banner?.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: '10%, 50%',
                  backgroundRepeat: 'no-repeat'
                }}
                key={banner?.id}
                className="flex h-full w-full items-center justify-center lg:rounded-[13px] bg-black/50 bg-cover bg-center"
              >
                <div
                  className={`mt-auto flex h-full w-[45%] flex-col justify-center gap-4 rounded-[13px] ${type === 'product' ? (banner.id === 1 ? 'ml-[200px] lg:ml-[540px]' : banner.id === 2 ? 'ml-[190px] lg:ml-[540px]' : banner.id === 3 ? 'ml-[40px] lg:ml-[100px]' : banner.id === 4 ? 'ml-[2px] bg-black pl-3 lg:pl-6' : banner.id === 5 ? 'ml-[150px] lg:ml-[500px]' : '') : banner.id === 1 ? 'ml-[180px] lg:ml-[550px]' : banner.id === 2 ? 'ml-[150px] lg:ml-[580px]' : banner.id === 3 ? 'ml-[100px]' : banner.id === 4 ? 'ml-[2px] pl-6' : banner.id === 5 ? 'ml-[100px] lg:ml-[500px]' : ''}`}
                >
                  <p
                    style={banner?.textColor ? {color: banner?.textColor} : {}}
                    className="text-[20px] font-bold text-[#878173] drop-shadow-lg lg:pr-10 lg:text-[40px]"
                  >
                    {banner?.text}
                  </p>
                  <div className="">
                    <CustomButton
                      className="flex h-[35px] w-fit cursor-pointer items-center justify-center rounded-[5px] border-2 border-black bg-white py-2 shadow-f2"
                      onClick={() => {
                        router.push('/post-ad')
                      }}
                    >
                      <TextComponent as="span" className={`whitespace-nowrap text-[12px] font-semibold`}>
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

export default AdsBanner

// const AdsBanner = () => {
//   const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
//   const isAuth = isAuthenticatedToken
//   const router = useRouter()
//   return (
//     <div className="lg:mt-[40px]">
//       {/* <div className="flex h-[470px] w-full flex-row gap-4 lg:h-[570px]">
//         <div className="h-full w-full bg-[url('/assets/ads_img.jpeg')] bg-cover bg-center lg:rounded-[8px]">
//           <div className="px-8 py-4 lg:p-12">
//             <h3 className="pb-5 text-[26px] font-semibold text-black">Advertise an item</h3>
//             <Button
//               onClick={() => {
//                 router.push('/post-ad')
//               }}
//               style={{
//                 backgroundColor: '#fff',
//                 color: 'black',
//                 border: 'none',
//                 // Force the styles to remain the same on hover
//                 transition: 'none' // Disable any transitions
//               }}
//               htmlType="button"
//               className="whitespace-nowrap rounded-lg bg-[#fff] px-4 py-[20px] font-bold text-gray-800"
//             >
//               Post Ad
//             </Button>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   )
// }

// export default AdsBanner
