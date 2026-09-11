import ShareIcon from '@/components/SharedUI/ShareIcon'

const BrandCardSkeleton = () => {
  return (
    <div className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Brand Header */}
      <div className="flex flex-1 items-center gap-3 border-b border-gray-100 p-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-50 ring-1 ring-gray-200">
          <div className="h-full w-full animate-pulse rounded-full bg-gray-200"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        {/* Brand Description */}
        <div className="flex-1">
          <div className="mb-1 h-3 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Share Button */}
        <div className="flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 p-2">
          <ShareIcon className="text-xl text-gray-200" />
        </div>
      </div>
    </div>
  )
}

export default BrandCardSkeleton
