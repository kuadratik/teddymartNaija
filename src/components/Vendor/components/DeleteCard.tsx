import CustomButton from '@/components/SharedUI/Buttons/Button'
import Spinner from '@/components/SharedUI/Spinner'
import {Icon} from '@iconify/react'
import React from 'react'

interface DeleteCardProps {
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
  message?: React.ReactNode | string
}

const DeleteCard: React.FC<DeleteCardProps> = ({
  onCancel,
  onConfirm,
  isLoading = false,
  message = 'Are you sure you want to delete this item?'
}) => {
  return (
    <div className="px-2">
      {/* Close Icon */}
      <div className="flex px-2">
        <Icon icon="mdi:close" className="ml-auto cursor-pointer text-[24px]" onClick={onCancel} />
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Icon icon="ep:delete-filled" className="cursor-pointer text-[44px] text-[#FF2D55]" />
        <h1>Are you sure?</h1>
        <p>{message}</p>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex w-full items-center gap-4">
        {/* Cancel Button */}
        <CustomButton
          onClick={onCancel}
          type="button"
          className="rounded-[10px] border border-[#FF2D55] bg-[#fff] px-1 py-4 text-[14px] text-[#FF2D55]"
        >
          Close
        </CustomButton>
        {/* Confirm Button */}
        <CustomButton
          onClick={onConfirm}
          type="button"
          className="w-full rounded-[10px] bg-[#FF2D55] px-1 py-4 text-[14px] text-white hover:bg-[#FF2D55] hover:text-white"
        >
          {isLoading ? <Spinner /> : 'Yes, Delete'}
        </CustomButton>
      </div>
    </div>
  )
}

export default DeleteCard
