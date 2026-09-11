import CustomButton from '@/components/SharedUI/Buttons/Button'
import {useGetBestDealsQuery, useGetTodayDealsQuery} from '@/services/store'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import DealsCards from './DealsCards'
import DealsCardSkeleton from './DealsCardSkeleton'
interface IProps {
  selectedLanguage: any
  initialBestDeals?: any[]
  initialTodayDeals?: any[]
}
const TopLowestDeals = ({selectedLanguage, initialBestDeals, initialTodayDeals}: IProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const router = useRouter()

  // Combined data fetching with skip logic
  const skipTodayDeals = !selectedLanguage?.value || (initialTodayDeals && initialTodayDeals.length > 0)
  const skipBestDeals = !selectedLanguage?.value || (initialBestDeals && initialBestDeals.length > 0)

  const {
    isLoading: todayDealsDataLoading,
    currentData: todayDealsDataCurrentData,
    isFetching: todayDealsFetching
  } = useGetTodayDealsQuery(
    {
      currency: selectedLanguage?.value || '',
      limit: 3
    },
    {
      skip: skipTodayDeals,
      refetchOnMountOrArgChange: 30 // Only refetch if it's been at least 30 seconds
    }
  )

  const {
    isLoading: bestDealsDataLoading,
    currentData: bestDealsData,
    isFetching: bestDealsFetching
  } = useGetBestDealsQuery(
    {
      currency: selectedLanguage?.value || ''
    },
    {
      skip: skipBestDeals,
      refetchOnMountOrArgChange: 30 // Only refetch if it's been at least 30 seconds
    }
  )

  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)
  const [hasInitiallyLoadedBestDeals, setHasInitiallyLoadedBestDeals] = useState(false)

  // Use an effect to track when data has been loaded at least once
  useEffect(() => {
    if (todayDealsDataCurrentData && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true)
    }
  }, [todayDealsDataCurrentData, hasInitiallyLoaded])

  useEffect(() => {
    if (bestDealsData && !hasInitiallyLoadedBestDeals) {
      setHasInitiallyLoadedBestDeals(true)
    }
  }, [bestDealsData, hasInitiallyLoadedBestDeals])

  // Better loading state management
  const todayDealsActuallyLoading = todayDealsDataLoading && !hasInitiallyLoaded
  const bestDealsActuallyLoading = bestDealsDataLoading && !hasInitiallyLoadedBestDeals

  // Cache data in component state to avoid re-renders when API refreshes
  const [cachedTodayDeals, setCachedTodayDeals] = useState<any[]>([])
  const [cachedBestDeals, setCachedBestDeals] = useState<any[]>([])

  useEffect(() => {
    if (todayDealsDataCurrentData?.data?.length) {
      setCachedTodayDeals(todayDealsDataCurrentData.data)
    }
  }, [todayDealsDataCurrentData])

  useEffect(() => {
    if (bestDealsData?.data?.length) {
      setCachedBestDeals(bestDealsData.data)
    }
  }, [bestDealsData])

  // Use the cached data or current data, whichever is available
  const todayDealsToShow = initialTodayDeals || todayDealsDataCurrentData?.data || cachedTodayDeals
  const bestDealsToShow = initialBestDeals || bestDealsData?.data || cachedBestDeals

  return (
    <div className="grid grid-cols-1 gap-y-[21px] px-4 py-10 lg:grid-cols-4 lg:gap-[21px] lg:px-0">
      <div
        className="h-[400px] w-full"
        style={{
          backgroundImage: `url('/assets/today-deals.png')`,
          backgroundSize: 'cover',
          backgroundPosition: '100%, 50%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="h-full">
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <p className="text-[14px] font-semibold uppercase tracking-wider text-white">Today’s Deals</p>
            <p className="text-center text-[32px] font-bold leading-9 text-white lg:w-[70%]">Big Savings Await</p>
            <div className="mt-[16px]">
              {' '}
              <CustomButton
                onClick={() => {
                  router.push('/category/top-deals')
                }}
                className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black shadow-f2"
              >
                Shop Now <Icon icon="charm:arrow-right" width="16" height="16" />
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 grid gap-5 lg:grid-cols-2">
        <div className="">
          <h4 className="pb-4 text-[18px] font-[500]">Today’s Deals</h4>
          <div className="flex flex-col gap-3">
            {todayDealsActuallyLoading ? (
              <div className="flex flex-col gap-2">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <DealsCardSkeleton key={`skeleton-${index}`} />
                  ))}
              </div>
            ) : (
              <>
                {todayDealsToShow?.map((item: any, i: number) => (
                  <DealsCards
                    isBestDeals={false}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    item={item}
                    key={item?.id || i}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <div className="">
          <h4 className="pb-4 text-[18px] font-[500]">Lowest Prices</h4>
          <div className="flex flex-col gap-3">
            {bestDealsActuallyLoading ? (
              <div className="flex flex-col gap-2">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <DealsCardSkeleton key={`skeleton-${index}`} />
                  ))}
              </div>
            ) : (
              <>
                {bestDealsToShow.slice(0, 3).map((item: any, i: number) => (
                  <DealsCards
                    isBestDeals={true}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    item={item}
                    key={item?.listing?.id || i}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="h-[400px]"
        style={{
          backgroundImage: `url('/assets/lowest-price.png')`,
          backgroundSize: 'cover',
          backgroundPosition: '10%, 50%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="h-full">
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <p className="text-[14px] font-semibold uppercase tracking-wider text-white">Lowest Prices</p>
            <p className="w-[70%] text-center text-[32px] font-[400] leading-9 text-white">
              Your favorites, <span className="font-bold">now cheaper!</span>
            </p>
            <div className="mt-[16px]">
              {' '}
              <CustomButton
                onClick={() => {
                  router.push('/category/lowest-prices')
                }}
                className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black shadow-f2"
              >
                Shop Now <Icon icon="charm:arrow-right" width="16" height="16" />
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopLowestDeals
