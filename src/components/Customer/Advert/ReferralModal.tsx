import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/PlannerModal'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useCopyToClipboard} from '@/hooks/useCopyToClipboard'
import {Icon} from '@iconify/react'
import React from 'react'
interface IProps {
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  formValues: any
  setFormValues: React.Dispatch<React.SetStateAction<any>>
}
const ReferralModal = ({modalOpen, setModalOpen, formValues, setFormValues}: IProps) => {
  const {handleCopy} = useCopyToClipboard()

  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  const baseUrl = `${window.location.protocol}//${window.location.host}`
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
      backgroundColor="#000000"
      width={380}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <Icon icon="noto:wrapped-gift" width="58" height="58" />
        <h2 className="text-center text-xl font-semibold text-white">Invite a Lister</h2>
        <p className="text-white">Refer a friend to list on myEKI today!</p>
      </div>
      <form className="mt-4 flex flex-col gap-5">
        <div
          onClick={() => {
            handleCopy(
              `${baseUrl}/auth/sign-up?redirect=%2Fpost-ad&referral_code=${isAuthenticatedUser?.referral_code}&referralType=ad_lister`,
              {
                successTitle: 'Ad referral link copied successfully!'
              }
            )
          }}
          className="relative cursor-pointer"
        >
          <Icon
            icon="solar:copy-bold-duotone"
            width="24"
            height="24"
            className="absolute right-3 top-[12px] z-20 text-white"
          />
          <TextInput
            name="email"
            onChange={() => {}}
            placeholder="Enter referral code"
            type="text"
            disabled={true}
            className="border-none bg-[#383838] pr-10 text-white"
            errorMessage={''}
            value={`${baseUrl}/auth/sign-up?redirect=%2Fpost-ad&referral_code=${isAuthenticatedUser?.referral_code}&referralType=ad_lister`}
            title=""
          />
        </div>
        <div
          onClick={() => {
            handleCopy(`${isAuthenticatedUser?.referral_code}`, {
              successTitle: 'Referral code copied successfully!'
            })
          }}
          className="relative cursor-pointer"
        >
          <Icon
            icon="solar:copy-bold-duotone"
            width="24"
            height="24"
            className="absolute right-3 top-[12px] z-20 text-white"
          />
          <TextInput
            name="email"
            onChange={() => {}}
            placeholder="Enter referral code"
            type="text"
            disabled={true}
            className="border-none bg-[#383838] pr-10 text-white"
            errorMessage={''}
            value={`${isAuthenticatedUser?.referral_code}`}
            title=""
          />
        </div>
        <div className="flex justify-center gap-4">
          <CustomButton className="rounded-lg border border-white py-3 text-white" onClick={() => setModalOpen(false)}>
            Close
          </CustomButton>
        </div>
      </form>
    </PlannerModal>
  )
}

export default ReferralModal
