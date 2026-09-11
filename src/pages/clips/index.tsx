import ClipsComponent from '@/components/Clips'
import BaseLayout from '@/components/Layout/BaseLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import TopBar from '@/components/Vendor/TopBar'
import {useRouter} from 'next/router'

const Clips = () => {
  const router = useRouter()
  return (
    <>
      <SEOHead
        title={`myEKI | Clips`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <BaseLayout>
        <div className="md:my-8">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col gap-8">
              <TopBar title="My Clips" />

              <ClipsComponent />

              {/* <div className="w-full border-b px-4 pb-[38px] pt-[14px]">
          <div className="flex w-full flex-col items-center justify-center gap-[37px]">
            <div className="flex w-full items-start gap-4">
              <Image src="/assets/clip1.svg" alt="clip" preview={false} />

              <div className="flex w-full flex-col items-start gap-[5px]">
                <TextComponent as="h4" className="text-[16px] font-medium leading-[20px] text-[#1D1D1D]">
                  Sneakers Central
                </TextComponent>
                <TextComponent as="span" className="text-[12px] font-normal leading-[16px] text-[#9796A1]">
                  3 Items
                </TextComponent>
                <TextComponent
                  as="span"
                  className="text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                >
                  $3200
                </TextComponent>
                <div className="flex w-full items-center justify-between py-2">
                  <TextComponent
                    as="span"
                    className="text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                  >
                    Clear Selection
                  </TextComponent>
                  <button
                    type="button"
                    onClick={() => {
                      setShowItems(true)
                    }}
                  >
                    <TextComponent
                      as="span"
                      className="cursor-pointer text-[12px] font-medium leading-[16px] tracking-[-0.16px] text-[#1D1D1D]"
                    >
                      View Items
                    </TextComponent>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div> */}
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default Clips
