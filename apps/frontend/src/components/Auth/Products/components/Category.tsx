import {Icon} from '@iconify/react'
import {Drawer} from 'antd'
import Image from 'next/image'
import {CategoriesProps} from '../utils'

import Carousel from '@/components/SharedUI/Carousel'
// Import Swiper styles
import PlannerModal from '@/components/SharedUI/ModalComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import CategoryDetails from './CategoryDetails'

interface ICategoryProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const filledColorClassMap: Record<string, string> = {
  '#F1EDFC': 'bg-[#F1EDFC]',
  '#FFF6E4': 'bg-[#FFF6E4]',
  '#E4E7F3': 'bg-[#E4E7F3]',
  '#E4F3EA': 'bg-[#E4F3EA]',
  '#FFECE8': 'bg-[#FFECE8]',
  '#FFE0ED': 'bg-[#FFE0ED]',
  '#EAFFE8': 'bg-[#EAFFE8]',
  '#FFF2E8': 'bg-[#FFF2E8]',
  '#E4E5F3': 'bg-[#E4E5F3]',
  '#DEFFDF': 'bg-[#DEFFDF]',
  '#FFE4E4': 'bg-[#FFE4E4]',
  '#FFD2FA': 'bg-[#FFD2FA]',
  '#E4FFEC': 'bg-[#E4FFEC]',
  '#E4EAFF': 'bg-[#E4EAFF]',
  '#FFF8E4': 'bg-[#FFF8E4]',
  '#E4FFE7': 'bg-[#E4FFE7]',
  '#E8E8E8': 'bg-[#E8E8E8]',
  '#F8E4FF': 'bg-[#F8E4FF]'
}

const solidColorClassMap: Record<string, string> = {
  '#6A3AF3': 'text-[#6A3AF3]',
  '#FCC21B': 'text-[#FCC21B]',
  '#3A619B': 'text-[#3A619B]',
  '#3A9B7A': 'text-[#3A9B7A]',
  '#FE6E4C': 'text-[#FE6E4C]',
  '#94989B': 'text-[#94989B]',
  '#FE4C97': 'text-[#FE4C97]',
  '#34C759': 'text-[#34C759]',
  '#007AFF': 'text-[#007AFF]',
  '#027B0A': 'text-[#027B0A]',
  '#FD0000': 'text-[#FD0000]',
  '#580057': 'text-[#580057]',
  '#00FF1E': 'text-[#00FF1E]',
  '#1300BE': 'text-[#1300BE]',
  '#F3911C': 'text-[#F3911C]',
  '#000000': 'text-[#000000]',
  '#AF52DE': 'text-[#AF52DE]',
  '#FF652D': 'text-[#FF652D]'
}

const getFilledColorClass = (color?: string) => filledColorClassMap[color ?? ''] ?? 'bg-[#F1EDFC]'
const getSolidColorClass = (color?: string) => solidColorClassMap[color ?? ''] ?? 'text-[#6A3AF3]'

