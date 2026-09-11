import {useAppSelector} from '@/hooks/reduxHooks'
import {useBookServiceSlotMutation} from '@/services/myBussiness'
import {Calendar, CalendarProps, Popover, theme, Tooltip} from 'antd'
import dayjs, {Dayjs} from 'dayjs'
import {useEffect, useRef, useState} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
import PlannerModal from '../SharedUI/ModalComponent'
import Spinner from '../SharedUI/Spinner'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import BookReservationModal from './BookReservationModal'
import DetailServiceSuccessModal from './DetailServiceSuccessModal'
import DetailTimeSelectionModal from './DetailTimeSelectionModal'

interface IProps {
  data: any
  refetch: () => void
  isLoadingStartConversation: boolean
  startConversation: (params: any) => void
  isSuccessConversation: boolean
}

const DetailServiceAvailabilityCard = ({
  data,
  refetch,
  isLoadingStartConversation,
  startConversation,
  isSuccessConversation
}: IProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [showBookingSuccessModal, setShowBookingSuccessModal] = useState(false)
  const [showBookReservationModal, setShowBookReservationModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null) // Add state for selected time slot
  const [bookingData, setBookingData] = useState<any>(null) // Add state for booking data
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [recentlyBookedSlotId, setRecentlyBookedSlotId] = useState<number | null>(null)
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const [showMessageVendorModal, setShowMessageVendorModal] = useState(false)
  const bookingDate = bookingData?.data?.date

  // Change initial messageVendor to empty string
  const [messageVendor, setMessageVendor] = useState('')

  // Whenever bookingDate changes, rebuild the vendor message with the formatted date
  useEffect(() => {
    const formatted = bookingDate ? dayjs(bookingDate).format('MMM DD, YYYY') : ''
    setMessageVendor(
      `Hello,

I have booked a reservation for ${formatted}. Let me know if there is anything I should prepare for or be aware of before then.

Thanks.`
    )
  }, [bookingDate])

  const isAuth = isAuthenticatedToken
  const [localServiceAvailabilities, setLocalServiceAvailabilities] = useState<any[]>(
    data?.data?.service_availabilities || []
  )
  console.log('🚀 ~ DetailServiceAvailabilityCard ~ bookingData:', bookingData)
  const [
    bookServiceSlot,
    {isLoading: isBookingLoading, isSuccess: isBookingSuccess, isError: isBookingError, error: bookingError}
  ] = useBookServiceSlotMutation()
  const [formValues, setFormValues] = useState({
    business_service_id: null,
    service_time_id: null,
    cus_phone_number: '',
    cus_email: '',
    cus_fullname: ''
  })
  useEffect(() => {
    setLocalServiceAvailabilities(data?.data?.service_availabilities || [])
  }, [data])
  useEffect(() => {
    if (isSuccessConversation) {
      setShowMessageVendorModal(false)
    }
  }, [isSuccessConversation])
  // Get service availabilities from data
  const serviceAvailabilities = data?.data?.service_availabilities || []

  // Function to handle going back to calendar from time selection
  const handleBackToCalendar = () => {
    setShowTimeModal(false)
    setPopoverOpen(true)
  }

  // Function to handle booking a time slot
  const handleBookTimeSlot = (service: any, timeSlot: any, date: Dayjs) => {
    const bookingData = {
      data: {
        business_service_id: service.id,
        service_time_id: timeSlot.id,
        service: service,
        timeSlot: timeSlot,
        date: date
      }
    }
    setBookingData(bookingData)
    setSelectedTimeSlot(timeSlot)
    setRecentlyBookedSlotId(timeSlot.id) // Store the slot ID for reference
    setShowBookReservationModal(true)
  }

  // Disable the just‑booked slot locally
  const handleBookingSuccess = () => {
    if (selectedService && selectedTimeSlot) {
      setLocalServiceAvailabilities(prev =>
        prev.map(s =>
          s.id === selectedService.id
            ? {
                ...s,
                time_slots: s.time_slots.map((ts: any) =>
                  ts.id === selectedTimeSlot.id ? {...ts, is_active: false} : ts
                )
              }
            : s
        )
      )
    }
  }

  // Reset booking success state when modal closes
  useEffect(() => {
    if (!showBookReservationModal) {
      setBookingSuccess(false)
    }
  }, [showBookReservationModal])

  return (
    <>
      {localServiceAvailabilities.map((service: any, index: number) => (
        <div
          key={index}
          className="relative flex items-center justify-between rounded-lg border border-[#EAECEF] bg-white p-3 shadow-f1"
        >
          <Tooltip
            title={service.availability_type === 'frame' ? 'Recurring schedule' : 'Flexible schedule'}
            placement="top"
            color="#000000"
            arrow={{pointAtCenter: true}}
          >
            <p className="text-sm font-[500]">
              {service.service_name.length > 30 ? service.service_name.slice(0, 30) + '...' : service.service_name}
            </p>
          </Tooltip>

          <div className="">
            <div className="flex items-center justify-between gap-2 border-l-2 border-[#EAECEF] pl-5">
              <div className="">
                {isAuth ? (
                  <Popover
                    content={
                      <div style={{padding: 0}}>
                        <SingleServiceCalender
                          service={service}
                          onSelectDate={(date: any) => {
                            setSelectedDate(date)
                            setPopoverOpen(false)
                            setShowTimeModal(true)
                            setSelectedService(service)
                          }}
                          setShowCalender={setPopoverOpen}
                        />
                      </div>
                    }
                    trigger="click"
                    open={popoverOpen && selectedService?.id === service.id}
                    onOpenChange={open => {
                      setPopoverOpen(open)
                      if (open) {
                        setSelectedService(service)
                      }
                    }}
                    styles={{
                      root: {
                        padding: 0,
                        margin: 0
                      }
                    }}
                  >
                    <CustomButton
                      className="bg-black p-2 text-white"
                      onClick={() => {
                        setSelectedService(service)
                        setPopoverOpen(true)
                      }}
                    >
                      Check Availability
                    </CustomButton>
                  </Popover>
                ) : (
                  <CustomButton
                    className="bg-black p-2 text-white"
                    onClick={() => {
                      showPlannerToast({
                        options: {
                          customToast: (
                            <CustomToast
                              altText={''}
                              title={<>You are not authenticated, please login.</>}
                              image={'/assets/states/notificationToasts/successcheck.svg'}
                              textColor="#fff"
                              message=""
                              backgroundColor="#000"
                            />
                          )
                        },
                        message: 'Copied'
                      })
                    }}
                  >
                    Check Availability
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {showTimeModal && selectedService && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <PlannerModal
            title=""
            modalOpen={showTimeModal}
            onCloseModal={() => {
              setShowTimeModal(false)
              setPopoverOpen(false)
            }}
            width={600}
            setModalOpen={setShowTimeModal}
            maskCloseable={true}
            className="rounded-lg"
          >
            <DetailTimeSelectionModal
              selectedDate={selectedDate}
              service={selectedService}
              setShowServiceModal={setShowTimeModal}
              handleBackToCalendar={handleBackToCalendar}
              onBookTimeSlot={handleBookTimeSlot}
              bookingSuccess={bookingSuccess}
              recentlyBookedSlotId={recentlyBookedSlotId}
            />
          </PlannerModal>
        </div>
      )}

      <>
        <PlannerModal
          modalOpen={showBookReservationModal}
          setModalOpen={setShowBookReservationModal}
          maskCloseable={true}
          onCloseModal={() => {
            setShowBookReservationModal(false)
          }}
          width={400}
          className="rounded-lg"
        >
          <BookReservationModal
            setShowBookingSuccessModal={setShowBookingSuccessModal}
            bookServiceSlot={bookServiceSlot}
            formValues={formValues}
            setFormValues={setFormValues}
            isBookingLoading={isBookingLoading}
            setShowTimeModal={setShowTimeModal}
            showBookReservationModal={showBookReservationModal}
            setShowBookReservationModal={setShowBookReservationModal}
            data={bookingData}
            refetch={refetch!}
            businessData={data}
            setShowCalender={setPopoverOpen}
            onBookingSuccess={handleBookingSuccess}
          />
        </PlannerModal>
      </>
      <>
        {bookingData && (
          <PlannerModal
            modalOpen={showBookingSuccessModal}
            setModalOpen={setShowBookingSuccessModal}
            maskCloseable={true}
            onCloseModal={() => {
              setShowBookingSuccessModal(false)
            }}
            width={400}
            className="rounded-lg"
          >
            <DetailServiceSuccessModal
              setShowMessageVendorModal={setShowMessageVendorModal}
              setShowBookingSuccessModal={setShowBookingSuccessModal}
              formValues={formValues}
              data={bookingData}
            />
          </PlannerModal>
        )}
      </>
      <>
        <PlannerModal
          modalOpen={showMessageVendorModal}
          setModalOpen={setShowMessageVendorModal}
          title="Send a message"
          width={450}
          className="rounded-[10px]"
          onCloseModal={() => setShowMessageVendorModal(false)}
        >
          <div className="my-3 whitespace-pre-line rounded-md border border-[#E4E7EC] p-2 text-[14px]">
            {messageVendor}
          </div>
          <div className="mt-6 flex w-full gap-4">
            <div className="w-full">
              <CustomButton
                onClick={() => {
                  setShowMessageVendorModal(false)
                }}
                className="w-full rounded-[10px] border border-black bg-white px-3 py-3 text-sm font-[500] text-black"
              >
                Close
              </CustomButton>
            </div>
            <div className="w-full">
              <CustomButton
                className="rounded-lg bg-black py-3 text-sm text-white"
                onClick={() => {
                  if (isAuth) {
                    // Make sure we're sending the current message value
                    const currentMessage = messageVendor
                    startConversation({
                      body: {
                        user_id: String(data?.data?.user_id ?? ''),
                        advert_id: '',
                        listing_id: String(data?.data?.id ?? ''),
                        message: currentMessage
                      },
                      convoRoute: 'directory',
                      isRedirect: false
                    })
                  }
                }}
              >
                {isLoadingStartConversation ? <Spinner /> : 'Send Message'}
              </CustomButton>
            </div>
          </div>
        </PlannerModal>
      </>
    </>
  )
}

export default DetailServiceAvailabilityCard

const SingleServiceCalender: React.FC<any> = ({service, onSelectDate, setShowCalender}) => {
  const {token} = theme.useToken()
  const isUserClick = useRef(false)
  const [currentMonth, setCurrentMonth] = useState(dayjs())

  // Determine available days based on service type
  const getAvailableDays = () => {
    const availableDays: string[] = []
    const availableDates: Dayjs[] = []

    if (service) {
      service.time_slots.forEach((slot: any) => {
        if (service.availability_type === 'frame' && slot.date === null) {
          // For frame type, add the day of week
          availableDays.push(slot.day_of_week)
        } else if (service.availability_type === 'flex' && slot.date) {
          // For flex type, add the specific date
          availableDates.push(dayjs(slot.date))
        }
      })
    }

    return {availableDays, availableDates}
  }

  const {availableDays, availableDates} = getAvailableDays()

  // Check if a date is available
  const isDateAvailable = (date: Dayjs) => {
    // For frame type (recurring), check if day of week matches
    if (service.availability_type === 'frame') {
      const dayOfWeek = date.format('dddd').toUpperCase()
      return availableDays.includes(dayOfWeek)
    }
    // For flex type, check if specific date matches
    else if (service.availability_type === 'flex') {
      return availableDates.some(availableDate => availableDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'))
    }
    return false
  }

  const handleDateSelect = (date: Dayjs) => {
    if (!isUserClick.current) {
      return
    }
    isUserClick.current = false

    if (isDateAvailable(date)) {
      onSelectDate(date)
    }
  }

  // Custom date cell renderer to highlight available dates
  const dateCellRender = (date: Dayjs) => {
    const isAvailable = isDateAvailable(date)

    return (
      <div
        className={`flex h-full w-full items-center justify-center font-[500] ${
          isAvailable
            ? 'cursor-pointer rounded-full bg-black text-white hover:bg-gray-200'
            : 'cursor-not-allowed text-gray-300'
        }`}
        onClick={() => {
          if (isAvailable) {
            isUserClick.current = true
          }
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
      setCurrentMonth(value.clone().subtract(1, 'month'))
    }
    const nextMonth = () => {
      onChange(value.clone().add(1, 'month'))
      setCurrentMonth(value.clone().add(1, 'month'))
    }
    return (
      <div className="flex items-center justify-between p-2">
        <button type="button" onClick={prevMonth} className="cursor-pointer border-none bg-none text-lg">
          &lt;
        </button>
        <span className="text-base font-[500]">{value.format('MMMM YYYY')}</span>
        <button type="button" className="cursor-pointer border-none bg-none text-lg" onClick={nextMonth}>
          &gt;
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div style={{width: 300}}>
        <Calendar
          fullscreen={false}
          onPanelChange={value => setCurrentMonth(value)}
          headerRender={headerRender}
          onSelect={handleDateSelect}
          fullCellRender={dateCellRender}
          mode="month"
          value={currentMonth}
        />
      </div>
    </div>
  )
}
