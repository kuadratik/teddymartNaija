import {Icon} from '@iconify/react'
import {Dropdown, MenuProps, Tooltip} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton
} from 'react-share'

import {default as PlannerPrimaryModal} from '@/components/SharedUI/ModalComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useElementDownload} from '@/hooks/useElementDownload'
import {useActiveUserQuery} from '@/services/auth'
import {useDeleteBusinessListingMutation} from '@/services/myBussiness'
import copyToClipboard from '@/utils/fx'
import errorToastIcon from '../../../public/assets/error-toast-icon.svg'
import DrawerContainer from '../SharedUI/DrawerContainer'
import PlannerModal from '../SharedUI/PlannerModal'
import CustomToast from '../SharedUI/Toast/CustomToast'
import {showPlannerToast} from '../SharedUI/Toast/plannerToast'
import DeleteCard from '../Vendor/components/DeleteCard'
import BusinessCard from './BusinessCard'

interface IProps {
  business: any
  setIsLoadingImage: React.Dispatch<React.SetStateAction<boolean>>
  defaultLogo: any
}
export const formatUrl = (url: string) => {
  if (!url) return ''
  // Check if the URL already has a protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // Add https:// as default protocol
  return `https://${url.replace(/^\/\//, '')}`
}
const MekDirectoryCard = ({business, defaultLogo, setIsLoadingImage}: IProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery({})
  const {elementRef, isDownloading, downloadAsImage} = useElementDownload()
  const [deleteBusinessListing, {isLoading: deleting}] = useDeleteBusinessListingMutation()
  const isAuthenticatedToken = useAppSelector(state => state.auth.token)
  const isHideAction =
    activeUserData?.data?.id !== business?.user_id || business?.user_id === null || !isAuthenticatedToken
  const cardUrl = `${window.location.origin}/mek-directory/${business?.business_slug}`
  const handleDeleteBusinessListing = async () => {
    try {
      await deleteBusinessListing({
        businessListingId: business?.id
      }).unwrap()
      setShowDeleteModal(false)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={
                <>
                  <span className="font-semibold">{business?.business_name}</span>Business listing deleted successfully
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
                  Failed to delete <span className="font-semibold">{business?.business_name}</span> business listing!
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
  const contactNumbers: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex flex-col gap-2">
          <a target="_blank" rel="noopener noreferrer" href={`tel:+${business.business_contact_number}`}>
            +{business.business_contact_number}
          </a>
          {business.secondary_contact_number && (
            <a target="_blank" rel="noopener noreferrer" href={`tel:+${business.secondary_contact_number}`}>
              +{business.secondary_contact_number}
            </a>
          )}
        </div>
      )
    }
  ]
  const emailLists: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex flex-col gap-2">
          <a target="_blank" rel="noopener noreferrer" href={`mailto:${business.business_email}`}>
            {business.business_email}
          </a>
          {business.secondary_business_email && (
            <a target="_blank" rel="noopener noreferrer" href={`mailto:${business.secondary_business_email}`}>
              {business.secondary_business_email}
            </a>
          )}
        </div>
      )
    }
  ]
  const actionItems: any = [
    {
      key: '1',
      label: (
        <Link
          className="flex items-center gap-1 py-1 text-[13px] font-medium text-[#4D4D4D] lg:py-0"
          href={`/mek-directory/${business?.business_slug}`}
        >
          <Icon icon="lets-icons:view-light" width="18" height="18" /> View
        </Link>
      )
    },
    {
      key: '2',
      label: (
        <button
          onClick={() => handleCopyLink(cardUrl)}
          className="flex items-center gap-1 py-1 text-[13px] font-medium text-[#4D4D4D] lg:py-0"
        >
          <Icon icon="solar:copy-linear" width="18" height="16" /> Copy Link
        </button>
      )
    },
    !isHideAction && {
      key: '3',
      label: (
        <Link
          href={`/get-list/${business?.id}/edit/${business?.business_slug}`}
          className="flex items-center gap-1 py-1 text-[13px] font-medium text-[#4D4D4D] lg:py-0"
        >
          <Icon icon="akar-icons:edit" width="18" height="16" /> Edit
        </Link>
      )
    },
    {
      key: '4',
      label: (
        <div className="flex items-center gap-1 py-1 text-[13px] font-medium text-[#4D4D4D] lg:py-0">
          <Icon icon="oui:share" width="18" height="16" /> Share
        </div>
      ),
      children: [
        {
          key: 'facebook',
          label: (
            <FacebookShareButton url={cardUrl} title="Check out this awesome listing!">
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
            <TwitterShareButton url={cardUrl} title="Check out this awesome listing!">
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
              url={cardUrl}
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
            <WhatsappShareButton url={cardUrl} title="Check out this awesome listing!">
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
            <TelegramShareButton url={cardUrl} title="Check out this awesome listing!">
              <div className="flex w-full items-center gap-2 px-2 py-1 hover:bg-gray-100">
                <Icon icon="ri:telegram-fill" className="text-[#0088cc]" />
                <span>Telegram</span>
              </div>
            </TelegramShareButton>
          )
        }
      ]
    },
    {
      key: '5',
      label: (
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 py-1 text-[13px] font-medium text-[#4D4D4D] lg:py-0"
        >
          <Icon icon="mdi-light:download" width="18" height="16" /> Download PNG
        </button>
      )
    },
    {
      key: '6',
      label: (
        <button
          onClick={() => {
            if (business?.website_link) {
              const formattedUrl = formatUrl(business.website_link)
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
          className="flex items-center gap-1 py-1 text-[13px] font-medium text-[#4D4D4D] lg:py-0"
        >
          <Icon icon="fluent-mdl2:website" width="18" height="16" /> Website
        </button>
      )
    },
    !isHideAction && {
      key: '7',
      label: (
        <div className="border-t-2 border-[#DADADA] py-1 lg:py-0">
          <button
            onClick={() => setShowDeleteModal(!showDeleteModal)}
            className="mt-2 flex w-full items-center gap-1 rounded-[5px] bg-[#FF2D55] p-2 text-[13px] font-medium text-white"
          >
            <Icon icon="ic:baseline-delete" width="18" height="18" /> Delete
          </button>
        </div>
      )
    }
  ].filter(Boolean)

  return (
    <>
      <div className="rounded-[20px] border border-[#C4C4C4] bg-white p-4">
        <div className="flex items-center justify-between">
          <Dropdown trigger={['click']} menu={{items: contactNumbers}}>
            <a onClick={e => e.preventDefault()}>
              <span className="flex cursor-pointer items-center gap-1 font-medium text-[#6B7280]">
                Contact Number
                <Icon icon="iconamoon:arrow-down-2-thin" width="24" height="24" />
              </span>
            </a>
          </Dropdown>
          <div className="">
            <Dropdown trigger={['click']} menu={{items: actionItems}}>
              <a onClick={e => e.preventDefault()}>
                <Icon icon="bi:three-dots" width="24" height="24" />
              </a>
            </Dropdown>
          </div>
        </div>
        <div className="mt-5 flex w-full flex-col items-center justify-center">
          <Image
            src={
              business?.business_logo_url ? `${process.env.imageBaseUrl}/${business.business_logo_url}` : defaultLogo
            }
            onLoadStart={() => {
              setIsLoadingImage(true)
            }}
            onLoad={() => {
              setIsLoadingImage(false)
            }}
            onError={(error: any) => {
              error.currentTarget.src = '/assets/default_banner.jpg'
              setIsLoadingImage(false)
            }}
            loading="lazy"
            width={94}
            height={94}
            alt="business logo"
            className="h-[94px] w-[94px] rounded-full"
          />
          <p className="py-2 text-[20px] font-bold text-[#4D4D4D]">{business.business_name}</p>
          <p className="h-[42px] text-[14px] text-[#6B7280]">
            {business?.business_description?.length > 68
              ? business?.business_description?.slice(0, 68) + '...'
              : (business?.business_description ?? '-')}
          </p>
          <hr className="my-3 h-[1px] w-full bg-[#E2E2E2]" />
        </div>
        <div className="flex items-center justify-between">
          <Dropdown
            trigger={['click']}
            menu={{items: emailLists}}
            disabled={business?.business_email?.length < 1 || business?.business_email === null}
          >
            <a onClick={e => e.preventDefault()}>
              <span className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[#6B7280]">
                <Icon icon="carbon:email" width="22" height="22" />

                {business?.business_email?.length > 0 || business?.business_email !== null ? (
                  <>
                    <span className="underline">Email(s)</span>
                    <Icon icon="iconamoon:arrow-down-2-thin" width="20" height="20" />
                  </>
                ) : (
                  '-'
                )}
              </span>
            </a>
          </Dropdown>
          <div className="">
            <Tooltip title={business?.business_address}>
              <span className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[#6B7280]">
                <Icon icon="mingcute:location-line" width="20" height="20" />
                {business?.business_address?.length > 10
                  ? business?.business_address.slice(0, 10) + '...'
                  : (business?.business_address ?? '-')}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
      <>
        {
          <PlannerModal
            onCloseModal={() => {
              setModalOpen(false)
            }}
            width={450}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          >
            <BusinessCard
              isFormCard={false}
              downloadAsImage={downloadAsImage}
              isDownloading={isDownloading}
              elementRef={elementRef}
              hideBtn={false}
              business={business}
              setIsLoadingImage={setIsLoadingImage}
              defaultLogo={defaultLogo}
              setModalOpen={setModalOpen}
            />
          </PlannerModal>
        }
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
                  Are you sure you want to delete <span className="font-semibold">{business?.business_name}</span>{' '}
                  business listing ?
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
                  Are you sure you want to delete <span className="font-semibold">{business?.business_name}</span>{' '}
                  business listing ?
                </>
              }
            />
          </DrawerContainer>
        )}
      </>
    </>
  )
}

export default MekDirectoryCard
