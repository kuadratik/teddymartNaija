import MekDirectoryCard from '@/components/Business/MekDirectoryCard'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import {useActiveUserQuery} from '@/services/auth'
import {useBusinessListingsQuery} from '@/services/myBussiness'
import {Pagination} from 'antd'
import React, {useState} from 'react'
import defaultLogo from '../../../../public/assets/default_banner.jpg'

const MyDirectory = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [pageSize, setPageSize] = useState(15)
  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery({})
  const {data, isLoading} = useBusinessListingsQuery({
    search: '',
    industry: undefined,
    page: currentPage,
    current_page: currentPage,
    per_page: pageSize,
    user: activeUserData?.data?.id as any
  })
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size) setPageSize(size)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
  if (isLoading) {
    return <SkeletonLoaderForPage />
  }
  return (
    <div className="">
      {data?.data.data.length === 0 && (
        <div className="flex h-[300px] w-full items-center justify-center rounded-[5px]">
          <p className="text-[20px] font-bold">No business found</p>
        </div>
      )}
      <div className="mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
        {data?.data.data.map((business, index) => {
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

export default MyDirectory
