const AdvertCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-[#EDEDED] bg-white">
      <div className="relative flex flex-col px-2 py-1 lg:flex-row lg:items-center">
        {/* Image skeleton */}
        <div className="relative h-[240px] animate-pulse rounded-[6px] bg-gray-200 lg:h-[130px] lg:w-[130px]" />

        <div className="flex flex-col justify-center space-y-3 p-4 lg:w-2/3">
          {/* Title skeleton */}
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

          {/* Price skeleton */}
          <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />

          {/* Description skeleton - multiple lines */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Location skeleton */}
      <div className="relative -top-1 px-4 py-2">
        <div className="flex items-center justify-end">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export default AdvertCardSkeleton
