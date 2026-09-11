import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks'
import {setSelectedLanguage, setSelectionOccurred} from '@/redux/apiSlice/countrySlice'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {languageList} from '../SharedUI/CountrySelect/CountrySelectView'
import DisplayIcon from '../SharedUI/CountrySelect/DisplayIcon'

// Cookie handling function
const setCookie = (name: string, value: string, days: number) => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + days)
  const encodedValue = encodeURIComponent(value)
  document.cookie = `${name}=${encodedValue};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict;Secure`
}

interface IProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setWhatTodoModal: React.Dispatch<React.SetStateAction<boolean>>
  handleModalClose: () => void
}
const ChooseCountry = ({setModalOpen, setWhatTodoModal, handleModalClose}: IProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)

  const handleCountrySelect = (country: (typeof languageList)[0]) => {
    dispatch(setSelectedLanguage(country as any))
    dispatch(setSelectionOccurred())
    setCookie('selectedLanguage', country.value, 30)
    setModalOpen(false)
    setWhatTodoModal(true) // Open the next modal
  }

  return (
    <div className="mx-auto w-full p-6 shadow-f2 *:relative">
      <div className="flex h-full flex-col items-center justify-center rounded-lg">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="w-[10%]"></div>

          <h2 className="w-[80%] text-center text-lg font-bold">Welcome to myEKI</h2>
          <Icon
            onClick={() => {
              setModalOpen(false)
              setWhatTodoModal(false)
              handleModalClose()
            }}
            icon={'carbon:close-outline'}
            className="w-[10%] cursor-pointer text-[25px] hover:opacity-50"
          />
        </div>

        <h4 className="pt-3 text-center text-[14px] font-[500]">Choose Your Country</h4>

        <div className="mt-6 grid w-full grid-cols-2 gap-4 md:grid-cols-3">
          {languageList.map((country, index) => (
            <div
              key={index}
              onClick={() => handleCountrySelect(country)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg p-4 transition-all ${
                selectedLanguage.value === country.value ? 'border shadow-f2' : 'bg-[#F5F5F5] hover:bg-gray-200'
              }`}
            >
              <div className="">{DisplayIcon(country.value, {className: 'w-[16px] h-[16px] rounded-md'})}</div>
              <div className="text-center text-sm font-medium text-black">{country.name}</div>
              {/* <div className="mt-1 text-xs">
                {country.currencySign} {country.value}
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChooseCountry
