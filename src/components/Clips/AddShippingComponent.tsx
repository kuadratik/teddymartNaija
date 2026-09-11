import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetCountryQuery} from '@/services/countryState'
import {useAddToShippingAddressMutation, useUpdateShippingAddressMutation} from '@/services/shipping'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import CustomButton from '../SharedUI/Buttons/Button'
import CountryInput from '../SharedUI/Input/CountryInput'
import StateInput from '../SharedUI/Input/StateInput'
import TextInput from '../SharedUI/Input/TextInput'
import Spinner from '../SharedUI/Spinner'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import {ShippingAddressSchema} from './utils/schema'

interface IProps {
  singleAddressId: string | undefined
  getSingleShippingAddress: any
  selectedAddress: any
  singleAddressIdEdit: any
  setSingleAddressIdEdit: any
  editAddressId: string | string[] | undefined
  setSelectedAddress: any
  refetchAddress: () => void
  shippingAddress: any
}
const AddShippingComponent = ({
  singleAddressId,
  getSingleShippingAddress,
  selectedAddress,
  singleAddressIdEdit,
  editAddressId,
  setSingleAddressIdEdit,
  setSelectedAddress,
  refetchAddress,
  shippingAddress
}: IProps) => {
  const user = useAppSelector(state => state.auth.user) // get authenticated user
  const router = useRouter()
  const {id} = router.query
  const {data} = useGetCountryQuery({
    search: ''
  })
  console.log('🚀 ~ AddShippingComponent ~ data:', data)
  const [addShippingAddress, {isLoading: addShippingAddressLoading}] = useAddToShippingAddressMutation()
  const [updateShippingAddress, {isLoading: updateShippingAddressLoading}] = useUpdateShippingAddressMutation()

  const initialValues = {
    address:
      (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) || editAddressId
        ? getSingleShippingAddress?.address
        : '',
    state:
      (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) || editAddressId
        ? getSingleShippingAddress?.state
        : undefined,
    city:
      (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) || editAddressId
        ? getSingleShippingAddress?.city
        : '',
    country:
      (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) || editAddressId
        ? getSingleShippingAddress?.country
        : undefined
  }

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    handleChange,
    resetForm,
    touched
    // setFieldError,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ShippingAddressSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      if (
        (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) ||
        editAddressId
      ) {
        // editAddressHandler()
        console.log('edit adrdress')
      } else {
        // saveAddressHandler()
        console.log('add adrdress')
      }
    }
  })
  console.log('🚀 ~ values:', values)

  useEffect(() => {
    // Add singleAddressIdEdit to the condition check
    if (
      (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) ||
      editAddressId
    ) {
      const matchingCountry = data?.data.find(
        (country: any) => country.name.toLowerCase() === getSingleShippingAddress?.country?.toLowerCase()
      )

      setFieldValue('address', getSingleShippingAddress?.address)
      setFieldValue('city', getSingleShippingAddress?.city)
      setFieldValue('state', getSingleShippingAddress?.state)
      setFieldValue('country', matchingCountry?.id || '')
    }
  }, [getSingleShippingAddress?.id, singleAddressId, singleAddressIdEdit, setFieldValue, data, editAddressId])

  const editAddressHandler = async () => {
    const payload = {
      ...values,
      country: data?.data?.find((item: any) => item.id == values.country).name,
      lga: values.city,
      landmark: values.city,
      saved: true
    }
    try {
      const response = await updateShippingAddress({body: payload, shippingAddressId: selectedAddress?.id}).unwrap()
      // Reset form to initial values
      setSingleAddressIdEdit(null)
      router.replace(`/clips/${id}`)
      setSelectedAddress(response?.data)
      refetchAddress()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Address updated successfully!'}
              textColor="#FFF"
              message={'Thank you'}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      resetForm({
        values: {
          address: '',
          state: undefined,
          city: '',
          country: undefined
        }
      })

      // If you're using any select components, you might want to reset their values as well
      if (typeof setFieldValue === 'function') {
        setFieldValue('country', '')
        setFieldValue('state', '')
        setFieldValue('city', '')
        setFieldValue('address', '')
      }
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={error?.data?.message || 'Something went wrong!'}
              textColor="#FFF"
              message={'Please try again later'}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }
  const saveAddressHandler = async () => {
    const payload = {
      ...values,
      country: data?.data?.find((item: any) => item.id == values.country).name,
      lga: values.city,
      landmark: values.city,
      saved: true
    }
    try {
      const response = await addShippingAddress({body: payload}).unwrap()
      console.log('🚀 ~ saveAddressHandler ~ response:', response?.data)
      if (shippingAddress?.data?.length === 0) {
        setSelectedAddress(response?.data)
      }
      router.replace(`/clips/${id}`)
      refetchAddress()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Address created successfully!'}
              textColor="#FFF"
              message={'Thank you'}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      resetForm({
        values: {
          address: '',
          state: undefined,
          city: '',
          country: undefined
        }
      })

      // If you're using any select components, you might want to reset their values as well
      if (typeof setFieldValue === 'function') {
        setFieldValue('country', '')
        setFieldValue('state', '')
        setFieldValue('city', '')
        setFieldValue('address', '')
      }
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={error?.data?.message || 'Something went wrong!'}
              textColor="#FFF"
              message={'Please try again later'}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  return (
    <div className="pb-5 flex flex-col gap-[20px] lg:pb-0">
      <h2 className="text-[20px] font-semibold leading-[26px] text-[#6B7280]">Delivery Address</h2>
      <div className="flex flex-col gap-[27px]">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="w-full">
            <div className={`pb-1`}>
              <label className="text-sm capitalize !text-black">Country*</label>
            </div>{' '}
            <CountryInput
              placeholder={'Country'}
              errorMessage={''}
              className={`border-[1px] ${errors.country ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              value={values?.country ?? undefined}
              onChange={value => {
                setFieldValue('country', value)
              }}
            />
          </div>
          <div className="w-full">
            {' '}
            <div className={`pb-1`}>
              <label className="text-sm capitalize !text-black">State*</label>
            </div>{' '}
            <StateInput
              className={`border-[1px] ${errors.state ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={''}
              //   @ts-ignore
              countryId={values.country}
              value={values.state ?? undefined}
              onChange={value => {
                setFieldValue('state', value)
              }}
              placeholder="State/Province"
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            {' '}
            <TextInput
              title="City*"
              className={`border-[1px] py-[9px] ${errors.city ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              labelClassName="!text-black"
              placeholder="City"
              errorMessage={errors.city ? errors.city : ''}
              value={values.city}
              onChange={handleChange}
              name={'city'}
              type={'text'}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row">
          {' '}
          <TextInput
            className={`border-[1px] ${errors.address ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
            placeholder=""
            errorMessage={errors.address ? errors.address : ''}
            value={values.address}
            onChange={handleChange}
            name={'address'}
            labelClassName="!text-black"
            type={'text'}
            title={'Address*'}
          />{' '}
        </div>
        {/* <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="saveAddress"
            name="saveAddress"
            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="saveAddress" className="text-sm text-gray-700">
            Save Address for later
          </label>
        </div> */}
        <div>
          <CustomButton
            disabled={
              addShippingAddressLoading ||
              !values.city ||
              !values.state ||
              !values.city ||
              !values.address ||
              updateShippingAddressLoading
            }
            className="h-[37px] !w-[132px] rounded-[8px] px-5 py-2 text-white"
            onClick={() => {
              if (
                (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) ||
                editAddressId
              ) {
                editAddressHandler()
              } else {
                saveAddressHandler()
              }
            }}
          >
            {addShippingAddressLoading || updateShippingAddressLoading ? (
              <Spinner className="border-white" />
            ) : (
              `${
                (getSingleShippingAddress?.id.toString() === singleAddressId?.toString() && singleAddressIdEdit) ||
                editAddressId
                  ? 'Edit'
                  : 'Add'
              } Address`
            )}
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default AddShippingComponent
