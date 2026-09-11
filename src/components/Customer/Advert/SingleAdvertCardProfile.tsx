import CustomButton from '@/components/SharedUI/Buttons/Button'
import SkeletonLoaderForList from '@/components/SharedUI/Loader/SkeletonLoaderForList'
import PlannerModal from '@/components/SharedUI/PlannerModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import VideoView from '@/components/SharedUI/VideoView'
import DeleteCard from '@/components/Vendor/components/DeleteCard'
import {useDeleteAdvertMutation, useGetAllRatedAdvertQuery, useUpdateAdvertMutation} from '@/services/advertisement'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Dropdown} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useState} from 'react'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import RetryPaymentModal from '../RetryPaymentModal'
import RatingCard from './RatingCard'
import ReferralModal from './ReferralModal'

interface IProps {
  ad: any
  className?: string
  setCurrentlyClickedAd: any
  currentlyClickedAd: any
  setShowRetry: any
  showRetry: any
  selectedLanguage: any
  setButtonText: any
  setTitle: React.Dispatch<React.SetStateAction<string>>
  promoteCurrency: any
  buttonText: any
  title: string
  index: any
  setPromoteCurrency: any
  adsRefetch: () => void
}

const SingleAdvertCardProfile = ({
  ad,
  className,
  currentlyClickedAd,
  setCurrentlyClickedAd,
  setShowRetry,
  showRetry,
  selectedLanguage,
  setButtonText,
  setTitle,
  promoteCurrency,
  buttonText,
  title,
  index,
  adsRefetch,
  setPromoteCurrency
}: IProps) => {
  const [openModal, setOpenModal] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const router = useRouter()
  const [deleteAdvert, {isLoading: deleting}] = useDeleteAdvertMutation()
  const [updateAdvert, {isLoading: isUpdateAdvertLoading, error}] = useUpdateAdvertMutation()
  const {
    data: adsRatedData,
    isLoading: adsRatedIsLoading,
    isFetching: adsRatedIsFetching
  } = useGetAllRatedAdvertQuery({
    advert_id: ad?.id as string
  })

  const handleAdvertAvailability = async () => {
    let payload: any = {
      is_available: true
    }

    console.log('payload', payload)

    try {
      const res = await updateAdvert({
        body: payload,
        advert: ad?.id,
        currency: selectedLanguage?.value
      }).unwrap()
      adsRefetch()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  <span className="font-semibold">{capitalizeOnlyFirstLetter(ad?.title)}</span> Advert availability
                  updated successfully!
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
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  Failed to update <span className="font-semibold">{ad?.title}</span> advert availability!
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
  const handleAdvertUnAvailability = async () => {
    let payload: any = {
      is_available: false
    }

    console.log('payload', payload)

    try {
      const res = await updateAdvert({
        body: payload,
        advert: ad?.id,
        currency: selectedLanguage?.value
      }).unwrap()
      adsRefetch()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  <span className="font-semibold">{capitalizeOnlyFirstLetter(ad?.title)}</span> advert unavailability
                  updated successfully!
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
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  Failed to update <span className="font-semibold">{ad?.title}</span> advert unavailability!
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
  const handleDeleteAdvert = async () => {
    try {
      await deleteAdvert({
        adsGalleryId: ad?.id
      }).unwrap()
      setModalDeleteOpen(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  <span className="font-semibold">{capitalizeOnlyFirstLetter(ad?.title)}</span> ad deleted successfully
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
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  Failed to delete <span className="font-semibold">{ad?.title}</span> ad!
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

  const items: any = [
    {
      label: (
        <div
          onClick={() => router.push(`/ads-gallery/${ad.id}`)}
          role="button"
          className="flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500] lg:w-[150px]"
        >
          <Icon icon="lets-icons:view-light" width={16} height={16} /> View
        </div>
      ),
      key: '0'
    },
    {
      label: (
        <div
          onClick={() => router.push(`/edit-ad/${ad.id}`)}
          role="button"
          className="flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500] lg:w-[150px]"
        >
          <Icon icon="lucide:edit" width={16} height={16} />
          Edit
        </div>
      ),
      key: '1'
    },
    {
      label: (
        <div role="button" className="flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500] lg:w-[150px]">
          <Icon icon="icon-park-outline:change" width={16} height={16} />
          Change status
        </div>
      ),
      children: [
        {
          key: '1-1',
          label: (
            <div
              onClick={() => {
                if (ad?.is_available === false) {
                  handleAdvertAvailability()
                }
              }}
              role="button"
              className="flex cursor-pointer items-center pb-2 text-[14px] font-[500] lg:w-[150px]"
            >
              {ad?.is_available === true && <Icon icon="bi:dot" width="26" height="26" className="text-[#007AFF]" />}
              Available
            </div>
          )
        },
        {
          key: '1-2',
          label: (
            <div
              onClick={() => {
                if (ad?.is_available === true) {
                  handleAdvertUnAvailability()
                }
              }}
              role="button"
              className="flex cursor-pointer items-center pb-2 text-[14px] font-[500] lg:w-[150px]"
            >
              {ad?.is_available === false && <Icon icon="bi:dot" width="26" height="26" className="text-[#007AFF]" />}
              Unavailable
            </div>
          )
        }
      ],
      key: '2'
    },
    {
      label: (
        <div
          onClick={() => setOpenModal(true)}
          role="button"
          className="flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500] lg:w-[150px]"
        >
          <Icon icon="ic:baseline-rate-review" width={16} height={16} />
          View Ratings
        </div>
      ),
      key: '3'
    },

    {
      label: (
        <div
          onClick={() => setIsReferralModalOpen(true)}
          role="button"
          className="flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500] lg:w-[150px]"
        >
          <Icon icon="mdi:user" width={16} height={16} />
          Refer
        </div>
      ),
      key: '4'
    },
    ad?.payment === null && {
      label: (
        <div
          role="button"
          onClick={() => setModalDeleteOpen(true)}
          className="flex cursor-pointer items-center gap-2 border-t border-[#DADADA] pb-2 text-[14px] font-[500] text-[#FF2D55] lg:w-[150px]"
        >
          <div className="flex items-center gap-2 pt-2">
            <Icon icon="ic:baseline-delete" width={16} height={16} />
            Delete
          </div>
        </div>
      ),
      key: '5'
    }
  ].filter(Boolean)

  return (
    <div className="rounded-[12.69px] border border-[#EAECEF] p-[10px]">
      <div className="flex flex-col gap-2">
        <div className="relative h-[250px] w-full lg:h-[190px]">
          {ad?.media[0]?.type === 'image' ? (
            <Image
              onError={error => {
                error.currentTarget.src = '/assets/default_banner.jpg'
              }}
              src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
              alt={ad?.title}
              width={200}
              height={50}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <VideoView
              className="h-full w-full rounded-lg object-cover"
              src={`${process.env.imageBaseUrl}/${ad?.media[0]?.file_path}`}
              width="200"
              height="50"
            />
          )}
          {ad?.is_available === false && (
            <div className="absolute -left-2 -top-1 z-40">
              <Image
                src={`/assets/unavailable-tag.svg`}
                alt={ad?.title}
                width={150}
                height={30}
                className="h-[35px] w-[100px] object-center"
              />
            </div>
          )}
        </div>
        <div className="flex justify-between gap-4 px-[10px]">
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-[500]">{capitalizeOnlyFirstLetter(ad?.title)}</h3>
            <p className="text-[12px]">
              {ad?.promote_plans[ad?.promote_plans?.length - 1]?.name === 'Free'
                ? 'Free'
                : ad?.payment?.status == 'success'
                  ? 'Payment Successful'
                  : ad?.payment?.status == 'pending_payment'
                    ? 'Payment Pending'
                    : ad?.payment?.status == null
                      ? 'Awaiting your payment'
                      : ad?.payment?.status == 'failed'
                        ? 'Payment Unsuccessful'
                        : ''}
            </p>
          </div>
          <Dropdown menu={{items}} trigger={['click']}>
            <button className="flex h-[24px] w-[50px] items-center justify-end">
              <Icon icon="pepicons-pencil:dots-y" width="22" height="22" />
            </button>
          </Dropdown>
        </div>
        <div className="w-full">
          {ad?.promote_plans[ad?.promote_plans?.length - 1]?.name === 'Free' ? (
            <CustomButton
              onClick={() => {
                if (selectedLanguage?.value !== ad?.currency && location?.pathname == '/customer') {
                  showPlannerToast({
                    options: {
                      customToast: (
                        <CustomToast
                          altText={''}
                          title={`Please promote the Ad in the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''} market. Simply click on the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''}  flag at the top panel.`}
                          textColor="#FFF"
                          message={''}
                          backgroundColor="#000"
                        />
                      )
                    },
                    message: 'message'
                  })
                } else {
                  setPromoteCurrency(ad?.currency)
                  setShowRetry(true)
                  setTitle('Promote Ad')
                  setButtonText('Promote')
                  setCurrentlyClickedAd(index)
                }
              }}
              style={{
                backgroundColor: '#fff',
                color: 'black'
              }}
              type="button"
              className="mt-4 whitespace-nowrap rounded-lg !border-[1.5px] !border-black bg-[#fff] px-7 py-3.5 text-black"
            >
              Promote Ad
            </CustomButton>
          ) : ad?.payment?.status === 'failed' ? (
            <CustomButton
              onClick={() => {
                if (selectedLanguage?.value !== ad?.currency && location?.pathname == '/customer') {
                  showPlannerToast({
                    options: {
                      customToast: (
                        <CustomToast
                          altText={''}
                          title={`Please promote the Ad in the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''} market. Simply click on the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''}  flag at the top panel.`}
                          textColor="#FFF"
                          message={''}
                          backgroundColor="#000"
                        />
                      )
                    },
                    message: 'message'
                  })
                } else {
                  setPromoteCurrency(ad?.currency)
                  setShowRetry(true)
                  setTitle('Retry Payment')
                  setButtonText('Retry')
                  setCurrentlyClickedAd(index)
                }
              }}
              style={{
                backgroundColor: '#000',
                color: 'white',
                border: 'none'
              }}
              type="button"
              className="mt-4 whitespace-nowrap rounded-lg bg-[#000] px-2 py-3.5 text-white"
            >
              Retry Payment
            </CustomButton>
          ) : ad?.payment?.status == null ? (
            <CustomButton
              onClick={() => {
                if (selectedLanguage?.value !== ad?.currency && location?.pathname == '/customer') {
                  showPlannerToast({
                    options: {
                      customToast: (
                        <CustomToast
                          altText={''}
                          title={`Please promote the Ad in the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''} market. Simply click on the ${ad?.currency === 'USD' ? 'American' : ad?.currency === 'CAD' ? 'Canadian' : ad?.currency === 'NGN' ? 'Nigerian' : ad?.currency === 'GBP' ? 'British' : ad?.currency === 'EUR' ? 'European' : ad?.currency === 'AUD' ? 'Australian' : ''}  flag at the top panel.`}
                          textColor="#FFF"
                          message={''}
                          backgroundColor="#000"
                        />
                      )
                    },
                    message: 'message'
                  })
                } else {
                  setPromoteCurrency(ad?.currency)
                  setShowRetry(true)
                  setTitle('Promote Ad')
                  setButtonText('Promote')
                  setCurrentlyClickedAd(index)
                }
              }}
              style={{
                backgroundColor: '#000',
                color: 'white',
                border: 'none'
              }}
              type="button"
              className="mt-4 whitespace-nowrap rounded-lg bg-[#000] px-2 py-3.5 text-white"
            >
              Pay Now
            </CustomButton>
          ) : (
            <></>
          )}

          {/* to be looked at */}
          {ad?.payment?.status === 'success' && (
            <TextComponent as="h2" className="mt-8 flex justify-end text-[12px] font-[500]">
              {ad?.promote_plans[0]?.duration_days > 0
                ? `Payment valid for ${ad?.promote_plans[0]?.duration_days} days`
                : ''}
            </TextComponent>
          )}
        </div>
      </div>
      {currentlyClickedAd === index && (
        <RetryPaymentModal
          adsRefetch={adsRefetch}
          promoteCurrency={promoteCurrency}
          showRetry={showRetry}
          setCurrentlyClickedAd={setCurrentlyClickedAd}
          setShowRetry={setShowRetry}
          advert={ad.id}
          price={ad.price}
          title={title}
          buttonText={buttonText}
          promotion={false}
        />
      )}
      <>
        {openModal && (
          <PlannerModal
            className=""
            onCloseModal={() => {
              setOpenModal(false)
            }}
            title="Ratings"
            height={500}
            width={580}
            modalOpen={openModal}
            setModalOpen={setOpenModal}
          >
            {adsRatedIsLoading ? (
              <SkeletonLoaderForList length={4} />
            ) : (
              <div
                className={`mt-5 grid gap-4 ${adsRatedData?.data?.ratings.length! > 0 ? 'md:grid-cols-2' : 'grid-cols-1'}`}
              >
                <>
                  {adsRatedData?.data?.ratings.length! > 0 ? (
                    <>
                      {adsRatedData?.data?.ratings.map(item => {
                        return (
                          <RatingCard
                            key={item?.id}
                            rating={item}
                            average_rating={adsRatedData?.data?.average_rating}
                            total_ratings={adsRatedData?.data?.total_ratings}
                          />
                        )
                      })}
                    </>
                  ) : (
                    <p className="w-full py-10 text-center font-[500]">No ratings yet</p>
                  )}
                </>
              </div>
            )}
          </PlannerModal>
        )}
        {modalDeleteOpen && (
          <PlannerModal
            className=""
            onCloseModal={() => {
              setModalDeleteOpen(false)
            }}
            width={380}
            modalOpen={modalDeleteOpen}
            setModalOpen={setModalDeleteOpen}
          >
            <div className="mt-8">
              <DeleteCard
                onCancel={() => setModalDeleteOpen(false)}
                onConfirm={() => {
                  handleDeleteAdvert()
                }}
                hideCancelBtn={false}
                isLoading={deleting}
                message={
                  <>
                    Are you sure you want to delete this
                    <span className="font-semibold"> {capitalizeOnlyFirstLetter(ad?.title)}</span>?
                  </>
                }
              />
            </div>
          </PlannerModal>
        )}
        {isReferralModalOpen && (
          <ReferralModal
            formValues={''}
            setFormValues={() => {}}
            modalOpen={isReferralModalOpen}
            setModalOpen={setIsReferralModalOpen}
          />
        )}
      </>
    </div>
  )
}

export default SingleAdvertCardProfile
