import TextComponent from '@/components/SharedUI/TextComponent'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {addStoreToMessaging, toggleMobileChatMessageModal} from '@/redux/features/messagingSlice'
import {useActiveUserQuery} from '@/services/auth'
import {Listing} from '@/types/store'
import styled from '@emotion/styled'
import {Icon} from '@iconify/react'
import {Image as AntImage} from 'antd'
import {useRouter} from 'next/router'
import {useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import tw from 'tailwind-styled-components'
import CustomButton from '../SharedUI/Buttons/Button'
import ImageComponent from '../SharedUI/Image/ImageComponent'
import TextInput from '../SharedUI/Input/TextInput'
import DetailsCard from './components/DetailsCard'

interface IProps {
  data: any
}
const VendorStore = ({data}: IProps) => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()
  // console.log('🚀 ~ VendorStore ~ router:', router)
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  const storeInfo = data?.data
  console.log('🚀 ~ VendorStore ~ storeInfo:', storeInfo)
  const [search, setSearch] = useState('')
  const [dropDown, setDropDown] = useState(false)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const {data: activeUserData, isSuccess, isLoading: activeUserisLoading} = useActiveUserQuery({})

  // Filter listings based on search term using useMemo
  const filteredListings = useMemo(() => {
    if (!search.trim() || !storeInfo?.listings) {
      return storeInfo?.listings || []
    }

    const searchTerm = search.toLowerCase()
    return storeInfo.listings.filter((listing: Listing) => {
      return (
        listing.name.toLowerCase().includes(searchTerm) ||
        (listing.description && listing.description.toLowerCase().includes(searchTerm))
      )
    })
  }, [search, storeInfo?.listings])

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }
  const handleStoreClick = (storeInfo: any) => {
    dispatch(addStoreToMessaging(storeInfo))
    dispatch(toggleMobileChatMessageModal())

    // Pass the store ID in the URL
    router.push(`/messages?userId=${storeInfo.user_id}`)
  }
  const isUserIDwithStore = storeInfo?.user_id === activeUserData?.data?.id
  return (
    <div className="mt-[2px]">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="relative h-[260px] w-full overflow-hidden">
          <ImageComponent
            setIsLoadingImage={setIsLoadingImage}
            isLoadingImage={isLoadingImage}
            src={
              storeInfo?.banner_path
                ? `${process.env.imageBaseUrl}/${storeInfo?.banner_path}`
                : '/assets/default_banner.jpg'
            }
            alt="Banner image"
            className={`${isLoadingImage ? 'h-full w-full object-cover blur-sm' : ''}`}
          />
        </div>

        <div className="border-5 relative flex h-[79px] w-[79px] -translate-y-10 items-center justify-center overflow-hidden rounded-[22px] border-[#FFFFFF] bg-[#fff]">
          <AntImage
            src={
              storeInfo?.profile_picture_path
                ? `${process.env.imageBaseUrl}/${storeInfo?.profile_picture_path}`
                : '/assets/profile_img.jpg'
            }
            alt="profile"
            className={`${isLoadingImage ? 'blur-sm' : ''} rounded-[22px] object-cover`}
            onLoadStart={() => {
              setIsLoadingImage(true)
            }}
            onError={error => {
              error.currentTarget.src = '/assets/profile_img.jpg'
              setIsLoadingImage(false)
            }}
            onLoad={() => {
              setIsLoadingImage(false)
            }}
            width={65}
            height={65}
            preview={false}
          />
        </div>

        <div className="-mt-[20px] mb-5">
          {/* <p className="text-center text-[14px] font-normal text-[#9796A1]">Email:89Cory Murray@gmail.com</p> */}
          <TextComponent as="h1" className="text-center text-[14px] font-bold leading-[32px] text-[#1D1D1D]">
            {storeInfo?.name}{' '}
          </TextComponent>
          {/* <TextComponent as="p" className="text-center text-[14px] font-normal text-[#9796A1]">
            {storeInfo?.description}{' '}
          </TextComponent> */}
          {!isUserIDwithStore && (
            <div className="">
              <CustomButton
                onClick={() => {
                  handleStoreClick(storeInfo)
                }}
                className="rounded-[4px] bg-black px-[40px] py-[10px] text-white hover:bg-black hover:opacity-80"
              >
                Message Vendor
              </CustomButton>
            </div>
          )}
        </div>
      </div>
      <>
        {storeInfo?.listings?.length > 0 ? (
          <>
            <div className="mt-[20px] flex items-center justify-between px-[16px]">
              <p className="text-[20px] font-bold">
                {router?.query?.type === 'product'
                  ? storeInfo?.listings?.length > 1
                    ? 'Products'
                    : 'Product'
                  : storeInfo?.listings?.length > 1
                    ? 'Services'
                    : 'Service'}
              </p>
              <div className="">
                <CustomButton
                  onClick={() => {}}
                  className="hidden rounded-[4px] bg-[#4E87F8] px-[40px] py-[10px] text-white hover:bg-[#4E87F8] hover:opacity-80"
                >
                  Connect
                </CustomButton>
              </div>
            </div>
            <SearchWrapper className="lg:hidden">
              <div className="container">
                <TextInput
                  iconName=""
                  iconClick={() => {
                    setOpen(true)
                  }}
                  iconClassName="cursor-pointer"
                  className="pl-[20px] lg:pl-[25px]"
                  placeholder={`Search for a ${type}`}
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  name={''}
                  value={search}
                  type={'text'}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      router.push('/search?id=' + search + `&type=${type}`)
                    }
                  }}
                />
              </div>
            </SearchWrapper>
            <div className="mb-10 mt-[20px] grid grid-cols-1 gap-4 px-[16px] md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 lg:px-0">
              {filteredListings?.length > 0 ? (
                filteredListings.map((listing: Listing, index: number) => {
                  return (
                    <div key={listing?.id || index}>
                      <DetailsCard
                        index={index}
                        listing={listing}
                        store_name={storeInfo?.name}
                        store_slug={storeInfo.slug}
                      />
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full py-4 text-center">
                  <p>No matching products found</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mx-auto my-[40px] flex flex-col items-center justify-center px-[16px] text-center md:w-[60%]">
            <p className="flex text-center text-[20px] font-bold">
              {router?.query?.type === 'product' ? 'Products' : 'Services'} loading…
            </p>
            <p className="flex items-center pb-10 pt-1 text-center text-[20px] font-bold opacity-80">
              Check back so you don’t miss out!{' '}
              <span className="ml-3 hidden md:block">
                <Icon icon="flowbite:gift-box-solid" />
              </span>
            </p>
          </div>
        )}
      </>
    </div>
  )
}
const SearchWrapper = styled(tw.div`
mx-auto flex items-center justify-center px-3 py-[25px] md:mt-5 lg:rounded-[12px] lg:px-0`)`
  .container {
    position: relative;
    width: 100%;
    margin: 0 auto;

    @media (min-width: 1024px) {
      max-width: 735px;
    }
  }

  .second-container {
    position: absolute;
    left: 0.5rem;
    top: 10px;
    z-index: 40;
    display: flex;
    height: 20px;
    width: 80px;
    align-items: flex-start;
    justify-content: flex-start;
    border-right: 1px solid #d1d5db; /* border-r-gray-300 */
    padding-right: 0.25rem; /* pr-1 */

    @media (min-width: 1024px) {
      left: 1rem; /* 4 in Tailwind (16px) */
      top: 50%;
      width: 87px;
      transform: translateY(-50%);
      padding-right: 13px;
    }
  }
`
export default VendorStore
