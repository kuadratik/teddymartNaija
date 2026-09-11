import TextComponent from '@/components/SharedUI/TextComponent'
import Image from 'next/image'
import {Autoplay} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Recommended} from '../utils'
const RecommendedComponent = () => {
  return (
    <div>
      <TextComponent as="p" className="text-[18px]">
        Recommended
      </TextComponent>

      <section className="mt-[10px]">
        <div className="flex gap-4">
          <Swiper
            slidesPerView={2}
            spaceBetween={20}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false
            }}
            pagination={{
              clickable: false
            }}
            modules={[Autoplay]}
            className=""
          >
            {Recommended?.map((category: any, i: number) => (
              <SwiperSlide key={i}>
                <div className="">
                  <div className="w-full">
                    <Image src={category.img} alt="image" className='w-full h-auto' layout='responsive' width={100} height={100} />
                  </div>
                  <p className="whitespace-wrap mt-[10px] text-[14px] text-[#181A20] text-center">{category.text}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  )
}

export default RecommendedComponent
