import {Icon} from '@iconify/react'

import {useAppSelector} from '@/hooks/reduxHooks'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import {twMerge} from 'tailwind-merge'
import TextComponent from '../SharedUI/TextComponent'

import {Image, Skeleton} from 'antd'
import {useState} from 'react'
import useUpdateProfilePicture from './hooks/useUpdateProfilePicture'

interface IProps {
  imageUrl: string
  className?: string
}

const ProfileHeader = ({imageUrl, className}: IProps) => {
  // const isAuthenticated = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const {isLoading, updateStoreIsLoading, handleUpdateProfilePicture} = useUpdateProfilePicture()
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  return (
    <>
      <div className="relative flex flex-col items-center justify-center">
        <div className={twMerge('h-[97px] w-full bg-black', className)} />
        <div className="relative">
          {' '}
          <label htmlFor="profile-picture" className="">
            {' '}
            <div className="relative flex h-[75px] w-[75px] -translate-y-9 items-center justify-center overflow-hidden rounded-full bg-[#fff] shadow">
              {isLoading || updateStoreIsLoading ? (
                <Skeleton.Avatar active shape={'circle'} size={70} />
              ) : (
                <>
                  <Image
                    src={
                      isActiveUser?.profile_picture_path
                        ? `${process.env.imageBaseUrl}/${isActiveUser?.profile_picture_path}`
                        : '/assets/profile_img.jpg'
                    }
                    onLoadStart={() => {
                      setIsLoadingImage(true)
                    }}
                    onLoad={() => {
                      setIsLoadingImage(false)
                    }}
                    onError={error => {
                      error.currentTarget.src = '/assets/default_banner.jpg'
                      setIsLoadingImage(false)
                    }}
                    alt="profile"
                    preview={false}
                    className={`-z-[9999px] !h-[70px] !w-[70px] cursor-pointer rounded-full object-cover ${isLoadingImage ? 'blur-sm' : ''}`}
                    width={70}
                    height={70}
                  />
                </>
              )}
              {/* <div className="cursor-pointer bg-black bg-opacity-50">
            </div>{' '} */}
              <input
                type="file"
                id="profile-picture"
                accept="..png, .jpeg, .jpg, .webp"
                className="hidden"
                onChange={e => {
                  if (e.target.files) {
                    handleUpdateProfilePicture({
                      payload: {...isActiveUser, profile_picture_path: e.target.files[0]}
                    })
                  }
                }}
              />
            </div>
            <Icon
              icon={'tabler:edit'}
              width={20}
              color="black"
              height={20}
              className="absolute left-[58px] top-[16px] !z-[9999px] cursor-pointer text-3xl text-black"
            />{' '}
          </label>
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
            {isActiveUser?.address1 ?? ''}
          </TextComponent>
        </div>
      </div>
    </>
  )
}

export default ProfileHeader
