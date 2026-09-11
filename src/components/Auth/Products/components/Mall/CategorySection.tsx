import Carousel from '@/components/SharedUI/Carousel'
import DetailsCard from '@/components/Store/components/DetailsCard'
import DetailsCardSkeletonLoader from '@/components/Store/components/DetailsCardSkeletonLoader'
import useAddToClipsQuery from '@/components/Store/hooks/useAddToClips'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
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
  const isFirstSection = category_id.includes(10) && category_id.includes(11)

  // Use a more efficient approach with IntersectionObserver
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(isFirstSection) // Default true for first section
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)

  // Set up IntersectionObserver for more efficient viewport detection
  useEffect(() => {
    if (!sectionRef.current || isFirstSection) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          // Once visible, no need to keep observing
          observer.disconnect()
        }
      },
      {
        rootMargin: '300px 0px', // Start loading 300px before element enters viewport
        threshold: 0.1 // Trigger when at least 10% is visible
      }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [isFirstSection])

  // Skip fetch for invisible sections or empty categories
  const skipFetch = (category_id.length === 0 && !isNew) || (!isVisible && !hasInitiallyLoaded && !isFirstSection)

  // Add preloading hint for first section
  useEffect(() => {
    if (isFirstSection && !hasInitiallyLoaded) {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = new URL(window.location.origin).origin
      document.head.appendChild(link)
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [isFirstSection, hasInitiallyLoaded])

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
    <div
      ref={sectionRef}
      data-category-section={categoryTitle || 'category'}
      className={`category-section ${isVisible ? 'visible' : 'not-visible'}`}
    >
      {/* Only render content if visible or already loaded */}
      {(isVisible || hasInitiallyLoaded) && (
        <div className="w-full">
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
      )}
    </div>
  )
}

// Memoize frequently used components
const MemoizedDetailsCard = memo(DetailsCard)
const MemoizedCarousel = memo(Carousel)

// Add component display name for easier debugging
CategorySection.displayName = 'CategorySection'

export default CategorySection
