import React, {useState, useEffect} from 'react'
import {Icon} from '@iconify/react'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Tooltip, Select, Input} from 'antd'
import {
  useGetSlugHistoryQuery,
  useUpdateSlugHistoryNoteMutation,
  useGetHistoryNotesQuery,
  useCreateHistoryNoteMutation,
  SlugHistoryEntry as APISlugHistoryEntry
} from '@/services/super-admin'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'

export interface SlugHistoryEntry {
  id: number
  old_slug: string
  old_target_url: string
  old_source_url: string
  new_slug: string
  new_target_url: string
  new_source_url: string
  changed_at: string
  changed_by: string
  notes?: string
  status?: 'current' | 'redirect_active' | 'historical'
}

export interface BrandSlugHistory {
  brandName: string
  brandId: number
  entries: SlugHistoryEntry[]
}

interface SlugHistoryTableProps {
  searchQuery?: string
  currentPage?: number
  onPageChange?: (page: number) => void
  dateRange?: any
}

const SlugHistoryTable: React.FC<SlugHistoryTableProps> = ({searchQuery, currentPage = 1, onPageChange, dateRange}) => {
  const [expandedBrands, setExpandedBrands] = useState<{[key: number]: boolean}>({})
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(undefined)
  const [brandDataCache, setBrandDataCache] = useState<{[key: number]: SlugHistoryEntry[]}>({})
  const [showDataDelay, setShowDataDelay] = useState<{[key: number]: boolean}>({})
  const [hasInitialized, setHasInitialized] = useState(false)
  const [noteValues, setNoteValues] = useState<{[key: number]: string}>({})
  const [dropdownOpen, setDropdownOpen] = useState<{[key: string]: boolean}>({})
  const [updateSlugHistoryNote, {isLoading: isUpdatingNote}] = useUpdateSlugHistoryNoteMutation()
  const [createHistoryNote] = useCreateHistoryNoteMutation()

  // Fetch available history notes
  const {data: historyNotesData, refetch: refetchHistoryNotes} = useGetHistoryNotesQuery()

  // Helper function to format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date: any): string | undefined => {
    if (!date) return undefined

    // Handle different date formats from Ant Design DatePicker
    if (date && typeof date === 'object' && date.format) {
      return date.format('YYYY-MM-DD')
    }

    // Handle string dates
    if (typeof date === 'string') {
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0]
      }
    }

    return undefined
  }

  // Get date parameters from dateRange
  const getDateParams = () => {
    if (!dateRange) return {}

    // If dateRange is an array (range picker), use start and end
    if (Array.isArray(dateRange)) {
      if (dateRange.length === 2) {
        const params: any = {}
        const startDate = formatDateForAPI(dateRange[0])
        const endDate = formatDateForAPI(dateRange[1])

        if (startDate) params.start_date = startDate
        if (endDate) params.end_date = endDate

        return params
      } else if (dateRange.length === 1) {
        // Handle case where array has only one date
        const startDate = formatDateForAPI(dateRange[0])
        return startDate ? {start_date: startDate} : {}
      }
    }

    // If dateRange is a single date (mobile single picker), use it as start_date only
    const startDate = formatDateForAPI(dateRange)
    return startDate ? {start_date: startDate} : {}
  }

  const dateParams = getDateParams()

  // Fetch all slug history data to populate accordion headers (without brand_id)
  const {
    data: allHistoryData,
    isLoading: isLoadingAll,
    error: allHistoryError
  } = useGetSlugHistoryQuery({
    search: searchQuery,
    page: currentPage,
    ...dateParams
  })

  // Fetch specific brand history when a brand is selected (with brand_id)
  const {
    data: brandHistoryData,
    isLoading: isLoadingBrand,
    error: brandHistoryError
  } = useGetSlugHistoryQuery(
    selectedBrandId
      ? {
          brand_id: selectedBrandId,
          page: 1,
          ...dateParams
        }
      : undefined,
    {
      skip: !selectedBrandId,
      // Force refetch when selectedBrandId changes to prevent stale data
      refetchOnMountOrArgChange: true
    }
  )

  // Get unique brands from all history data to create accordion structure
  const getBrandList = (apiData: APISlugHistoryEntry[]): BrandSlugHistory[] => {
    const brandMap = new Map<number, BrandSlugHistory>()

    apiData.forEach(entry => {
      if (!brandMap.has(entry.brand_id)) {
        brandMap.set(entry.brand_id, {
          brandId: entry.brand_id,
          brandName: entry.brand_name,
          entries: [] // Will be populated when accordion is opened
        })
      }
    })

    return Array.from(brandMap.values())
  }

  // Transform API data to component format
  const transformApiDataToEntries = (apiData: APISlugHistoryEntry[]): SlugHistoryEntry[] => {
    return apiData.map(entry => ({
      id: entry.id,
      old_slug: entry.old_slug,
      old_target_url: entry.old_target_url,
      old_source_url: entry.old_source_url,
      new_slug: entry.new_slug,
      new_target_url: entry.new_target_url,
      new_source_url: entry.new_source_url,
      changed_at: new Date(entry.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      changed_by: entry.admin_name,
      notes: entry.note || undefined
    }))
  }

  // Get brand list for accordion headers from the general query
  const brandList = allHistoryData?.data?.data ? getBrandList(allHistoryData.data.data) : []

  // Update cache when new brand data is loaded with 1-second delay
  useEffect(() => {
    if (selectedBrandId && brandHistoryData?.data?.data && !isLoadingBrand) {
      const transformedEntries = transformApiDataToEntries(brandHistoryData.data.data)
      setBrandDataCache(prev => ({
        ...prev,
        [selectedBrandId]: transformedEntries
      }))

      // Add 1-second delay before showing data to prevent flashing
      const timer = setTimeout(() => {
        setShowDataDelay(prev => ({
          ...prev,
          [selectedBrandId]: true
        }))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [selectedBrandId, brandHistoryData, isLoadingBrand])

  // Create brand groups - populate entries only from cache for the selected brand with delay
  const brandGroups: BrandSlugHistory[] = brandList.map(brand => {
    const isSelected = selectedBrandId === brand.brandId
    const canShowData = isSelected && showDataDelay[brand.brandId]
    const entries = canShowData ? brandDataCache[brand.brandId] || [] : []

    return {
      ...brand,
      entries
    }
  })

  // Set first brand as expanded and selected by default when data loads (only once)
  useEffect(() => {
    if (brandList.length > 0 && !hasInitialized) {
      const firstBrandId = brandList[0].brandId
      setExpandedBrands({[firstBrandId]: true})
      setSelectedBrandId(firstBrandId)
      setHasInitialized(true)
    }
  }, [brandList, hasInitialized])

  // Reset initialization when date range changes to allow re-initialization with filtered data
  useEffect(() => {
    setHasInitialized(false)
    setExpandedBrands({})
    setSelectedBrandId(undefined)
    setBrandDataCache({})
    setShowDataDelay({})
    setNoteValues({})
    setDropdownOpen({})
  }, [dateRange])

  // Loading state - show loading if we're loading all data or loading specific brand data
  const isLoading = isLoadingAll || (selectedBrandId && isLoadingBrand)

  // Add custom styles for Select dropdown and notes display
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .slug-status-select .ant-select-selector {
        border-radius: 8px !important;
        padding: 8px 12px !important;
        border: 1px solid #e5e7eb !important;
        height: auto !important;
      }
      
      .slug-status-select .ant-select-selection-item {
        font-size: 13px !important;
        font-weight: 500 !important;
        color: #374151 !important;
      }
      
      .slug-status-select .ant-select-arrow {
        color: #9ca3af !important;
      }
      
      .slug-status-select:hover .ant-select-selector {
        border-color: #d1d5db !important;
      }
      
      .slug-status-select.ant-select-focused .ant-select-selector {
        border-color: #000 !important;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
      }
      
      .slug-status-dropdown {
        width: 380px !important;
      }
      
      @media (max-width: 1024px) {
        .slug-status-dropdown {
          width: 320px !important;
        }
      }
      
      .slug-status-dropdown .ant-select-item {
        padding: 12px 12px !important;
        font-size: 13px !important;
      }
      
      .slug-status-dropdown .ant-select-item-option {
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
      }
      
      .slug-status-dropdown .ant-select-item-option-content {
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const saveNote = async (entryId: number, noteText?: string) => {
    try {
      const noteValue = noteText || noteValues[entryId] || ''

      // First, create the note in the history-notes endpoint if it's a new custom note
      if (noteValue && noteText === undefined) {
        // This is a custom note from the input field
        try {
          await createHistoryNote({note: noteValue}).unwrap()
          // Refetch the history notes to update the dropdown
          await refetchHistoryNotes()
        } catch (error) {
          console.error('Failed to create history note:', error)
          // Continue with updating the slug history note even if creation fails
        }
      }

      await updateSlugHistoryNote({
        historyId: entryId,
        data: {note: noteValue}
      }).unwrap()

      // Update the cache with the new note
      setBrandDataCache(prev => {
        const newCache = {...prev}
        Object.keys(newCache).forEach(brandId => {
          newCache[parseInt(brandId)] = newCache[parseInt(brandId)].map(entry =>
            entry.id === entryId ? {...entry, notes: noteValue} : entry
          )
        })
        return newCache
      })

      setNoteValues(prev => {
        const newValues = {...prev}
        delete newValues[entryId]
        return newValues
      })

      // Close both desktop and mobile dropdowns
      setDropdownOpen(prev => ({...prev, [`${entryId}-desktop`]: false, [`${entryId}-mobile`]: false}))

      showPlannerToast({
        message: 'Note saved successfully'
      })
    } catch (error: any) {
      console.error('Failed to update note:', error)
      showPlannerToast({
        message: error?.data?.message || 'Failed to update note'
      })
    }
  }

  // Define predefined status labels
  const availableNotes = historyNotesData?.data?.map(noteObj => noteObj.note) || []

  // Check if a note matches any available note from the API
  const isAvailableNote = (note: string | undefined): boolean => {
    if (!note) return false
    return availableNotes.includes(note)
  }

  const saveStatusAsNote = async (entryId: number, noteValue: string) => {
    // Close dropdown immediately for better UX
    setDropdownOpen(prev => ({...prev, [`${entryId}-desktop`]: false, [`${entryId}-mobile`]: false}))

    await saveNote(entryId, noteValue)
  }

  // Reusable Select component to avoid duplication
  const renderStatusSelect = (entry: SlugHistoryEntry, viewType: 'desktop' | 'mobile') => {
    const dropdownKey = `${entry.id}-${viewType}`

    return (
      <Select
        className="slug-status-select w-full"
        popupClassName="slug-status-dropdown"
        placeholder="Select"
        suffixIcon={<Icon icon="heroicons:chevron-down" className="text-sm text-gray-400" />}
        value={entry.notes || undefined}
        open={dropdownOpen[dropdownKey]}
        onDropdownVisibleChange={open => {
          setDropdownOpen(prev => ({...prev, [dropdownKey]: open}))
        }}
        dropdownRender={menu => (
          <div>
            {menu}
            <div className="border-t border-gray-200 p-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Create new notes"
                  value={noteValues[entry.id] || ''}
                  onChange={e => setNoteValues(prev => ({...prev, [entry.id]: e.target.value}))}
                  className="flex-1 text-[13px]"
                  onPressEnter={() => {
                    if (noteValues[entry.id]?.trim()) {
                      saveNote(entry.id)
                    }
                  }}
                />
                <button
                  onClick={() => saveNote(entry.id)}
                  disabled={isUpdatingNote || !noteValues[entry.id]?.trim()}
                  className="rounded-lg bg-black px-4 py-1.5 text-[12px] font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        options={availableNotes.map(note => ({
          label: (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-900">{note}</span>
            </div>
          ),
          value: note
        }))}
        optionLabelProp="label"
        onChange={async value => {
          if (value) {
            await saveStatusAsNote(entry.id, value.toString())
          }
        }}
      />
    )
  }

  const toggleBrand = (brandId: number) => {
    const isCurrentlyExpanded = expandedBrands[brandId]

    if (isCurrentlyExpanded) {
      // If clicking on an already expanded brand, close it (allow closing even if it's the only one)
      setExpandedBrands({})
      setSelectedBrandId(undefined)
      // Clear the delay state for this brand
      setShowDataDelay(prev => {
        const newDelay = {...prev}
        delete newDelay[brandId]
        return newDelay
      })
    } else {
      // Close all other accordions and open only this one
      setExpandedBrands({[brandId]: true})
      setSelectedBrandId(brandId)

      // Clear the cache and delay state for this brand to force fresh data
      setBrandDataCache(prev => {
        const newCache = {...prev}
        delete newCache[brandId]
        return newCache
      })
      setShowDataDelay(prev => {
        const newDelay = {...prev}
        delete newDelay[brandId]
        return newDelay
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    )
  }

  if (brandGroups.length === 0) {
    const hasDateFilter = dateRange && ((Array.isArray(dateRange) && dateRange.length > 0) || dateRange)
    const isDateRange = Array.isArray(dateRange) && dateRange.length === 2

    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center">
        <Icon icon="heroicons:clock" className="mb-4 text-6xl text-gray-300" />
        <TextComponent as="p" className="text-[16px] font-medium text-gray-900">
          No history found
        </TextComponent>
        <TextComponent as="p" className="mt-2 text-[14px] text-gray-500">
          {hasDateFilter
            ? `No slug changes found for the selected ${isDateRange ? 'date range' : 'date'}`
            : 'Slug changes will appear here'}
        </TextComponent>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Brand Accordions */}
      {brandGroups.map((brandGroup: BrandSlugHistory) => (
        <div
          key={brandGroup.brandId}
          className="rounded-[16px] border border-white bg-white/20 px-4 pb-4 backdrop-blur-sm transition-shadow hover:shadow-md"
        >
          {/* Brand Header - Clickable Accordion Toggle */}
          <button
            onClick={() => toggleBrand(brandGroup.brandId)}
            className={`${expandedBrands[brandGroup.brandId] ? 'mb-4' : ''} flex w-full items-center justify-between pt-4 transition-colors hover:opacity-80`}
          >
            <TextComponent as="h2" className="text-[20px] font-semibold text-gray-900">
              {brandGroup.brandName}
            </TextComponent>
            <Icon
              icon={expandedBrands[brandGroup.brandId] ? 'heroicons:chevron-up' : 'heroicons:chevron-down'}
              className="text-2xl text-gray-900"
            />
          </button>

          {/* Accordion Content */}
          {expandedBrands[brandGroup.brandId] && (
            <>
              {/* Show loading state for individual brand (including during delay) */}
              {selectedBrandId === brandGroup.brandId && (isLoadingBrand || !showDataDelay[brandGroup.brandId]) ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <div className="text-center">
                    <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="text-sm text-gray-600">Loading {brandGroup.brandName} history...</p>
                  </div>
                </div>
              ) : selectedBrandId === brandGroup.brandId &&
                !isLoadingBrand &&
                showDataDelay[brandGroup.brandId] &&
                brandGroup.entries.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="relative hidden lg:block">
                    {/* Left Scroll Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        const tableContainer = e.currentTarget.parentElement?.querySelector(
                          '.overflow-x-auto'
                        ) as HTMLElement
                        if (tableContainer) {
                          tableContainer.scrollBy({left: -300, behavior: 'smooth'})
                        }
                      }}
                      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black p-2 text-white opacity-50 shadow-lg transition-all hover:bg-gray-800 hover:opacity-100 hover:shadow-xl"
                      title="Scroll left"
                    >
                      <Icon icon="heroicons:chevron-left" className="h-4 w-4" />
                    </button>

                    {/* Right Scroll Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        const tableContainer = e.currentTarget.parentElement?.querySelector(
                          '.overflow-x-auto'
                        ) as HTMLElement
                        if (tableContainer) {
                          tableContainer.scrollBy({left: 300, behavior: 'smooth'})
                        }
                      }}
                      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black p-2 text-white opacity-50 shadow-lg transition-all hover:bg-gray-800 hover:opacity-100 hover:shadow-xl"
                      title="Scroll right"
                    >
                      <Icon icon="heroicons:chevron-right" className="h-4 w-4" />
                    </button>

                    {/* Table Container */}
                    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                      <table className="w-full min-w-[1920px]">
                        <thead className="bg-black text-white">
                          <tr>
                            <th className="rounded-bl-xl border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              SN
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              Old Slug
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              Old Affiliate url
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              Old myEKI url
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              New Slug
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              New Affiliate url
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              New myEKI url
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              Changed At
                            </th>
                            <th className="border-r border-white px-4 py-4 text-left text-[13px] font-semibold">
                              Changed By
                            </th>
                            <th className="w-[320px] max-w-[320px] rounded-br-xl px-4 py-4 text-left text-[13px] font-semibold">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {brandGroup.entries.map((entry: SlugHistoryEntry, index: number) => (
                            <tr key={entry.id} className="transition-colors hover:bg-gray-50">
                              <td className="px-4 py-4 text-[13px] text-gray-900">{index + 1}</td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.old_slug}>
                                  <span className="block max-w-[150px] truncate text-[13px] text-gray-900">
                                    {entry.old_slug}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.old_target_url}>
                                  <span className="block max-w-[200px] truncate text-[13px] text-gray-600">
                                    {entry.old_target_url}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.old_source_url}>
                                  <span className="block max-w-[200px] truncate text-[13px] text-gray-600">
                                    {entry.old_source_url}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.new_slug}>
                                  <span className="block max-w-[150px] truncate text-[13px] text-gray-900">
                                    {entry.new_slug}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.new_target_url}>
                                  <span className="block max-w-[200px] truncate text-[13px] text-gray-600">
                                    {entry.new_target_url}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.new_source_url}>
                                  <span className="block max-w-[200px] truncate text-[13px] text-gray-600">
                                    {entry.new_source_url}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.changed_at}>
                                  <span className="block w-[150px] max-w-[150px] truncate text-[13px] text-gray-900">
                                    {entry.changed_at}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="px-4 py-4">
                                <Tooltip title={entry.changed_by}>
                                  <span className="block w-[120px] max-w-[120px] truncate text-[13px] text-gray-900">
                                    {entry.changed_by}
                                  </span>
                                </Tooltip>
                              </td>
                              <td className="w-[320px] max-w-[320px] px-4 py-4">
                                {renderStatusSelect(entry, 'desktop')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="space-y-4 lg:hidden">
                    {brandGroup.entries.map((entry: SlugHistoryEntry, index: number) => (
                      <div key={entry.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        {/* Card Header */}
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-medium text-white">
                              {index + 1}
                            </span>
                            <span className="text-[13px] font-medium text-gray-900">Slug Change</span>
                          </div>
                          <span className="text-[11px] text-gray-500">{entry.changed_at}</span>
                        </div>

                        {/* Slug Changes */}
                        <div className="mb-4 space-y-3">
                          <div>
                            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                              From
                            </div>
                            <div className="space-y-2">
                              <div>
                                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Slug
                                </div>
                                <Tooltip title={entry.old_slug}>
                                  <div className="truncate text-[13px] font-medium text-gray-900">{entry.old_slug}</div>
                                </Tooltip>
                              </div>
                              <div>
                                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Affiliate url
                                </div>
                                <Tooltip title={entry.old_target_url}>
                                  <div className="truncate text-[12px] text-gray-600">{entry.old_target_url}</div>
                                </Tooltip>
                              </div>
                              <div>
                                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  myEKI url
                                </div>
                                <Tooltip title={entry.old_source_url}>
                                  <div className="truncate text-[12px] text-gray-600">{entry.old_source_url}</div>
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <Icon icon="heroicons:arrow-down" className="text-gray-400" />
                          </div>

                          <div>
                            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">To</div>
                            <div className="space-y-2">
                              <div>
                                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Slug
                                </div>
                                <Tooltip title={entry.new_slug}>
                                  <div className="truncate text-[13px] font-medium text-gray-900">{entry.new_slug}</div>
                                </Tooltip>
                              </div>
                              <div>
                                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Affiliate url
                                </div>
                                <Tooltip title={entry.new_target_url}>
                                  <div className="truncate text-[12px] text-gray-600">{entry.new_target_url}</div>
                                </Tooltip>
                              </div>
                              <div>
                                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  myEKI url
                                </div>
                                <Tooltip title={entry.new_source_url}>
                                  <div className="truncate text-[12px] text-gray-600">{entry.new_source_url}</div>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Changed By */}
                        <div className="mb-4">
                          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Changed By
                          </div>
                          <div className="text-[13px] text-gray-900">{entry.changed_by}</div>
                        </div>

                        {/* Status & Notes */}
                        <div>
                          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Status & Notes
                          </div>
                          {renderStatusSelect(entry, 'mobile')}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : selectedBrandId === brandGroup.brandId && !isLoadingBrand && showDataDelay[brandGroup.brandId] ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <TextComponent as="p" className="text-[14px] text-gray-500">
                    No history found for {brandGroup.brandName}
                  </TextComponent>
                </div>
              ) : null}
            </>
          )}
        </div>
      ))}

      {/* Pagination for the main brand list */}
      {allHistoryData?.data && allHistoryData.data.total > allHistoryData.data.per_page && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <TextComponent as="p" className="text-[14px] font-normal text-gray-600">
            Showing{' '}
            <span className="font-medium">
              {allHistoryData.data.from} to {allHistoryData.data.to} of {allHistoryData.data.total}
            </span>{' '}
            entries
          </TextComponent>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <Icon icon="heroicons:chevron-left" className="text-lg text-gray-600" />
            </button>

            {Array.from({length: allHistoryData.data.last_page}, (_, i) => i + 1)
              .filter(page => {
                if (allHistoryData.data.last_page <= 5) return true
                if (page === 1 || page === allHistoryData.data.last_page) return true
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
                        onClick={() => onPageChange?.(page)}
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
                    onClick={() => onPageChange?.(page)}
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

            <button
              onClick={() => onPageChange?.(Math.min(allHistoryData.data.last_page, currentPage + 1))}
              disabled={currentPage === allHistoryData.data.last_page}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <Icon icon="heroicons:chevron-right" className="text-lg text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SlugHistoryTable
