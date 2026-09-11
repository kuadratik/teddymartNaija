import TextComponent from '@/components/SharedUI/TextComponent'
import Image from 'next/image'
import {Autoplay} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Recommended} from '../utils'
import {useGetRecommendedStoresQuery} from '@/services/general/general'
import {useEffect, useState} from 'react'
const RecommendedComponent = () => {
  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      console.log('uuid', uuid)
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  // remove string from uuid

  const {data} = useGetRecommendedStoresQuery({
    uuid: JSON.parse(clipUuid)
  })
  console.log('data', data)

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
                    <Image
                      src={category.img}
                      alt="image"
                      className="h-auto w-full"
                      layout="responsive"
                      width={100}
                      height={100}
                    />
                  </div>
                  <p className="whitespace-wrap mt-[10px] text-center text-[14px] text-[#181A20]">{category.text}</p>
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
