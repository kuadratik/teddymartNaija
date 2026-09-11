import {Icon} from '@iconify/react'

const MekDirectoryCardSkeleton = () => {
  return (
    <div className="rounded-[20px] border border-[#C4C4C4] bg-white p-4">
      {/* Header with contact number and menu */}
      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center gap-1 font-medium text-[#6B7280]">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
          <Icon icon="iconamoon:arrow-down-2-thin" width="24" height="24" className="text-gray-200" />
        </div>
        <div className="">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
        </div>
      </div>

      {/* Business profile info */}
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        {/* Logo skeleton */}
        <div className="h-[94px] w-[94px] animate-pulse rounded-full bg-gray-200"></div>

        {/* Business name skeleton */}
        <div className="mt-2 h-7 w-48 animate-pulse rounded bg-gray-200"></div>

        {/* Description skeleton - multiple lines */}
        <div className="mt-3 h-[42px] w-full space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
        </div>

        <hr className="my-3 h-[1px] w-full bg-[#E2E2E2]" />
      </div>

      {/* Footer with email and location */}
      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center gap-1">
          <Icon icon="carbon:email" width="22" height="22" className="text-gray-200" />
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="flex cursor-pointer items-center gap-1">
          <Icon icon="mingcute:location-line" width="20" height="20" className="text-gray-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

export default MekDirectoryCardSkeleton
