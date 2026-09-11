import {Icon} from '@iconify/react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {CategoriesProps} from '../utils'
import {Drawer} from 'antd'

// Import Swiper styles
import 'swiper/css/pagination'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useSelector} from 'react-redux'
import React from 'react'
import TextInput from '@/components/SharedUI/Input/TextInput'
import {useRouter} from 'next/router'
import TextComponent from '@/components/SharedUI/TextComponent'

interface ICategoryProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const Category = ({open, setOpen}: ICategoryProps) => {
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)

  const {data, isLoading} = useGetAllCategoriesQuery({
    type: type
  })

  const AllCategories = data?.data?.map((val: {name: string}) => {
    if (val.name === 'Electronics') {
      return {...val, icon: 'map:electronics-store', filledColor: '#F1EDFC', solidColor: '#6A3AF3'}
    } else if (val.name === 'Fashion') {
      return {...val, icon: 'noto-v1:womans-clothes', filledColor: '#FFF6E4', solidColor: '#FCC21B'}
    } else if (val.name === 'Home & Kitchen') {
      return {...val, icon: 'fluent:food-16-regular', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Beauty & Personal Care') {
      return {...val, icon: 'icon-park-outline:beauty', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Sports & Outdoors') {
      return {...val, icon: 'fluent:sport-american-football-20-regular', filledColor: '#FFECE8', solidColor: '#FE6E4C'}
    } else if (val.name === 'Books & Media') {
      return {...val, icon: 'emojione:books', filledColor: '#E4F3EA', solidColor: '#94989B'}
    } else if (val.name === 'Toys & Games') {
      return {...val, icon: 'ion:gift-outline', filledColor: '#FFE0ED', solidColor: '#FE4C97'}
    } else if (val.name === 'Automotive') {
      return {...val, icon: 'hugeicons:automotive-battery-01', filledColor: '#FFF6E4', solidColor: '#FCC21B'}
    } else if (val.name === 'Health & Wellness') {
      return {...val, icon: 'solar:health-bold-duotone', filledColor: '#FFF6E4', solidColor: '#FCC21B'}
    } else if (val.name === 'Groceries') {
      return {...val, icon: 'solar:health-bold-duotone', filledColor: '#FFECE8', solidColor: '#FE6E4C'}
    } else if (val.name === 'Gourmet Food') {
      return {...val, icon: 'arcticons:ourgroceries', filledColor: '#FFECE8', solidColor: '#FE6E4C'}
    } else if (val.name === 'Home Services') {
      return {...val, icon: 'teenyicons:home-outline', filledColor: '#F1EDFC', solidColor: '#6A3AF3'}
    } else if (val.name === 'Personal Services') {
      return {...val, icon: 'tdesign:personal-information', filledColor: '#FFF6E4', solidColor: '#FCC21B'}
    } else if (val.name === 'Event Services') {
      return {...val, icon: 'mdi:event-week-begin-outline', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Professional Services') {
      return {...val, icon: 'fa6-solid:helmet-safety', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Health & Wellness Services') {
      return {...val, icon: 'solar:health-bold-duotone', filledColor: '#FFF6E4', solidColor: '#FCC21B'}
    } else if (val.name === 'Education Services') {
      return {...val, icon: 'clarity:book-line', filledColor: '#FFE0ED', solidColor: '#FE4C97'}
    } else if (val.name === 'Transportation Services') {
      return {...val, icon: 'bxs:bus', filledColor: '#FFECE8', solidColor: '#FE6E4C'}
    } else if (val.name === 'Technology Services') {
      return {...val, icon: 'hugeicons:nano-technology', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Pet Services') {
      return {
        ...val,
        icon: 'material-symbols-light:pet-supplies-outline',
        filledColor: '#FFF6E4',
        solidColor: '#FCC21B'
      }
    } else if (val.name === 'Travel Services') {
      return {
        ...val,
        icon: 'material-symbols-light:travel',
        filledColor: '#FFECE8',
        solidColor: '#FE6E4C'
      }
    } else {
      return {...val, icon: 'map:electronics-store', filledColor: '#F1EDFC', solidColor: '#6A3AF3'}
    }
  })

  const [search, setSearch] = React.useState('')
  const [searchValue, setSearchValue] = React.useState('')

  const onClose = () => {
    setOpen && setOpen(false)
  }

  console.log(data?.data)

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
          {AllCategories?.map((category: CategoriesProps, i: number) => (
            <SwiperSlide>
              <div className="flex flex-col gap-2" key={i}>
                <div
                  style={{backgroundColor: category.filledColor}}
                  className={`flex h-[60px] w-[70px] items-center justify-center gap-6 rounded-[9px] p-2 px-4`}
                >
                  <Icon icon={category.icon} className={`text-2xl`} style={{color: category.solidColor}} />
                </div>
                <p className="text-center text-[12px]">{category?.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Drawer
        // title="Basic Drawer"
        onClose={onClose}
        closable={false}
        open={open}
        placement="bottom" // Set the drawer to slide from the bottom
        height="90vh" // Set the height to 90% of the viewport height
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col items-center justify-center !p-0">
              {' '}
              <TextComponent as="h1" className="text-[16px] font-semibold leading-[32px] text-[#000000]">
                Search by Category
              </TextComponent>
            </div>

            <span
              className="cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              <Icon icon={'mdi:close'} className="text-[24px]" />
            </span>
          </div>
          <div className="w-full">
            <TextInput
              iconName="carbon:search"
              iconClassName="text-[#181A20] w-[16px] h-[16x]"
              iconClick={() => {
                setSearchValue(search)
              }}
              placeholder="Search for Category"
              onChange={e => {
                setSearch(e.target.value)
              }}
              name={''}
              value={search}
              type={'text'}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setSearchValue(search)
                }
              }}
            />
          </div>

          <div className="grid w-full grid-cols-4 gap-4">
            {AllCategories?.filter((category: CategoriesProps) =>
              category.name?.toLowerCase()?.includes(search.toLowerCase())
            )?.map((category: CategoriesProps, i: number) => (
              <div
                className="flex cursor-pointer flex-col gap-2"
                key={i}
                onClick={() => {
                  router.push(`/category/${category.id}`)
                }}
              >
                <div
                  style={{backgroundColor: category.filledColor}}
                  className={`flex h-[60px] w-[70px] items-center justify-center gap-6 rounded-[9px] p-2 px-4`}
                >
                  <Icon icon={category.icon} className={`text-2xl`} style={{color: category.solidColor}} />
                </div>
                <p className="text-center text-[12px]">{category?.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </section>
  )
}

export default Category