const Category = ({open, setOpen}: ICategoryProps) => {
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)

  const {data, isLoading} = useGetAllCategoriesQuery({
    type: type
  })

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [signUpUser, setSignUpUser] = useState<any>(null)

  const [selectedId, setSelectedId] = useState<number | null>(null)

  // const {data: recommendedData} = useGetRecordInteractionQuery({
  //   category: data?.data?.find((category: any) => category.id === Number(selectedId))?.slug,
  //   interactUid: signUpUser
  // })

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
      return {...val, icon: 'fluent:food-16-regular', filledColor: '#E4E7F3', solidColor: '#3A619B'}
    } else if (val.name === 'Beauty & Personal Care') {
      return {...val, name: 'Beauty', icon: 'icon-park-outline:beauty', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
    } else if (val.name === 'Sports & Outdoors') {
      return {...val, icon: 'fluent:sport-american-football-20-regular', filledColor: '#FFECE8', solidColor: '#FE6E4C'}
    } else if (val.name === 'Books & Media') {
      return {...val, icon: 'emojione:books', filledColor: '#E4F3EA', solidColor: '#94989B'}
    } else if (val.name === 'Toys & Games') {
      return {...val, icon: 'dashicons:games', filledColor: '#FFE0ED', solidColor: '#FE4C97'}
    } else if (val.name === 'Automotive') {
      return {...val, icon: 'hugeicons:automotive-battery-01', filledColor: '#FFF6E4', solidColor: '#FCC21B'}
    } else if (val.name === 'Health & Wellness') {
      return {...val, icon: 'solar:health-bold-duotone', filledColor: '#FFF6E4', solidColor: '#FCC21B'}
    } else if (val.name === 'Groceries') {
      return {...val, icon: 'solar:health-bold-duotone', filledColor: '#EAFFE8', solidColor: '#34C759'}
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
    } else if (val.name === 'Food & Dining') {
      return {
        ...val,
        icon: 'material-symbols:dining-rounded',
        filledColor: '#FFF2E8',
        solidColor: '#FF652D'
      }
    } else if (val.name === 'Office & Stationery') {
      return {
        ...val,
        icon: 'hugeicons:stationery',
        filledColor: '#E4E5F3',
        solidColor: '#007AFF'
      }
    } else if (val.name === 'Pet Supplies') {
      return {
        ...val,
        icon: 'mdi:pets',
        filledColor: '#DEFFDF',
        solidColor: '#027B0A'
      }
    } else if (val.name === 'Art & Crafts') {
      return {
        ...val,
        icon: 'map:art-gallery',
        filledColor: '#FFE4E4',
        solidColor: '#FD0000'
      }
    } else if (val.name === 'Collectibles') {
      return {
        ...val,
        icon: 'material-symbols:collections-bookmark-outline-rounded',
        filledColor: '#FFD2FA',
        solidColor: '#580057'
      }
    } else if (val.name === 'Travel & Luggage') {
      return {
        ...val,
        icon: 'material-symbols-light:travel',
        filledColor: '#E4FFEC',
        solidColor: '#00FF1E'
      }
    } else if (val.name === 'Digital Products') {
      return {
        ...val,
        icon: 'hugeicons:digital-clock',
        filledColor: '#E4EAFF',
        solidColor: '#1300BE'
      }
    } else if (val.name === 'Construction') {
      return {
        ...val,
        icon: 'noto:building-construction',
        filledColor: '#FFF8E4',
        solidColor: '#F3911C'
      }
    } else if (val.name === 'Eco-Friendly') {
      return {
        ...val,
        icon: 'material-symbols-light:nest-eco-leaf-rounded',
        filledColor: '#E4FFE7',
        solidColor: '#34C759'
      }
    } else if (val.name === 'Tools & Hardware') {
      return {
        ...val,
        icon: 'hugeicons:tools',
        filledColor: '#E8E8E8',
        solidColor: '#000000'
      }
    } else if (val.name === 'Babies & Kids') {
      return {
        ...val,
        icon: 'fa-solid:baby',
        filledColor: '#F8E4FF',
        solidColor: '#AF52DE'
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

  return (
    <section className="mx-auto w-full max-w-screen-xl xl:px-0 2xl:max-w-screen-2xl">
      <Carousel<any>
        items={AllCategories ?? []}
        containerClassName="my-0 w-full px-[10px] lg:px-0"
        showArrows={isDesktop}
        breakpoints={{
          320: {
            slidesPerView: 2.1,
            spaceBetween: 16
          },
          370: {
            slidesPerView: 2.2,
            spaceBetween: 16
          },
          400: {
            slidesPerView: 2.2,
            spaceBetween: 16
          },
          450: {
            slidesPerView: 2.5,
            spaceBetween: 16
          },
          540: {
            slidesPerView: 2.7,
            spaceBetween: 16
          },
          640: {
            slidesPerView: 3.2,
            spaceBetween: 16
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 4.2,
            spaceBetween: 20
          },
          1280: {
            slidesPerView: 7.8,
            spaceBetween: 16
          },
          1700: {
            slidesPerView: 9,
            spaceBetween: 16
          }
        }}
        renderItem={(category: CategoriesProps, i: number) => (
          <Link
            href={`/category/${category.id}-${(category as any).slug}?type=${(category as any).type}`}
            key={`${category.id}-${i}`}
            className="flex h-[57px] min-w-[200px] cursor-pointer flex-row items-center gap-2 border-b border-b-[#EAECEF] py-[9px] hover:opacity-80"
            onClick={() => setSelectedId(category.id ?? null)}
          >
            <div
              className={`flex h-[41.88px] w-[41.88px] items-center justify-center gap-6 rounded-[9px] ${getFilledColorClass(category.filledColor)}`}
            >
              {category.name === 'Groceries' ? (
                <Image src={'/assets/fruits.svg'} alt="fruits" width={19} height={36} />
              ) : (
                <Icon icon={category.icon} className={`text-[16px] ${getSolidColorClass(category.solidColor)}`} />
              )}
            </div>
            <p className="whitespace-nowrap text-center text-[12px] font-[500]">{category?.name}</p>
          </Link>
        )}
      />

      {isDesktop && (
        <PlannerModal
          width={600}
          modalOpen={open!}
          setModalOpen={setOpen!}
          onCloseModal={() => setOpen && setOpen(false)}
        >
          <CategoryDetails
            setSearchValue={setSearchValue}
            AllCategories={AllCategories}
            onClose={onClose}
            search={search}
            setSearch={setSearch}
            router={router}
            setSelectedId={setSelectedId}
          />
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
          <CategoryDetails
            setSearchValue={setSearchValue}
            AllCategories={AllCategories}
            onClose={onClose}
            search={search}
            setSearch={setSearch}
            router={router}
            setSelectedId={setSelectedId}
          />
        </Drawer>
      )}
    </section>
  )
}

export default Category
