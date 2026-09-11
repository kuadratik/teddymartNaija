import NewAdvertSwiperSkeleton from '@/components/Auth/Products/components/Mall/NewAdvertSwiperSkeleton'
import NewAdvertSwiper from '@/components/Auth/Products/components/NewAdvertSwiper'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import useWindowResize from '@/hooks/useWindowResize'
import {Grid3Layout} from '@/pages/ads-gallery'
import {useDeleteAdvertWishlistMutation} from '@/services/advertisement'
import {useGetCountryQuery} from '@/services/countryState'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import TextComponent from '../../SharedUI/TextComponent'
import VideoView from '../../SharedUI/VideoView'
import {SingleAdvertWrapper} from '../Advert'

interface IProps {
  data: any
  className?: string
  isHideDeleteSaveAds?: boolean
  refetch?: any
  isShowExtra?: boolean
  isLoading?: boolean
}
const AdsSingleComponent = ({
  data,
  className = '',
  isHideDeleteSaveAds = false,
  refetch,
  isLoading = false,
  isShowExtra = true
}: IProps) => {
  const router = useRouter()
  const {data: countries} = useGetCountryQuery({
    search: ''
  })
  const {width} = useWindowResize()
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const [selectedAds, setSelectedAds] = useState<any>(null)
  const [deleteAdvertWishlist, {isLoading: isDeleteWishlistLoading}] = useDeleteAdvertWishlistMutation()
  // console.log(`${process.env.imageBaseUrl}/${ad?.media[0]}`)
  const handleDeleteWishlistAdvert = async (ad: any) => {
    try {
      await deleteAdvertWishlist({
        advert_id: ad?.id
      }).unwrap()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  <span className="font-semibold">{capitalizeOnlyFirstLetter(ad?.title)}</span> deleted successfully
                  from wishlist!
                </>
              }
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      refetch()
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  Failed to delete <span className="font-semibold">{ad?.title}</span> from wishList!
                </>
              }
              image={errorToastIcon}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }
  return (
    <>
      {isShowExtra ? (
        <Grid3Layout className={className}>
          <>
            {data.map((ad: any, index: any) => {
              const findCountry = countries?.data.find((country: any) => country?.id === ad?.country_id)

              return (
                <div key={ad?.id} className="group relative">
                  {isHideDeleteSaveAds && (
                    <button
                      disabled={isDeleteWishlistLoading}
                      className="absolute right-2 top-2 z-30 hidden cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-md transition-colors duration-200 hover:bg-gray-100 group-hover:flex"
                      onClick={() => {
                        handleDeleteWishlistAdvert(ad)
                        setSelectedAds(ad)
                      }}
                    >
                      {isDeleteWishlistLoading && ad?.id === selectedAds?.id ? (
                        <Spinner className="border-black" />
                      ) : (
                        <Image src="/assets/delete.svg" alt="delete" width={20} height={20} />
                      )}
                    </button>
                  )}
                  <Link href={`/ads-gallery/${ad.id}`}>
                    <SingleAdvertWrapper className="cursor-pointer bg-white">
                      <div className="relative flex flex-col px-2 py-1 lg:flex-row lg:items-center">
                        <div className="relative h-[240px] rounded-[6px] bg-[#F5F5F5] lg:h-[130px] lg:w-[130px]">
                          {ad?.media[0]?.type === 'image' ? (
                            <ImageComponent
                              src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                              alt={ad?.title}
                              isLoadingImage={isLoadingImage}
                              setIsLoadingImage={setIsLoadingImage}
                              width={200}
                              index={index}
                              height={50}
                              className="h-full w-full rounded-[6px] border border-gray-100 bg-[#F5F5F5] object-cover object-center"
                            />
                          ) : (
                            <VideoView
                              className="w-full"
                              src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
                              width="200"
                              height="50"
                            />
                          )}
                          {ad?.is_available === false && (
                            <div className="absolute -left-2 top-2">
                              <Image
                                src={`/assets/unavailable-tag.svg`}
                                alt={ad?.title}
                                width={100}
                                height={30}
                                className="h-[35px] object-center"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center p-4 lg:w-2/3">
                          <TextComponent as="h2" className="text-[15px] font-bold leading-4 text-black/80">
                            {capitalizeOnlyFirstLetter(ad?.title)}
                          </TextComponent>
                          <TextComponent as="h2" className="text-[17px] font-bold text-black">
                            {ad?.price_on_request ? (
                              'Please Contact'
                            ) : (
                              <FormatNumberCurrency value={+ad.price} currency={ad?.currency} />
                            )}
                          </TextComponent>
                          <p className="text-[14px] lg:h-[63px]">
                            {capitalizeOnlyFirstLetter(ad?.description).length > 50 ? (
                              <>
                                <span
                                  className="ql-content text-black"
                                  dangerouslySetInnerHTML={{
                                    __html: capitalizeOnlyFirstLetter(ad?.description).slice(0, 50) + '...'
                                  }}
                                />{' '}
                                <span
                                  onClick={() => {
                                    router.push(`/ads-gallery/${ad.id}`)
                                  }}
                                  className="cursor-pointer underline group-hover:font-bold"
                                >
                                  see more
                                </span>
                              </>
                            ) : (
                              <span
                                className="ql-content text-black"
                                dangerouslySetInnerHTML={{
                                  __html: capitalizeOnlyFirstLetter(ad?.description)
                                }}
                              />
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="relative -top-1 px-4">
                        <div className="flex items-center justify-end gap-2 text-[14px] font-[500] lg:text-[12px]">
                          <Icon icon="duo-icons:location" width="14" height="14" />
                          <span className="text-black">
                            {ad?.state}, {findCountry?.name ?? ''}
                          </span>
                        </div>
                      </div>
                    </SingleAdvertWrapper>
                  </Link>
                </div>
              )
            })}
          </>
        </Grid3Layout>
      ) : (
        <>
          {isLoading ? (
            <NewAdvertSwiperSkeleton count={width > 1024 ? 6 : width > 640 ? 2 : 1} />
          ) : (
            <NewAdvertSwiper
              data={data}
              countries={countries}
              handleDeleteWishlistAdvert={handleDeleteWishlistAdvert}
              isDeleteWishlistLoading={isDeleteWishlistLoading}
              isHideDeleteSaveAds={isHideDeleteSaveAds}
            />
          )}
        </>
      )}
    </>
  )
}

export default AdsSingleComponent
