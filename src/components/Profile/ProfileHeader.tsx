import {Icon} from '@iconify/react'

import {twMerge} from 'tailwind-merge'
import TextComponent from '../SharedUI/TextComponent'
import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'

import {Image} from 'antd'

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

        <div className="relative flex h-[65px] w-[65px] -translate-y-9 items-center justify-center overflow-hidden rounded-full shadow">
          <Image
            src={`${process.env.imageBaseUrl}/${isAuthenticatedUser?.store?.profile_picture_path}`}
            alt="profile"
            preview={false}
            className="!h-[65px] !w-[65px] rounded-full object-cover"
            width={65}
            height={65}
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
