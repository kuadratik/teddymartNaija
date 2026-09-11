import {useAppSelector} from '@/hooks/reduxHooks'
import {Icon} from '@iconify/react'
import dayjs from 'dayjs'
import React, {useEffect} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
import TextInput from '../SharedUI/Input/TextInput'
import PhoneInputWithCountry from '../SharedUI/PhoneInputWithCountry'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'

interface IProps {
  setShowCalender?: React.Dispatch<React.SetStateAction<boolean>>
  data: any
  businessData: any
  setShowBookReservationModal?: React.Dispatch<React.SetStateAction<boolean>>
  showBookReservationModal?: boolean
  setShowTimeModal: React.Dispatch<React.SetStateAction<boolean>>
  bookServiceSlot: any
  isBookingLoading: boolean
  formValues: any
  setFormValues: React.Dispatch<React.SetStateAction<any>>
  setShowBookingSuccessModal: React.Dispatch<React.SetStateAction<boolean>>
  refetch: () => void
  onBookingSuccess?: () => void
}

const BookReservationModal = ({
  setShowCalender,
  data,
  setShowBookReservationModal,
  setShowBookingSuccessModal,
  businessData,
  setShowTimeModal,
  bookServiceSlot,
  isBookingLoading,
  formValues,
  refetch,
  setFormValues,
  onBookingSuccess
}: IProps) => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const fullName = `${isAuthenticatedUser?.first_name} ${isAuthenticatedUser?.last_name}`

  // Format time for display
  const formatTime = (timeString: string) => dayjs.utc(timeString).format('hh:mm A')

  // Get the service and time slot information from the data prop
  const service = data?.data?.service
  const timeSlot = data?.data?.timeSlot
  const selectedDate = data?.data?.date

  useEffect(() => {
    if (data?.data) {
      setFormValues({
        ...formValues,
        business_service_id: data.data.business_service_id,
        service_time_id: data.data.service_time_id,
        cus_email: isAuthenticatedUser?.email ?? '',
        cus_fullname: fullName ?? ''
      })
    }
  }, [isAuthenticatedUser, data])

  const handleBookServiceSlot = async () => {
    let payload = {
      business_service_id: formValues.business_service_id,
      service_time_id: formValues.service_time_id,
      cus_phone_number: formValues.cus_phone_number,
      cus_email: formValues.cus_email,
      cus_fullname: formValues.cus_fullname
    }
    try {
      // Call the booking API here
      await bookServiceSlot({
        body: payload,
        businessListingId: businessData?.data?.id // Replace with actual business listing ID
      }).unwrap()

      // Signal booking success to parent components
      if (onBookingSuccess) {
        onBookingSuccess()
      }

      setShowBookingSuccessModal(true)
      refetch()
      if (setShowBookReservationModal) {
        setShowBookReservationModal(false)
      }
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={error?.data?.message || <>An Error occurred!</>}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'Please try again'
      })
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-[500]">Book Reservation</h3>
        <Icon
          onClick={() => {
            setShowBookReservationModal && setShowBookReservationModal(false)
            setShowTimeModal && setShowTimeModal(true)
          }}
          icon="material-symbols:close-rounded"
          width="24"
          height="24"
          className="cursor-pointer"
        />
      </div>

      {service && timeSlot && selectedDate && (
        <div className="mb-4 rounded-lg bg-gray-100 p-3">
          <h4 className="text-md mb-2 font-medium">{service.service_name}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Date:</p>
              <p className="font-medium">{selectedDate.format('MMM DD, YYYY')}</p>
            </div>
            <div>
              <p className="text-gray-500">Time:</p>
              <p className="font-medium">
                {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}
              </p>
            </div>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-4">
        <TextInput
          name="cus_fullname"
          type="text"
          title="Customer Name"
          value={formValues.cus_fullname}
          onChange={e => setFormValues({...formValues, cus_fullname: e.target.value})}
          placeholder="Enter your full name"
          errorMessage={formValues.cus_fullname ? '' : 'Full name is required'}
        />
        <TextInput
          title="Email"
          name="cus_email"
          type="email"
          value={formValues.cus_email}
          onChange={e => setFormValues({...formValues, cus_email: e.target.value})}
          placeholder="Enter your email"
          errorMessage={formValues.cus_email ? '' : 'Email is required'}
        />
        <div>
          <PhoneInputWithCountry
            errorMessage={formValues.cus_phone_number ? '' : 'Phone number is required'}
            className=""
            title="Customer Phone Number"
            inputProps={{
              name: 'cus_phone_number',
              id: 'cus_phone_number'
            }}
            placeholder={''}
            disabled={false}
            fontSize={14}
            color={'#3D3D3D'}
            value={formValues.cus_phone_number}
            onChange={e => {
              setFormValues({...formValues, cus_phone_number: e})
            }}
          />
        </div>
      </form>

      <div className="mt-4 flex w-full">
        <CustomButton
          onClick={handleBookServiceSlot}
          className={`rounded bg-black px-4 py-2 text-white ${isBookingLoading ? 'opacity-50' : ''}`}
          disabled={
            isBookingLoading || !formValues.cus_fullname || !formValues.cus_email || !formValues.cus_phone_number
          }
        >
          {isBookingLoading ? 'Booking...' : 'Book Now'}
        </CustomButton>
      </div>
    </div>
  )
}

export default BookReservationModal
