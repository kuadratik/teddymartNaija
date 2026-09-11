import {Grid2Layout} from '@/components/Customer/Advert'
import useAdsGallerylist from '@/components/Customer/Advert/hooks/useGetAllAdsGallery'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import VideoView from '@/components/SharedUI/VideoView'
import {TruncatedText} from '@/components/Store/components/DetailsCard'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import useQueryParams from '@/hooks/useQueryParams'
import {GetAdsGalleryQuery} from '@/types/adsgallery'
import {Button} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import ComingSoon from './ComingSoon'

const NewAdvert = () => {
  const [comingSoon, showComingSoon] = React.useState(false)

  const {type} = useSelector((state: any) => state.vendor)

  const {selectedLanguage} = useAppSelector(state => state.country)

  const {queryParams, updateQueryParams} = useQueryParams<GetAdsGalleryQuery>({
    current_page: 1,
    type: type,
    search: '',
    per_page: 6
  })

  const {isLoading, handleAllAdsGallery, data, isError} = useAdsGallerylist()

  useEffect(() => {
    // Make the POST request when the component mounts
    handleAllAdsGallery({
      params: {...queryParams, status: 'active', price_min: 1},
      body: [],
      currency: selectedLanguage.value
    })
  }, [queryParams, selectedLanguage.value])

  const dataResponseArr = data?.data

  const router = useRouter()

  return (
    <React.Fragment>
      <section className="box-border bg-[#2d2d2d] lg:rounded-[21px]">
        <div className="mx-auto max-w-7xl px-7 py-12 lg:px-24 lg:py-6">
          <div className="mb-6 flex items-center justify-between">
            <Link href={'/ads-gallery'}>
              {' '}
              <TextComponent as="h3" className="text-[19px] font-bold leading-[24px] text-white underline">
                Classified Ads
              </TextComponent>
            </Link>

            <Button
              disabled={false}
              onClick={() => {
                router.push('/post-ad')
              }}
              style={{
                backgroundColor: '#fff',
                color: 'black',
                border: 'none'
                // Force the styles to remain the same on hover
              }}
              htmlType="button"
              className="whitespace-nowrap rounded-lg bg-[#fff] px-7 py-[22px] font-bold text-gray-800 hover:opacity-80"
            >
              Post an Ad
            </Button>
          </div>
          <Grid2Layout className="">
            {dataResponseArr?.data?.map((ad: any, index: any) => (
              <div
                onClick={() => {
                  router.push(`/ads-gallery/${ad.id}`)
                }}
                key={index}
                className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md"
              >
                <div className="flex flex-col p-3 lg:flex-row lg:p-4">
                  <div className="lg:w-1/3">
                    {ad?.media[0]?.type === 'image' ? (
                      <Image
                        src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                        alt={ad?.title}
                        width={200}
                        height={150}
                        onError={error => {
                          error.currentTarget.src = '/assets/default_banner.jpg'
                        }}
                        className="h-[150px] w-full rounded-lg object-cover"
                      />
                    ) : (
                      <VideoView
                        className="w-full"
                        src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                        width="200"
                        height="150"
                      />

                      // <video
                      //   ref={videoRef}
                      //   src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                      //   width="200"
                      //   height="50"
                      //   className="h-full w-full rounded-lg object-cover"
                      //   // muted
                      //   loop // Optional: loops the video
                      //   onMouseEnter={handleMouseEnter}
                      //   onMouseLeave={handleMouseLeave}
                      //   style={{cursor: 'pointer'}}
                      // />
                    )}
                  </div>
                  <div className="p-4 lg:w-2/3">
                    <TextComponent as="h2" className="text-[14px] font-bold leading-[22px] text-[#4D4D4D]">
                      {ad.title}
                    </TextComponent>
                    <TextComponent as="p" className="text-[16px] font-medium leading-[25px] text-[#1a1a1a]">
                      {ad?.price_on_request ? (
                        'Please Contact'
                      ) : (
                        <FormatNumberCurrency value={+ad.price} currency={ad?.currency} />
                      )}
                    </TextComponent>
                    <div className="flex h-[90px] flex-col justify-between">
                      <TextComponent as="p" className="mt-2 text-sm text-gray-500">
                        <TruncatedText text={ad?.description} limit={90} />{' '}
                      </TextComponent>
                      {/* <TextComponent as="p" className="mt-2 text-xs text-gray-400">
                        {ad.contact}
                      </TextComponent> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Grid2Layout>
        </div>
      </section>
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

export default NewAdvert
