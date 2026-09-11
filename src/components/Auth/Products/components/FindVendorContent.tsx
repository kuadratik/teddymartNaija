import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import Link from 'next/link'
import {useCallback, useState} from 'react'

interface IProps {
  refetch: any
  data: {
    [key: string]: Array<{
      id: number
      user_id: number
      name: string
      slug: string
      user: {
        id: number
        offers_product: boolean
        offers_service: boolean
      }
    }>
  }
  isLoading: boolean
  type: string
  searchTerm: string
  setSearchTerm: any
}

const FindVendorContent = ({refetch, data, isLoading, type, searchTerm, setSearchTerm}: IProps) => {
  const [activeFilter, setActiveFilter] = useState('')

  const generateAlphabetFilters = useCallback(() => {
    const filters = [
      {id: 1, name: '0-9'},
      ...Array.from({length: 26}, (_, i) => ({
        id: i + 2,
        name: String.fromCharCode(65 + i)
      }))
    ]
    return filters
  }, [])

  const filter = generateAlphabetFilters()

  const filterVendors = useCallback(
    (vendors: Array<any>) => {
      const filteredVendors = vendors.filter(vendor => {
        return !searchTerm || vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
      })

      // Sort vendors if there's a search term
      const sortedVendors = searchTerm
        ? filteredVendors.sort((a, b) => {
            const aStartsWith = a.name.toLowerCase().startsWith(searchTerm.toLowerCase())
            const bStartsWith = b.name.toLowerCase().startsWith(searchTerm.toLowerCase())

            // If one starts with the search term and the other doesn't
            if (aStartsWith && !bStartsWith) return -1
            if (!aStartsWith && bStartsWith) return 1

            // If neither or both start with the search term, sort by position of search term
            const aIndex = a.name.toLowerCase().indexOf(searchTerm.toLowerCase())
            const bIndex = b.name.toLowerCase().indexOf(searchTerm.toLowerCase())
            return aIndex - bIndex
          })
        : filteredVendors

      return {vendors: sortedVendors}
    },
    [searchTerm]
  )

  const renderFilteredResults = () => {
    const filteredGroups = filter.map(item => {
      const allVendors = data?.[item?.name] || []
      const {vendors: filteredVendors} = filterVendors(allVendors)

      return {
        ...item,
        filteredVendors,
        isEmpty: filteredVendors.length === 0,
        // Add a priority for groups containing search matches
        priority: searchTerm && filteredVendors.length > 0 ? 1 : 0
      }
    })

    // Sort groups to bring non-empty groups to the top when searching
    const sortedGroups = searchTerm
      ? filteredGroups.sort((a, b) => {
          if (a.isEmpty && !b.isEmpty) return 1
          if (!a.isEmpty && b.isEmpty) return -1
          return b.priority - a.priority
        })
      : filteredGroups

    return sortedGroups.map(group => (
      <div key={group.id} id={`section-${group.name}`} className="">
        <h3 onClick={() => setActiveFilter(group.name)} className="">
          <p className="text-[20px] text-sm font-bold">{group.name}</p>
        </h3>
        <div
          className={`mt-3 grid-cols-2 flex-wrap gap-x-[10px] gap-y-5 rounded-[10px] bg-white px-[10px] py-[15px] md:grid-cols-4 lg:grid-cols-6 ${
            group.filteredVendors.length === 0 ? 'flex' : 'grid'
          }`}
        >
          {group.filteredVendors.length === 0 ? (
            <p className="w-full text-center text-[14px] font-semibold text-gray-500">No vendors available.</p>
          ) : (
            group.filteredVendors.map(vendor => (
              <Link
                href={`/store/${vendor.slug}?type=${type}`}
                key={vendor.id}
                className="flex items-center gap-[10px] hover:underline"
              >
                <p className="text-[14px] font-[500]">{vendor.name}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    ))
  }

const scrollToSection = useCallback((sectionName: string) => {
  setActiveFilter(sectionName)
  const section = document.getElementById(`section-${sectionName}`)
  const offset = 85
  if (section) {
    const elementPosition = section.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}, [])

  if (isLoading) {
    return (
      <div className="mt-[30px]">
        <SkeletonLoaderForPage />
      </div>
    )
  }

  return (
    <div className="mt-[30px]">
      <h3 className="text-lg font-semibold">MEK Vendors</h3>
      <div className="mt-4 flex flex-wrap items-center border-b border-t lg:justify-between">
        {filter.map(item => (
          <button
            onClick={() => scrollToSection(item.name)}
            key={item.id}
            className="my-2 border-b-2 border-transparent bg-transparent text-sm font-semibold hover:border-gray-500 hover:text-gray-700"
          >
            <p className="w-full px-3 text-sm font-bold">{item.name}</p>
          </button>
        ))}
      </div>
      <div className="mt-[30px] flex flex-col justify-start gap-[20px]">{renderFilteredResults()}</div>
    </div>
  )
}

export default FindVendorContent
