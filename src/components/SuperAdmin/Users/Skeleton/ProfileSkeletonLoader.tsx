// Add this skeleton loader component above the return statement in the index component
const ProfileSkeletonLoader = () => (
  <div className="flex flex-col gap-6 py-6 lg:bg-[#FFFFFF4D] lg:px-8">
    {/* User Details Section */}
    <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
      <div className="lg:w-[40%]">
        <div className="h-6 animate-pulse rounded bg-gray-300"></div>
      </div>
      <div className="lg:w-[60%]">
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="w-full">
                <div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 animate-pulse rounded-[3px] bg-gray-300"></div>
              </div>
              <div className="w-full">
                <div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 animate-pulse rounded-[3px] bg-gray-300"></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="w-full">
                <div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 animate-pulse rounded-[3px] bg-gray-300"></div>
              </div>
              <div className="w-full">
                <div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 animate-pulse rounded-[3px] bg-gray-300"></div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Permissions and Accessibility Section */}
    <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
      <div className="lg:w-[40%]">
        <div className="h-6 animate-pulse rounded bg-gray-300"></div>
      </div>
      <div className="lg:w-[60%]">
        <div className="mb-0 h-12 animate-pulse rounded-t-lg bg-gray-300"></div>
        <div className="flex flex-col rounded-b-lg bg-[#FFFFFF5C] px-5 py-3">
          <div className="space-y-2 py-3">
            <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 animate-pulse rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Change Password Section */}
    <div className="flex flex-col gap-4 rounded-[15px] border border-white bg-[#F9F9F963] p-5 lg:flex-row lg:gap-6 lg:p-10">
      <div className="lg:w-[40%]">
        <div className="h-6 animate-pulse rounded bg-gray-300"></div>
      </div>
      <div className="lg:w-[60%]">
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="w-full">
                <div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 animate-pulse rounded-[3px] bg-gray-300"></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="w-full">
                <div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 animate-pulse rounded-[3px] bg-gray-300"></div>
              </div>
              <div className="w-full">
                <div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
                <div className="h-10 animate-pulse rounded-[3px] bg-gray-300"></div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0">
            <div className="h-12 w-40 animate-pulse rounded-lg bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
export default ProfileSkeletonLoader
