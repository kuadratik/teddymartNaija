// pages/dashboard.tsx

import CustomButton from '@/components/SharedUI/Buttons/Button'
import ImageComponent from '@/components/SharedUI/Image/ImageComponent'
import StoreFrontLayout from '@/components/SharedUI/StoreFrontLayout'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import Invite from '@/components/Vendor/components/dashboard/Invite'
import ProductReview from '@/components/Vendor/components/dashboard/ProductReview'
import RecentOrder from '@/components/Vendor/components/dashboard/RecentOrder'
import TopSelling from '@/components/Vendor/components/dashboard/TopSelling'
import TopVisualization from '@/components/Vendor/components/dashboard/TopVisualization'
import {useAppSelector} from '@/hooks/reduxHooks'
import copyToClipboard from '@/utils/fx'
import {CloseOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Button} from 'antd'
import Image from 'next/image'
import {useState} from 'react'

const DashboardPage = () => {
  const [isVisible, setIsVisible] = useState(true)

  const handleDelete = () => {
    setIsVisible(false)
  }

  const handleCopyLink = (text: string) =>
    copyToClipboard(text)
      .then(() => {
        showPlannerToast({
          options: {
            customToast: (
              <CustomToast
                altText={''}
                title={<>Link copied!</>}
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

  const isAuthenticatedUser = useAppSelector((state: {auth: {user: any}}) => state.auth.user) // get authenticated user
  console.log(isAuthenticatedUser)
  return (
    <div>
      {isVisible && (
        <div className="hidden !h-[15px] rounded-[4px] md:block">
          <div className="relative h-[110px] w-full overflow-hidden rounded-[21px] bg-[url('/assets/advert_banner.jpg')]">
            {/* Your content goes here */}
            <button
              // onClick={handleDelete}
              className="!hover:bg-black absolute right-8 top-10 rounded-full border-none bg-black p-1 text-xl font-bold text-white"
            >
              <CloseOutlined />
            </button>
          </div>
          {/* <Image src={``} alt="product-image" className={`rounded-[4px]`} width={830} height={100} /> */}
        </div>
      )}
      {/* This is the content that will move up when the image div is removed */}
      <div className="mt-[10px] md:mt-[120px]">
        <div className="flex w-full flex-col justify-between md:flex-row">
          <div className="flex flex-col">
            <TextComponent as="p" className="text-[24px] font-semibold leading-[31px]">
              Hello {isAuthenticatedUser?.last_name} {isAuthenticatedUser?.first_name}
            </TextComponent>
            <TextComponent as="p" className="mt-[8px] text-[14px] font-medium leading-[18px]">
              Here's what's happening with your store today.{' '}
            </TextComponent>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-[9px] bg-white p-2 md:mt-0 md:gap-6">
            {' '}
            <div className="flex w-full items-center gap-1">
              {' '}
              <div className="rounded bg-[#F8EAFF] p-2">
                <Icon icon="gg:link" className="text-xl text-[#AF52DE]" />{' '}
              </div>
              <TextComponent as="p" className="truncate text-[14px] font-medium leading-[18px] text-[#6B7280]">
                https://myeki.com/store/busi
              </TextComponent>
            </div>
            <Button
              onClick={() => {
                handleCopyLink('https://myeki.com/store/businessname')
              }}
              className="!hover:bg-[#AF52DE] rounded-[6px] bg-[#AF52DE] px-2 py-2 text-[14px] font-normal text-white md:px-4"
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>{' '}
      <div className="mt-[40px] grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        <TopVisualization
          value={'$559.25k'}
          data={{
            title: 'Total Revenue',
            icon: 'tdesign:money'
          }}
        />
        <TopVisualization
          value={'36,894'}
          data={{
            title: 'Orders Fulfilled',
            icon: 'solar:cart-bold-duotone'
          }}
        />{' '}
        <TopVisualization
          value={'183'}
          data={{
            title: 'My Customers',
            icon: 'ic:round-man'
          }}
        />{' '}
        <TopVisualization
          value={'54'}
          data={{
            title: 'Products Listed',
            icon: 'solar:wallet-bold-duotone'
          }}
        />
      </div>
      <div className="mt-[30px] gap-6 md:flex">
        <TopSelling />
        <RecentOrder />
      </div>
      <div className="gap-6 md:flex">
        <div className="flex-[4]">
          <ProductReview />
        </div>

        <div className="mt-8 flex-shrink-0 md:w-[250px]">
          <Invite />
        </div>
      </div>
    </div>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <StoreFrontLayout>{page}</StoreFrontLayout>
}

export default DashboardPage
