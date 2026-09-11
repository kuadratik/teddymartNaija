// pages/dashboard.tsx

import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {TruncatedText} from '@/components/Store/components/DetailsCard'
import ProductReview from '@/components/Vendor/components/dashboard/ProductReview'
import RecentOrder from '@/components/Vendor/components/dashboard/RecentOrder'
import TopSelling from '@/components/Vendor/components/dashboard/TopSelling'
import TopVisualization from '@/components/Vendor/components/dashboard/TopVisualization'
// import Invite from '@/components/Vendor/components/dashboard/Invite'
// import ProductReview from '@/components/Vendor/components/dashboard/ProductReview'
// import RecentOrder from '@/components/Vendor/components/dashboard/RecentOrder'
// import TopSelling from '@/components/Vendor/components/dashboard/TopSelling'
// import TopVisualization from '@/components/Vendor/components/dashboard/TopVisualization'
import FormatNumberCurrency from '@/hooks/FormatNumberCurrency'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetDashboardMetricsQuery} from '@/services/store'
import copyToClipboard from '@/utils/fx'
import {Icon} from '@iconify/react'
import {Button} from 'antd'
import {useState} from 'react'

export interface ITypeProps {
  value: 'product' | 'service'
  label: string
}

export const typeOptions: ITypeProps[] = [
  {value: 'product', label: 'Product'},
  {value: 'service', label: 'Service'}
]

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

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user

  const {data: listingTotalData, isLoading} = useGetDashboardMetricsQuery({userStore: isActiveUser?.slug})

  if (isLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  const bestSellingproducts = listingTotalData?.data?.list?.bestSellingProducts

  const recentOrders = listingTotalData?.data?.list?.recentOrders

  const productReviews = listingTotalData?.data?.list?.productReviews

  // console.log(isActiveUser?.currency)
  return (
    <div>
      {isVisible && (
        <div className="!h-[15px] rounded-[4px] md:block">
          <div className="relative h-[110px] w-full overflow-hidden rounded-[21px] bg-[url('/assets/ad_banner.svg')]">
            {/* Your content goes here */}
          </div>
          {/* <Image src={``} alt="product-image" className={`rounded-[4px]`} width={830} height={100} /> */}
        </div>
      )}
      {/* This is the content that will move up when the image div is removed */}
      <div className="">
        <div className="flex w-full flex-col justify-between md:flex-row">
          <div className="flex flex-col">
            <TextComponent as="p" className="text-[24px] font-semibold leading-[31px]">
              Hello {isAuthenticatedUser?.first_name} {isAuthenticatedUser?.last_name}
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
              <TextComponent
                as="p"
                className="truncate text-[14px] font-medium leading-[18px] text-[#6B7280] lg:hidden"
              >
                <TruncatedText
                  text={`${window.location.origin}/store/${isActiveUser?.slug}?type=${isActiveUser?.type}`}
                  limit={30}
                />{' '}
                {/* {`${window.location.origin}/store/${isActiveUser?.slug}?type=${isActiveUser?.type}`}{' '} */}
              </TextComponent>
              <TextComponent
                as="p"
                className="hidden truncate text-[14px] font-medium leading-[18px] text-[#6B7280] lg:block"
              >
                <TruncatedText
                  text={`${window.location.origin}/store/${isActiveUser?.slug}?type=${isActiveUser?.type}`}
                  limit={50}
                />{' '}
                {/* {`${window.location.origin}/store/${isActiveUser?.slug}?type=${isActiveUser?.type}`}{' '} */}
              </TextComponent>
            </div>
            <Button
              style={{
                backgroundColor: '#AF52DE',
                color: 'white',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              onClick={() => {
                handleCopyLink(`${window.location.origin}/store/${isActiveUser?.slug}?type=${isActiveUser?.type}`)
              }}
              className="!hover:bg-[#AF52DE] rounded-[6px] bg-[#AF52DE] px-2 py-2 text-[14px] font-normal text-white md:px-4"
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 gap-2 overflow-x-auto">
        {' '}
        <div className="mt-[40px] flex w-[calc(100%*4)] gap-5 overflow-x-auto lg:w-full">
          <TopVisualization
            value={
              <FormatNumberCurrency
                value={+listingTotalData?.data?.counts?.totalRevenue}
                currency={isActiveUser?.currency}
              />
            }
            data={{
              title: 'Total Revenue',
              icon: 'tdesign:money',
              tooltipTitle: 'Total sales to date'
            }}
          />
          <TopVisualization
            value={
              <FormatNumberCurrency
                value={+listingTotalData?.data?.counts?.payoutAccrued}
                currency={isActiveUser?.currency}
              />
            }
            data={{
              title: 'Payout Accrued',
              icon: 'solar:wallet-bold-duotone',
              tooltipTitle: 'Pending payout'
            }}
          />{' '}
          <TopVisualization
            value={listingTotalData?.data?.counts?.orderFulfilled}
            data={{
              title: 'Orders Fulfilled',
              icon: 'solar:cart-bold-duotone',
              tooltipTitle: 'Orders delivered'
            }}
          />{' '}
          <TopVisualization
            value={listingTotalData?.data?.counts?.myCustomers}
            data={{
              title: 'My Customers',
              icon: 'ic:round-man',
              tooltipTitle: 'List of customers that have paid'
            }}
          />
          <TopVisualization
            value={listingTotalData?.data?.counts?.productListed}
            data={{
              title: 'Products Listed',
              icon: 'solar:wallet-bold-duotone',
              tooltipTitle: 'List of products'
            }}
          />
        </div>
      </div>

      <div className="mt-[30px] gap-6 lg:flex">
        <TopSelling data={bestSellingproducts} />
        <RecentOrder data={recentOrders} />
      </div>

      <div className="">
        <div className="">
          <ProductReview data={productReviews} />
        </div>

        {/* <div className="mt-8 flex-shrink-0 md:w-[250px]">
          <Invite />
        </div> */}
      </div>
    </div>
  )
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default DashboardPage
