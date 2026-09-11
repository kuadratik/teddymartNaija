import {useAppSelector} from '@/hooks/reduxHooks'
import useWindowResize from '@/hooks/useWindowResize'
import {Icon} from '@iconify/react'
import {Pagination} from 'antd'
import Link from 'next/link'
import React, {useState} from 'react'
import defaultLogo from '../../../public/assets/default_banner.jpg'
import {ISelectedCategory} from '../Auth/Products/components/AllCategory'
import TextComponent from '../SharedUI/TextComponent'
import MekDirectoryCard from './MekDirectoryCard'
import MekDirectoryCardSkeleton from './MekDirectoryCardSkeleton'

type Props = {
  search?: string
  selectedCategories?: ISelectedCategory[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedCategory[]>>
  industries: any
  data: any
  isLoading: boolean
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  currentPage: number
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  pageSize: number
  selectedCountry: string
  setSelectedState: React.Dispatch<React.SetStateAction<string>>
  selectedState: string
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>
  selectedOnClickState: any
  selectedOnclickCountry: any

}

const MekDirectories = ({
  search,
  selectedCategories,
  setSelectedCategories,
  data,
  isLoading,
  setCurrentPage,
  setPageSize,
  pageSize,
  currentPage,
  selectedOnClickState,
  selectedOnclickCountry,
}: Props) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const {width} = useWindowResize()

  const removeCategory = (id: number) => {
    setSelectedCategories(prevSelected => prevSelected.filter(selected => selected.id !== id))
  }
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuth = isAuthenticatedToken

  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size) setPageSize(size)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  // console.log('data', data)
  if (isLoading)
    return (
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-0">
        <div className="mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {[...Array(width > 1024 ? 8 : width > 640 ? 4 : 4)].map((_, index) => (
            <MekDirectoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  return (
    <div className="mx-auto w-full max-w-7xl px-5 lg:px-0">
      <div className="mb-4 flex items-center justify-between">
        <TextComponent as="span" className="text-[19px] font-bold capitalize leading-[13px]">
          MEK Directory
        </TextComponent>{' '}
        <Link
          href={`/${isAuth ? 'get-list' : 'auth/sign-up?redirect=/get-list'}`}
          className="rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:text-gray-200 hover:opacity-80 lg:px-8"
        >
          Get Listed
        </Link>
      </div>
      {selectedOnclickCountry || selectedOnClickState ? (
        <div className="relative bottom-3 px-[35px] lg:px-0">
          <p className="pt-2 font-[500] lg:pt-0">
            {data?.data?.data.length === 0 && 'No'} Results for{' '}
            {selectedOnClickState?.name ? selectedOnClickState?.name + ',' : ''} {selectedOnclickCountry?.name ?? ''}
          </p>
        </div>
      ) : null}
      {(selectedCategories ?? []).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {(selectedCategories ?? []).map((category, index) => (
            <div
              onClick={() => removeCategory(category.id)}
              key={index}
              className="flex cursor-pointer items-center gap-2 rounded-[5px] bg-[#CFD6E4] px-2 py-1.5 shadow-f1"
            >
              <p className="font-[500] text-[#6B7280]">{category.name}</p>
              <Icon icon={'mdi:close'} className="text-[16px]" />
            </div>
          ))}
        </div>
      )}

      {data?.data.data.length === 0 && (
        <div className="flex h-[300px] w-full items-center justify-center rounded-[5px]">
          <p className="text-[20px] font-bold">No business found</p>
        </div>
      )}
      <div className="mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data?.data.data.map((business: any, index: number) => {
          return (
            <React.Fragment key={business.id}>
              <MekDirectoryCard setIsLoadingImage={setIsLoadingImage} business={business} defaultLogo={defaultLogo} />
            </React.Fragment>
          )
        })}
      </div>

      <div className="my-8 flex w-full">
        <div className="ml-auto">
          {data?.data?.to! > 0 && !isLoading && (
            <Pagination
              current={currentPage}
              total={(data as any)?.data?.total!}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={handlePaginationChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MekDirectories
