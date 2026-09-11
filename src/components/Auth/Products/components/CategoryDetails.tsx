import TextInput from '@/components/SharedUI/Input/TextInput'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import React from 'react'
import {useSelector} from 'react-redux'
import {CategoriesProps} from '../utils'

interface ICategoryDetailsProp {
  onClose: () => void
  AllCategories: CategoriesProps[]
  setSelectedId: (value: React.SetStateAction<number | null>) => void
  router: any
  search: string
  setSearch: (value: string) => void
  setSearchValue: (value: React.SetStateAction<string>) => void
}

const CategoryDetails = ({
  onClose,
  AllCategories,
  setSelectedId,
  router,
  search,
  setSearch,
  setSearchValue
}: ICategoryDetailsProp) => {
  const {type} = useSelector((state: any) => state.vendor)

  return (
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
          placeholder="Search"
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

      <div className="grid w-full grid-cols-4 lg:grid-cols-5 gap-4">
        {AllCategories?.filter((category: CategoriesProps) =>
          category.name?.toLowerCase()?.includes(search.toLowerCase())
        )?.map((category: CategoriesProps, i: number) => (
          <div
            className="flex hover:opacity-70 transition-all duration-75 delay-75 cursor-pointer flex-col items-center gap-2"
            key={i}
            onClick={() => {
              setSelectedId(category.id ?? null)
              router.push(`/category/${category.id}-${(category as any).slug}?type=${(category as any).type}`)
            }}
          >
            <div
              style={{backgroundColor: category.filledColor}}
              className={`flex h-[60px] w-[70px] items-center justify-center gap-6 rounded-[9px] p-2 px-4`}
            >
              {category.name === 'Groceries' ? (
                <Image src={'/assets/fruits.svg'} alt="fruits" width={32} height={36} />
              ) : (
                <Icon icon={category.icon} className={`text-2xl lg:text-3xl`} style={{color: category.solidColor}} />
              )}
            </div>
            <p className="text-center text-[12px] font-[500]">{category?.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryDetails
