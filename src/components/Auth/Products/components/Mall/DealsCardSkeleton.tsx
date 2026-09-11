import React from 'react'
import {Icon} from '@iconify/react'

const DealsCardSkeleton = () => {
  return (
    <div className="flex items-center gap-3 border border-[#E6E6E6] bg-white p-1">
      {/* Image skeleton */}
      <div className="h-[100px] w-[150px] animate-pulse bg-gray-200"></div>

      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex flex-col">
          {/* Title skeleton */}
          <div className="mb-1 h-5 w-32 animate-pulse rounded bg-gray-200"></div>

          {/* Price skeleton */}
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Arrow icon skeleton */}
        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    </div>
  )
}

export default DealsCardSkeleton
