import TextComponent from '@/components/SharedUI/TextComponent'
import {useCopyToClipboard} from '@/hooks/useCopyToClipboard'
import {Brand} from '@/services/super-admin'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps, Tooltip} from 'antd'
import Image from 'next/image'
import React from 'react'

export interface BrandCardData {
  id: string | number
  name: string
  category?: string
  description: string
  is_active: boolean
  logo?: string
  logo_url?: string
  categories?: Array<{id: number; name: string}>
}

interface BrandCardProps {
  brand: BrandCardData | Brand
  onEdit?: (brand: BrandCardData | Brand) => void
  onArchive?: (brand: BrandCardData | Brand) => void
  onViewLink?: (brand: BrandCardData | Brand) => void
  showArchivedBadge?: boolean
}

const BrandCard: React.FC<BrandCardProps> = ({brand, onEdit, onArchive, onViewLink, showArchivedBadge = false}) => {
  if (!brand) return null

  const {handleCopy} = useCopyToClipboard()

  // Support both old and new data formats
  const rawLogoUrl = 'logo_url' in brand ? brand.logo_url : 'logo' in brand ? brand.logo : undefined
  // Construct full image URL with base URL for API paths
  const logoUrl = rawLogoUrl ? `${process.env.imageBaseUrl}/${rawLogoUrl}` : undefined

  const categoryText =
    'categories' in brand && brand.categories && brand.categories.length > 0
      ? brand.categories.length > 2
        ? brand.categories
            .slice(0, 2)
            .map(c => c.name)
            .join(', ') + ` + ${brand.categories.length - 2} more`
        : brand.categories.map(c => c.name).join(', ')
      : 'category' in brand
        ? brand.category
        : 'Category'

  const fullCategoryText =
    'categories' in brand && brand.categories && brand.categories.length > 0
      ? brand.categories.map(c => c.name).join(', ')
      : 'category' in brand
        ? brand.category
        : 'Category'

  const isArchived = 'is_archived' in brand && brand.is_archived
  const archiveLabel = isArchived ? 'Unarchive' : 'Archive'

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <Icon icon="heroicons:pencil" className="text-base" />,
      onClick: () => onEdit?.(brand)
    },
    {
      key: 'copy-url',
      label: 'Copy myEKI URL',
      icon: <Icon icon="heroicons:clipboard-document" className="text-base" />,
      onClick: () => {
        const url = 'source_url' in brand && brand.source_url
        if (url) {
          handleCopy(url, {
            successTitle: 'myEKI URL Copied',
            successMessage: 'The myEKI URL has been copied to your clipboard'
          })
        }
      }
    },
    {
      key: 'archive',
      label: archiveLabel,
      icon: <Icon icon="heroicons:archive-box" className="text-base" />,
      onClick: () => onArchive?.(brand)
    }
  ]

  return (
    <div className="rounded-[16px] border border-white bg-white/20 p-6 backdrop-blur-sm transition-shadow hover:shadow-md">
      {/* Header with Logo, Name and Menu */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex w-[80%] items-center gap-3">
          {/* Logo */}
          <div className="relative flex h-[64px] w-[64px] items-center justify-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={brand.name}
                width={64}
                height={64}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Icon icon="heroicons:building-storefront" className="rounded-full text-3xl text-gray-400" />
            )}
            {brand.is_active && (
              <svg
                className="absolute bottom-0 right-0"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="5.81818" fill="white" stroke="#0088FF" stroke-width="4.36364" />
              </svg>
            )}
          </div>

          {/* Name and Category */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <TextComponent as="h3" className=" text-[18px] font-semibold leading-tight text-gray-900">
                {brand.name}
              </TextComponent>
              {showArchivedBadge && isArchived && (
                <span className="inline-flex items-center rounded-full bg-black px-2 py-1.5 text-xs font-medium text-white xl:py-0.5">
                  <span className="hidden xl:inline-block">Archived</span>
                  <span className="inline-block xl:hidden">
                    <Icon icon="heroicons:archive-box" className="text-sm" />
                  </span>
                </span>
              )}
            </div>
            {brand.categories && brand.categories.length > 2 ? (
              <Tooltip
                placement="top"
                title={fullCategoryText}
                color="#fff"
                overlayInnerStyle={{color: '#000', textAlign: 'center'}}
              >
                <span className="mt-1 cursor-pointer truncate text-[14px] font-normal text-gray-500">
                  {categoryText}
                </span>
              </Tooltip>
            ) : (
              <TextComponent as="p" className="mt-1 truncate text-[14px] font-normal text-gray-500">
                {categoryText}
              </TextComponent>
            )}
          </div>
        </div>

        {/* Menu Dropdown */}
        <Dropdown menu={{items: menuItems}} placement="bottomRight" trigger={['click']}>
          <button title="More options" className="rounded-lg p-1 transition-colors hover:bg-gray-100">
            <Icon icon="heroicons:ellipsis-vertical" className="text-xl text-gray-600" />
          </button>
        </Dropdown>
      </div>

      <div className="w-full border-t-2 border-white pb-4" />

      {/* Description with Link Icon */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white bg-white/20 p-3 backdrop-blur-sm transition-shadow">
        <Tooltip placement="top" title={brand.description}>
          <span className="flex-1 cursor-pointer truncate text-[15px] font-normal leading-relaxed text-gray-600">
            {brand.description}
          </span>
        </Tooltip>
        <Tooltip title="View link in new tab">
          <button
            onClick={() => {
              const url = 'source_url' in brand && brand.source_url
              if (url) {
                window.open(url, '_blank')
              }
              onViewLink?.(brand)
            }}
            className="flex-shrink-0 rounded-lg bg-white p-2 transition-colors hover:bg-gray-100"
          >
            <Icon icon="heroicons:link" className="text-xl text-gray-600" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default BrandCard
