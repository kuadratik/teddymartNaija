const UserMobileCardSkeleton = () => (
  <div className="flex flex-col gap-2 rounded-2xl border border-white bg-[#F9F9F963] p-5 shadow-f1">
    <div className="flex items-center justify-between">
      <div className="h-5 w-32 animate-pulse rounded bg-gray-300"></div>
      <div className="h-6 w-6 animate-pulse rounded bg-gray-300"></div>
    </div>
    <div className="h-4 w-48 animate-pulse rounded bg-gray-300"></div>
    <div className="h-4 w-40 animate-pulse rounded bg-gray-300"></div>
    <div className="mt-2">
      <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-300"></div>
    </div>
  </div>
)

export default UserMobileCardSkeleton
