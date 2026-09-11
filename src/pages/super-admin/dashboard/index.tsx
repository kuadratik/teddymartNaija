import CustomButton from '@/components/SharedUI/Buttons/Button'
import PlannerModal from '@/components/SharedUI/PlannerModal'
import SEOHead from '@/components/SharedUI/SEOHead'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import NavBarForm from '@/components/SuperAdmin/NavBar/NavBarForm'
import PermissionGuard from '@/components/SuperAdmin/PermissionGuard'
import WelcomeSection from '@/components/SuperAdmin/WelcomeSection'
import {useDragAndDrop} from '@/hooks/useDragAndDrop'
import {useSubNavDragAndDrop} from '@/hooks/useSubNavDragAndDrop'
import {useSuperAdminAuth} from '@/hooks/useSuperAdminAuth'
import {
  useDeleteNavigationMutation,
  useGetAllNavigationQuery,
  useUpdateNavigationMutation
} from '@/services/super-admin/nav-bar'
import {useGetAdminStaffProfileQuery} from '@/services/super-admin/user-management'
import {INavBarListDatum} from '@/types/super-admin/nav-bar'
import {Icon} from '@iconify/react'
import {Alert, Dropdown} from 'antd'
import {useEffect, useState} from 'react'

interface NavLink {
  id: string
  name: string
  path: string
  isActive: boolean
  isSubNav?: boolean
  parentId?: string
}

// Mock nav data
const mockNavLinks: NavLink[] = [
  {id: '1', name: 'Stores', path: '/stores', isActive: true},
  {id: '2', name: 'Mall', path: '/mall', isActive: false},
  {id: '3', name: 'Vendors', path: '/vendors', isActive: true},
  {id: '4', name: 'Riders & Shippers', path: '/riders', isActive: true},
  {id: '5', name: 'Classified Ads', path: '/#', isActive: true},
  {id: '6', name: 'new nav link 1', path: '/classified ad/link name', isActive: true, isSubNav: true, parentId: '5'},
  {id: '7', name: 'new nav link 2', path: '/classified ad/link name', isActive: true, isSubNav: true, parentId: '5'},
  {id: '8', name: 'Brands', path: '/brands', isActive: true},
  {id: '9', name: 'Directory', path: '/directory', isActive: true}
]

const mockBottomNavLinks: NavLink[] = [
  {id: '10', name: 'Find Vendors', path: '/find-a-vendors', isActive: true},
  {id: '11', name: 'Reviews', path: '/reviews', isActive: true},
  {id: '12', name: 'Messages', path: '/messages', isActive: true}
]

const SuperAdminDashboard = () => {
  const [navLinks, setNavLinks] = useState<NavLink[]>([])
  const [bottomNavLinks, setBottomNavLinks] = useState<NavLink[]>([])
  const [expandedNavs, setExpandedNavs] = useState<string[]>(['5']) // Classified Ads expanded by default
  const {isAuthenticated, isInitialized} = useSuperAdminAuth()
  const [isShowModalEdit, setIsShowModalEdit] = useState(false)
  const [isCreateModalView, setIsCreateModalView] = useState(false)
  const [selectedItem, setSelectedItem] = useState<INavBarListDatum | null>(null)
  const {data, isLoading, refetch} = useGetAllNavigationQuery()
  console.log('🚀 ~ SuperAdminDashboard ~ data:', data)
  const [updateNavigation, {isLoading: isUpdating}] = useUpdateNavigationMutation()
  const [deleteNavigation, {isLoading: isDeleting}] = useDeleteNavigationMutation()
  const [subNavModal, setSubNavModal] = useState<'add-sub-nav' | 'edit'>()
  const [isShowModalDelete, setIsShowModalDelete] = useState(false)
  const {data: profileData, isLoading: isProfileLoading} = useGetAdminStaffProfileQuery({})
  const isSuperAdmin = profileData?.data?.role.toLowerCase() === 'super_admin'

  // Handle ordering updates for top or bottom navs
  const handleUpdateOrder = async (items: NavLink[], navType: 'top' | 'bottom') => {
    if (!data?.data) return

    // Filter for main items only (ignore subnavs for ordering calculation)
    const mainItems = items.filter(item => !item.isSubNav)

    // Create promises for updates
    const updatePromises = mainItems.map((item, index) => {
      const originalItem = data.data.find(d => String(d.id) === item.id)
      if (!originalItem) return Promise.resolve()

      // Use B suffix for bottom nav items
      const newOrder = navType === 'bottom' ? `${index + 1}B` : String(index + 1)

      // Get current subnavs from the items list to preserve their order
      const currentSubNavs = items.filter(i => i.parentId === item.id)

      // Map to API structure - preserve subnav order based on their position in the list
      const subnavBody = currentSubNavs.map((sub, subIdx) => {
        // Parse original index from ID format: parentId-sub-index
        const parts = sub.id.split('-sub-')
        const originalSubIndex = parts.length >= 2 ? parseInt(parts[1]) : subIdx
        const originalSub = originalItem.subnav?.[originalSubIndex]

        if (!originalSub) {
          // Fallback for potentially new items or malformed IDs
          return {
            name: sub.name,
            link: sub.path,
            active: sub.isActive,
            coming_soon: false,
            icon: ''
          }
        }

        return {
          name: originalSub.name,
          link: originalSub.link,
          active: originalSub.active,
          coming_soon: originalSub.coming_soon,
          icon: originalSub.icon
        }
      })

      return updateNavigation({
        navigationId: String(originalItem.id),
        body: {
          type: originalItem.type,
          name: originalItem.name,
          link: originalItem.link,
          active: originalItem.active,
          coming_soon: originalItem.coming_soon,
          icon: originalItem.icon,
          ordering: newOrder,
          subnav: subnavBody.length > 0 ? subnavBody : null
        }
      }).unwrap()
    })

    try {
      await Promise.all(updatePromises)
      refetch()
    } catch (error) {
      console.error('Failed to update order', error)
    }
  }
  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      await deleteNavigation({navigationId: selectedItem.id.toString()}).unwrap()
      setIsShowModalDelete(false)
      refetch()
      // Show success toast after closing
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Navigation deleted successfully!</>}
              textColor="#FFF"
              message="The Navigation has been deleted."
              backgroundColor="#000"
            />
          )
        },
        message: 'Success'
      })
      refetch()
    } catch (error: any) {
      console.error('Failed to delete navigation:', error)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  Error Deleting
                  {selectedItem && <div className="font-semibold capitalize">{selectedItem.name}</div>}
                </>
              }
              textColor="#FFF"
              message={error?.data?.message || 'An error occurred while deleting the navigation.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Error'
      })
    }
  }
  useEffect(() => {
    if (data?.data) {
      // Helper function to parse ordering for sorting (handles mixed formats like "1", "2", "1A", "2B")
      const parseOrdering = (ordering: string | undefined): number => {
        if (!ordering) return Infinity
        const numMatch = ordering.match(/^\d+/)
        return numMatch ? parseInt(numMatch[0]) : Infinity
      }

      // Sort data by type first, then by ordering
      const sortedData = [...data.data].sort((a, b) => {
        if (a.type === b.type) {
          return parseOrdering(a.ordering) - parseOrdering(b.ordering)
        }
        return 0
      })

      const topNavs: NavLink[] = []
      const bottomNavs: NavLink[] = []

      // Process top navs
      sortedData
        .filter(item => item.type === 'top')
        .forEach(item => {
          const navItem: NavLink = {
            id: String(item.id),
            name: item.name,
            path: item.link,
            isActive: item.active
          }
          topNavs.push(navItem)
          if (item.subnav && item.subnav.length > 0) {
            item.subnav.forEach((sub, idx) => {
              topNavs.push({
                id: `${item.id}-sub-${idx}`,
                name: sub.name,
                path: sub.link,
                isActive: sub.active ?? true,
                isSubNav: true,
                parentId: String(item.id)
              })
            })
          }
        })

      // Process bottom navs
      sortedData
        .filter(item => item.type === 'bottom')
        .forEach(item => {
          const navItem: NavLink = {
            id: String(item.id),
            name: item.name,
            path: item.link,
            isActive: item.active
          }
          bottomNavs.push(navItem)
          if (item.subnav && item.subnav.length > 0) {
            item.subnav.forEach((sub, idx) => {
              bottomNavs.push({
                id: `${item.id}-sub-${idx}`,
                name: sub.name,
                path: sub.link,
                isActive: sub.active ?? true,
                isSubNav: true,
                parentId: String(item.id)
              })
            })
          }
        })

      setNavLinks(topNavs)
      setBottomNavLinks(bottomNavs)
    }
  }, [data])

  const handleEdit = (id: string) => {
    if (!data?.data) return

    // Check if it's a subnav (contains '-sub-')
    if (id.includes('-sub-')) {
      const parentId = id.split('-sub-')[0]
      const parent = data.data.find(item => String(item.id) === parentId)
      if (parent) {
        setSelectedItem(parent)
        setIsShowModalEdit(true)
      }
    } else {
      const item = data.data.find(i => String(i.id) === id)
      if (item) {
        setSelectedItem(item)
        setIsShowModalEdit(true)
      }
    }
  }

  const toggleNavExpand = (navId: string) => {
    setExpandedNavs(prev => (prev.includes(navId) ? prev.filter(id => id !== navId) : [...prev, navId]))
  }

  const toggleNavActive = async (navId: string, isBottomNav: boolean = false) => {
    // Optimistic update
    if (isBottomNav) {
      setBottomNavLinks(prev => prev.map(link => (link.id === navId ? {...link, isActive: !link.isActive} : link)))
    } else {
      setNavLinks(prev => prev.map(link => (link.id === navId ? {...link, isActive: !link.isActive} : link)))
    }

    if (!data?.data) return

    // Check if it is a subnav
    if (navId.includes('-sub-')) {
      const [parentId, subIndexStr] = navId.split('-sub-')
      const subIndex = parseInt(subIndexStr)
      const parentItem = data.data.find(item => String(item.id) === parentId)

      if (parentItem && parentItem.subnav && parentItem.subnav[subIndex]) {
        const updatedSubnavs = parentItem.subnav.map((sub, idx) => {
          if (idx === subIndex) {
            return {...sub, active: !sub.active}
          }
          return sub
        })

        try {
          await updateNavigation({
            navigationId: String(parentItem.id),
            body: {
              type: parentItem.type,
              name: parentItem.name,
              link: parentItem.link,
              active: parentItem.active,
              coming_soon: parentItem.coming_soon,
              icon: parentItem.icon,
              ordering: parentItem.ordering,
              subnav: updatedSubnavs.map(s => ({
                name: s.name,
                link: s.link,
                active: s.active,
                coming_soon: s.coming_soon,
                icon: s.icon
              }))
            }
          }).unwrap()
          refetch()
        } catch (error) {
          console.error('Failed to toggle subnav active status', error)
          refetch()
        }
      }
    } else {
      // Main nav item
      const item = data.data.find(i => String(i.id) === navId)
      if (item) {
        try {
          await updateNavigation({
            navigationId: String(item.id),
            body: {
              type: item.type,
              name: item.name,
              link: item.link,
              active: !item.active,
              coming_soon: item.coming_soon,
              icon: item.icon,
              ordering: item.ordering,
              subnav: item.subnav
                ? item.subnav.map(s => ({
                    name: s.name,
                    link: s.link,
                    active: s.active,
                    coming_soon: s.coming_soon,
                    icon: s.icon
                  }))
                : null
            }
          }).unwrap()
          refetch()
        } catch (error) {
          console.error('Failed to toggle nav active status', error)
          refetch()
        }
      }
    }
  }

  const hasSubNavs = (navId: string, links: NavLink[] = navLinks) => {
    return links.some(link => link.parentId === navId)
  }

  const getSubNavs = (parentId: string, links: NavLink[] = navLinks) => {
    return links.filter(link => link.parentId === parentId)
  }

  // Main Nav drag and drop (with sub-nav rebuilding) - for TOP navs
  const mainNavDrag = useDragAndDrop<NavLink>({
    items: navLinks,
    onReorder: newItems => {
      setNavLinks(newItems)
      handleUpdateOrder(newItems, 'top')
    },
    canDrag: item => !item.isSubNav,
    rebuildWithChildren: (reorderedMainNavs, allItems) => {
      const result: NavLink[] = []
      reorderedMainNavs.forEach(mainNav => {
        result.push(mainNav)
        // Add sub-navs for this main nav
        const subNavs = allItems.filter(link => link.parentId === mainNav.id)
        result.push(...subNavs)
      })
      return result
    }
  })

  // Sub-nav drag and drop - for TOP navs
  const subNavDrag = useSubNavDragAndDrop<NavLink>({
    items: navLinks,
    onReorder: newItems => {
      setNavLinks(newItems)
      handleUpdateOrder(newItems, 'top')
    }
  })

  // Sub-nav drag and drop - for BOTTOM navs
  const bottomSubNavDrag = useSubNavDragAndDrop<NavLink>({
    items: bottomNavLinks,
    onReorder: newItems => {
      setBottomNavLinks(newItems)
      handleUpdateOrder(newItems, 'bottom')
    }
  })

  // Bottom Nav drag and drop (simple list) - for BOTTOM navs
  const bottomNavDrag = useDragAndDrop<NavLink>({
    items: bottomNavLinks,
    onReorder: newItems => {
      setBottomNavLinks(newItems)
      handleUpdateOrder(newItems, 'bottom')
    }
  })

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

  return (
    <>
      <SEOHead
        title="Super Admin Dashboard | myEKI"
        description="Manage and monitor all brands, users, and activities on myEKI platform"
      />

      <SuperAdminLayout>
        {/* Welcome Section with Add Button */}
        <PermissionGuard permission="manage-navigation-bar">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
            <WelcomeSection />

            <div className="w-full sm:w-auto sm:flex-shrink-0">
              <button
                onClick={() => {
                  setIsCreateModalView(true)
                }}
                aria-label="Add nav-link"
                className="w-fit rounded-full bg-black px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 sm:px-6 sm:py-3 sm:text-[14px] md:w-auto"
              >
                Add nav-link
              </button>
            </div>
          </div>

          {/* Main Nav Section */}
          <div className="mb-4 w-full rounded-lg bg-white/30 p-2 sm:mb-6 sm:p-3 md:mb-8 md:p-4">
            <div className="mb-3 flex w-full items-center justify-between">
              <TextComponent as="h2" className="text-base font-semibold text-gray-900 sm:text-lg md:mb-4">
                Main Nav
              </TextComponent>
              {/* <div className="w-fit sm:w-auto sm:flex-shrink-0">
                <button
                  onClick={() => console.log('Add nav-link')}
                  aria-label="Add nav-link"
                  className="w-fit rounded-full bg-[#0088FF] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:opacity-30 sm:px-6 sm:py-3 sm:text-[14px] md:w-auto"
                >
                  Reset Nav
                </button>
              </div> */}
            </div>
            {/* ========== TOP NAV ============= */}
            {isLoading ? (
              Array.from({length: 5}).map((_, idx) => (
                <div className="flex flex-row items-center justify-between gap-3 rounded-lg px-3 py-3 shadow-sm sm:px-5 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Skeleton for Draggable icon */}
                    <div className="hidden h-5 w-5 animate-pulse rounded bg-gray-200 sm:block"></div>

                    {/* Skeleton for Toggle Switch */}
                    <div className="relative inline-flex h-6 w-11 animate-pulse rounded-full bg-gray-200"></div>

                    {/* Skeleton for Nav Name */}
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>

                    {/* Skeleton for Expand/Collapse Button */}
                    <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Skeleton for Path */}
                    <div className="h-8 w-10 animate-pulse rounded-lg bg-gray-200 p-2 lg:w-24"></div>

                    {/* Skeleton for Action Buttons */}
                    <div className="hidden items-center gap-2 lg:flex">
                      <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
                      <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
                      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
                    </div>
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 lg:hidden"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="">
                {navLinks
                  .filter(link => !link.isSubNav)
                  .map(link => (
                    <div
                      key={link.id}
                      draggable
                      onDragStart={e => mainNavDrag.handleDragStart(e, link.id)}
                      onDragOver={mainNavDrag.handleDragOver}
                      onDragEnter={e => mainNavDrag.handleDragEnter(e, link.id)}
                      onDragLeave={mainNavDrag.handleDragLeave}
                      onDrop={() => mainNavDrag.handleDrop(link.id)}
                      onDragEnd={mainNavDrag.handleDragEnd}
                      className={`cursor-move border-b border-[#E6E6E6] bg-white/30 transition-all duration-200 ${mainNavDrag.getDragItemClassName(link.id)}`}
                    >
                      {/* Main Nav Item */}
                      <div className="flex flex-row items-center justify-between gap-3 rounded-lg px-3 py-3 shadow-sm sm:px-5 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Draggeable icon for main navs */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hidden flex-shrink-0 cursor-grab active:cursor-grabbing sm:block"
                          >
                            <path
                              d="M16 9H11V4H14L10 0L6 4H9V9H4V6L0 10L4 14V11H9V16H6L10 20L14 16H11V11H16V14L20 10L16 6V9Z"
                              fill="#B8B8B8"
                            />
                          </svg>

                          {/* Toggle Switch */}
                          <button
                            title="toggle"
                            onClick={() => toggleNavActive(link.id)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                              link.isActive ? 'bg-black' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                link.isActive ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>

                          {/* Nav Name */}
                          <p
                            onClick={() => hasSubNavs(link.id) && toggleNavExpand(link.id)}
                            className="text-[14px] font-medium text-gray-900"
                          >
                            {link.name}
                          </p>

                          {/* Expand/Collapse Button for items with sub-navs */}
                          {hasSubNavs(link.id) && (
                            <button
                              title="expand"
                              onClick={() => toggleNavExpand(link.id)}
                              className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
                            >
                              <Icon
                                icon={
                                  expandedNavs.includes(link.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'
                                }
                                className="text-lg text-gray-600"
                              />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Path */}
                          <TextComponent
                            as="span"
                            className="break-all rounded-lg bg-white p-2 text-[12px] text-black sm:text-[14px]"
                          >
                            {link.path}
                          </TextComponent>

                          {/* Action Buttons */}
                          <div className="hidden items-center gap-2 lg:flex">
                            <button
                              title="edit"
                              onClick={() => handleEdit(link.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-gray-100"
                            >
                              <Icon icon="heroicons:pencil" className="text-lg text-gray-600" />
                            </button>
                            {isSuperAdmin && (
                              <button
                                title="delete"
                                onClick={() => {
                                  setSelectedItem(link as any)
                                  setIsShowModalDelete(true)
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 transition-colors hover:bg-gray-100"
                              >
                                <Icon icon="ic:baseline-delete" className="text-lg text-red-600" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                handleEdit(link.id)
                                setSubNavModal('add-sub-nav')
                              }}
                              className="rounded-full border border-black px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-sm"
                            >
                              Add sub nav
                            </button>
                          </div>
                          <div className="rounded-lg bg-white px-2 py-2 shadow-f1 lg:hidden">
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: '1',
                                    label: 'Edit',
                                    onClick: () => handleEdit(link.id)
                                  },
                                  // {
                                  //   key: '2',
                                  //   label: 'Add sub nav',
                                  //   onClick: () => console.log('Add sub nav clicked')
                                  // },
                                  ...(isSuperAdmin
                                    ? [
                                        {
                                          key: '3',
                                          label: <span className="text-red-600">Delete</span>,
                                          onClick: () => {
                                            setSelectedItem(link as any)
                                            setIsShowModalDelete(true)
                                          }
                                        }
                                      ]
                                    : [])
                                ]
                              }}
                              trigger={['click']}
                            >
                              <a
                                onClick={e => {
                                  e.preventDefault()
                                }}
                              >
                                <Icon icon="bi:three-dots" className="relative rotate-90 text-xl" />
                              </a>
                            </Dropdown>
                          </div>
                        </div>
                      </div>

                      {/* Sub Nav Items */}
                      {hasSubNavs(link.id) && expandedNavs.includes(link.id) && (
                        <div className="mr-0 pr-2 sm:mr-[100px] sm:pr-4">
                          {getSubNavs(link.id).map(subLink => (
                            <div
                              key={subLink.id}
                              draggable
                              onDragStart={e => subNavDrag.handleDragStart(e, subLink.id)}
                              onDragOver={subNavDrag.handleDragOver}
                              onDragEnter={e => subNavDrag.handleDragEnter(e, subLink.id)}
                              onDragLeave={subNavDrag.handleDragLeave}
                              onDrop={() => subNavDrag.handleDropSubNav(link.id, subLink.id)}
                              onDragEnd={subNavDrag.handleDragEnd}
                              className={`flex cursor-move flex-col gap-2 rounded-lg border-b border-[#E6E6E6] bg-white/50 py-3 pl-6 pr-3 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:pl-12 sm:pr-5 ${subNavDrag.getDragItemClassName(subLink.id)}`}
                            >
                              <div className="flex h-10 items-center gap-2 border-l-[3px] border-black pl-2 sm:gap-3 sm:pl-3">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="hidden flex-shrink-0 cursor-grab active:cursor-grabbing sm:block"
                                >
                                  <path
                                    d="M16 9H11V4H14L10 0L6 4H9V9H4V6L0 10L4 14V11H9V16H6L10 20L14 16H11V11H16V14L20 10L16 6V9Z"
                                    fill="#B8B8B8"
                                  />
                                </svg>
                                {/* Toggle Switch */}
                                <button
                                  title="toggle"
                                  onClick={() => toggleNavActive(subLink.id)}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                                    subLink.isActive ? 'bg-black' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                      subLink.isActive ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                                  />
                                </button>

                                {/* Nav Name */}
                                <TextComponent as="span" className="text-[14px] font-medium text-gray-900">
                                  {subLink.name}
                                </TextComponent>
                              </div>

                              <div className="flex items-center justify-between gap-2 sm:gap-3">
                                {/* Path */}
                                <TextComponent
                                  as="span"
                                  className="break-all rounded-lg bg-white p-2 text-[12px] text-black sm:text-[14px]"
                                >
                                  {subLink.path}
                                </TextComponent>

                                {/* Edit Button */}
                                <button
                                  title="edit"
                                  onClick={() => handleEdit(subLink.id)}
                                  className="hidden h-8 w-8 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-gray-100 lg:flex"
                                >
                                  <Icon icon="heroicons:pencil" className="text-lg text-gray-600" />
                                </button>
                                <div className="block w-fit rounded-lg bg-[#E8E8E8] px-2 py-2 shadow-f1 lg:hidden">
                                  <Dropdown
                                    menu={{
                                      items: [
                                        {
                                          key: '1',
                                          label: 'Edit sub nav',
                                          onClick: () => handleEdit(subLink.id)
                                        }
                                      ]
                                    }}
                                    trigger={['click']}
                                  >
                                    <a
                                      onClick={e => {
                                        e.preventDefault()
                                      }}
                                    >
                                      <Icon icon="bi:three-dots" className="relative rotate-90 text-xl" />
                                    </a>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {/* ========== TOP NAV END ============= */}
          </div>

          {/* Bottom Nav Section */}
          <div className="mb-4 rounded-lg bg-white/30 p-2 sm:mb-6 sm:p-3 md:mb-8 md:px-4 md:pb-4">
            <TextComponent as="h2" className="mb-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg md:mb-4">
              Bottom Nav
            </TextComponent>
            {isLoading ? (
              Array.from({length: 4}).map((_, idx) => (
                <div className="flex flex-row items-center justify-between gap-3 rounded-lg px-3 py-3 shadow-sm sm:px-5 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Skeleton for Draggable icon */}
                    <div className="hidden h-5 w-5 animate-pulse rounded bg-gray-200 sm:block"></div>

                    {/* Skeleton for Toggle Switch */}
                    <div className="relative inline-flex h-6 w-11 animate-pulse rounded-full bg-gray-200"></div>

                    {/* Skeleton for Nav Name */}
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>

                    {/* Skeleton for Expand/Collapse Button */}
                    <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Skeleton for Path */}
                    <div className="h-8 w-10 animate-pulse rounded-lg bg-gray-200 p-2 lg:w-24"></div>

                    {/* Skeleton for Action Buttons */}
                    <div className="hidden items-center gap-2 lg:flex">
                      <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
                      <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
                      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
                    </div>
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 lg:hidden"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="">
                {bottomNavLinks
                  .filter(link => !link.isSubNav)
                  .map(link => (
                    <div
                      key={link.id}
                      draggable
                      onDragStart={e => bottomNavDrag.handleDragStart(e, link.id)}
                      onDragOver={bottomNavDrag.handleDragOver}
                      onDragEnter={e => bottomNavDrag.handleDragEnter(e, link.id)}
                      onDragLeave={bottomNavDrag.handleDragLeave}
                      onDrop={() => bottomNavDrag.handleDrop(link.id)}
                      onDragEnd={bottomNavDrag.handleDragEnd}
                      className={`cursor-move border-b border-[#E6E6E6] bg-white/30 transition-all duration-200 ${bottomNavDrag.getDragItemClassName(link.id)}`}
                    >
                      {/* Main Nav Item */}
                      <div className="flex flex-row items-center justify-between gap-3 rounded-lg px-3 py-3 shadow-sm sm:px-5 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Draggeable icon for bottom navs */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hidden flex-shrink-0 cursor-grab active:cursor-grabbing sm:block"
                          >
                            <path
                              d="M16 9H11V4H14L10 0L6 4H9V9H4V6L0 10L4 14V11H9V16H6L10 20L14 16H11V11H16V14L20 10L16 6V9Z"
                              fill="#B8B8B8"
                            />
                          </svg>

                          {/* Toggle Switch */}
                          <button
                            title="Toggle Active Status"
                            onClick={() => toggleNavActive(link.id, true)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                              link.isActive ? 'bg-black' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                link.isActive ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>

                          {/* Nav Name */}
                          <p
                            onClick={() => hasSubNavs(link.id, bottomNavLinks) && toggleNavExpand(link.id)}
                            className="text-[14px] font-medium text-gray-900"
                          >
                            {link.name}
                          </p>

                          {/* Expand/Collapse Button for items with sub-navs */}
                          {hasSubNavs(link.id, bottomNavLinks) && (
                            <button
                              title="expand"
                              onClick={() => toggleNavExpand(link.id)}
                              className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
                            >
                              <Icon
                                icon={
                                  expandedNavs.includes(link.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'
                                }
                                className="text-lg text-gray-600"
                              />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-row items-center gap-2 sm:gap-3">
                          {/* Path */}
                          <TextComponent
                            as="span"
                            className="break-all rounded-lg bg-white p-2 text-[12px] text-black sm:text-[14px]"
                          >
                            {link.path}
                          </TextComponent>

                          {/* Action Buttons */}
                          <div className="hidden items-center gap-2 lg:flex">
                            <button
                              title="edit"
                              onClick={() => handleEdit(link.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-gray-100"
                            >
                              <Icon icon="heroicons:pencil" className="text-lg text-gray-600" />
                            </button>
                            {isSuperAdmin && (
                              <button
                                title="delete"
                                onClick={() => {
                                  setSelectedItem(link as any)
                                  setIsShowModalDelete(true)
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 transition-colors hover:bg-gray-100"
                              >
                                <Icon icon="ic:baseline-delete" className="text-lg text-red-600" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                handleEdit(link.id)
                                setSubNavModal('add-sub-nav')
                              }}
                              className="rounded-full border border-black px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-sm"
                            >
                              Add sub nav
                            </button>
                          </div>
                          <div className="rounded-lg bg-white px-2 py-2 shadow-f1 lg:hidden">
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: '1',
                                    label: 'Edit',
                                    onClick: () => handleEdit(link.id)
                                  },
                                  ...(isSuperAdmin
                                    ? [
                                        {
                                          key: '3',
                                          label: <span className="text-red-600">Delete</span>,
                                          onClick: () => {
                                            setSelectedItem(link as any)
                                            setIsShowModalDelete(true)
                                          }
                                        }
                                      ]
                                    : [])
                                ]
                              }}
                              trigger={['click']}
                            >
                              <a
                                onClick={e => {
                                  e.preventDefault()
                                }}
                              >
                                <Icon icon="bi:three-dots" className="relative rotate-90 text-xl" />
                              </a>
                            </Dropdown>
                          </div>
                        </div>
                      </div>

                      {/* Sub Nav Items */}
                      {hasSubNavs(link.id, bottomNavLinks) && expandedNavs.includes(link.id) && (
                        <div className="mr-0 pr-2 sm:mr-[100px] sm:pr-4">
                          {getSubNavs(link.id, bottomNavLinks).map(subLink => (
                            <div
                              key={subLink.id}
                              draggable
                              onDragStart={e => bottomSubNavDrag.handleDragStart(e, subLink.id)}
                              onDragOver={bottomSubNavDrag.handleDragOver}
                              onDragEnter={e => bottomSubNavDrag.handleDragEnter(e, subLink.id)}
                              onDragLeave={bottomSubNavDrag.handleDragLeave}
                              onDrop={() => bottomSubNavDrag.handleDropSubNav(link.id, subLink.id)}
                              onDragEnd={bottomSubNavDrag.handleDragEnd}
                              className={`flex cursor-move flex-col gap-2 rounded-lg border-b border-[#E6E6E6] bg-white/50 py-3 pl-6 pr-3 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:pl-12 sm:pr-5 ${bottomSubNavDrag.getDragItemClassName(subLink.id)}`}
                            >
                              <div className="flex h-10 items-center gap-2 border-l-[3px] border-black pl-2 sm:gap-3 sm:pl-3">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="hidden flex-shrink-0 cursor-grab active:cursor-grabbing sm:block"
                                >
                                  <path
                                    d="M16 9H11V4H14L10 0L6 4H9V9H4V6L0 10L4 14V11H9V16H6L10 20L14 16H11V11H16V14L20 10L16 6V9Z"
                                    fill="#B8B8B8"
                                  />
                                </svg>
                                {/* Toggle Switch */}
                                <button
                                  title="toggle"
                                  onClick={() => toggleNavActive(subLink.id, true)}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                                    subLink.isActive ? 'bg-black' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                      subLink.isActive ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                                  />
                                </button>

                                {/* Nav Name */}
                                <TextComponent as="span" className="text-[14px] font-medium text-gray-900">
                                  {subLink.name}
                                </TextComponent>
                              </div>

                              <div className="flex items-center justify-between gap-2 sm:gap-3">
                                {/* Path */}
                                <TextComponent
                                  as="span"
                                  className="break-all rounded-lg bg-white p-2 text-[12px] text-black sm:text-[14px]"
                                >
                                  {subLink.path}
                                </TextComponent>

                                {/* Edit Button */}
                                <button
                                  title="edit"
                                  onClick={() => handleEdit(subLink.id)}
                                  className="hidden h-8 w-8 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-gray-100 lg:flex"
                                >
                                  <Icon icon="heroicons:pencil" className="text-lg text-gray-600" />
                                </button>
                                <div className="block w-fit rounded-lg bg-[#E8E8E8] px-2 py-2 shadow-f1 lg:hidden">
                                  <Dropdown
                                    menu={{
                                      items: [
                                        {
                                          key: '1',
                                          label: 'Edit sub nav',
                                          onClick: () => handleEdit(subLink.id)
                                        }
                                      ]
                                    }}
                                    trigger={['click']}
                                  >
                                    <a
                                      onClick={e => {
                                        e.preventDefault()
                                      }}
                                    >
                                      <Icon icon="bi:three-dots" className="relative rotate-90 text-xl" />
                                    </a>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </PermissionGuard>

        {/* Pagination Footer */}
      </SuperAdminLayout>
      {isCreateModalView && (
        <PlannerModal
          title={<span className="text-lg font-semibold text-black">Add Nav-bar</span>}
          iconClassName="relative top-1 text-black text-2xl"
          onCloseModal={() => {
            setIsCreateModalView(false)
          }}
          width={600}
          className="order-details-modal rounded-xl"
          modalOpen={isCreateModalView}
          setModalOpen={setIsCreateModalView}
        >
          <Alert
            message="Nav Sub-navigation"
            description={
              <>
                <div>Do you want to create sub-navigation for this nav?</div>
                <div className="mt-1 text-sm text-gray-600">
                  If yes, the main nav will not require a link. If no, please provide a link for the main nav.
                </div>
              </>
            }
            type="info"
            showIcon
            closable
          />
          <NavBarForm
            isEditing={false}
            refetch={refetch}
            existingNavigations={data?.data || []}
            onCloseModal={() => {
              setIsCreateModalView(false)
            }}
          />
        </PlannerModal>
      )}
      {isShowModalEdit && (
        <PlannerModal
          width={600}
          title={
            <span className="text-lg font-semibold text-black">
              {subNavModal === 'add-sub-nav' ? 'Add Sub Nav' : 'Edit Main Nav and Sub Nav'}
            </span>
          }
          iconClassName="relative top-1 text-black text-2xl"
          onCloseModal={() => {
            setIsShowModalEdit(false)
            setSubNavModal('edit')
          }}
          className="order-details-modal rounded-xl"
          modalOpen={isShowModalEdit}
          setModalOpen={setIsShowModalEdit}
        >
          <Alert
            message="Nav Sub-navigation"
            description={
              <>
                <div>Do you want to create sub-navigation for this nav?</div>
                <div className="mt-1 text-sm text-gray-600">
                  If yes, the main nav will not require a link. If no, please provide a link for the main nav.
                </div>
              </>
            }
            type="info"
            showIcon
            closable
          />
          <NavBarForm
            isEditing={true}
            navigationId={selectedItem ? String(selectedItem.id) : undefined}
            navigationData={selectedItem}
            refetch={refetch}
            existingNavigations={data?.data || []}
            onCloseModal={() => setIsShowModalEdit(false)}
          />
        </PlannerModal>
      )}
      {isShowModalDelete && (
        <PlannerModal
          title={<span className="text-lg font-semibold text-black">Delete Nav-bar</span>}
          iconClassName="relative top-1 text-black text-2xl"
          onCloseModal={() => {
            setIsShowModalDelete(false)
          }}
          className="order-details-modal rounded-xl"
          modalOpen={isShowModalDelete}
          setModalOpen={setIsShowModalDelete}
        >
          <div className="mx-auto flex w-[95%] flex-col items-center justify-center gap-y-2">
            <>
              <div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#FFEBEB]">
                <Icon icon="material-symbols-light:warning-rounded" className="m-auto text-3xl text-[#FF2D55]" />
              </div>
              <p className="text-center text-[20px] font-medium text-[#23262F] lg:text-[24px]">
                Are you sure you want to delete the navigation,{' '}
                {selectedItem && <span className="font-semibold capitalize">{selectedItem.name}</span>} ?
              </p>

              <div className="mt-5 flex w-full gap-x-4">
                <CustomButton
                  bordered={false}
                  onClick={() => setIsShowModalDelete(false)}
                  className="w-full rounded-[10px] bg-[#F1F1F1] py-3.5"
                >
                  No
                </CustomButton>
                <CustomButton
                  bordered={false}
                  onClick={handleDelete}
                  className="rounded-[10px] bg-[#FF2D55] py-3.5 text-white"
                >
                  {isDeleting ? <Spinner /> : 'Yes,delete'}
                </CustomButton>
              </div>
            </>
          </div>
        </PlannerModal>
      )}
      <style jsx global>{`
        .order-details-modal .ant-modal-body {
          padding: 0;
          max-height: 85vh;
          overflow-y: auto;
          // reduce scrollbar width
          scrollbar-width: 1px;
          &::-webkit-scrollbar {
            width: 6px;
          }
        }
        .order-details-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
        .order-details-container {
          padding: 2rem;
        }
        @media (max-width: 768px) {
          .order-details-container {
            padding: 0;
          }
        }
      `}</style>
    </>
  )
}

export default SuperAdminDashboard
