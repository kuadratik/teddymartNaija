import React from 'react'
import {ClipWrapper} from './ClipView'
import {useGetAllClipsQuery} from '@/services/clips'
import {useAppSelector} from '@/hooks/reduxHooks'
import DeliverySideView from './DeliverySideView'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Button} from 'antd'
import tw from 'tailwind-styled-components'
import ShippingAddress from './ShippingAddress'

const ClipDeliveryView = () => {
  const {selectedLanguage} = useAppSelector(state => state.country)

  const {
    data,
    isLoading,
    isFetching,
    isSuccess: allClipsIsSuccess
  } = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div>
      {' '}
      <ClipWrapper className="">
        <div className="flex-[4]">
          <div className="flex justify-between">
            {' '}
            <TextComponent as="h1" className="text-[20px] font-semibold text-[#6B7280]">
              Saved Address
            </TextComponent>
            <ButtonWrapper
              // onClick={onClick ?? router.back()}
              htmlType="button"
              type="primary"
              className=""
            >
              New Address
            </ButtonWrapper>
          </div>

          <ShippingAddress />
        </div>
        <ClipWrapper className="">
          <div className="flex-shrink-0 rounded-xl bg-[#F0F1F5] p-6 md:w-[400px]">
            <DeliverySideView data={data?.data} />
          </div>
        </ClipWrapper>
      </ClipWrapper>
    </div>
  )
}

const ButtonWrapper = tw(Button)`whitespace-nowrap rounded-lg bg-black px-20 py-[22px] text-white md:w-[140px]`

export default ClipDeliveryView
