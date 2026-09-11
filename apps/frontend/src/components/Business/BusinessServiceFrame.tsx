import {Icon} from '@iconify/react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {useEffect, useState} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
import MultipleSelect from '../SharedUI/Input/MultipleSelect'
import SelectInput from '../SharedUI/Input/SelectInput'
import TextInput from '../SharedUI/Input/TextInput'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'

// Initialize dayjs with UTC plugin
dayjs.extend(utc)

interface IProps {
  showFrameModal: boolean
  setShowFrameModal: (showFrameModal: boolean) => void
  onSaveService?: (service: any) => void
  currentService?: any
}
interface TimeSlot {
  startTime: string
  endTime: string
}
interface DayTimeSlots {
  [dayKey: string]: {
    day: string
    slots: TimeSlot[]
  }
}
const BusinessServiceFrame = ({showFrameModal, setShowFrameModal, onSaveService, currentService}: IProps) => {
  const [dayTimeSlots, setDayTimeSlots] = useState<DayTimeSlots>({})
  const [serviceName, setServiceName] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [newSlot, setNewSlot] = useState<{startTime: string; endTime: string}>({
    startTime: '',
    endTime: ''
  })

  // Improved extract HH:mm directly from API string without timezone adjustments
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

  // Load existing time slots when editing a service
  useEffect(() => {
    console.log('Current service in frame:', currentService)
    if (currentService?.time_slots?.length) {
      // Set service name from current service
      setServiceName(currentService.service_name || '')

      // Create a map to organize time slots by day
      const slotsByDay: DayTimeSlots = {}

      // Process all time slots
      currentService.time_slots.forEach((slot: any) => {
        // Convert DAY_OF_WEEK to Title Case (e.g., MONDAY → Monday)
        const day = slot.day_of_week.charAt(0) + slot.day_of_week.slice(1).toLowerCase()

        if (!slotsByDay[day]) {
          slotsByDay[day] = {
            day,
            slots: []
          }
        }

        // Extract time using dayjs to avoid timezone issues
        const startTimeStr = extractTimeFromISO(slot.start_time)
        const endTimeStr = extractTimeFromISO(slot.end_time)

        console.log(`Extracted times: ${startTimeStr} - ${endTimeStr} from ${slot.start_time} - ${slot.end_time}`)

        slotsByDay[day].slots.push({
          startTime: startTimeStr,
          endTime: endTimeStr
        })
      })

      console.log('Processed slots by day:', slotsByDay)

      // Update state with the organized time slots
      setDayTimeSlots(slotsByDay)

      // Also update the selected days
      setSelectedDays(Object.keys(slotsByDay))

      // This is not a new/modified service yet
      setIsModified(false)
    } else {
      // Reset form if no current service
      resetForm()
    }
  }, [currentService])

  // Add a reset function to clear all form fields
  const resetForm = () => {
    setServiceName('')
    setSelectedDays([])
    setDayTimeSlots({})
    setNewSlot({startTime: '', endTime: ''})
    setIsModified(false)
  }

  // Ensure timeOptions also uses dayjs for consistency
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

  const handleTimeChange = (day: string, index: number, field: 'startTime' | 'endTime', value: any) => {
    const timeValue =
      typeof value === 'string' ? value : value && typeof value === 'object' && value.value ? value.value : null

    if (timeValue) {
      updateTimeSlot(day, index, field, timeValue)
    } else {
      console.error('Invalid time format received:', value)
    }
  }

  const updateTimeSlot = (day: string, index: number, field: 'startTime' | 'endTime', value: string) => {
    const dayData = dayTimeSlots[day]
    if (!dayData) return

    const updatedSlots = [...dayData.slots]

    // Create new slot with the updated field
    const updatedSlot = {
      ...updatedSlots[index],
      [field]: value
    }

    // If we're updating the end time, verify it's after the start time
    if (field === 'endTime') {
      const startParts = updatedSlot.startTime.split(':').map(Number)
      const endParts = value.split(':').map(Number)

      const startMinutes = startParts[0] * 60 + startParts[1]
      const endMinutes = endParts[0] * 60 + endParts[1]

      if (endMinutes <= startMinutes) {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={
                  <>
                    Your end time must be greater than your start time. For example, if starting at 2:00 PM, the end
                    time should be 2:15 PM or later.
                  </>
                }
                message="End time must be after start time"
                textColor="#FFF"
                backgroundColor="#000"
              />
            )
          },
          message: 'Invalid time slot'
        })
        return
      }
    }

    // If we're updating the start time, verify it's before the end time
    if (field === 'startTime') {
      const startParts = value.split(':').map(Number)
      const endParts = updatedSlot.endTime.split(':').map(Number)

      const startMinutes = startParts[0] * 60 + startParts[1]
      const endMinutes = endParts[0] * 60 + endParts[1]

      if (endMinutes <= startMinutes) {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText=""
                title={
                  <>
                    Your end time must be greater than your start time. For example, if starting at 2:00 PM, the end
                    time should be 2:15 PM or later.
                  </>
                }
                message="Start time must be before end time"
                textColor="#FFF"
                backgroundColor="#000"
              />
            )
          },
          message: 'Invalid time slot'
        })
        return
      }
    }

    updatedSlots[index] = updatedSlot

    setDayTimeSlots({
      ...dayTimeSlots,
      [day]: {
        ...dayData,
        slots: updatedSlots
      }
    })
    setIsModified(true)
  }

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setServiceName(newName)
    setIsModified(true)
  }

  const handleDaySelection = (selected: string[]) => {
    // Handle "Add all Days" special case
    if (selected.includes('Add all Days')) {
      selected = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
    setSelectedDays(selected)
    // Purge any slots for days no longer selected
    setDayTimeSlots(prev => {
      const filtered = Object.fromEntries(Object.entries(prev).filter(([day]) => selected.includes(day)))
      return filtered
    })
    setIsModified(true)
  }

  const handleNewSlotTime = (field: 'startTime' | 'endTime', value: any) => {
    const timeValue =
      typeof value === 'string' ? value : value && typeof value === 'object' && value.value ? value.value : null

    if (timeValue) {
      setNewSlot({...newSlot, [field]: timeValue})
    }
  }

  const addTimeSlot = () => {
    const {startTime, endTime} = newSlot

    if (!startTime || !endTime || selectedDays.length === 0) {
      return // Don't add incomplete slots
    }

    // Validate that end time is after start time
    const startParts = startTime.split(':').map(Number)
    const endParts = endTime.split(':').map(Number)

    const startMinutes = startParts[0] * 60 + startParts[1]
    const endMinutes = endParts[0] * 60 + endParts[1]

    if (endMinutes <= startMinutes) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  Your end time must be greater than your start time. For example, if starting at 2:00 PM, the end time
                  should be 2:15 PM or later.
                </>
              }
              message="End time must be after start time"
              textColor="#FFF"
              backgroundColor="#000"
            />
          )
        },
        message: 'Invalid time slot'
      })
      return
    }

    // Create a new copy of the time slots
    const updatedSlots = {...dayTimeSlots}

    // Add the time slot to all selected days
    selectedDays.forEach(day => {
      if (!updatedSlots[day]) {
        updatedSlots[day] = {
          day,
          slots: []
        }
      }

      updatedSlots[day].slots.push({
        startTime,
        endTime
      })
    })

    setDayTimeSlots(updatedSlots)
    setNewSlot({startTime: '', endTime: ''}) // Reset the new slot form
    setIsModified(true)
  }

  const addSlotToDay = (day: string) => {
    const updatedSlots = {...dayTimeSlots}

    if (!updatedSlots[day]) {
      return // Day doesn't exist in our data structure
    }

    updatedSlots[day].slots.push({
      startTime: '09:00',
      endTime: '10:00'
    })

    setDayTimeSlots(updatedSlots)
    setIsModified(true)
  }

  const removeTimeSlot = (day: string, index: number) => {
    const dayData = dayTimeSlots[day]
    if (!dayData) return

    const updatedSlots = [...dayData.slots]
    updatedSlots.splice(index, 1)

    setDayTimeSlots({
      ...dayTimeSlots,
      [day]: {
        ...dayData,
        slots: updatedSlots
      }
    })
    setIsModified(true)
  }

  const prepareServiceData = () => {
    const timeSlots = Object.entries(dayTimeSlots).flatMap(([dayKey, dayData]) => {
      return dayData.slots.map(slot => ({
        day_of_week: dayKey.toUpperCase(),
        start_time: slot.startTime,
        end_time: slot.endTime,
        date: null // Set date to null for frame-based availability
      }))
    })

    // Fix the ID logic to properly preserve existing IDs
    return {
      ...(currentService || {}),
      id: currentService?.id || (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      service_name: serviceName.trim(),
      availability_type: 'frame',
      time_slots: timeSlots
    }
  }

  const handleSave = () => {
    if (!serviceName.trim()) return

    // Validate all time slots to ensure end times are after start times
    let hasInvalidTimeSlots = false
    const invalidDays: string[] = []

    Object.entries(dayTimeSlots).forEach(([day, dayData]) => {
      dayData.slots.forEach((slot, index) => {
        // Convert times to comparable values (minutes since midnight)
        const startParts = slot.startTime.split(':').map(Number)
        const endParts = slot.endTime.split(':').map(Number)

        const startMinutes = startParts[0] * 60 + startParts[1]
        const endMinutes = endParts[0] * 60 + endParts[1]

        if (endMinutes <= startMinutes) {
          hasInvalidTimeSlots = true
          if (!invalidDays.includes(day)) {
            invalidDays.push(day)
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

    // Only check for duplicate names when creating a new service, not when editing
    if (!currentService?.id) {
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

    const serviceData = prepareServiceData()
    console.log('Saving service with ID:', serviceData.id, 'Is update:', !!currentService?.id)

    if (onSaveService) {
      onSaveService(serviceData)
    }

    // Clear all form fields after successful save
    resetForm()

    setShowFrameModal(false)
  }

  return (
    <div className="flex h-full min-h-[450px] w-full max-w-5xl flex-col justify-between">
      <div className="">
        <div className="flex w-full items-center justify-between pb-5">
          <h3 className="text-lg font-semibold">Set Availability</h3>
          <div className="">
            <CustomButton
              onClick={() => {
                resetForm() // Reset form when closing the modal
                // handleSave() // Save the service data
                setShowFrameModal(!showFrameModal)
              }}
              type="button"
              className="flex w-full items-center justify-center gap-1 rounded-[10px] border bg-white p-2 text-[14px] text-black hover:opacity-60"
            >
              <Icon icon="material-symbols:chevron-left-rounded" width="24" height="24" /> Back
            </CustomButton>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <TextInput
            title="Service Name*"
            placeholder="Enter Service Name"
            className="w-full bg-white text-[14px] text-black"
            type="text"
            name="serviceName"
            id="serviceName"
            required={true}
            onChange={handleServiceNameChange}
            value={serviceName}
          />
          <div className="flex flex-col items-center gap-y-4 lg:flex-row lg:gap-2">
            <div className="w-full">
              <MultipleSelect
                mode="multiple"
                onChange={handleDaySelection}
                options={[
                  {label: 'Monday', value: 'Monday'},
                  {label: 'Tuesday', value: 'Tuesday'},
                  {label: 'Wednesday', value: 'Wednesday'},
                  {label: 'Thursday', value: 'Thursday'},
                  {label: 'Friday', value: 'Friday'},
                  {label: 'Saturday', value: 'Saturday'},
                  {label: 'Sunday', value: 'Sunday'},
                  {label: 'Add all Days', value: 'Add all Days'}
                ]}
                defaultValue={selectedDays}
                placeholder="Select Day"
                optionLabelProps="label"
                optionFilterProp="label"
                backgroundColor="#fff"
                handleSearchSelect={() => {}}
                className="w-full border border-gray-300 bg-white text-[14px] text-black"
                size="large"
              />
            </div>

            <div className="flex w-full items-center justify-between gap-2 sm:flex-row sm:gap-2 lg:w-[80%]">
              <div className="flex w-full items-center gap-2 sm:mb-0 sm:w-auto">
                <SelectInput
                  data={timeOptions()}
                  value={newSlot.startTime || undefined}
                  onChange={value => handleNewSlotTime('startTime', value)}
                  className="w-[120px] bg-white py-1.5 md:w-[200px] lg:w-[150px]"
                  size="middle"
                  placeholder="Start time"
                />
                <span>-</span>
                <SelectInput
                  data={timeOptions()}
                  value={newSlot.endTime || undefined}
                  onChange={value => handleNewSlotTime('endTime', value)}
                  className="w-[120px] bg-white py-1.5 md:w-[200px] lg:w-[150px]"
                  size="middle"
                  placeholder="End time"
                />
              </div>
              <div className="w-full">
                <CustomButton
                  onClick={addTimeSlot}
                  type="button"
                  disabled={!newSlot.startTime || !newSlot.endTime || selectedDays.length === 0}
                  className="w-full rounded-[10px] bg-[#000000] px-1 py-[11px] text-[14px] text-white disabled:bg-gray-400"
                >
                  Add
                </CustomButton>
              </div>
            </div>
          </div>
        </div>

        {/* Selected dates - only shown after adding time slots */}
        {Object.keys(dayTimeSlots).length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(dayTimeSlots).map(([day, dayData]) => (
              <div key={day} className="mb-4 cursor-pointer rounded-lg bg-[#EEEEEE] p-2">
                <div className="flex items-center justify-between rounded-md bg-white p-2">
                  <p className="flex items-center gap-2 font-[500]">
                    <Icon
                      onClick={() => {
                        const updatedSlots = {...dayTimeSlots}
                        delete updatedSlots[day]
                        setDayTimeSlots(updatedSlots)
                        // also unselect in the multi‑select
                        setSelectedDays(prev => prev.filter(d => d !== day))
                        setIsModified(true)
                      }}
                      icon="ic:baseline-delete"
                      width="20"
                      height="20"
                      className="text-[#FF2D55]"
                    />
                    {day}
                  </p>
                  <Icon
                    icon="ic:round-plus"
                    width="24"
                    height="24"
                    onClick={() => addSlotToDay(day)}
                    className="cursor-pointer hover:opacity-75"
                  />
                </div>

                {dayData.slots.map((slot, index) => (
                  <div key={index} className="relative mt-3">
                    <div className="flex items-center justify-between">
                      <SelectInput
                        data={timeOptions()}
                        value={slot.startTime}
                        onChange={value => handleTimeChange(day, index, 'startTime', value)}
                        className="w-[130px] bg-white"
                        size="middle"
                        placeholder="Start time"
                      />
                      <span>-</span>
                      <SelectInput
                        data={timeOptions()}
                        value={slot.endTime}
                        onChange={value => handleTimeChange(day, index, 'endTime', value)}
                        className="w-[130px] bg-white"
                        size="middle"
                        placeholder="End time"
                      />
                      {dayData.slots.length > 1 && (
                        <button
                          onClick={() => removeTimeSlot(day, index)}
                          className="text-[#FF2D55] hover:opacity-50"
                          title="Remove time slot"
                        >
                          <Icon icon="material-symbols:close-rounded" width="24" height="24" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {dayData.slots.length === 0 && (
                  <div className="mt-3 text-center text-gray-500">No time slots added yet</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-center">
        <CustomButton
          onClick={handleSave}
          type="button"
          disabled={!serviceName.trim() || Object.values(dayTimeSlots).every(day => day.slots.length === 0)}
          className="rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white disabled:bg-gray-400 md:w-[20%]"
        >
          {currentService?.id ? 'Update Frame' : 'Add Frame'}
        </CustomButton>
      </div>
    </div>
  )
}

export default BusinessServiceFrame
