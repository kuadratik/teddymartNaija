import {Icon} from '@iconify/react'
import {Drawer} from 'antd'
import Image from 'next/image'

// Import Swiper styles
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useRouter} from 'next/router'
import React from 'react'
import {useSelector} from 'react-redux'
import 'swiper/css/pagination'
import {CategoriesProps} from '../utils'

export interface ISelectedCategory {
  id: number
  name: string
}

interface ICategoryProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedCategory[]>>
  isShowServiceProductCategories?: boolean
  handleCategoryClick: (category: CategoriesProps) => void
  data: any
}

const AllCategory = ({
  open,
  setOpen,
  setSelectedCategories,
  isShowServiceProductCategories = true,
  handleCategoryClick,
  data
}: ICategoryProps) => {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const {type} = useSelector((state: any) => state.vendor)

  const AllCategories = data?.data?.map((val: {name: string}) => {
    if (val.name === 'Electronics') {
      return {...val, icon: 'f7:tv-fill', filledColor: '#F1EDFC', solidColor: '#6A3AF3'}
    } else if (val.name === 'Fashion') {
      return {
        ...val,
        icon: 'noto-v1:womans-clothes',
        filledColor: '#FFF6E4',
        solidColor: '#FCC21B'
      }
    } else if (val.name === 'Home & Kitchen') {
      return {...val, icon: 'fluent:food-16-regular', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Beauty & Personal Care') {
      return {...val, name: 'Beauty', icon: 'icon-park-outline:beauty', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Sports & Outdoors') {
      return {
        ...val,
        icon: 'fluent:sport-american-football-20-regular',
        filledColor: '#FFECE8',
        solidColor: '#FE6E4C'
      }
    } else if (val.name === 'Books & Media') {
      return {...val, icon: 'emojione:books', filledColor: '#E4F3EA', solidColor: '#94989B'}
    } else if (val.name === 'Toys & Games') {
      return {...val, icon: 'dashicons:games', filledColor: '#FFE0ED', solidColor: '#FE4C97'}
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
    } else if (val.name === 'Logistics Services') {
      return {
        ...val,
        icon: 'bxs:bus',
        filledColor: '#FFECE8',
        solidColor: '#FE6E4C'
      }
    } else {
      return {...val, icon: 'map:electronics-store', filledColor: '#F1EDFC', solidColor: '#6A3AF3'}
    }
  })

  const onClose = () => {
    setOpen && setOpen(false)
  }

  const [search, setSearch] = React.useState('')

  return (
    <section className="w-full overflow-x-scroll lg:mx-auto">
      {/* {isDesktop && ( */}
      {isDesktop && (
        <PlannerModal modalOpen={open!} setModalOpen={setOpen!} onCloseModal={() => setOpen && setOpen(false)}>
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
          <div className="my-6 w-full">
            <TextInput
              iconName="carbon:search"
              iconClassName="text-[#181A20] w-[16px] h-[16x]"
              placeholder="Search"
              onChange={e => {
                setSearch(e.target.value)
              }}
              name={''}
              value={search}
              type={'text'}
            />
          </div>

          <div className="grid w-full grid-cols-5 gap-4 px-[10px] lg:px-[24px]">
            {AllCategories?.filter((category: any) =>
              category.name?.toLowerCase()?.includes(search.toLowerCase())
            )?.map((category: any, i: number) => (
              <div
                className="flex cursor-pointer flex-col items-center gap-2"
                key={i}
                onClick={() => handleCategoryClick(category)}
              >
                <div
                  style={{backgroundColor: category.filledColor}}
                  className={`flex h-[60px] w-[70px] items-center justify-center gap-6 rounded-[9px] p-2 px-4`}
                >
                  {category.name === 'Groceries' ? (
                    <Image src={'/assets/fruits.svg'} alt="fruits" width={32} height={36} />
                  ) : (
                    <Icon icon={category.icon} className={`text-2xl`} style={{color: category.solidColor}} />
                  )}
                </div>
                <p className="text-center text-[12px]">{category?.name}</p>
              </div>
            ))}
          </div>
        </PlannerModal>
      )}

      {!isDesktop && (
        <Drawer
          // title="Basic Drawer"
          onClose={onClose}
          closable={false}
          open={open}
          placement="bottom" // Set the drawer to slide from the bottom
          height="90vh" // Set the height to 90% of the viewport height
        >
          {' '}
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
          <div className="my-6 w-full">
            <TextInput
              iconName="carbon:search"
              iconClassName="text-[#181A20] w-[16px] h-[16x]"
              placeholder="Search"
              onChange={e => {
                setSearch(e.target.value)
              }}
              name={''}
              value={search}
              type={'text'}
            />
          </div>
          <div className="grid w-full grid-cols-4 gap-4 px-[10px] lg:px-[24px]">
            {AllCategories?.filter((category: any) =>
              category.name?.toLowerCase()?.includes(search.toLowerCase())
            )?.map((category: any, i: number) => (
              <div
                className="flex cursor-pointer flex-col items-center gap-2"
                key={i}
                onClick={() => handleCategoryClick(category)}
              >
                <div
                  style={{backgroundColor: category.filledColor}}
                  className={`flex h-[60px] w-[70px] items-center justify-center gap-6 rounded-[9px] p-2 px-4`}
                >
                  {category.name === 'Groceries' ? (
                    <Image src={'/assets/fruits.svg'} alt="fruits" width={32} height={36} />
                  ) : (
                    <Icon icon={category.icon} className={`text-2xl`} style={{color: category.solidColor}} />
                  )}
                </div>
                <p className="text-center text-[12px]">{category?.name}</p>
              </div>
            ))}
          </div>
        </Drawer>
      )}
    </section>
  )
}

export default AllCategory
