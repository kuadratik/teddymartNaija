import React from 'react'

interface IPros {
  step: number
  title_header?: boolean
  showProfile?: boolean
}
const SkeletonStoreInformation = ({step, title_header = true, showProfile = true}: IPros) => {
  const Line = ({w = 'w-full', h = 'h-4', rounded = 'rounded-md'}) => (
    <div className={`${w} ${h} ${rounded} animate-pulse bg-gray-200`} />
  )

  const TwoCols = ({left, right}: {left: React.ReactNode; right: React.ReactNode}) => (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      {left}
      {right}
    </div>
  )
  if (step === 1) {
    return (
      <div className="mb-[80px] w-full">
        <div className="mt-[50px]">
          <Line w="w-2/3" h="h-6" />
          <div className="mt-6">
            <Line w="w-full" h="h-2" />
          </div>
        </div>

        <div className="mt-[24px] flex w-full flex-col gap-6">
          {/* Store Name */}
          <div className="space-y-2">
            <Line w="w-32" h="h-4" />
            <Line />
          </div>

          {/* Category */}
          <div className="w-full space-y-2">
            <Line w="w-28" h="h-4" />
            <div className="flex gap-2">
              <Line w="w-1/3" />
              <Line w="w-1/4" />
              <Line w="w-1/6" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Line w="w-28" h="h-4" />
            <div className="space-y-2">
              <Line />
              <Line />
              <Line w="w-3/4" />
            </div>
          </div>

          {/* Phone fields */}
          <TwoCols
            left={
              <div className="w-full space-y-2">
                <Line w="w-28" h="h-4" />
                <Line />
              </div>
            }
            right={
              <div className="w-full space-y-2">
                <Line w="w-28" h="h-4" />
                <Line />
              </div>
            }
          />

          {/* Address rows */}
          <TwoCols
            left={
              <div className="w-full space-y-2">
                <Line w="w-40" h="h-4" />
                <Line />
              </div>
            }
            right={
              <div className="w-full space-y-2">
                <Line w="w-40" h="h-4" />
                <Line />
              </div>
            }
          />

          {/* Country/State */}
          <TwoCols
            left={
              <div className="w-full space-y-2">
                <Line w="w-40" h="h-4" />
                <Line />
              </div>
            }
            right={
              <div className="w-full space-y-2">
                <Line w="w-40" h="h-4" />
                <Line />
              </div>
            }
          />

          {/* City / Postal */}
          <TwoCols
            left={
              <div className="w-full space-y-2">
                <Line w="w-28" h="h-4" />
                <Line />
              </div>
            }
            right={
              <div className="w-full space-y-2">
                <Line w="w-28" h="h-4" />
                <Line />
              </div>
            }
          />
        </div>
      </div>
    )
  }
  if (step === 2) {
    const Line = ({w = 'w-full', h = 'h-4', rounded = 'rounded-md'}) => (
      <div className={`${w} ${h} ${rounded} animate-pulse bg-gray-200`} />
    )

    return (
      <div className="mb-[80px] w-full">
        {title_header && (
          <div className="mt-[50px]">
            <Line w="w-2/3" h="h-6" />
            <div className="mt-6">
              <Line w="w-full" h="h-2" />
            </div>
          </div>
        )}

        <div className={`${title_header ? 'mt-[24px]' : 'mt-[52px]'} flex flex-col gap-8`}>
          {showProfile && (
            <div className="">
              <div className="space-y-4">
                <Line w="w-1/3" h="h-5" />
                <div className="rounded-md border border-gray-100 p-6">
                  <div className="h-[160px] w-full animate-pulse rounded-md bg-gray-200" />
                </div>
              </div>
            </div>
          )}

          <div className="">
            <div className="space-y-4">
              <Line w="w-1/3" h="h-5" />
              <div className="rounded-md border border-gray-100 p-6">
                <div className="h-[138px] w-full animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (step === 3) {
    const Line = ({w = 'w-full', h = 'h-4', rounded = 'rounded-md'}) => (
      <div className={`${w} ${h} ${rounded} animate-pulse bg-gray-200`} />
    )

    return (
      <div className="mb-[80px] w-full">
        {title_header && (
          <div className="mt-[50px]">
            <Line w="w-2/3" h="h-6" />
            <div className="mt-2">
              <Line w="w-full" h="h-4" />
              <Line w="w-3/4" h="h-4" />
            </div>
            <div className="mt-6">
              <Line w="w-full" h="h-2" />
            </div>
          </div>
        )}

        <div className={`${title_header ? 'mt-[32px]' : ''}`}>
          <div className="space-y-4 rounded-[12px] bg-[#F9FAFB] p-6">
            {/* Admin Fee */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <Line w="w-32" h="h-6" />
              <Line w="w-24" h="h-6" />
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between border-b border-gray-200 py-4">
              <Line w="w-36" h="h-6" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
                <Line w="w-20" h="h-6" />
              </div>
            </div>

            {/* Country */}
            <div className="flex items-center justify-between pt-4">
              <Line w="w-28" h="h-6" />
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                <Line w="w-20" h="h-6" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-3 lg:gap-5">
            <div className="h-12 w-[30%] animate-pulse rounded-[10px] bg-gray-200" />
            <div className="h-12 w-[70%] animate-pulse rounded-[10px] bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="mb-[80px] w-full">
      <div className="mt-[50px]">
        <Line w="w-2/3" h="h-6" />
        <div className="mt-6">
          <Line w="w-full" h="h-2" />
        </div>
      </div>

      <div className="mt-[24px] flex w-full flex-col gap-6">
        {/* Store Name */}
        <div className="space-y-2">
          <Line w="w-32" h="h-4" />
          <Line />
        </div>

        {/* Category */}
        <div className="w-full space-y-2">
          <Line w="w-28" h="h-4" />
          <div className="flex gap-2">
            <Line w="w-1/3" />
            <Line w="w-1/4" />
            <Line w="w-1/6" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Line w="w-28" h="h-4" />
          <div className="space-y-2">
            <Line />
            <Line />
            <Line w="w-3/4" />
          </div>
        </div>

        {/* Phone fields */}
        <TwoCols
          left={
            <div className="w-full space-y-2">
              <Line w="w-28" h="h-4" />
              <Line />
            </div>
          }
          right={
            <div className="w-full space-y-2">
              <Line w="w-28" h="h-4" />
              <Line />
            </div>
          }
        />

        {/* Address rows */}
        <TwoCols
          left={
            <div className="w-full space-y-2">
              <Line w="w-40" h="h-4" />
              <Line />
            </div>
          }
          right={
            <div className="w-full space-y-2">
              <Line w="w-40" h="h-4" />
              <Line />
            </div>
          }
        />

        {/* Country/State */}
        <TwoCols
          left={
            <div className="w-full space-y-2">
              <Line w="w-40" h="h-4" />
              <Line />
            </div>
          }
          right={
            <div className="w-full space-y-2">
              <Line w="w-40" h="h-4" />
              <Line />
            </div>
          }
        />

        {/* City / Postal */}
        <TwoCols
          left={
            <div className="w-full space-y-2">
              <Line w="w-28" h="h-4" />
              <Line />
            </div>
          }
          right={
            <div className="w-full space-y-2">
              <Line w="w-28" h="h-4" />
              <Line />
            </div>
          }
        />
      </div>
    </div>
  )
}

export default SkeletonStoreInformation
