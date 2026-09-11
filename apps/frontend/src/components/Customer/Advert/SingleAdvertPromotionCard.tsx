import CustomButton from '@/components/SharedUI/Buttons/Button'
import PlannerModal from '@/components/SharedUI/PlannerModal'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import DeleteCard from '@/components/Vendor/components/DeleteCard'
import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {MenuProps} from 'antd'
import Image from 'next/image'
import {useState} from 'react'
import RetryPaymentModal from '../RetryPaymentModal'
import ReferralModal from './ReferralModal'

interface IProps {
  ad: any
  className?: string
  setCurrentlyClickedAd: any
  currentlyClickedAd: any
  setShowRetry: any
  showRetry: any
  setButtonText: any
  setTitle: React.Dispatch<React.SetStateAction<string>>
  promoteCurrency: any
  buttonText: any
  title: string
  index: any
  setPromoteCurrency: any
  adsRefetch: () => void
}

const SingleAdvertPromotionCard = ({
  ad,
  className,
  currentlyClickedAd,
  setCurrentlyClickedAd,
  setShowRetry,
  showRetry,
  setButtonText,
  setTitle,
  promoteCurrency,
  buttonText,
  title,
  index,
  setPromoteCurrency,
  adsRefetch
}: IProps) => {
  const [openModal, setOpenModal] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const items: MenuProps['items'] = [
    {
      label: (
        <div role="button" className="lg: flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500]">
          <Icon icon="lucide:edit" width={16} height={16} />
          Edit
        </div>
      ),
      key: '0'
    },
    {
      label: (
        <div role="button" className="lg: flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500]">
          <Icon icon="icon-park-outline:change" width={16} height={16} />
          Change status
        </div>
      ),
      children: [
        {
          key: '1-1',
          label: (
            <div role="button" className="lg: flex cursor-pointer items-center pb-2 text-[14px] font-[500]">
              <Icon icon="bi:dot" width="26" height="26" className="text-[#007AFF]" />
              Available
            </div>
          )
        },
        {
          key: '1-2',
          label: (
            <div role="button" className="lg: flex cursor-pointer items-center pb-2 text-[14px] font-[500]">
              <Icon icon="bi:dot" width="26" height="26" className="text-[#007AFF]" />
              Unavailable
            </div>
          )
        }
      ],
      key: '1'
    },
    {
      label: (
        <div
          onClick={() => setOpenModal(true)}
          role="button"
          className="lg: flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500]"
        >
          <Icon icon="ic:baseline-rate-review" width={16} height={16} />
          View Ratings
        </div>
      ),
      key: '2'
    },

    {
      label: (
        <div
          onClick={() => {
            if (isAuthenticatedUser) {
              setIsReferralModalOpen(true)
            } else {
              showPlannerToast({
                options: {
                  customToast: (
                    <CustomToast
                      altText={''}
                      title={<>You are not authenticated, please login.</>}
                      image={'/assets/states/notificationToasts/successcheck.svg'}
                      textColor="#fff"
                      message=""
                      backgroundColor="#000"
                    />
                  )
                },
                message: 'Copied'
              })
            }
          }}
          role="button"
          className="lg: flex cursor-pointer items-center gap-2 pb-2 text-[14px] font-[500]"
        >
          <Icon icon="mdi:user" width={16} height={16} />
          Refer
        </div>
      ),
      key: '3'
    }
    // {
    //   label: (
    //     <div
    //       role="button"
    //       onClick={() => setModalDeleteOpen(true)}
    //       className="lg: flex cursor-pointer items-center gap-2 border-t border-[#DADADA] pb-2 text-[14px] font-[500] text-[#FF2D55]"
    //     >
    //       <div className="flex items-center gap-2 pt-2">
    //         <Icon icon="ic:baseline-delete" width={16} height={16} />
    //         Delete
    //       </div>
    //     </div>
    //   ),
    //   key: '4'
    // }
  ]
  return (
    <div className="rounded-[12.69px] border border-[#EAECEF] p-[10px]">
      <div className="flex flex-col gap-2">
        <div className="h-[250px] w-full lg:h-[190px]">
          <Image
            onError={error => {
              error.currentTarget.src = '/assets/default_banner.jpg'
            }}
            src={`${process.env.imageBaseUrl}/${ad?.banner_path}`}
            alt={ad?.name}
            width={200}
            height={50}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <div className="flex justify-between gap-4 px-[10px]">
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-[500]">{capitalizeOnlyFirstLetter(ad?.name)}</h3>
            <h3 className="text-[14px] font-[500]"> {ad?.type === 'product' ? 'Product' : 'Service'}</h3>
            <p className="text-[12px]">
              {ad?.promoted_stores?.payment_id == null
                ? 'Awaiting your payment'
                : ad?.promoted_stores?.status === 'pending_payment'
                  ? 'Payment Pending'
                  : ad?.promoted_stores?.status === 'active'
                    ? 'Payment Successful'
                    : 'Payment Unsuccessful'}
            </p>
          </div>
          {/* <Dropdown  menu={{items}} trigger={['click']}>
            <button className="flex h-[24px] w-[50px] items-center justify-end">
              <Icon icon="pepicons-pencil:dots-y" width="22" height="22" />
            </button>
          </Dropdown> */}
        </div>
        <div className="w-full">
          {ad?.promoted_stores?.status === 'failed' && (
            <CustomButton
              onClick={() => {
                setPromoteCurrency(ad?.currency)
                setShowRetry(true)
                setTitle('Retry Payment')
                setButtonText('Retry')
                setCurrentlyClickedAd(index)
              }}
              style={{
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              className="mt-4 whitespace-nowrap rounded-lg bg-[#000] px-7 py-3.5 text-white"
            >
              Retry Payment
            </CustomButton>
          )}

          {ad?.promoted_stores?.payment_id == null && (
            <CustomButton
              onClick={() => {
                setPromoteCurrency(ad?.currency)
                setShowRetry(true)
                setTitle('Promote Store')
                setButtonText('Promote')
                setCurrentlyClickedAd(index)
              }}
              style={{
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              className="mt-4 whitespace-nowrap rounded-lg bg-[#000] px-7 py-3.5 text-white"
            >
              Pay Now
            </CustomButton>
          )}

          {/* to be looked at */}
          {ad?.promoted_stores?.status === 'active' && (
            <TextComponent as="h2" className="mt-8 flex justify-end text-[16px] font-normal text-[#6B7280]">
              {ad?.promoted_stores?.store_promote_plan?.duration_days > 0
                ? `Payment valid for ${ad?.promoted_stores?.store_promote_plan?.duration_days} days`
                : ''}
            </TextComponent>
          )}
        </div>
      </div>
      {currentlyClickedAd === index && (
        <RetryPaymentModal
          adsRefetch={adsRefetch}
          showRetry={showRetry}
          promoteCurrency={promoteCurrency}
          setCurrentlyClickedAd={setCurrentlyClickedAd}
          setShowRetry={setShowRetry}
          promotion={true}
          advert={ad.id}
          price={ad.price}
          title={title}
          buttonText={buttonText}
        />
      )}
      <>
        {/* {openModal && (
          <PlannerModal
            className=""
            onCloseModal={() => {
              setOpenModal(false)
            }}
            width={580}
            modalOpen={openModal}
            setModalOpen={setOpenModal}
          >
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(item => {
                return <RatingCard key={item} />
              })}
            </div>
          </PlannerModal>
        )} */}
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
                onConfirm={() => {}}
                hideCancelBtn={false}
                isLoading={false}
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
            isAuthenticatedUser={isAuthenticatedUser}
            referralLink={`${baseUrl}/auth/sign-up?redirect=%2Fpost-ad&referral_code=${(isAuthenticatedUser as any)?.referral_code}&referralType=ad_lister`}
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

export default SingleAdvertPromotionCard
