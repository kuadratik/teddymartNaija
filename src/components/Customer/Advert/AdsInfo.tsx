import TextAreaInput from '@/components/SharedUI/Input/TextAreaInput'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {Button} from 'antd'
import {useRouter} from 'next/router'
import {useState} from 'react'
import tw from 'tailwind-styled-components'
import useStartConversation from './hooks/useStartVendorConversation'

interface AdsInfoInterface {
  adsDataVal?: any
}

const AdsInfo = ({adsDataVal}: AdsInfoInterface) => {
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token

  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated token

  console.log(adsDataVal)

  console.log(isAuthenticatedUser?.id)

  const isAuth = isAuthenticatedToken

  const router = useRouter()

  const [message, setMessage] = useState('')

  const {isLoadingStartConversation, startConversation, error} = useStartConversation(() => {
    setMessage('')
  })

  return (
    <div className="mt-[23px] w-full">
      <div className="flex w-full items-center justify-between">
        {' '}
        <TextComponent as="p" className="text-[24px] font-semibold text-black">
          {adsDataVal?.title}
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

      <TextComponent as="p" className="mt-4 text-[14px] font-normal text-[#6B7280]">
        {adsDataVal?.description}
      </TextComponent>
      {adsDataVal?.quantity > 0 && (
        <TextComponent as="p" className="mt-4 text-[14px] font-medium text-[#6B7280]">
          Quantity: {adsDataVal?.quantity ?? 0}
        </TextComponent>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <TextComponent as="p" className="text-[16px] font-medium text-black">
          Vendor's Information
        </TextComponent>
        <TextComponent as="p" className="text-[14px] font-medium text-[#6B7280]">
          {adsDataVal?.user?.first_name}
        </TextComponent>
        {/* <TextComponent as="p" className="text-[14px] font-medium text-[#6B7280]">
          +234 5678 9023{' '}
        </TextComponent>{' '} */}

        {/* <div className="flex items-center gap-2 font-medium text-[#6B7280]">
          {' '}
          <Icon icon="tdesign:location" className="text-[24px]" />{' '}
          <TextComponent as="p" className="text-[14px] text-[#6B7280]">
            Manitoba, Canada
          </TextComponent>
        </div> */}
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
          loading={isLoadingStartConversation}
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
          htmlType="button"
          className=""
        >
          {isAuth ? 'Send Message' : 'Message Vendor'}
        </ButtonWrapper>
      )}
    </div>
  )
}

const ButtonWrapper = tw(
  Button
)`mt-4 w-full whitespace-nowrap rounded-full border-black bg-[#fff] px-4 py-[20px] font-bold text-gray-800`

const PriceWrapper = tw.div`flex items-center justify-center rounded-[31px]  bg-gray-200 px-6 py-[8px] text-center text-[14px] font-bold text-black`

export default AdsInfo
