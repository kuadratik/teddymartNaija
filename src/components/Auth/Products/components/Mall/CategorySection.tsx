import Carousel from '@/components/SharedUI/Carousel'
import DetailsCard from '@/components/Store/components/DetailsCard'
import DetailsCardSkeletonLoader from '@/components/Store/components/DetailsCardSkeletonLoader'
import useAddToClipsQuery from '@/components/Store/hooks/useAddToClips'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import useNearViewport from '@/hooks/useNearViewport'
import useWindowResize from '@/hooks/useWindowResize'
import {toggleLargeOpenServiceModal} from '@/redux/features/openServiceModalSlice'
import {useGetSearchStoreListingQuery} from '@/services/store'
import {useRouter} from 'next/router'
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useDispatch} from 'react-redux'

interface IProps {
  selectedLanguage?: any
  categoryTitle?: string
  category_id: number[]
  type: 'product' | 'service'
  formattedCategoryIds?: number[]
  selectedOnclickCountry: string
  isNew?: boolean
  showSeeAllLink?: boolean
  seeAllLinkHref?: string
}
interface Listing {
  store: {
    name: string
    slug: string
  }
}
const CategorySection = ({
  selectedLanguage,
  categoryTitle,
  category_id,
  selectedOnclickCountry,
  type,
  isNew = false,
  showSeeAllLink = false,
  seeAllLinkHref = '/',
  formattedCategoryIds
}: IProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const {width} = useWindowResize()

  // Update the first section check to match new priority (Groceries is now first)
  const isFirstSection = category_id.includes(10) && category_id.length === 2
  const {ref: sectionRef, isNear} = useNearViewport('300px', undefined, isFirstSection)

  // Create a new state to track first load vs subsequent loads
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)

  // Use skip to prevent unnecessary fetches - but load first section immediately
  const skipFetch = (category_id.length === 0 && !isNew) || (!isNear && !hasInitiallyLoaded && !isFirstSection)

  const {
    data: categoryListingData,
    isLoading: categoryListingLoading,
    refetch: categoryListingRefetch,
    currentData: categoryListingCurrentData,
    isFetching: categoryListingFetching
  } = useGetSearchStoreListingQuery(
    {
      currency: selectedLanguage.value,
      listType: type,
      country_id: selectedOnclickCountry as any,
      limit: 10,
      category: isNew ? undefined : category_id
    },
    {
      // Skip if we don't need this data or not near viewport
      skip: skipFetch,
      // Use memory cached data while refetching
      refetchOnMountOrArgChange: true
    }
  )

  // More accurate loading state that considers initial load vs refetches
  const isActuallyLoading = categoryListingLoading && !hasInitiallyLoaded
  const isRefreshing = categoryListingFetching && !categoryListingLoading

  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [currId, setCurrId] = useState<any>()
  const [clipId, setClipId] = useState<any>()

  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const prevRef = useRef(null)
  const nextRef = useRef(null)

  const {isLoading: handleClipIsLoading, handleAddToClip} = useAddToClipsQuery()

  // Ensure navigation is updated after Swiper initialization
  useEffect(() => {
    if (swiperInstance && swiperInstance.navigation) {
      swiperInstance.navigation.update()
    }
  }, [swiperInstance])
  const latestProducts = useMemo(
    () =>
      categoryListingCurrentData?.data
        ? [...categoryListingCurrentData.data]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 15)
        : [],
    [categoryListingCurrentData?.data]
  )
  // Add the memoizedRenderItem here

  type RenderItemCallback = (
    item: {id: string | number; store: {name: string; slug: string}},
    index: number
  ) => JSX.Element

  const memoizedRenderItem: RenderItemCallback = useCallback(
    (listing, index) => (
      <div key={listing?.id || index} className="w-[300px]">
        <MemoizedDetailsCard
          index={index}
          listing={listing as any}
          store_name={listing?.store?.name}
          store_slug={listing?.store?.slug}
        />
      </div>
    ),
    []
  )

  // Use an effect to track when data has been loaded at least once
  useEffect(() => {
    if (categoryListingCurrentData && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true)
    }
  }, [categoryListingCurrentData, hasInitiallyLoaded])
  const handleOpenLargeServiceModal = () => {
    dispatch(toggleLargeOpenServiceModal())
  }

  return (
    // Add data attribute for the ScrollOptimizer to identify category sections
    <div className="" ref={sectionRef} data-category-section={categoryTitle || 'category'}>
      <div className="w-full">
        {/* {isDesktop ? (
          <> */}
        {isActuallyLoading ? (
          <div className="my-4 flex w-full flex-row gap-4 px-4 lg:px-0">
            <div className="grid w-full grid-cols-1 gap-[10px] sm:grid-cols-3 lg:grid-cols-4">
              {Array(width > 1024 ? 4 : width > 640 ? 2 : 1)
                .fill(0)
                .map((_, index) => (
                  <DetailsCardSkeletonLoader key={`skeleton-${index}`} />
                ))}
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 lg:px-0">
              {isNew
                ? latestProducts.length > 0 && (
                    <div className="relative w-full">
                      <div className="">
                        <MemoizedCarousel
                          showArrows={true}
                          seeAllLinkHref={seeAllLinkHref}
                          showSeeAllLink={showSeeAllLink}
                          title={categoryTitle}
                          titleClassName="text-left"
                          items={latestProducts || []}
                          scrollAmount={300}
                          containerClassName="my-3"
                          buttonClassName=""
                          renderItem={memoizedRenderItem as any}
                        />
                      </div>
                    </div>
                  )
                : categoryListingCurrentData?.data?.length! > 0 && (
                    <div className="relative w-full">
                      <div className="">
                        <MemoizedCarousel
                          showArrows={true}
                          title={categoryTitle}
                          seeAllLinkHref={seeAllLinkHref}
                          showSeeAllLink={showSeeAllLink}
                          titleClassName="text-left"
                          items={categoryListingCurrentData?.data || []}
                          scrollAmount={300}
                          containerClassName="my-3"
                          buttonClassName=""
                          renderItem={memoizedRenderItem as any}
                        />
                      </div>
                    </div>
                  )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
// Memoize frequently used components
const MemoizedDetailsCard = memo(DetailsCard)
const MemoizedCarousel = memo(Carousel)
export default CategorySection
