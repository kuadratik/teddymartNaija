import type {CalendarProps} from 'antd'
import {Calendar, theme} from 'antd'
import dayjs, {Dayjs} from 'dayjs'
import React, {useEffect, useRef, useState} from 'react'

interface BusinessCalenderProps {
  onSelectDate?: (date: Dayjs) => void
  onSelectMultipleDates?: (dates: Dayjs[]) => void
  setShowCalender?: React.Dispatch<React.SetStateAction<boolean>>
  setShowTime?: React.Dispatch<React.SetStateAction<boolean>>
  selectedDates?: any[] // now accept objects
}

const BusinessCalender: React.FC<BusinessCalenderProps> = ({
  onSelectDate,
  onSelectMultipleDates,
  setShowCalender,
  setShowTime,
  selectedDates = []
}) => {
  const {token} = theme.useToken()
  const isUserClick = useRef(false)

  // helper to normalize any entry to Dayjs
  const toDayjs = (d: any): Dayjs => {
    if (d?.originalDate) return dayjs(d.originalDate) // ← wrap Date in dayjs
    if (d?.fullDate) return dayjs(d.fullDate)
    if (typeof d === 'string') return dayjs(d)
    return dayjs()
  }

  // use normalized dates
  const [internalSelectedDates, setInternalSelectedDates] = useState<Dayjs[]>(() => selectedDates.map(toDayjs))
  console.log('🚀 ~ internalSelectedDates:', internalSelectedDates)
  const [validationError, setValidationError] = useState<string>('')

  // log whenever state changes
  useEffect(() => {
    console.log('🛠️ internalSelectedDates changed:', internalSelectedDates)
  }, [internalSelectedDates])

  useEffect(() => {
    const mapped = selectedDates.map(toDayjs)
    setInternalSelectedDates(mapped)
  }, [selectedDates])

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG
  }

  // Handle date selection
  const handleDateSelect = (date: Dayjs) => {
    // debug entry
    console.log('🛠️ handleDateSelect called with:', date.format(), 'isUserClick:', isUserClick.current)

    // Only process selection if it's from a user click
    if (!isUserClick.current) {
      return
    }

    // Reset the flag
    isUserClick.current = false

    // Clear any error message when user makes a selection
    setValidationError('')

    // Check if the date is already selected
    const dateStr = date.format('YYYY-MM-DD')
    const dateIndex = internalSelectedDates.findIndex(d => d.format('YYYY-MM-DD') === dateStr)

    // Consolidate the updatedDates declaration and assignment
    const updatedDates: Dayjs[] =
      dateIndex >= 0 ? internalSelectedDates.filter((_, i) => i !== dateIndex) : [...internalSelectedDates, date]

    // now guaranteed defined
    console.log(
      '🛠️ computed updatedDates:',
      updatedDates.map(d => d.format())
    )

    setInternalSelectedDates(updatedDates)

    // Call the callback with updated dates
    if (onSelectMultipleDates) {
      onSelectMultipleDates(updatedDates)
    }

    // For single-date backwards compatibility
    if (onSelectDate) {
      onSelectDate(date)
    }
  }

  // Handle panel change (month/year navigation)
  const handlePanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }

  const handleDoneSelecting = () => {
    // Validate that at least one date is selected
    if (internalSelectedDates.length === 0) {
      setValidationError('Please select at least one date before proceeding')
      return
    }

    // Log the exact dates being passed to verify
    console.log(
      'Calendar dates selected:',
      internalSelectedDates.map(d => d.format('YYYY-MM-DD'))
    )

    // Close calendar and open time selector
    if (setShowCalender && setShowTime) {
      setShowCalender(false)

      // Make sure we're passing the complete date objects with year/month/day
      if (onSelectMultipleDates) {
        // Clone the dates to ensure we don't lose reference
        const datesWithFullInfo = internalSelectedDates.map(d => d.clone())
        console.log('🚀 ~ handleDoneSelecting ~ datesWithFullInfo:', datesWithFullInfo)
        onSelectMultipleDates(datesWithFullInfo)
      }
      setShowTime(true)
    }
  }

  // Custom date cell renderer to highlight selected dates
  const dateCellRender = (date: Dayjs) => {
    const isSelected = internalSelectedDates.some(
      selectedDate => selectedDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    )

    return (
      <div
        className={`h-full w-full ${isSelected ? 'rounded-full bg-black text-white' : ''}`}
        onClick={() => {
          isUserClick.current = true
        }}
      >
        {date.date()}
      </div>
    )
  }

  // Custom header to show only month with forward/backward arrows
  const headerRender: CalendarProps<Dayjs>['headerRender'] = ({value, onChange}) => {
    const prevMonth = () => {
      onChange(value.clone().subtract(1, 'month'))
    }
    const nextMonth = () => {
      onChange(value.clone().add(1, 'month'))
    }
    return (
      <div className="flex items-center justify-between" style={{padding: 8}}>
        <button onClick={prevMonth} style={{border: 'none', background: 'none', cursor: 'pointer', fontSize: 18}}>
          &lt;
        </button>
        <span style={{fontWeight: 500, fontSize: 16}}>{value.format('MMMM YYYY')}</span>
        <button onClick={nextMonth} style={{border: 'none', background: 'none', cursor: 'pointer', fontSize: 18}}>
          &gt;
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div style={wrapperStyle}>
        <Calendar
          fullscreen={false}
          onPanelChange={handlePanelChange}
          headerRender={headerRender}
          onSelect={handleDateSelect}
          fullCellRender={dateCellRender}
          mode="month"
        />
      </div>
      <div className="mt-2 flex flex-col">
        {validationError && <p className="mb-2 text-sm text-red-500">{validationError}</p>}
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-[500]">
            {new Set(internalSelectedDates.map(date => date.format('YYYY-MM-DD'))).size} dates selected
          </p>
          <button
            onClick={handleDoneSelecting}
            className={`w-[200px] rounded-lg px-4 py-2 text-center ${
              internalSelectedDates.length > 0 ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default BusinessCalender
