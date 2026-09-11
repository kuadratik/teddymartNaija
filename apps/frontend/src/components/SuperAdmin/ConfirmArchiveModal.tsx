import React from 'react'
import {Icon} from '@iconify/react'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Brand} from '@/services/super-admin'

interface ConfirmArchiveModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  brandName: string
  isLoading?: boolean
  brand?: Brand
}

const ConfirmArchiveModal: React.FC<ConfirmArchiveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  brandName,
  isLoading = false,
  brand
}) => {
  if (!isOpen) return null

  const isArchived = brand && 'is_archived' in brand && brand.is_archived
  const actionText = isArchived ? 'unarchive' : 'archive'
  const buttonText = isArchived ? 'Yes, Unarchive' : 'Yes, Archive'
  const description = isArchived
    ? 'Unarchiving this brand will make it visible to users again'
    : 'Archiving this brand will take it out of the visuals of the user'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white px-8 py-12 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Icon icon="heroicons:exclamation-triangle-solid" className="text-5xl text-gray-900" />
          </div>
        </div>

        {/* Title */}
        <TextComponent as="h2" className="text-center text-2xl font-semibold text-gray-900">
          Are you sure you want to {actionText}
        </TextComponent>
        <TextComponent as="h2" className="mb-4 text-center text-2xl font-semibold text-gray-900">
          {brandName}
        </TextComponent>

        {/* Description */}
        <TextComponent as="p" className="mb-8 text-center text-base font-normal text-gray-500">
          {description}
        </TextComponent>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {/* No Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border-2 border-black bg-white px-6 py-4 text-base font-medium text-black transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            No
          </button>

          {/* Yes, Archive/Unarchive Button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-black px-6 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="eos-icons:loading" className="text-xl" />
                {isArchived ? 'Unarchiving...' : 'Archiving...'}
              </span>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmArchiveModal
