import {Icon} from '@iconify/react'
import Image from 'next/image'
import React from 'react'
import CustomButton from '../SharedUI/Buttons/Button'

interface IProps {
  business: any
  setIsLoadingImage: React.Dispatch<React.SetStateAction<boolean>>
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  defaultLogo: any
  hideBtn: boolean
  elementRef: any
  isDownloading: boolean
  downloadAsImage: any
  isFormCard: boolean
  formCardImage?: any
  activeColor?: string
}
const BusinessCard = ({
  business,
  defaultLogo,
  setIsLoadingImage,
  setModalOpen,
  hideBtn,
  downloadAsImage,
  elementRef,
  isFormCard,
  isDownloading,
  activeColor,
  formCardImage
}: IProps) => {
  console.log('🚀 ~ business:', business)
  const handleDownload = async () => {
    await downloadAsImage({
      fileName: `${business.business_name}-business-card.png`,
      backgroundColor: `${business?.color || '#000000'}`
    })
  }

  return (
    <>
      <div
        ref={elementRef}
        className={`business-card relative rounded-[10px] text-white ${isDownloading ? 'blur-md' : ''} `}
        style={{
          backgroundColor: isFormCard ? activeColor : `${business?.color || '#000000'}`
        }}
      >
        <div
          style={{
            background: `url('/assets/bg-business-card.png')`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom right'
          }}
          className="relative z-40 flex h-[200px] flex-col justify-between p-[20px]"
        >
          <div className="flex items-center">
            <Image
              src={
                isFormCard
                  ? formCardImage || defaultLogo
                  : business?.business_logo_url
                    ? `${process.env.imageBaseUrl}/${business?.business_logo_url}`
                    : defaultLogo
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
              width={94}
              height={94}
              crossOrigin="anonymous"
              alt="business logo"
              className="h-[49px] w-[49px] rounded-full object-cover object-center"
              priority
            />
            <div style={{padding: 8}} className="pl-3">
              <p className={`text-[20px] font-bold ${isDownloading ? 'relative -top-2.5' : ''}`}>
                {business?.business_name}
              </p>
              {/* remove to render the website null if its not found */}
              <p className={`p-0 text-[9px] text-[#EAECEF] ${isDownloading ? 'relative -top-2.5' : ''}`}>
                {business?.website_link ?? '-'}
              </p>
            </div>
          </div>
          <div className="">
            <p className="pt-5 text-[20px] font-bold">
              {' '}
              <p className="font-meduim text-[10px]">{business?.owner_name ?? '-'}</p>
            </p>
            <p className="font-meduim text-[10px] capitalize">{business?.owner_role ?? '-'}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
            <>
              {business?.business_email && (
                <div className="flex items-center gap-1">
                  <Icon icon="carbon:email" width="10" height="10" />
                  <p
                    className={`text-[9px] ${isDownloading ? 'relative -top-1.5' : ''} no-underline`}
                    style={{textDecoration: 'none !important', color: 'inherit !important'}}
                  >
                    <span className="text-inherit" style={{textDecoration: 'none !important'}}>
                      {/* Add zero-width space character between parts of the email */}
                      {business.business_email.split('@').join('\u200B@')}
                    </span>
                  </p>
                </div>
              )}
            </>

            <>
              {business?.secondary_business_email && (
                <div className="flex items-center gap-1">
                  <Icon icon="carbon:email" width="10" height="10" />
                  <p
                    className={`text-[9px] ${isDownloading ? 'relative -top-1.5' : ''} no-underline`}
                    style={{textDecoration: 'none !important', color: 'inherit !important'}}
                  >
                    <span className="text-inherit" style={{textDecoration: 'none !important'}}>
                      {/* Add zero-width space character between parts of the email */}
                      {business?.secondary_business_email.split('@').join('\u200B@')}
                    </span>
                  </p>
                </div>
              )}
            </>

            {business?.business_contact_number && (
              <div className="flex items-center gap-1">
                <Icon icon="ic:sharp-phone" width="10" height="10" />
                <p className={`text-[9px] ${isDownloading ? 'relative -top-1.5' : ''} `}>
                  +{business?.business_contact_number}
                </p>
              </div>
            )}
            {business?.business_address && (
              <div className="flex items-center gap-1">
                {' '}
                {/* Changed items-center to items-start */}
                <Icon icon="mdi-light:map-marker" width="10" height="10" className="" />{' '}
                {/* Added margin-top for fine-tuning */}
                <p
                  className={`text-[9px] ${isDownloading ? 'relative -top-1.5' : ''} max-w-full flex-1 whitespace-normal break-words break-all`}
                >
                  {business?.business_address}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {hideBtn ? null : (
        <div className="relative z-40 mt-5 flex gap-5">
          <CustomButton
            onClick={() => {
              setModalOpen(false)
            }}
            type="button"
            className="w-full rounded-[10px] border border-[#EDEDED] bg-[#EDEDED] px-1 py-4 text-[14px] text-black"
          >
            No
          </CustomButton>

          <CustomButton
            onClick={handleDownload}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
          >
            <Icon icon="mdi-light:download" width="18" height="16" />{' '}
            {isDownloading ? 'Generating...' : 'Download Card'}
          </CustomButton>
        </div>
      )}
    </>
  )
}

export default BusinessCard
