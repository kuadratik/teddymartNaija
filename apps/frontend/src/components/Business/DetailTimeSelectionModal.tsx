import {Tooltip} from 'antd'
import dayjs, {Dayjs} from 'dayjs'
import utc from 'dayjs/plugin/utc'
import React, {useEffect, useState} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
dayjs.extend(utc)

interface IProps {
  service: any
  selectedDate: Dayjs
  setShowServiceModal: React.Dispatch<React.SetStateAction<boolean>>
  handleBackToCalendar: () => void
  onBookTimeSlot?: (service: any, timeSlot: any, date: Dayjs) => void // Prop for booking action
  bookingSuccess?: boolean
  recentlyBookedSlotId?: number | null
}

const DetailTimeSelectionModal = ({
  service,
  selectedDate,
  setShowServiceModal,
  handleBackToCalendar,
  onBookTimeSlot,
  bookingSuccess,
  recentlyBookedSlotId
}: IProps) => {
  // State to track the selected time slot
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null)
  // State to track locally booked slots
  const [locallyBookedSlots, setLocallyBookedSlots] = useState<number[]>([])

  // Find time slots available for the selected date
  const getAvailableTimeSlots = () => {
    if (!service || !selectedDate) return []

    return service.time_slots.filter((slot: any) => {
      if (service.availability_type === 'frame') {
        // For frame type, check if day of week matches
        const dayOfWeek = selectedDate.format('dddd').toUpperCase()
        return slot.day_of_week === dayOfWeek
      } else if (service.availability_type === 'flex') {
        // For flex type, check if the date matches
        if (slot.date) {
          const slotDate = dayjs(slot.date)
          return slotDate.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
        }
      }
      return false
    })
  }

  const availableTimeSlots = getAvailableTimeSlots()

  // Format time for display (keep UTC hour, no local shift)
  const formatTime = (timeString: string) => dayjs.utc(timeString).format('hh:mm A')

  // Update locally booked slots when booking is successful
  useEffect(() => {
    if (bookingSuccess && recentlyBookedSlotId) {
      setLocallyBookedSlots(prev => [...prev, recentlyBookedSlotId])
    }
  }, [bookingSuccess, recentlyBookedSlotId])

  // Open BookReservationModal immediately when a time slot is selected
  useEffect(() => {
    if (selectedTimeSlot && onBookTimeSlot) {
      onBookTimeSlot(service, selectedTimeSlot, selectedDate)
      setShowServiceModal(false)
    }
  }, [selectedTimeSlot])

  // Check if a slot is locally marked as booked
  const isSlotLocallyBooked = (slotId: number) => {
    return locallyBookedSlots.includes(slotId)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-[500]">{service.service_name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-[500]">{selectedDate.format('MMM DD, YYYY')}</span>
        </div>
      </div>

      <h4 className="text-md mb-2 text-center font-medium">Available Time Slots</h4>

      {availableTimeSlots.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {availableTimeSlots.map((slot: any, index: number) => {
            const isBooked = slot?.is_active === false || isSlotLocallyBooked(slot.id)

            return (
              <Tooltip
                key={index}
                title={isBooked ? 'Already Booked' : 'Available'}
                placement="top"
                mouseEnterDelay={0.1}
                trigger="hover"
              >
                <div className="w-full" style={{display: 'inline-block', cursor: isBooked ? 'not-allowed' : 'pointer'}}>
                  <button
                    type="button"
                    onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                    disabled={isBooked}
                    className={`rounded-lg w-full border-2 border-[#EAECEF] px-2 py-2.5 text-[12px] font-medium md:px-3 md:text-sm ${
                      selectedTimeSlot?.id === slot.id
                        ? 'bg-black text-white hover:bg-black'
                        : isBooked
                          ? 'cursor-not-allowed bg-black text-white opacity-80'
                          : 'cursor-pointer hover:bg-gray-200'
                    }`}
                  >
                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  </button>
                </div>
              </Tooltip>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-500">No time slots available for this date.</p>
      )}

      {/* Footer with Back and Close buttons */}
      <div className="mt-6 flex justify-between gap-5">
        <CustomButton className="bg-gray-200 p-2 text-black hover:opacity-70" onClick={handleBackToCalendar}>
          Back to Calendar
        </CustomButton>
        <CustomButton
          className="border bg-white p-2 text-black hover:opacity-70"
          onClick={() => setShowServiceModal(false)}
        >
          Close
        </CustomButton>
      </div>
    </div>
  )
}

export default DetailTimeSelectionModal
