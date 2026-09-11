import {useBusinessListingsQuery} from '@/services/myBussiness'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import React, {useState} from 'react'
import defaultLogo from '../../../public/assets/default_banner.jpg'
import {ISelectedCategory} from '../Auth/Products/components/AllCategory'
import SkeletonLoaderForPage from '../SharedUI/Loader/SkeletonLoaderForPage'
import {Pagination} from 'antd'

type Props = {
  search?: string
  selectedCategories?: ISelectedCategory[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedCategory[]>>
}

const MekDirectories = ({search, selectedCategories, setSelectedCategories}: Props) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  const removeCategory = (id: number) => {
    setSelectedCategories(prevSelected => prevSelected.filter(selected => selected.id !== id))
  }

  const {data, isLoading} = useBusinessListingsQuery({
    search: search,
    industry: selectedCategories?.map(category => +category.id),
    page: currentPage,
    current_page: currentPage,
    per_page: pageSize
  })

  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size) setPageSize(size)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  // console.log('data', data)
  if (isLoading) return <SkeletonLoaderForPage length={2} />
  return (
    <div className="mx-auto w-full max-w-7xl px-2">
      <h1 className="mb-4 text-[20px] font-bold text-black">MEK Directory</h1>

      {(selectedCategories ?? []).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {(selectedCategories ?? []).map((category, index) => (
            <div
              onClick={() => removeCategory(category.id)}
              key={index}
              className="flex cursor-pointer items-center gap-2 rounded-[5px] bg-[#CFD6E4] px-2 py-1.5 shadow-f1"
            >
              <p className="text-[#6B7280]">{category.name}</p>
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
      <div className="mb-10 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {data?.data.data.map((business, index) => {
          // console.log('logo', `${process.env.imageBaseUrl}/${business.business_logo_url}`)
          return (
            <div key={business.id} className="flex flex-col gap-2 bg-white p-2 md:p-4">
              <Image
                src={
                  business?.business_logo_url
                    ? `${process.env.imageBaseUrl}/${business.business_logo_url}`
                    : defaultLogo
                }
                onLoadStart={() => {
                  setIsLoadingImage(true)
                }}
                onLoad={() => {
                  setIsLoadingImage(false)
                }}
                onError={(error: any) => {
                  error.currentTarget.src = '/assets/default_banner.jpg'
                  setIsLoadingImage(false)
                }}
                width={100}
                height={100}
                alt="business logo"
                className={`h-[303px] w-full ${isLoadingImage ? 'blur-sm' : ''}`}
              />
              <h2 className="text-[20px] font-bold text-[#6B7280]">{business.business_name}</h2>
              {business.show_business_email && business.business_email && (
                <div className="mt-2 flex items-center gap-2">
                  <Icon icon={'carbon:email'} className="text-[20px]" />
                  <span className="font-medium">{business.business_email}</span>
                </div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <Icon icon={'ic:sharp-phone'} className="text-[20px]" />
                <span className="font-medium"> +{business.business_contact_number}</span>
              </div>

              {business.show_business_address && business.business_address && (
                <div className="mt-2 flex items-center gap-2">
                  <Icon icon={'mingcute:location-line'} className="text-[20px]" />
                  <p className="text-normal font-medium text-[#6B7280]">{business.business_address}</p>
                </div>
              )}

              {business.show_business_description && business.business_description && (
                <div className="mt-auto rounded-lg bg-[#EAECEF] p-2">
                  {/* <p className="text-normal font-semibold text-[#6B7280]">Business Description:</p> */}
                  <p className="text-normal font-medium text-[#4D4D4D]">{business.business_description}</p>
                </div>
              )}
            </div>
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
