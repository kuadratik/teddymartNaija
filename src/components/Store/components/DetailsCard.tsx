import {Badge, Button, Image} from 'antd'
import React, {useEffect, useState} from 'react'
// import Image from 'next/image'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {Listing} from '@/types/store'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useLocalStorage} from 'react-use'
import {Uuid} from '@/utils/fx'
import useAddToClipsQuery from '../hooks/useAddToClips'
import Spinner from '@/components/SharedUI/Spinner'
import {useSelector} from 'react-redux'

interface DetailsProps {
  listing: Listing
}

const DetailsCard = ({listing}: DetailsProps) => {
  const router = useRouter()

  const {type} = useSelector((state: any) => state.vendor)

  const {id} = router.query

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const {isLoading, handleAddToClip} = useAddToClipsQuery()

  return (
    <div className="w-full rounded-[8px] border-[1px] border-solid border-[#EDEDED]">
      <div className="flex flex-col items-center justify-center border-b-2 border-[#EDEDED]">
        <div className="flex w-full flex-col items-center p-6">
          {' '}
          <div className="flex !w-full flex-col items-center">
            {' '}
            <Badge.Ribbon
              text="Unavailable"
              style={{
                marginTop: 6
              }}
              placement="start"
              className={`custom-ribbon ${listing?.is_available ? 'hidden' : ''}`}
            >
              <Image
                src={`${process.env.imageBaseUrl}/${listing?.images[0]}`}
                width={237}
                height={200}
                alt="profile"
                className="object-contain"
                // quality={100}
                preview={false}
              />
            </Badge.Ribbon>
            <CustomButton
              disabled={!listing?.is_available}
              type="submit"
              onClick={() => {
                if (listing?.type === 'service') {
                } else {
                  handleAddToClip(listing?.slug)
                }
              }}
              className={` ${listing?.is_available ? 'bg-[#000000]' : 'bg-[#B9B9B9]'} w-full rounded-[10px] px-1 py-4 text-[14px] text-white`}
            >
              {' '}
              {listing?.type === 'service' ? 'Send a message' : isLoading ? <Spinner /> : 'Clip Item'}
            </CustomButton>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-8 px-4">
        {listing?.type === 'product' && (
          <TextComponent as="h1" className="text-[14px] font-medium text-[#000000]">
            {listing?.name}{' '}
          </TextComponent>
        )}
        <div className="flex items-center justify-between">
          {listing?.type === 'service' && (
            <TextComponent as="h1" className="text-[14px] font-medium text-[#000000]">
              {listing?.name}{' '}
            </TextComponent>
          )}

          {listing?.type === 'product' && (
            <TextComponent as="p" className="text-[24px] font-bold text-[#1C1C1C]">
              <FormatNumberCurrency value={+listing?.price} />
            </TextComponent>
          )}
          <Button
            htmlType="button"
            className="!border-none"
            onClick={() => {
              router.push(`/store/details/${id}?slug=${listing.slug}`)
            }}
          >
            <Icon icon={'mingcute:information-fill'} width={24} height={24} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DetailsCard
