import {Icon} from '@iconify/react'
import Image from 'next/image'
import {twMerge} from 'tailwind-merge'
import TextComponent from '../SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'

interface IProps {
  imageUrl: string
  className?: string
}
const ProfileHeader = ({imageUrl, className}: IProps) => {
  // const isAuthenticated = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user

  return (
    <>
      <div className="relative flex flex-col items-center justify-center">
        <div className={twMerge('h-[97px] w-full bg-black', className)} />
        <div className="relative flex h-[60px] w-[60px] -translate-y-7 items-center justify-center rounded-full border-[0.47px] border-[#EAECEF] bg-white shadow-f2">
          {/* <Image src={imageUrl} alt="profile" className="object-contain" quality={100} /> */}
          <Image
            src={`${process.env.imageBaseUrl}/${isAuthenticatedUser?.store?.profile_picture_path}`}
            alt="profile-img"
            className="object-contain"
            quality={100}
            width={38}
            height={38}
          />
        </div>
      </div>
      <div className="relative flex -translate-y-3 flex-col items-center justify-center">
        <TextComponent as="h1" className="text-[24px] font-bold leading-[32px] text-black">
          {capitalizeOnlyFirstLetter(isAuthenticatedUser?.last_name ?? '')}{' '}
          {capitalizeOnlyFirstLetter(isAuthenticatedUser?.first_name ?? '')}
        </TextComponent>
        <div className="flex items-center gap-1">
          <Icon icon="codicon:location" className="text-[16px] text-black" />
          <TextComponent as="p" className="text-[12px] font-medium leading-[24px] text-black">
            {isAuthenticatedUser?.store?.address1 ?? ''}
          </TextComponent>
        </div>
      </div>
    </>
  )
}

export default ProfileHeader
