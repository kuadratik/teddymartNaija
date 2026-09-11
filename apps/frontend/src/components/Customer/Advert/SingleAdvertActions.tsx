import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useAddAdvertToWishlistMutation, useRateThisAdvertMutation} from '@/services/advertisement'
import copyToClipboard, {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps} from 'antd'
import {useState} from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share'
import * as yup from 'yup'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import RatingModal from './RatingModal'
import ReferralModal from './ReferralModal'

interface IProps {
  data: any
  adsRatedRefetch: () => void
  isWishlisted: boolean
  refetchSingleAdvert: () => void
}
export const ratingValidateSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  rating: yup.number().required('Rating is required')
})
const SingleAdvertActions = ({data, adsRatedRefetch, isWishlisted, refetchSingleAdvert}: IProps) => {
  const [visible, setVisible] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const [addAdvertToWishlist, {isLoading}] = useAddAdvertToWishlistMutation()
  const [rateThisAdvert, {isLoading: isRateThisAdvertLoading, error: rateThisAdvertError}] = useRateThisAdvertMutation()
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const [formRatingValues, setFormRatingValues] = useState({
    rating: 1,
    name: isAuthenticatedUser ? `${isAuthenticatedUser?.first_name} ${isAuthenticatedUser?.last_name}` : '',
    review: ''
  })

  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`This may interest you: ${data.title}`)
    const adUrl = window.location.href // or your specific URL for the advertisement
    const body = encodeURIComponent(
      `Hello!\n\n` +
        `I found this Ad on AfricanDiasporaMart and thought you might be interested:\n` +
        `${data.title}: ${adUrl}\n\n` +
        `Join AfricanDiasporaMart Community\n` +
        `Facebook: https://www.facebook.com/myekimarket\n` +
        `Instagram: https://www.instagram.com/myekimarket/\n` +
        `Website: https://myeki.market`
    )
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailtoLink
  }

  const handleSaveWishlistAdvert = async () => {
    try {
      await addAdvertToWishlist({
        advert_id: data?.id.toString(),
        body: {}
      }).unwrap()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  <span className="font-semibold">{capitalizeOnlyFirstLetter(data?.title)}</span> added to wishlist
                  successfully
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
      refetchSingleAdvert()
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  {(error as any)?.data?.message}
                  {/* Failed to save <span className="font-semibold">{data?.title}</span> to wishlist! */}
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
  const handleRateThisAdvert = async () => {
    // Clear previous form errors if validation is successful
    let payload = {
      name: formRatingValues.name,
      rating: formRatingValues.rating
    }
    try {
      await ratingValidateSchema.validate(formRatingValues, {
        abortEarly: false
      })
      setFormErrors({})

      await rateThisAdvert({
        advert_id: data?.id.toString(),
        body: {
          name: payload.name,
          rating: payload.rating
        }
      }).unwrap()
      adsRatedRefetch()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  <span className="font-semibold">{capitalizeOnlyFirstLetter(data?.title)}</span> rated successfully
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
      if (error.name === 'ValidationError') {
        // Handle client-side validation errors
        const errors: {[key: string]: string} = {}
        error.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            errors[validationError.path] = validationError.message
          }
        })
        setFormErrors(errors)
      } else {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={
                  <>
                    {(error as any)?.data?.message}
                    {/* Failed to save <span className="font-semibold">{data?.title}</span> to wishlist! */}
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
  const socialShareItems: MenuProps['items'] = [
    {
      key: 'facebook',
      label: (
        <FacebookShareButton url={window.location.href}>
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:facebook-fill" className="text-[#3b5998]" />
            <span>Facebook</span>
          </div>
        </FacebookShareButton>
      )
    },
    {
      key: 'twitter',
      label: (
        <TwitterShareButton url={window.location.href} title="Check out this awesome ad!">
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:twitter-fill" className="text-[#1da1f2]" />
            <span>Twitter</span>
          </div>
        </TwitterShareButton>
      )
    },
    {
      key: 'linkedin',
      label: (
        <LinkedinShareButton
          url={window.location.href}
          title="Check out this awesome ad!"
          summary="Discover more about this business"
        >
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:linkedin-fill" className="text-[#0077b5]" />
            <span>LinkedIn</span>
          </div>
        </LinkedinShareButton>
      )
    },
    {
      key: 'whatsapp',
      label: (
        <WhatsappShareButton url={window.location.href} title="Check out this awesome ad!">
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:whatsapp-fill" className="text-[#25D366]" />
            <span>WhatsApp</span>
          </div>
        </WhatsappShareButton>
      )
    },
    {
      key: 'telegram',
      label: (
        <TelegramShareButton url={window.location.href} title="Check out this awesome ad!">
          <div className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10">
            <Icon icon="ri:telegram-fill" className="text-[#0088cc]" />
            <span>Telegram</span>
          </div>
        </TelegramShareButton>
      )
    },
    {
      key: 'email',
      label: (
        <button
          onClick={handleEmailSubmit}
          className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10"
        >
          <Icon icon="ic:outline-email" className="text-[#666666]" />
          <span>Email</span>
        </button>
      )
    },
    {
      key: 'copy',
      label: (
        <button
          onClick={() => {
            handleCopyLink(window.location.href)
            // navigator.clipboard.writeText(window.location.href)
            // Add toast notification here if needed
          }}
          className="flex w-full items-center gap-2 px-3 py-1 hover:bg-gray-100 lg:pl-2 lg:pr-10"
        >
          <Icon icon="ri:clipboard-fill" className="text-[#666666]" />
          <span>Copy Link</span>
        </button>
      )
    }
  ]
  return (
    <>
      <div className="grid grid-cols-2 items-center justify-between gap-5 bg-[#F9F9F9] px-4 py-3 lg:flex lg:gap-2 lg:rounded-full">
        <button
          disabled={isLoading}
          onClick={handleSaveWishlistAdvert}
          className="flex items-center gap-2 font-[500] hover:opacity-60"
        >
          {isLoading ? (
            <Spinner className="border-black" />
          ) : (
            <Icon icon={isWishlisted ? 'material-symbols:favorite' : 'mdi:heart-outline'} className="text-[16px]" />
          )}
          <span className="text-[14px]">Save</span>
        </button>
        <button onClick={() => setVisible(true)} className="flex items-center gap-2 font-[500] hover:opacity-60">
          <Icon icon="material-symbols:star-rate-rounded" className="text-[20px]" />
          <span className="text-[14px] underline">Rate Ad</span>
        </button>
        <button
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
          className="flex items-center gap-2 font-[500] hover:opacity-60"
        >
          <Icon icon="mdi:user" className="text-[20px]" />
          <span className="text-[14px]">Refer a friend</span>
        </button>
        <Dropdown
          overlayClassName="lg:max-w-[760px] mx-auto mt-1"
          destroyPopupOnHide
          trigger={['click']}
          menu={{items: socialShareItems}}
        >
          <button className="flex items-center gap-2 font-[500] hover:opacity-60">
            <Icon icon="material-symbols:share" className="text-[20px]" />
            <span className="text-[14px]">Share </span>
          </button>
        </Dropdown>
      </div>
      {visible && (
        <RatingModal
          isAuthenticatedUser={isAuthenticatedUser}
          isRateThisAdvertLoading={isRateThisAdvertLoading}
          handleRateThisAdvert={handleRateThisAdvert}
          errors={rateThisAdvertError}
          formErrors={formErrors}
          formValues={formRatingValues}
          setFormValues={setFormRatingValues}
          modalOpen={visible}
          setModalOpen={setVisible}
        />
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
  )
}

export default SingleAdvertActions
