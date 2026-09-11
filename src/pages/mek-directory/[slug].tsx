import BusinessCard from '@/components/Business/BusinessCard'
import MekDirectoryCard from '@/components/Business/MekDirectoryCard'
import SingleMekDirectoryQuickAction from '@/components/Business/SingleMekDirectoryQuickAction'
import CustomerLayout from '@/components/Layout/Customerlayout'
import Carousel from '@/components/SharedUI/Carousel'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useElementDownload} from '@/hooks/useElementDownload'
import {useGetAllIndustriesQuery} from '@/services/category/category'
import {useBusinessListingsQuery} from '@/services/myBussiness'
import {singleBusinessListingsTopLevel} from '@/types/business'
import copyToClipboard from '@/utils/fx'
import {Icon} from '@iconify/react'
import axios from 'axios'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {useEffect, useState} from 'react'
import defaultLogo from '../../../public/assets/default_banner.jpg'

export function getClipUid() {
  if (typeof window !== 'undefined') {
    const clipUid = localStorage.getItem('Clip-Uid')
    if (clipUid) {
      // console.log('🚀 ~ getClipUid ~ clipUid:', clipUid)
      // Set the Clip-Uid as a cookie so it can be accessed in getServerSideProps
      return clipUid
    }
  }
  return null
}
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      // console.log('🚀 ~ getAuthToken ~ authToken:', authToken)
      // Set the Clip-Uid as a cookie so it can be accessed in getServerSideProps
      return authToken
    }
  }
  return null
}
interface IProps {
  data: singleBusinessListingsTopLevel
}
const SingleMekDirectory = ({data}: IProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const router = useRouter()
  const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})
  const {data: allBusiness, isLoading: allBusinessLoading} = useBusinessListingsQuery({
    search: '',
    industry: undefined,
    page: 1,
    current_page: 1,
    per_page: 20
  })
  const {elementRef, isDownloading, downloadAsImage} = useElementDownload()

  const handleDownload = async () => {
    await downloadAsImage({
      fileName: `${data?.data?.business_name}-business-card.jpg`,
      backgroundColor: `${data?.data?.color || '#000000'}`
    })
  }
  const handleCopyLink = (text: string) =>
    copyToClipboard(text)
      .then(() => {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>Link Copied Successfully</>}
                image={'/assets/states/notificationToasts/successcheck.svg'}
                textColor="#fff"
                message=""
                backgroundColor="#000"
              />
            )
          },
          message: 'Copied'
        })
      })
      .catch(() =>
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>Unable to copy!</>}
                image={'/assets/states/notificationToasts/error.svg'}
                textColor="red"
                message="Unable to copy"
                backgroundColor="#FCFCFD"
              />
            )
          },
          message: 'Oops, Something went wrong'
        })
      )
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', preventDefault)
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        preventDefault(e)
      }
    })

    return () => {
      document.removeEventListener('contextmenu', preventDefault)
      document.removeEventListener('keydown', preventDefault)
    }
  }, [])
  // Add fallback UI for when the page is loading
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Handle error state
  if (!data) {
    return <div>Error loading business details</div>
  }
  return (
    <div>
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={`${process.env.imageBaseUrl}/${data?.data?.business_logo_url}` || defaultLogo}
          alt="Banner image"
          fill
          style={{objectFit: 'cover'}}
          className={`${isLoadingImage ? 'blur-sm' : ''}`}
          onLoadStart={() => setIsLoadingImage(true)}
          onLoadingComplete={() => setIsLoadingImage(false)}
          onError={error => {
            error.currentTarget.src = '/assets/default_banner.jpg'
            setIsLoadingImage(false)
          }}
          sizes="100vw"
          priority
        />
      </div>
      <div className="relative -top-7 mx-auto max-w-5xl">
        <SingleMekDirectoryQuickAction
          handleDownload={handleDownload}
          data={data?.data!}
          handleCopyLink={handleCopyLink}
        />
      </div>
      {/* main body */}
      <div className="my-8 w-full max-w-7xl px-[20px] lg:mx-auto lg:px-[60px]">
        <div className="flex w-full flex-col gap-y-3 lg:flex-row lg:gap-x-10 xl:gap-x-20">
          <div className="lg:w-[75%]">
            <div className="flex flex-col justify-between gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap">
                <div className="w-full">
                  <h2 className="text-[30px] font-semibold text-[#4D4D4D]">{data?.data?.business_name}</h2>
                  <p className="text-[14px] font-bold text-[#6B7280]">
                    {data?.data?.business_email && (
                      <a href={`mailto:${data?.data?.business_email}`} className="">
                        {data?.data?.business_email}
                      </a>
                    )}
                    {data?.data?.secondary_business_email ? (
                      <a href={`mailto:${data?.data?.secondary_business_email}`} className="">
                        | {data?.data?.secondary_business_email}
                      </a>
                    ) : (
                      ''
                    )}
                  </p>
                </div>
                <div className="rounded-[5px] bg-[#CFD6E4] px-2 py-1 text-[11px] font-medium text-gray-700 lg:whitespace-nowrap">
                  {industries?.data.find(industry => industry.id === data?.data?.industry_id)?.name}
                </div>
              </div>
              {/* description */}
              <div className="rounded-[8px] border p-2 text-[14px] text-[#4D4D4D]">
                {data?.data?.business_description}
              </div>
              {/* location / phone number */}
              <div className="mt-3 flex flex-wrap gap-5 text-[13px] font-medium text-[#6B7280] md:flex-nowrap">
                <span className="flex items-center gap-1">
                  <Icon icon="tdesign:location-filled" width="24" height="16" />
                  {data?.data?.business_address ?? '-'}
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon="hugeicons:telephone" width="24" height="16" />
                  <a href={`tel:${data?.data?.business_contact_number}`} className="">
                    {data?.data?.business_contact_number}
                  </a>
                  {data?.data?.secondary_contact_number && (
                    <>
                      ,
                      <a href={`tel:${data?.data?.secondary_contact_number}`} className="">
                        {data?.data?.secondary_contact_number}
                      </a>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="lg:w-[450px]">
            <BusinessCard
              isFormCard={false}
              downloadAsImage={downloadAsImage}
              isDownloading={isDownloading}
              elementRef={elementRef}
              business={data?.data}
              setIsLoadingImage={setIsLoadingImage}
              defaultLogo={defaultLogo}
              setModalOpen={setModalOpen}
              hideBtn={true}
            />
          </div>
        </div>
        <div className="mt-16">
          {allBusiness?.data?.data?.length! > 0 && (
            <div className="relative mt-4 w-full">
              <div className="">
                <Carousel<any>
                  title="See businesses in the Directory"
                  items={allBusiness?.data.data || []}
                  scrollAmount={300}
                  containerClassName=""
                  buttonClassName="bg-blue-500 hover:bg-blue-400"
                  renderItem={(listing, index) => (
                    <div key={index} className="w-[300px]">
                      <MekDirectoryCard
                        setIsLoadingImage={setIsLoadingImage}
                        business={listing}
                        defaultLogo={defaultLogo}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
SingleMekDirectory.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}
export default SingleMekDirectory
export const getServerSideProps = async (context: any) => {
  const {slug} = context.query
  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || ''
  const authToken = cookies['authToken'] || ''

  if (!slug) {
    return {
      redirect: {
        destination: '/mek-directory',
        permanent: false
      }
    }
  }

  try {
    // Add retry logic for better reliability
    const fetchData = async (retryCount = 0) => {
      try {
        const res = await axios.get(`${process.env.baseUrl}front/business-listings/${slug}/details`, {
          headers: {
            Authorization: authToken || '',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'clip-uid': clipUid
          }
        })
        return res.data
      } catch (error: any) {
        if (retryCount < 2 && error?.response?.status === 404) {
          // Wait for a short time before retrying
          await new Promise(resolve => setTimeout(resolve, 1000))
          return fetchData(retryCount + 1)
        }
        throw error
      }
    }

    const data = await fetchData()

    if (!data || !data.data) {
      return {
        notFound: true
      }
    }

    const seoData = {
      title: `myEKI | ${data?.data?.business_name || 'Business Listing name not available'}`,
      description: data?.data?.business_description || 'Business Listing description not available',
      image: `${process.env.imageBaseUrl}/${data?.data?.business_logo_url}`,
      slug: data?.data?.business_slug || ''
    }

    return {
      props: {
        data,
        seoData
      }
    }
  } catch (error: any) {
    console.error('Error fetching business data:', {
      status: error?.response?.status,
      message: error?.message,
      url: error?.config?.url
    })

    // If there's an error, redirect to home or show 404
    return {
      notFound: true
    }
  }
}

