import NavBar from '@/components/Auth/Products/components/NavBar'
import ClipsComponent from '@/components/Clips'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/CustomerLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import TopBar from '@/components/Vendor/TopBar'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useRouter} from 'next/router'

const Clips = () => {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <>
      <SEOHead
        title={`myEKI | Clips`}
        description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
      />
      <div className="px-0 py-8 lg:px-0 lg:py-0">
        <div className="md:py-8">
          <div className="">
            <div className="flex w-full flex-col gap-8">
              {/* {!isDesktop && <TopBar title="My Clips" />} */}

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
      </div>
    </>
  )
}

Clips.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default Clips
