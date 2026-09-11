import React from 'react'

const DetailsCardSkeletonLoader = () => {
  return (
    <div className=" w-full rounded-[8px] border-[1px] border-solid border-[#EDEDED] bg-[#FFFFFF] h-full">
      <div className="flex flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center">
          <div className="relative flex !w-full flex-col items-center overflow-hidden  lg:p-0">
            {/* Image skeleton */}
            <div className=" w-full animate-pulse overflow-hidden rounded-t-[10px] bg-gray-200 p-1.5 h-[250px]"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between p-3">
        <div className="flex flex-col">
          {/* Title skeleton */}
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>

          {/* Price skeleton */}
          <div className="mt-2 h-5 w-28 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Button skeleton */}
        <div className="flex h-[42px] w-[42px] animate-pulse items-center justify-center rounded-full bg-gray-200"></div>
      </div>
    </div>
  )
}

export default DetailsCardSkeletonLoader
