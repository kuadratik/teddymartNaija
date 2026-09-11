import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Button} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React from 'react'
import tw from 'tailwind-styled-components'
import ComingSoon from './ComingSoon'

const TeddyAdvert = () => {
  const [comingSoon, showComingSoon] = React.useState(false)
  const router = useRouter()
  return (
    <React.Fragment>
      <div className="bg-[#000000] lg:rounded-[21px]">
        <AdvertWrapper>
          <TextComponent as="h1" className="text-[24px] font-bold leading-[24px] text-white">
            MEK Directory{' '}
          </TextComponent>
          <TextComponent as="h1" className="text-[20px] font-normal leading-[24px] text-white">
            Business Listings Made Easy{' '}
          </TextComponent>
          <Image className="!border-none" src={'/assets/out_now.svg'} loading='lazy' alt="coming soon" width={250} height={60} />
          <Button
            onClick={() => {
              // showComingSoon(true)
              router.push('/get-list')
            }}
            style={{
              backgroundColor: '#fff',
              color: 'black',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
            htmlType="button"
            className="whitespace-nowrap rounded-lg bg-[#fff] px-10 py-[22px] font-bold text-gray-800"
          >
            Get Listed
          </Button>
        </AdvertWrapper>
      </div>

      <PlannerModal
        modalOpen={comingSoon}
        setModalOpen={showComingSoon}
        onCloseModal={() => showComingSoon(false)}
        modalStyles={{
          content: {
            backgroundColor: 'black'
          }
        }}
      >
        <ComingSoon onClose={() => showComingSoon(false)} />
      </PlannerModal>
    </React.Fragment>
  )
}

const AdvertWrapper = tw.div`mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-7 py-12 lg:px-24 lg:py-10`

export default TeddyAdvert
