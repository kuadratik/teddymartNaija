import {Icon} from '@iconify/react'
import {addMinutes, format, isAfter, parse, parseISO} from 'date-fns'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import React, {useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import CustomButton from '../SharedUI/Buttons/Button'
import SelectInput from '../SharedUI/Input/SelectInput'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'

// Initialize dayjs with UTC plugin
dayjs.extend(utc)

interface TimeSlot {
  startTime: Date
  endTime: Date
}

interface DateTimeSlots {
  [dateKey: string]: {
    slots: TimeSlot[]
    date: string // YYYY-MM-DD format
  }
}

interface IProps {
  setShowTime: React.Dispatch<React.SetStateAction<boolean>>
  setShowCalender: React.Dispatch<React.SetStateAction<boolean>>
  selectedDates?: any[]
  currentService?: any
  onSaveService?: (service: any) => void
}

const BusinessTime = ({setShowTime, setShowCalender, selectedDates = [], currentService, onSaveService}: IProps) => {
  console.log('🚀 ~ BusinessTime ~ selectedDates:', selectedDates)
  const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlots>({})
  console.log('🚀 ~ BusinessTime ~ dateTimeSlots:', dateTimeSlots)
  const [serviceName, setServiceName] = useState('')
  const [isModified, setIsModified] = useState(false)
  const isEditMode = Boolean(currentService)

  console.log('BusinessTime received dates:', selectedDates)

  const extractDateInfo = (dateInput: any) => {
    console.log('Extracting date info from:', dateInput)

    if (dateInput && typeof dateInput === 'object' && dateInput.fullDate) {
      console.log('Using exact date from fullDate property:', dateInput.fullDate)
      return {
        displayKey: dateInput.display || '',
        dateStr: dateInput.fullDate
      }
    }

    if (dateInput && (dateInput._isAMomentObject || dateInput._isUTC || dateInput.$d)) {
      const dateStr = dateInput.format ? dateInput.format('YYYY-MM-DD') : format(new Date(dateInput), 'yyyy-MM-dd')
      console.log('Using exact date from date object:', dateStr)
      return {
        displayKey: dateInput.format ? dateInput.format('dddd Do') : format(new Date(dateInput), 'EEEE do'),
        dateStr: dateStr
      }
    }

    if (typeof dateInput === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        console.log('Using provided ISO date string:', dateInput)
        return {
          displayKey: format(parseISO(dateInput), 'EEEE do'),
          dateStr: dateInput
        }
      }

      console.log('Warning: Using display format string, may lose exact date:', dateInput)
      return {
        displayKey: dateInput,
        dateStr: format(new Date(), 'yyyy-MM-dd')
      }
    }

    console.warn('Could not extract date info, using current date')
    return {
      displayKey: format(new Date(), 'EEEE do'),
      dateStr: format(new Date(), 'yyyy-MM-dd')
    }
  }

  // Improved extract HH:mm from ISO time string without timezone adjustments
  const extractTimeFromISO = (iso: string): string => {
    // If already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(iso)) return iso

    // Use direct string extraction for ISO strings to avoid any timezone conversion
    if (iso.includes('T')) {
      return iso.split('T')[1].substring(0, 5)
    }

    // For other formats, use dayjs to parse in UTC and format without timezone conversion
    try {
      return dayjs.utc(iso).format('HH:mm')
    } catch (e) {
      console.error('Failed to parse time:', iso, e)
      return iso || '00:00'
    }
  }

  useEffect(() => {
    // reset modified state and service name
    setIsModified(false)
    setServiceName(currentService?.service_name || '')

    const slots: DateTimeSlots = {}

    // 1. Group existing service.time_slots (if any)
    if (currentService?.time_slots?.length) {
      const timeSlotsByDate: Record<string, any[]> = {}
      currentService.time_slots.forEach((slot: any) => {
        timeSlotsByDate[slot.date] = timeSlotsByDate[slot.date] || []
        timeSlotsByDate[slot.date].push(slot)
      })
      Object.entries(timeSlotsByDate).forEach(([dateStr, slotsArr]) => {
        const date = parseISO(dateStr)
        const displayKey = format(date, 'EEEE do')
        slots[displayKey] = {
          date: dateStr,
          slots: slotsArr.map((s: any) => {
            const startTimeStr = extractTimeFromISO(s.start_time)
            const endTimeStr = extractTimeFromISO(s.end_time)
            return {
              startTime: parse(startTimeStr, 'HH:mm', date),
              endTime: parse(endTimeStr, 'HH:mm', date)
            }
          })
        }
      })
    }

    // 2. Always add any newly selectedDates not already in slots
    selectedDates.forEach((dateInput: any) => {
      const {displayKey, dateStr} = extractDateInfo(dateInput)
      if (!slots[displayKey]) {
        try {
          const date = parseISO(dateStr)
          slots[displayKey] = {
            date: dateStr,
            slots: [
              {
                startTime: parse('09:00', 'HH:mm', date),
                endTime: parse('10:00', 'HH:mm', date)
              }
            ]
          }
        } catch {
          // ignore parse errors
        }
      }
    })

    setDateTimeSlots(slots)
  }, [selectedDates, currentService])

  const addTimeSlot = (displayKey: string) => {
    const dateData = dateTimeSlots[displayKey]
    if (!dateData) return

    const currentSlots = dateData.slots || []
    const lastSlot = currentSlots[currentSlots.length - 1]
    const date = parseISO(dateData.date)

    const newStartTime = lastSlot ? addMinutes(lastSlot.endTime, 0) : parse('09:00', 'HH:mm', date)
    const newEndTime = addMinutes(newStartTime, 60)

    const updatedSlots = {
      ...dateTimeSlots,
      [displayKey]: {
        ...dateData,
        slots: [...currentSlots, {startTime: newStartTime, endTime: newEndTime}]
      }
    }

    setDateTimeSlots(updatedSlots)
    setIsModified(true)
  }

  const updateTimeSlot = (displayKey: string, index: number, field: 'startTime' | 'endTime', value: string) => {
    try {
      if (!value || typeof value !== 'string') return

      const dateData = dateTimeSlots[displayKey]
      if (!dateData) return

      const currentSlots = [...dateData.slots]
      const date = parseISO(dateData.date)

      const timeDate = parse(value, 'HH:mm', date)

      if (isNaN(timeDate.getTime())) return

      // More robust validation with clear error messaging
      if (field === 'endTime') {
        if (!isAfter(timeDate, currentSlots[index].startTime)) {
          // showPlannerToast({
          //   options: {
          //     customToast: (
          //       <CustomToast
          //         altText=""
          //         title={<>Invalid time slot, end time must be after start time</>}
          //         message="End time must be after start time"
          //         textColor="#FFF"
          //         backgroundColor="#000"
          //       />
          //     )
          //   },
          //   message: 'Invalid time slot'
          // })
          // Set a valid end time instead of allowing invalid input
          currentSlots[index].endTime = addMinutes(currentSlots[index].startTime, 30)
          return
        }
        currentSlots[index].endTime = timeDate
      }

      if (field === 'startTime') {
        if (!isAfter(currentSlots[index].endTime, timeDate)) {
          // showPlannerToast({
          //   options: {
          //     customToast: (
          //       <CustomToast
          //         altText=""
          //         title={
          //           <>
          //             Your end time must be greater than your start time. For example, if starting at 2:00 PM, the end
          //             time should be 2:15 PM or later.
          //           </>
          //         }
          //         message="Start time must be before end time"
          //         textColor="#FFF"
          //         backgroundColor="#000"
          //       />
          //     )
          //   },
          //   message: 'Invalid time slot'
          // })
          // Set a valid start time instead of allowing invalid input
          currentSlots[index].startTime = addMinutes(currentSlots[index].endTime, -30)
          return
        }
        currentSlots[index].startTime = timeDate
      }

      const updatedSlots = {
        ...dateTimeSlots,
        [displayKey]: {
          ...dateData,
          slots: currentSlots
        }
      }

      setDateTimeSlots(updatedSlots)
      setIsModified(true)
    } catch (error) {
      console.error('Error updating time slot:', error)
    }
  }

  const removeTimeSlot = (displayKey: string, index: number) => {
    const dateData = dateTimeSlots[displayKey]
    if (!dateData) return

    const currentSlots = dateData.slots

    if (currentSlots.length > 1) {
      const updatedSlots = {
        ...dateTimeSlots,
        [displayKey]: {
          ...dateData,
          slots: currentSlots.filter((_, i) => i !== index)
        }
      }

      setDateTimeSlots(updatedSlots)
      setIsModified(true)
    }
  }

  const prepareServiceData = (slots: DateTimeSlots, name: string) => {
    const formattedTimeSlots = Object.entries(slots).flatMap(([displayKey, dateData]) => {
      const {slots: timeSlots, date: dateStr} = dateData

      let date
      try {
        date = parseISO(dateStr)
        console.log(`Preparing data for date: ${dateStr} (${format(date, 'EEEE')})`)
      } catch (e) {
        console.error(`Error parsing date: ${dateStr}`, e)
        date = new Date()
      }

      const dayOfWeek = format(date, 'EEEE').toUpperCase()

      return timeSlots.map(slot => {
        return {
          day_of_week: dayOfWeek,
          start_time: format(slot.startTime, 'HH:mm'),
          end_time: format(slot.endTime, 'HH:mm'),
          date: dateStr
        }
      })
    })

    console.log('Final formatted time slots:', formattedTimeSlots)

    const serviceId = currentService?.id || (crypto.randomUUID ? crypto.randomUUID() : uuidv4())
    return {
      ...(currentService || {}),
      id: serviceId,
      service_name: name.trim(),
      availability_type: 'flex',
      time_slots: formattedTimeSlots
    }
  }

  // Update timeOptions to use dayjs for consistency
  const timeOptions = () => {
    const options = []

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const formattedTime = dayjs(`2023-01-01T${timeString}`).format('h:mm A')

        options.push({
          value: timeString,
          label: formattedTime
        })
      }
    }

    return options
  }

  const handleTimeChange = (displayKey: string, index: number, field: 'startTime' | 'endTime', value: any) => {
    const timeValue =
      typeof value === 'string' ? value : value && typeof value === 'object' && value.value ? value.value : null

    if (timeValue) {
      updateTimeSlot(displayKey, index, field, timeValue)
    } else {
      console.error('Invalid time format received:', value)
    }
  }

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setServiceName(newName)
    setIsModified(true)
  }

  const handleSave = () => {
    if (!serviceName.trim()) return

    // Validate all time slots to ensure end times are after start times
    let hasInvalidTimeSlots = false
    const invalidDays: string[] = []

    Object.entries(dateTimeSlots).forEach(([displayKey, dateData]) => {
      if (!dateData.slots) return

      dateData.slots.forEach(slot => {
        if (!isAfter(slot.endTime, slot.startTime)) {
          hasInvalidTimeSlots = true
          if (!invalidDays.includes(displayKey)) {
            invalidDays.push(displayKey)
          }
        }
      })
    })

    // Show error toast for invalid time slots
    if (hasInvalidTimeSlots) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  Invalid time slots. Please fix time slots with end time before or equal to start time for{' '}
                  {invalidDays.join(', ')}
                </>
              }
              message={`Please fix time slots with end time before or equal to start time for ${invalidDays.join(', ')}`}
              textColor="#FFF"
              backgroundColor="#000"
            />
          )
        },
        message: 'Invalid time slots'
      })
      return // Stop execution if invalid time slots found
    }

    // Only check for duplicate names when creating a new service (not in edit mode)
    if (!isEditMode) {
      // Get the current services from the parent component
      const existingServices = window.localStorage.getItem('businessData')
        ? JSON.parse(window.localStorage.getItem('businessData') || '{}')?.services || []
        : []

      // Find any service with the same name (case insensitive comparison)
      const isDuplicate = existingServices.some(
        (service: any) => service.service_name.toLowerCase() === serviceName.trim().toLowerCase()
      )

      if (isDuplicate) {
        // Show toast notification for duplicate name
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={<>Service name already exists.Please use a different service name.</>}
                message="Please use a different service name."
                textColor="#FFF"
                backgroundColor="#000"
              />
            )
          },
          message: 'Duplicate service name'
        })
        return // Stop execution if duplicate found
      }
    }

    const updatedService = prepareServiceData(dateTimeSlots, serviceName)
    if (onSaveService) onSaveService(updatedService)
    setShowTime(false)

    if (!isEditMode) {
      setServiceName('')
      setDateTimeSlots({})
    }
  }

  if (selectedDates.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Time</h3>
          <button
            title="close"
            type="button"
            onClick={() => setShowTime(false)}
            className="ml-auto rounded-full py-1 text-black hover:opacity-75"
          >
            <Icon icon="material-symbols:close-rounded" width="24" height="24" />
          </button>
        </div>

        <div className="my-6 flex flex-col items-center justify-center rounded-lg bg-[#EEEEEE] p-6 text-center">
          <Icon icon="mdi:calendar-alert" width="48" height="48" className="mb-3 text-gray-500" />
          <p className="mb-4 text-lg font-medium">No dates selected</p>
          <p className="mb-6 text-sm text-gray-600">Please select at least one date from the calendar.</p>
          <CustomButton
            onClick={() => {
              setShowTime(false)
              setShowCalender(true)
            }}
            className="rounded-lg border border-black bg-black py-3 text-white hover:opacity-75"
          >
            Go to Calendar
          </CustomButton>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add Time</h3>
        <button
          title="close"
          type="button"
          onClick={() => setShowTime(false)}
          className="ml-auto rounded-full py-1 text-black hover:opacity-75"
        >
          <Icon icon="material-symbols:close-rounded" width="24" height="24" />
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Service Name*"
          value={serviceName}
          onChange={handleServiceNameChange}
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {Object.entries(dateTimeSlots).map(([displayKey, dateData]) => (
          <div key={displayKey} className="mb-4 cursor-pointer rounded-lg bg-[#EEEEEE] p-2">
            <div className="flex items-center justify-between rounded-md bg-white p-2">
              <p className="flex items-center gap-2 font-[500]">
                {Object.keys(dateTimeSlots).length > 1 && (
                  <Icon
                    onClick={() => {
                      const updated = {...dateTimeSlots}
                      delete updated[displayKey]
                      setDateTimeSlots(updated)
                      setIsModified(true)
                    }}
                    icon="ic:baseline-delete"
                    width="20"
                    height="20"
                    className="text-[#FF2D55]"
                  />
                )}
                {displayKey}
              </p>
              <Icon
                icon="ic:round-plus"
                width="24"
                height="24"
                onClick={() => addTimeSlot(displayKey)}
                className="cursor-pointer hover:opacity-75"
              />
            </div>

            {dateData?.slots?.map((slot, index) => (
              <div key={index} className="relative mt-3">
                <div className="flex items-center justify-between">
                  <SelectInput
                    data={timeOptions()}
                    value={format(slot.startTime, 'HH:mm')}
                    onChange={value => handleTimeChange(displayKey, index, 'startTime', value)}
                    className="w-[130px] bg-white"
                    size="middle"
                    placeholder="Start time"
                  />
                  <span>-</span>
                  <SelectInput
                    data={timeOptions()}
                    value={format(slot.endTime, 'HH:mm')}
                    onChange={value => handleTimeChange(displayKey, index, 'endTime', value)}
                    className="w-[130px] bg-white"
                    size="middle"
                    placeholder="End time"
                  />
                  {dateData.slots.length > 1 && (
                    <button
                      onClick={() => removeTimeSlot(displayKey, index)}
                      className="text-[#FF2D55] hover:opacity-50"
                      title="Remove time slot"
                    >
                      <Icon icon="material-symbols:close-rounded" width="24" height="24" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-5">
        <CustomButton
          onClick={() => {
            if (isEditMode) {
              setShowTime(false)
            } else {
              setShowTime(false)
              setShowCalender(true)
            }
          }}
          className="rounded-lg border border-black bg-white py-3 text-black hover:opacity-75"
        >
          {isEditMode ? 'Close' : 'Back'}
        </CustomButton>
        <CustomButton
          disabled={!serviceName.trim()}
          onClick={handleSave}
          className={`rounded-lg border border-black py-3 text-white hover:opacity-75 ${
            !serviceName.trim() ? 'bg-gray-400' : isModified ? 'bg-black' : 'bg-black'
          }`}
        >
          {isModified ? 'Save Changes' : 'Save'}
        </CustomButton>
      </div>
    </div>
  )
}

export default BusinessTime
