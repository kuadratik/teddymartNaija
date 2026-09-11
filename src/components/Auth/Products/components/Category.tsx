import {Icon} from '@iconify/react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Categories, CategoriesProps} from '../utils'
import SwiperComponent from './Swiper'

// Import Swiper styles
import 'swiper/css/pagination'
const Category = () => {
  return (
    <section className="">
      <div className="flex gap-4">
        <Swiper
          slidesPerView={4}
          spaceBetween={20}
          pagination={{
            clickable: false
          }}
          modules={[]}
          className=""
        >
          {Categories?.map((category: CategoriesProps, i: number) => (
            <SwiperSlide>
              <div className="flex flex-col gap-2" key={i}>
                <div
                  style={{backgroundColor: category.filledColor}}
                  className={`flex h-[60px] w-[70px] items-center justify-center gap-6 rounded-[9px] p-2 px-4`}
                >
                  <Icon icon={category.icon} className={`text-2xl`} style={{color: category.solidColor}} />
                </div>
                <p className="text-[12px] text-center">{category.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <SwiperComponent />
    </section>
  )
}

export default Category
