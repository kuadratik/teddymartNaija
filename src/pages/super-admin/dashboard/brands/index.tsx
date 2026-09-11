import React, {useState} from 'react'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import TextComponent from '@/components/SharedUI/TextComponent'
import SEOHead from '@/components/SharedUI/SEOHead'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import BrandCard from '@/components/SuperAdmin/BrandCard'
import AddBrandModal, {AddBrandFormData} from '@/components/SuperAdmin/AddBrandModal'
import EditBrandModal from '@/components/SuperAdmin/EditBrandModal'
import ConfirmArchiveModal from '@/components/SuperAdmin/ConfirmArchiveModal'
import WelcomeSection from '@/components/SuperAdmin/WelcomeSection'
import SlugHistoryTable from '@/components/SuperAdmin/SlugHistoryTable'
import {DatePicker} from 'antd'
import {SearchIcon, SendIcon} from '@/components/SuperAdmin/icons'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'
import {useGetBrandsQuery, useArchiveBrandMutation, useUnarchiveBrandMutation, Brand} from '@/services/super-admin'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'

const SuperAdminDashboard = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'archive' | 'slug-history'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<any>(null)
  const {isAuthenticated, isInitialized} = useSuperAdminAuth()

  // State for slug history pagination
  const [slugHistoryPage, setSlugHistoryPage] = useState(1)

  // Fetch brands with filters - separate queries for each tab
  const {
    data: activeBrandsData,
    isLoading: isLoadingActiveBrands,
    refetch: refetchActiveBrands
  } = useGetBrandsQuery(
    activeFilter === 'all'
      ? {
          page: currentPage,
          search: searchQuery || undefined,
          include_archived: true // Include all brands (active and archived)
        }
      : undefined,
    {skip: activeFilter !== 'all'}
  )

  const {
    data: archivedBrandsData,
    isLoading: isLoadingArchivedBrands,
    refetch: refetchArchivedBrands
  } = useGetBrandsQuery(
    activeFilter === 'archive'
      ? {
          page: currentPage,
          search: searchQuery || undefined,
          include_archived: true // Get both, then we'll filter for archived only
        }
      : undefined,
    {skip: activeFilter !== 'archive'}
  )
  const [archiveBrand] = useArchiveBrandMutation()
  const [unarchiveBrand] = useUnarchiveBrandMutation()

  const handleAddBrand = (data: AddBrandFormData) => {
    // Modal handles the API call and will close itself on success
    // Only refetch the currently active tab
    try {
      if (activeFilter === 'all') {
        refetchActiveBrands()
      } else {
        refetchArchivedBrands()
      }
    } catch (error) {
      // Silently handle refetch errors
      console.error('Error refetching brands:', error)
    }
  }

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsEditModalOpen(true)
  }

  const handleEditBrand = () => {
    // Modal handles the API call and will close itself on success
    // Only refetch the currently active tab
    try {
      if (activeFilter === 'all') {
        refetchActiveBrands()
      } else {
        refetchArchivedBrands()
      }
    } catch (error) {
      // Silently handle refetch errors
      console.error('Error refetching brands:', error)
    }
  }

  const handleArchiveClick = (brand: Brand) => {
    setSelectedBrand(brand as Brand)
    setIsArchiveModalOpen(true)
  }

  const handleConfirmArchive = async () => {
    if (!selectedBrand) return

    try {
      const brandId = typeof selectedBrand.id === 'string' ? parseInt(selectedBrand.id) : selectedBrand.id
      const isCurrentlyArchived = 'is_archived' in selectedBrand && selectedBrand.is_archived

      if (isCurrentlyArchived) {
        await unarchiveBrand(brandId).unwrap()
        showPlannerToast({
          message: `${selectedBrand.name} has been unarchived`
        })
      } else {
        await archiveBrand(brandId).unwrap()
        showPlannerToast({
          message: `${selectedBrand.name} has been archived`
        })
      }

      setIsArchiveModalOpen(false)
      setSelectedBrand(null)

      // Refetch after closing modal - only refetch the currently active tab
      try {
        if (activeFilter === 'all') {
          refetchActiveBrands()
        } else {
          refetchArchivedBrands()
        }
      } catch (error) {
        console.error('Error refetching brands:', error)
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update brand'
      showPlannerToast({
        message: errorMessage
      })
    }
  }

  const handleCloseArchiveModal = () => {
    setIsArchiveModalOpen(false)
    setSelectedBrand(null)
  }

  // Show loading state while checking authentication
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Determine loading state and data based on active filter
  const isLoadingBrands = activeFilter === 'all' ? isLoadingActiveBrands : isLoadingArchivedBrands
  const brandsData = activeFilter === 'all' ? activeBrandsData : archivedBrandsData

  // Get displayed brands - for archive tab, filter out active brands from the response
  const displayedBrands =
    activeFilter === 'all'
      ? brandsData?.data?.data || []
      : (brandsData?.data?.data || []).filter(brand => brand.is_archived)

  const total = brandsData?.data?.total || 0
  const perPage = brandsData?.data?.per_page || 10
  const lastPage = Math.ceil(total / perPage)

  return (
    <>
      <SEOHead
        title="Super Admin Dashboard | myEKI"
        description="Manage and monitor all brands, users, and activities on myEKI platform"
      />

      <SuperAdminLayout>
        {/* Welcome Section with Add Button (responsive) */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <WelcomeSection />

          <div className="w-full sm:w-auto sm:flex-shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              aria-label="Add Brand"
              className="w-full rounded-full bg-black px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-gray-800 sm:w-auto"
            >
              Add Brand
            </button>
          </div>
        </div>

        {/* Filter Tabs and Search */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex w-fit items-center justify-center gap-2 rounded-xl bg-white p-2">
            <button
              onClick={() => {
                setActiveFilter('all')
                setCurrentPage(1)
              }}
              className={`min-w-[100px] rounded-xl px-5 py-2.5 text-[13px] font-medium transition-colors ${
                activeFilter === 'all' ? 'bg-black text-white' : 'bg-[#F2F2F2] text-black hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setActiveFilter('archive')
                setCurrentPage(1)
              }}
              className={`rounded-xl px-5 py-2.5 text-[13px] font-medium transition-colors ${
                activeFilter === 'archive' ? 'bg-black text-white' : 'bg-[#F2F2F2] text-black hover:bg-gray-100'
              }`}
            >
              Archive
            </button>
            <button
              onClick={() => {
                setActiveFilter('slug-history')
                setCurrentPage(1)
                setSlugHistoryPage(1)
              }}
              className={`rounded-xl px-5 py-2.5 text-[13px] font-medium transition-colors ${
                activeFilter === 'slug-history' ? 'bg-black text-white' : 'bg-[#F2F2F2] text-black hover:bg-gray-100'
              }`}
            >
              Slug History
            </button>
          </div>
          <div className="w-full sm:w-[400px]">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                  setSlugHistoryPage(1)
                }}
                placeholder="Search"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-[14px] shadow-sm transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SendIcon />
              </div>
            </div>
          </div>
          {/* This is to keep the search input centered. DON"T REMOVE! */}
          {activeFilter === 'slug-history' ? (
            <div className="w-full sm:w-auto sm:flex-shrink-0">
              {/* Desktop: Range Picker */}
              <div className="hidden w-full rounded-[8px] border border-gray-200 bg-white py-[3px] shadow-sm transition-colors focus-within:border-black focus-within:ring-1 focus-within:ring-black hover:border-gray-300 sm:block sm:w-[280px]">
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates: any) => {
                    setDateRange(dates)
                    // Reset pagination when date changes
                    setSlugHistoryPage(1)
                  }}
                  placeholder={['Start Date', 'End Date']}
                  className="w-full border-none text-[14px]"
                  size="large"
                  allowClear
                  suffixIcon={<img src="/assets/super-admin/calendar-icon.svg" alt="calendar" className="h-5 w-5" />}
                  style={{
                    width: '100%'
                  }}
                />
              </div>

              {/* Mobile: Single Date Picker */}
              <div className="w-full rounded-[8px] border border-gray-200 bg-white py-[3px] shadow-sm transition-colors focus-within:border-black focus-within:ring-1 focus-within:ring-black hover:border-gray-300 sm:hidden">
                <DatePicker
                  value={Array.isArray(dateRange) ? dateRange[0] : dateRange}
                  onChange={(date: any) => {
                    setDateRange(date)
                    // Reset pagination when date changes
                    setSlugHistoryPage(1)
                  }}
                  placeholder="Filter by Date"
                  className="w-full border-none text-[14px]"
                  size="large"
                  allowClear
                  suffixIcon={<img src="/assets/super-admin/calendar-icon.svg" alt="calendar" className="h-5 w-5" />}
                  style={{
                    width: '100%'
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="sm:min-w-[50px] lg:min-w-[150px]" />
          )}
        </div>

        {/* Date Filter Indicator */}
        {activeFilter === 'slug-history' && dateRange && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
            <Icon icon="heroicons:calendar-days" className="h-4 w-4" />
            <span>
              {Array.isArray(dateRange) && dateRange.length === 2
                ? `Filtering from ${dateRange[0]?.format('MMM DD, YYYY')} to ${dateRange[1]?.format('MMM DD, YYYY')}`
                : `Filtering from ${(Array.isArray(dateRange) ? dateRange[0] : dateRange)?.format('MMM DD, YYYY')}`}
            </span>
            <button
              onClick={() => setDateRange(null)}
              className="ml-auto rounded-full p-1 hover:bg-blue-100"
              aria-label="Clear date filter"
            >
              <Icon icon="heroicons:x-mark" className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Content Area */}
        {activeFilter === 'slug-history' ? (
          /* Slug History Table */
          <SlugHistoryTable
            searchQuery={searchQuery}
            currentPage={slugHistoryPage}
            onPageChange={setSlugHistoryPage}
            dateRange={dateRange}
          />
        ) : isLoadingBrands ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="text-gray-600">Loading brands...</p>
            </div>
          </div>
        ) : displayedBrands.length > 0 ? (
          <>
            {/* Brand Cards Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedBrands.map(brand => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  onEdit={brand => handleEditClick(brand as Brand)}
                  onArchive={brand => handleArchiveClick(brand as Brand)}
                  onViewLink={brand => console.log('View link:', brand)}
                  showArchivedBadge={activeFilter === 'all'}
                />
              ))}
            </div>

            {/* Pagination Footer */}
            {(activeFilter === 'all' || activeFilter === 'archive') && (
              <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <TextComponent as="p" className="text-[14px] font-normal text-gray-600">
                  Showing{' '}
                  <span className="font-medium">
                    {brandsData?.data?.from} to {brandsData?.data?.to} of {brandsData?.data?.total}
                  </span>{' '}
                  Brands
                </TextComponent>

                {/* Pagination: compact on mobile, full on sm+ */}
                <div className="flex items-center justify-center gap-2 sm:justify-end">
                  {/* Mobile compact controls (visible < sm) */}
                  <div className="flex w-full items-center justify-between gap-2 sm:hidden">
                    <button
                      aria-label="Previous page"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
                    >
                      <Icon icon="heroicons:chevron-left" className="text-lg text-gray-600" />
                    </button>

                    <div className="flex-1 text-center">
                      <span className="inline-flex min-w-[60px] items-center justify-center rounded-lg bg-black px-3 py-2 text-[13px] font-medium text-white">
                        {currentPage} of {lastPage}
                      </span>
                    </div>

                    <button
                      aria-label="Next page"
                      onClick={() => setCurrentPage(prev => Math.min(lastPage, prev + 1))}
                      disabled={currentPage === lastPage}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
                    >
                      <Icon icon="heroicons:chevron-right" className="text-lg text-gray-600" />
                    </button>
                  </div>

                  {/* Full controls for sm+ */}
                  <div className="hidden items-center gap-2 sm:flex">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icon icon="heroicons:chevron-left" className="text-lg text-gray-600" />
                    </button>

                    {/* Page numbers */}
                    {Array.from({length: lastPage}, (_, i) => i + 1)
                      .filter(page => {
                        if (lastPage <= 5) return true
                        if (page === 1 || page === lastPage) return true
                        if (page >= currentPage - 1 && page <= currentPage + 1) return true
                        return false
                      })
                      .map((page, index, array) => {
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return (
                            <React.Fragment key={`dots-${page}`}>
                              <span className="text-gray-600">...</span>
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg text-[14px] font-medium transition-colors ${
                                  page === currentPage
                                    ? 'bg-black text-white'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          )
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-[14px] font-medium transition-colors ${
                              page === currentPage
                                ? 'bg-black text-white'
                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                    {/* Next button */}
                    <button
                      onClick={() => setCurrentPage(lastPage)}
                      disabled={currentPage === lastPage}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icon icon="heroicons:chevron-right" className="text-lg text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State for Archive */
          <div className="flex min-h-[500px] flex-col items-center justify-center">
            <div className="mb-4">
              <Image src={'/assets/super-admin/Brand_empty.svg'} alt="Empty brands" width={120} height={120} />
            </div>
            <TextComponent as="p" className="text-[16px] font-medium text-gray-900">
              Nothing to see here
            </TextComponent>
          </div>
        )}
        <AddBrandModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddBrand} />
        <EditBrandModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedBrand(null)
          }}
          onSubmit={handleEditBrand}
          brand={selectedBrand}
        />
        <ConfirmArchiveModal
          isOpen={isArchiveModalOpen}
          onClose={handleCloseArchiveModal}
          onConfirm={handleConfirmArchive}
          brandName={selectedBrand?.name || ''}
          isLoading={false}
          brand={selectedBrand || undefined}
        />
      </SuperAdminLayout>
    </>
  )
}

export default SuperAdminDashboard
