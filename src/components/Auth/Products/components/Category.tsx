import {Icon} from '@iconify/react'
import {Drawer} from 'antd'
import Image from 'next/image'
import {Swiper, SwiperSlide} from 'swiper/react'
import {CategoriesProps} from '../utils'

// Import Swiper styles
import PlannerModal from '@/components/SharedUI/ModalComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import 'swiper/css/pagination'
import CategoryDetails from './CategoryDetails'

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

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [signUpUser, setSignUpUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = JSON.parse(localStorage.getItem('Clip-Uid')!)
      setSignUpUser(uuid)
    }
  }, [])

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
      return {...val, icon: 'fluent:food-16-regular', filledColor: '#E4F3EA', solidColor: '#3A9B7A'}
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

  const [search, setSearch] = React.useState('')
  const [searchValue, setSearchValue] = React.useState('')

  const onClose = () => {
    setOpen && setOpen(false)
  }

  return (
    <section className="lg:h-[400px] lg:w-[259px] lg:overflow-y-scroll">
      {isDesktop && (
        <div>
          {AllCategories?.map((category: CategoriesProps, i: number) => (
            <div
              className="flex h-[57px] cursor-pointer flex-row items-center gap-2 border-b border-b-[#EAECEF] py-[9px] hover:opacity-80"
              key={i}
              onClick={() => {
                setSelectedId(category.id ?? null)
                router.push(`/category/${category?.id}?type=${type}`)
              }}
            >
              <div
                style={{backgroundColor: category.filledColor}}
                className={`flex h-[41.88px] w-[41.88px] items-center justify-center gap-6 rounded-[9px]`}
              >
                {category.name === 'Groceries' ? (
                  <Image src={'/assets/fruits.svg'} alt="fruits" width={19} height={36} />
                ) : (
                  <Icon icon={category.icon} className={`text-[16px]`} style={{color: category.solidColor}} />
                )}
              </div>
              <p className="text-center text-[12px]">{category?.name}</p>
            </div>
          ))}
        </div>
      )}
      {!isDesktop && (
        <div className="flex h-full w-full flex-col gap-4">
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 4
              },
              640: {
                slidesPerView: 4
              },
              768: {
                slidesPerView: 5
              },
              1024: {
                slidesPerView: 5
              }
            }}
            spaceBetween={20}
            pagination={{
              clickable: false
            }}
            modules={[]}
            className="h-full w-full"
          >
            {AllCategories?.map((category: CategoriesProps, i: number) => (
              <SwiperSlide className="w-full" key={i}>
                <div
                  className="flex cursor-pointer flex-col items-center gap-2"
                  key={i}
                  onClick={() => {
                    setSelectedId(category.id ?? null)
                    router.push(`/category/${category?.id}?type=${type}`)
                  }}
                >
                  <div
                    style={{backgroundColor: category.filledColor}}
                    className={`flex h-[60px] w-[70px] items-center justify-center gap-6 rounded-[9px] p-2 px-4`}
                  >
                    {category.name === 'Groceries' ? (
                      <Image src={'/assets/fruits.svg'} alt="fruits" width={23} height={36} />
                    ) : (
                      <Icon icon={category.icon} className={`text-2xl`} style={{color: category.solidColor}} />
                    )}
                  </div>
                  <p className="text-center text-[12px]">{category?.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {isDesktop && (
        <PlannerModal modalOpen={open!} setModalOpen={setOpen!} onCloseModal={() => setOpen && setOpen(false)}>
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
