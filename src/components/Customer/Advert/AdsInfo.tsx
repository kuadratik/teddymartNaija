import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetCountryQuery} from '@/services/countryState'
import {capitalizeOnlyFirstLetter, formatPhoneNumber} from '@/utils/fx'
import {Icon} from '@iconify/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import {useRouter} from 'next/router'
import {useState} from 'react'
import tw from 'tailwind-styled-components'
import useStartConversation from './hooks/useStartVendorConversation'

interface AdsInfoInterface {
  adsDataVal?: any
}
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months', // This ensures "months" instead of "mon"
    y: 'a year',
    yy: '%d years'
  }
})
const AdsInfo = ({adsDataVal}: AdsInfoInterface) => {
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const {data: countries} = useGetCountryQuery({
    search: ''
  })
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated token
  const findCountry = countries?.data.find((country: any) => country?.id === adsDataVal?.country_id)
  console.log(adsDataVal)

  console.log(isAuthenticatedUser?.id)

  const isAuth = isAuthenticatedToken

  const router = useRouter()

  const [message, setMessage] = useState(
    `Hello! I’m interested in ${adsDataVal?.title}. Please is it available? Thank you!`
  )

  const {isLoadingStartConversation, startConversation, error} = useStartConversation(() => {
    setMessage('')
  })

  return (
    <div className="mt-[23px] w-full">
      <div className="flex w-full items-center justify-between">
        {' '}
        <TextComponent as="p" className="text-[24px] font-semibold text-black">
          {capitalizeOnlyFirstLetter(adsDataVal?.title)}
        </TextComponent>
        <PriceWrapper className="">
          {' '}
          {adsDataVal?.price_on_request ? (
            'Please Contact'
          ) : (
            <FormatNumberCurrency value={+adsDataVal?.price} currency={adsDataVal?.currency} />
          )}
        </PriceWrapper>
      </div>

      <TextComponent as="p" className="mt-4 text-[14px] font-normal text-black">
        {capitalizeOnlyFirstLetter(adsDataVal?.description)}
      </TextComponent>
      {adsDataVal?.quantity > 0 && (
        <TextComponent as="p" className="mt-4 text-[14px] font-medium text-black">
          Quantity: {adsDataVal?.quantity ?? 0}
        </TextComponent>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <TextComponent as="p" className="text-[16px] font-semibold text-black">
          Vendor's Information
        </TextComponent>
        <TextComponent as="p" className="text-[14px] font-medium text-black">
          {adsDataVal?.user?.first_name}
        </TextComponent>

        <div onClick={() => setShowPhoneNumber(!showPhoneNumber)} className="flex cursor-pointer items-center gap-6">
          <p className={'text-[14px] font-[500] text-black'}>
            {!showPhoneNumber ? (
              <>
                {adsDataVal?.phone_number
                  ? `+${adsDataVal.phone_number.substring(0, 3)} ${'*'.repeat(4)} ${'*'.repeat(
                      3
                    )} ${adsDataVal.phone_number.substring(10)}`
                  : ''}
              </>
            ) : (
              <> {formatPhoneNumber(adsDataVal?.phone_number)}</>
            )}
          </p>

          <Icon icon={showPhoneNumber ? 'mdi:eye' : 'mdi:eye-off'} width="20" height="20" />
        </div>
        <TextComponent as="p" className="text-[14px] font-medium text-black">
          Posted <span className="font-bold">{dayjs(adsDataVal?.created_at).fromNow()}</span>
        </TextComponent>

        <div className="relative">
          <div className="flex items-center gap-2 text-[14px] font-[500]">
            <Icon icon="uil:map-marker-alt" width="20" height="20" />
            <span className="">
              {adsDataVal?.state}, {findCountry?.name ?? ''}
            </span>
          </div>
        </div>
      </div>

      {isAuth && adsDataVal?.user_id !== isAuthenticatedUser?.id && (
        <TextAreaInput
          className="mt-4"
          errorMessage={''}
          value={message}
          title={''}
          maxLength={200}
          onChange={e => {
            setMessage(e.target.value)
          }}
          name={'description'}
          row={4}
          placeholder={'Type a message'}
        />
      )}

      {adsDataVal?.user_id !== isAuthenticatedUser?.id && (
        <ButtonWrapper
          disabled={isLoadingStartConversation}
          bordered={!isAuth ? true : false}
          onClick={() => {
            if (isAuth) {
              startConversation({
                body: {
                  user_id: adsDataVal?.user?.id,
                  advert_id: adsDataVal?.id,
                  listing_id: '',
                  message
                },
                convoRoute: 'gallery'
              })
            } else {
              router.push(`/auth/sign-up?redirect=${encodeURIComponent(router.asPath)}`)
            }
          }}
          style={{
            backgroundColor: `${isAuth ? '#000' : '#fff'}`,
            color: `${isAuth ? '#fff' : '#000'}`,
            // Force the styles to remain the same on hover
            transition: 'none' // Disable any transitions
          }}
          className=""
        >
          {isAuth ? (
            <span className="flex items-center justify-center gap-2">
              {isLoadingStartConversation && <Spinner />} Message Vendor
            </span>
          ) : (
            'Message Vendor'
          )}
        </ButtonWrapper>
      )}
    </div>
  )
}

const ButtonWrapper = tw(
  CustomButton
)`mt-4 w-full whitespace-nowrap rounded-full border-black bg-black px-4 py-2.5 font-bold text-base text-gray-800`

const PriceWrapper = tw.div`flex items-center justify-center rounded-[31px]  bg-[#E5E5EA] px-6 py-[8px] text-center text-[13px] font-bold text-black`

export default AdsInfo
