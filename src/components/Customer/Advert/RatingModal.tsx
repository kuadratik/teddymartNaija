import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/PlannerModal'
import Spinner from '@/components/SharedUI/Spinner'
import {Rate} from 'antd'
import React from 'react'
interface IProps {
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  formValues: any
  setFormValues: React.Dispatch<React.SetStateAction<any>>
  errors: any
  handleRateThisAdvert: () => void
  isRateThisAdvertLoading: boolean
  isAuthenticatedUser: any
  formErrors: any
}
const RatingModal = ({
  modalOpen,
  setModalOpen,
  formValues,
  setFormValues,
  errors,
  handleRateThisAdvert,
  isAuthenticatedUser,
  isRateThisAdvertLoading,
  formErrors
}: IProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormValues((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }
  return (
    <PlannerModal
      className=""
      onCloseModal={() => {
        setModalOpen(false)
      }}
      width={380}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    >
      <h2 className="mt-5 text-center text-xl font-semibold">Rate Ad</h2>
      <form className="mt-4 flex flex-col gap-5">
        <TextInput
          name="name"
          onChange={handleInputChange}
          placeholder="Enter name"
          type="text"
          className=""
          disabled={isAuthenticatedUser ? true : false}
          errorMessage={formErrors?.name}
          value={formValues.name}
          title="Name"
        />
        <div className="flex justify-center">
          <Rate
            onChange={value => {
              setFormValues((prev: any) => ({
                ...prev,
                rating: value
              }))
            }}
            value={formValues.rating}
            style={{
              fontSize: 30,
              color: '#FDBF5E' // Both size and color in style prop
            }}
          />
        </div>
        <div className="">
          <CustomButton
            className="rounded-lg bg-black py-3 text-white"
            onClick={handleRateThisAdvert}
            disabled={isRateThisAdvertLoading}
          >
            {isRateThisAdvertLoading ? <Spinner /> : 'Done'}
          </CustomButton>
        </div>
      </form>
    </PlannerModal>
  )
}

export default RatingModal
