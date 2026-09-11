import {VendorOnboardingProps} from '@/components/Auth/Signup/utils'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import React from 'react'
import {IProductInfoProps} from './ProductInfo'
import {useSelector} from 'react-redux'

const MoreDetails = ({active, setActive, handleChange, values, setFieldError, errors}: IProductInfoProps) => {
  const {type} = useSelector((state: any) => state.vendor)
  return (
    <div className="flex w-full flex-col gap-6">
      <TextAreaInput
        title={'Full Description*'}
        maxLength={200}
        onChange={handleChange}
        name={'description'}
        row={4}
        value={values.description}
        placeholder={''}
        helperText={`The ${type} description should give the customer useful information about the ${type} to ensure ${type === 'product' ? 'a purchase' : 'clarity'}. `}
        errorMessage={errors && errors.description ? errors.description : ''}
      />

      <TextAreaInput
        title={'Additional Information'}
        maxLength={100}
        onChange={handleChange}
        name={'additional_info'}
        row={4}
        placeholder={''}
        value={values.additional_info}
        helperText={`Extra features. Something to make the customer ${type === 'product' ? 'buy from' : 'contact'} you`}
      />

      <div className="mt-3 flex w-full items-center gap-4">
        <CustomButton
          onClick={() => {
            setActive(prev => prev - 1)
          }}
          type="button"
          className="w-[104px] rounded-[10px] border border-black bg-[#fff] px-1 py-4 text-[14px] text-black"
        >
          Back
        </CustomButton>

        <CustomButton
          onClick={() => {
            if (values['description'].length === 0) {
              setFieldError('name', `This field is required`)
            } else {
              setActive(prev => prev + 1)
            }
          }}
          type="submit"
          className="w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
        >
          Next
        </CustomButton>
      </div>
    </div>
  )
}

export default MoreDetails
