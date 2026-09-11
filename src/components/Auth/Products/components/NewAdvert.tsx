import AdsSingleComponent from '@/components/Customer/Advert/AdsSingleComponent'
import useAdsGallerylist from '@/components/Customer/Advert/hooks/useGetAllAdsGallery'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import useQueryParams from '@/hooks/useQueryParams'
import {GetAdsGalleryQuery} from '@/types/adsgallery'
import {Button} from 'antd'
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
        <div className="mx-auto max-w-7xl px-7 py-12 lg:px-20 lg:py-6">
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
          <AdsSingleComponent className="md:grid-cols-3" data={dataResponseArr?.data ?? []} />
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
