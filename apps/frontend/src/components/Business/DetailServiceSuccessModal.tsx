import {Icon} from '@iconify/react'
import dayjs from 'dayjs'
import React from 'react'
import CustomButton from '../SharedUI/Buttons/Button'

interface IProps {
  // Define any props you need here
  setShowBookingSuccessModal: React.Dispatch<React.SetStateAction<boolean>>
  setShowMessageVendorModal: React.Dispatch<React.SetStateAction<boolean>>
  formValues: any
  data: any
}
const DetailServiceSuccessModal = ({
  setShowBookingSuccessModal,
  data,
  formValues,
  setShowMessageVendorModal
}: IProps) => {
  const timeSlot = data?.data?.timeSlot
  const selectedDate = data?.data?.date
  // Format time for display
  const formatTime = (timeString: string) => dayjs.utc(timeString).format('hh:mm A')
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 text-center">
      <Icon icon="ep:success-filled" className="text-[40px] text-[#34C759]" />
      <p className="w-[78%]">
        Reservation for <span className="font-semibold">{formValues.cus_fullname}</span> on{' '}
        <span className="font-[500]">{selectedDate.format('MMM DD, YYYY')}</span> at{' '}
        <span className="font-[500]">
          {' '}
          {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}
        </span>
      </p>

      <div className="mt-6 flex w-full gap-4">
        <CustomButton
          onClick={() => {
            setShowBookingSuccessModal(false)
          }}
          className="w-full rounded-[10px] border border-black bg-white px-3 py-3 text-sm font-[500] text-black md:px-5"
        >
          Close
        </CustomButton>
        <CustomButton
          onClick={() => {
            setShowBookingSuccessModal(false)
            setShowMessageVendorModal(true)
          }}
          className="w-full rounded-[10px] border border-black bg-black px-3 py-3 text-sm font-[500] text-white md:px-5"
        >
          Message Vendor
        </CustomButton>
      </div>
    </div>
  )
}

export default DetailServiceSuccessModal
