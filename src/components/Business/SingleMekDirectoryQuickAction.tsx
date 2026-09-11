import {default as PlannerPrimaryModal} from '@/components/SharedUI/ModalComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useActiveUserQuery} from '@/services/auth'
import {useDeleteBusinessListingMutation} from '@/services/myBussiness'
import {BusinessListingDatum} from '@/types/business'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps} from 'antd'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share'
import errorToastIcon from '../../../public/assets/error-toast-icon.svg'
import DrawerContainer from '../SharedUI/DrawerContainer'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import DeleteCard from '../Vendor/components/DeleteCard'
import {formatUrl} from './MekDirectoryCard'
interface IProps {
  handleDownload: () => void
  handleCopyLink: (text: string) => void
  data: BusinessListingDatum
}
const SingleMekDirectoryQuickAction = ({handleDownload, handleCopyLink, data}: IProps) => {
  console.log('🚀 ~ SingleMekDirectoryQuickAction ~ data:', data)
  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery({})
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isAuthenticatedToken = useAppSelector(state => state.auth.token)
  const isHideAction = activeUserData?.data?.id !== data?.user_id || data?.user_id === null || !isAuthenticatedToken
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteBusinessListing, {isLoading: deleting}] = useDeleteBusinessListingMutation()
  const handleDeleteBusinessListing = async () => {
    try {
      await deleteBusinessListing({
        businessListingId: data?.id
      }).unwrap()
      setShowDeleteModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  <span className="font-semibold">{data?.business_name}</span> Business listing deleted successfully
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
      router.push('/mek-directory')
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={
                <>
                  Failed to delete <span className="font-semibold">{data?.business_name}</span> business listing!
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
  const socialShareItems: MenuProps['items'] = [
    {
      key: 'facebook',
      label: (
        <FacebookShareButton url={window.location.href}>
          <div className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100">
            <Icon icon="ri:facebook-fill" className="text-[#3b5998]" />
            <span>Facebook</span>
          </div>
        </FacebookShareButton>
      )
    },
    {
      key: 'twitter',
      label: (
        <TwitterShareButton url={window.location.href} title="Check out this awesome listing!">
          <div className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100">
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
          title="Check out this awesome listing!"
          summary="Discover more about this business"
        >
          <div className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100">
            <Icon icon="ri:linkedin-fill" className="text-[#0077b5]" />
            <span>LinkedIn</span>
          </div>
        </LinkedinShareButton>
      )
    },
    {
      key: 'whatsapp',
      label: (
        <WhatsappShareButton url={window.location.href} title="Check out this awesome listing!">
          <div className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100">
            <Icon icon="ri:whatsapp-fill" className="text-[#25D366]" />
            <span>WhatsApp</span>
          </div>
        </WhatsappShareButton>
      )
    },
    {
      key: 'telegram',
      label: (
        <TelegramShareButton url={window.location.href} title="Check out this awesome listing!">
          <div className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100">
            <Icon icon="ri:telegram-fill" className="text-[#0088cc]" />
            <span>Telegram</span>
          </div>
        </TelegramShareButton>
      )
    }
    // {
    //   key: 'copy',
    //   label: (
    //     <button
    //       onClick={() => {
    //         handleCopyLink(window.location.href)
    //         // navigator.clipboard.writeText(window.location.href)
    //         // Add toast notification here if needed
    //       }}
    //       className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100"
    //     >
    //       <Icon icon="ri:clipboard-fill" className="text-[#666666]" />
    //       <span>Copy Link</span>
    //     </button>
    //   )
    // }
  ]
  return (
    <div
      className={`grid grid-cols-2 gap-2 rounded-[11px] bg-white px-[30px] mx-5 py-2 shadow-f1 lg:gap-6 ${
        !isHideAction ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-2 lg:grid-cols-4'
      }`}
    >
      {/* copy link */}
      <button
        onClick={() => handleCopyLink(window.location.href)}
        className="flex items-center gap-3 rounded-[5px] bg-[#F5F5F5] px-3 py-2 text-[13px] font-medium text-[#4D4D4D] hover:opacity-80"
      >
        <Icon icon="solar:copy-linear" width="18" height="16" /> Copy Link
      </button>
      {/* edit */}
      {!isHideAction && (
        <button
          onClick={() => router.push(`/get-list/${data?.id}/edit/${data?.business_slug}`)}
          className="flex items-center gap-3 rounded-[5px] bg-[#F5F5F5] px-3 py-2 text-[13px] font-medium text-[#4D4D4D] hover:opacity-80"
        >
          <Icon icon="akar-icons:edit" width="18" height="16" /> Edit
        </button>
      )}
      {/* share */}
      <Dropdown
        overlayClassName="lg:max-w-[760px] mx-auto mt-1"
        destroyPopupOnHide
        trigger={['click']}
        menu={{items: socialShareItems, className: 'lg:grid grid-cols-5'}}
      >
        <button className="flex items-center justify-between gap-3 rounded-[5px] bg-[#F5F5F5] px-3 py-2 text-[13px] font-medium text-[#4D4D4D] hover:opacity-80">
          <a onClick={e => e.preventDefault()} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <Icon icon="akar-icons:edit" width="18" height="16" /> Share
            </span>
            <Icon icon="ic:round-keyboard-arrow-down" width="24" height="24" />
          </a>
        </button>
      </Dropdown>
      {/* download */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-3 whitespace-nowrap rounded-[5px] bg-[#F5F5F5] px-3 py-2 text-[13px] font-medium text-[#4D4D4D] hover:opacity-80"
      >
        <Icon icon="mdi-light:download" width="18" height="16" /> Download PNG
      </button>
      {/* website */}
      <button
        onClick={() => {
          if (data?.website_link) {
            const formattedUrl = formatUrl(data.website_link)
            window.open(formattedUrl, '_blank', 'noopener,noreferrer')
          } else {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText={''}
                    title={<>This business hasn’t added a website yet. Check back later!</>}
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
        className="flex items-center gap-3 rounded-[5px] bg-[#F5F5F5] px-3 py-2 text-[13px] font-medium text-[#4D4D4D] hover:opacity-80"
      >
        <Icon icon="fluent-mdl2:website" width="18" height="16" /> Website
      </button>

      {/* delete */}
      {!isHideAction && (
        <button
          onClick={() => setShowDeleteModal(!showDeleteModal)}
          className="flex items-center gap-3 rounded-[5px] bg-[#FF2D55] px-3 py-2 text-[13px] font-medium text-white hover:opacity-80"
        >
          <Icon icon="ic:baseline-delete" width="18" height="18" /> Delete
        </button>
      )}
      {isDesktop && showDeleteModal && (
        <PlannerPrimaryModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          maskCloseable={true}
          onCloseModal={() => {
            setShowDeleteModal(false)
          }}
          width={400}
        >
          <DeleteCard
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteBusinessListing}
            isLoading={deleting}
            message={
              <>
                Are you sure you want to delete <span className="font-semibold">{data?.business_name}</span> business
                listing ?
              </>
            }
          />
        </PlannerPrimaryModal>
      )}

      {!isDesktop && showDeleteModal && (
        <DrawerContainer open={showDeleteModal} onClose={() => setShowDeleteModal(false)} height={300}>
          <DeleteCard
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteBusinessListing}
            isLoading={deleting}
            message={
              <>
                Are you sure you want to delete <span className="font-semibold">{data?.business_name}</span> business
                listing ?
              </>
            }
          />
        </DrawerContainer>
      )}
    </div>
  )
}

export default SingleMekDirectoryQuickAction
