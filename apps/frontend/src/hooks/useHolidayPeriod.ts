import {isHolidayPeriod} from '@/utils/fx'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import {useEffect, useState} from 'react'

dayjs.extend(isBetween)

export const useHolidayPeriod = () => {
  const [isHolidaySeason, setIsHolidaySeason] = useState(false)

  useEffect(() => {
    // Check initially
    setIsHolidaySeason(isHolidayPeriod())

    // Set up an interval to check every hour
    const interval = setInterval(() => {
      setIsHolidaySeason(isHolidayPeriod())
    }, 3600000) // Check every hour

    return () => clearInterval(interval)
  }, [])

  return isHolidaySeason
}
