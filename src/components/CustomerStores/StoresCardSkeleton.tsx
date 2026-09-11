import {Icon} from '@iconify/react'

const StoresCardSkeleton = () => {
  return (
    <div className="rounded-[16px] border border-gray-100 bg-white p-2 shadow-f2">
      <div className="relative">
        <div className="h-[138px] w-full animate-pulse rounded-[12px] bg-gray-200"></div>
        <div className="absolute -bottom-7 left-1/2 h-[64px] w-[64px] -translate-x-1/2 animate-pulse rounded-full bg-gray-200"></div>
      </div>
      <div className="text-center text-[#2A2A2A]">
        <div className="pt-10">
          <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="mx-auto mt-2 w-[90%]">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="">
          <div className="mb-2 mt-4 flex items-center justify-between rounded-[9px] bg-[#F9F9F9] px-4 py-1.5">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="flex h-[38px] w-[36px] items-center justify-center rounded-lg border border-[#FEFEFE] bg-white">
              <Icon icon="lets-icons:send-duotone" width="20" height="20" className="text-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoresCardSkeleton
