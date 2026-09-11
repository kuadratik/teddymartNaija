import React, { useState } from 'react'
import SuperAdminLayout from '@/components/SuperAdmin/Layout'
import TextComponent from '@/components/SharedUI/TextComponent'
import SEOHead from '@/components/SharedUI/SEOHead'
import { Icon } from '@iconify/react'
import WelcomeSection from '@/components/SuperAdmin/WelcomeSection'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { useSubNavDragAndDrop } from '@/hooks/useSubNavDragAndDrop'
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth'

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
  { id: '1', name: 'Stores', path: '/stores', isActive: true },
  { id: '2', name: 'Mall', path: '/mall', isActive: false },
  { id: '3', name: 'Vendors', path: '/vendors', isActive: true },
  { id: '4', name: 'Riders & Shippers', path: '/riders', isActive: true },
  { id: '5', name: 'Classified Ads', path: '/#', isActive: true },
  { id: '6', name: 'new nav link 1', path: '/classified ad/link name', isActive: true, isSubNav: true, parentId: '5' },
  { id: '7', name: 'new nav link 2', path: '/classified ad/link name', isActive: true, isSubNav: true, parentId: '5' },
  { id: '8', name: 'Brands', path: '/brands', isActive: true },
  { id: '9', name: 'Directory', path: '/directory', isActive: true }
]

const mockBottomNavLinks: NavLink[] = [
  { id: '10', name: 'Find Vendors', path: '/find-a-vendors', isActive: true },
  { id: '11', name: 'Reviews', path: '/reviews', isActive: true },
  { id: '12', name: 'Messages', path: '/messages', isActive: true }
]

const SuperAdminDashboard = () => {
  const [navLinks, setNavLinks] = useState<NavLink[]>(mockNavLinks)
  const [bottomNavLinks, setBottomNavLinks] = useState<NavLink[]>(mockBottomNavLinks)
  const [expandedNavs, setExpandedNavs] = useState<string[]>(['5']) // Classified Ads expanded by default
  const { isAuthenticated, isInitialized } = useSuperAdminAuth()

  const toggleNavExpand = (navId: string) => {
    setExpandedNavs(prev => (prev.includes(navId) ? prev.filter(id => id !== navId) : [...prev, navId]))
  }

  const toggleNavActive = (navId: string, isBottomNav: boolean = false) => {
    if (isBottomNav) {
      setBottomNavLinks(prev => prev.map(link => (link.id === navId ? { ...link, isActive: !link.isActive } : link)))
    } else {
      setNavLinks(prev => prev.map(link => (link.id === navId ? { ...link, isActive: !link.isActive } : link)))
    }
  }

  const hasSubNavs = (navId: string) => {
    return navLinks.some(link => link.parentId === navId)
  }

  const getSubNavs = (parentId: string) => {
    return navLinks.filter(link => link.parentId === parentId)
  }

  // Main Nav drag and drop (with sub-nav rebuilding)
  const mainNavDrag = useDragAndDrop<NavLink>({
    items: navLinks,
    onReorder: setNavLinks,
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

  // Sub-nav drag and drop
  const subNavDrag = useSubNavDragAndDrop<NavLink>({
    items: navLinks,
    onReorder: setNavLinks
  })

  // Bottom Nav drag and drop (simple list)
  const bottomNavDrag = useDragAndDrop<NavLink>({
    items: bottomNavLinks,
    onReorder: setBottomNavLinks
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
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <WelcomeSection />

          <div className="w-full sm:w-auto sm:flex-shrink-0">
            <button
              onClick={() => console.log('Add nav-link')}
              aria-label="Add nav-link"
              className="w-full rounded-full bg-black px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 sm:px-6 sm:py-3 sm:text-[14px] md:w-auto"
            >
              Add nav-link
            </button>
          </div>
        </div>

        {/* Main Nav Section */}
        <div className="mb-4 rounded-lg bg-white/30 p-2 sm:mb-6 sm:p-3 md:mb-8 md:p-4">
          <TextComponent as="h2" className="mb-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg md:mb-4">
            Main Nav
          </TextComponent>

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
                  <div className="flex flex-col gap-3 rounded-lg px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
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
                        onClick={() => toggleNavActive(link.id)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${link.isActive ? 'bg-black' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${link.isActive ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                        />
                      </button>

                      {/* Nav Name */}
                      <TextComponent as="span" className="text-[14px] font-medium text-gray-900">
                        {link.name}
                      </TextComponent>

                      {/* Expand/Collapse Button for items with sub-navs */}
                      {hasSubNavs(link.id) && (
                        <button
                          onClick={() => toggleNavExpand(link.id)}
                          className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
                        >
                          <Icon
                            icon={expandedNavs.includes(link.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'}
                            className="text-lg text-gray-600"
                          />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      {/* Path */}
                      <TextComponent as="span" className="break-all rounded-lg bg-white p-2 text-[12px] text-black sm:text-[14px]">
                        {link.path}
                      </TextComponent>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => console.log('Edit', link.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-gray-100"
                        >
                          <Icon icon="heroicons:pencil" className="text-lg text-gray-600" />
                        </button>
                        <button
                          onClick={() => console.log('Add sub nav', link.id)}
                          className="rounded-full border border-black px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-sm"
                        >
                          Add sub nav
                        </button>
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
                              onClick={() => toggleNavActive(subLink.id)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${subLink.isActive ? 'bg-black' : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${subLink.isActive ? 'translate-x-5' : 'translate-x-0.5'
                                  }`}
                              />
                            </button>

                            {/* Nav Name */}
                            <TextComponent as="span" className="text-[14px] font-medium text-gray-900">
                              {subLink.name}
                            </TextComponent>
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            {/* Path */}
                            <TextComponent as="span" className="break-all rounded-lg bg-white p-2 text-[12px] text-black sm:text-[14px]">
                              {subLink.path}
                            </TextComponent>

                            {/* Edit Button */}
                            <button
                              onClick={() => console.log('Edit', subLink.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-gray-100"
                            >
                              <Icon icon="heroicons:pencil" className="text-lg text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Bottom Nav Section */}
        <div className="mb-4 rounded-lg bg-white/30 p-2 sm:mb-6 sm:p-3 md:mb-8 md:px-4 md:pb-4">
          <TextComponent as="h2" className="mb-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg md:mb-4">
            Bottom Nav
          </TextComponent>

          <div className="">
            {bottomNavLinks.map(link => (
              <div
                key={link.id}
                draggable
                onDragStart={e => bottomNavDrag.handleDragStart(e, link.id)}
                onDragOver={bottomNavDrag.handleDragOver}
                onDragEnter={e => bottomNavDrag.handleDragEnter(e, link.id)}
                onDragLeave={bottomNavDrag.handleDragLeave}
                onDrop={() => bottomNavDrag.handleDrop(link.id)}
                onDragEnd={bottomNavDrag.handleDragEnd}
                className={`order-b flex cursor-move flex-col gap-3 rounded-lg border-[#E6E6E6] bg-white/30 px-3 py-3 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 ${bottomNavDrag.getDragItemClassName(link.id)}`}
              >
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
                    onClick={() => toggleNavActive(link.id, true)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${link.isActive ? 'bg-black' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${link.isActive ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                    />
                  </button>

                  {/* Nav Name */}
                  <TextComponent as="span" className="text-[14px] font-medium text-gray-900">
                    {link.name}
                  </TextComponent>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  {/* Path */}
                  <TextComponent as="span" className="break-all rounded-lg bg-white p-2 text-[12px] text-black sm:text-[14px]">
                    {link.path}
                  </TextComponent>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => console.log('Edit', link.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-gray-100"
                    >
                      <Icon icon="heroicons:pencil" className="text-lg text-gray-600" />
                    </button>
                    <button
                      onClick={() => console.log('Add sub nav', link.id)}
                      className="rounded-full border border-black px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-sm"
                    >
                      Add sub nav
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:pt-6">
          <TextComponent as="p" className="text-center text-[13px] font-normal text-gray-600 sm:text-left sm:text-[14px]">
            Showing <span className="font-medium">1 to 5 of 120</span> Brands
          </TextComponent>

          {/* Pagination: compact on mobile, full on sm+ */}
          <div className="flex items-center justify-center gap-2 sm:justify-end">
            {/* Mobile compact controls (visible < sm) */}
            <div className="flex w-full items-center justify-between gap-2 sm:hidden">
              <button
                aria-label="Previous page"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <Icon icon="heroicons:chevron-left" className="text-lg text-gray-600" />
              </button>

              <div className="flex-1 text-center">
                <span className="inline-flex min-w-[60px] items-center justify-center rounded-lg bg-black px-3 py-2 text-[13px] font-medium text-white">
                  1 of 24
                </span>
              </div>

              <button
                aria-label="Next page"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <Icon icon="heroicons:chevron-right" className="text-lg text-gray-600" />
              </button>
            </div>

            {/* Full controls for sm+ */}
            <div className="hidden items-center gap-2 sm:flex">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50">
                <Icon icon="heroicons:chevron-left" className="text-lg text-gray-600" />
              </button>

              {/* Page numbers */}
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-[14px] font-medium text-white">
                1
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50">
                2
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50">
                ...
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50">
                24
              </button>

              {/* Next button */}
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50">
                <Icon icon="heroicons:chevron-right" className="text-lg text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </SuperAdminLayout>
    </>
  )
}

export default SuperAdminDashboard
