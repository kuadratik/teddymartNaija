import CustomButton from '@/components/SharedUI/Buttons/Button'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import Image from 'next/image'
import React from 'react'
import ComingSoon from './ComingSoon'
import {Button} from 'antd'
import {Grid2Layout} from '@/components/Customer/Advert'

const OldAdvert = () => {
  const [comingSoon, showComingSoon] = React.useState(false)

  return (
    <section className="box-border bg-[#2d2d2d] lg:rounded-[21px]">
      <div className="mx-auto max-w-7xl px-7 py-12 lg:px-24 lg:py-6">
        <div className="mb-6 flex items-center justify-between">
          <TextComponent as="h3" className="text-[19px] font-bold leading-[24px] text-white">
            Classified Ads
          </TextComponent>

          <Button
            onClick={() => {
              showComingSoon(true)
            }}
            style={{
              backgroundColor: '#fff',
              color: 'black',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
            htmlType="button"
            className="whitespace-nowrap rounded-lg bg-[#fff] px-7 py-[22px] font-bold text-gray-800"
          >
            Post an Ad
          </Button>
        </div>
        <Grid2Layout className="">
          {[
            {
              title: 'Green Helment',
              price: 14.99,
              description: 'This green helmet is designed for both style and safety, offering a sleek, modern look....',
              contact: 'Reach out at 416 470 6921',
              image: '/assets/img1.png'
            },
            {
              title: 'Modern Black Chair',
              price: 7.99,
              description:
                'Modern black and white chair with sleek lines and minimalist design, crafted for both style and comfortable....',
              contact: 'Reach out at 437 785 5243',
              image: '/assets/img_2.png'
            },
            {
              title: 'Black Watch',
              price: 544.99,
              description:
                '• The watch is essentially "like new" with little to no signs of use\n• It is a vibrant red fitness ...',
              contact: 'Send me a message today!',
              image: '/assets/img_3.png'
            },
            {
              title: 'Disposable Cup Branding',
              price: 50.0,
              description:
                "Trust our expertise for flawless cup branding. We deliver precision and quality to enhance your brand's presence.",
              contact: 'Email: imau@gmail.com',
              image: '/assets/img_4.png'
            }
          ].map((ad, index) => (
            <div key={index} className="overflow-hidden rounded-lg bg-white shadow-md">
              <div className="flex flex-col p-3 lg:flex-row lg:p-4">
                <div className="lg:w-1/3">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    width={200}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 lg:w-2/3">
                  <TextComponent as="h2" className="text-[14px] font-bold leading-[22px] text-[#4D4D4D]">
                    {ad.title}
                  </TextComponent>
                  <TextComponent as="p" className="text-[16px] font-medium leading-[25px] text-[#1a1a1a]">
                    {<FormatNumberCurrency value={ad.price} />}
                  </TextComponent>
                  <div className="flex h-[90px] flex-col justify-between">
                    <TextComponent as="p" className="mt-2 text-sm text-gray-500">
                      {ad.description}
                    </TextComponent>
                    <TextComponent as="p" className="mt-2 text-xs text-gray-400">
                      {ad.contact}
                    </TextComponent>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Grid2Layout>
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
    </section>
  )
}

export default OldAdvert
