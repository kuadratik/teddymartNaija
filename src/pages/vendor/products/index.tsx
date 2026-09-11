// pages/dashboard.tsx

import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'
import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import ProductContainer from '@/components/Vendor/components/product/ProductContainer'
import {useAppSelector} from '@/hooks/reduxHooks'
// import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
// import ProductContainer from '@/components/Vendor/components/Product/ProductContainer'
import useQueryParams from '@/hooks/useQueryParams'
import debounce from '@/utils/debounce'
import {Icon} from '@iconify/react'
import {Dropdown, MenuProps} from 'antd'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useCallback, useState} from 'react'

const ProductPage = () => {
  const router = useRouter()
  const isActiveUser = useAppSelector(state => state.auth.activeUser)
  const {queryParams, updateQueryParams} = useQueryParams<any>({
    search: ''
  })
  const [showShipping, setShowShipping] = useState(false)

  const [queryString, setQueryString] = useState(queryParams?.search ?? '')

  // * This debounce function update the search queryParams and delays executing the api request
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateQueryParams({
        search: value ?? ''
      })
    }, 1000),
    []
  )

  const filterMenu: MenuProps = {
    items: [
      {
        label: 'Price',
        key: '1',
        children: [
          {
            label: 'Highest',
            key: '1-1',
            onClick: () => {
              updateQueryParams({
                sort_price: 'highest'
              })
            }
          },
          {
            label: 'Lowest',
            key: '1-2',
            onClick: () => {
              updateQueryParams({
                sort_price: 'lowest'
              })

              // console.log('Filter by Lowest Price')
            }
          }
        ]
      },
      {
        label: 'Date',
        key: '2',
        children: [
          {
            label: 'Oldest',
            key: '2-1',
            onClick: () => {
              updateQueryParams({
                sort_date: 'oldest'
              })
            }
          },
          {
            label: 'Newest',
            key: '2-2',
            onClick: () => {
              updateQueryParams({
                sort_date: 'newest'
              })
            }
          }
        ]
      }
    ]
  }

  return (
    <div>
      <DashboardHeader
        extra={
          <div className="mt-8 block lg:hidden">
            <Dropdown trigger={['click']} menu={filterMenu}>
              {/* <Button className="flex justify-between">
              <span>Filter</span>
              <Icon icon="tabler:dots" className="text-2xl" />{' '}
            </Button> */}
              <CustomButton
                onClick={() => {}}
                style={{
                  color: 'black',
                  border: '1px solid black',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                type="button"
                className="flex items-center justify-between whitespace-nowrap rounded-lg bg-[#fff] py-2 text-base font-bold lg:gap-3"
              >
                Filter
                <Icon icon="mi:filter-1" className="text-2xl" />
                {/* <Icon icon="tabler:dots" />{' '} */}
              </CustomButton>
            </Dropdown>
          </div>
        }
        btnText="Add Product"
        titleHeader="Product"
        searchValue={queryString ?? ''}
        setSearchValue={e => {
          setQueryString(e)
          debouncedSearch(e as string)
        }}
        onClick={() => {
          localStorage.removeItem('product_arr')
          if (isActiveUser?.shipping_methods?.length === 0) {
            setShowShipping(true)
          } else {
            router.push('/vendor/products/add-product')
          }
        }}
      />

      <ProductContainer isActiveUserShippingMethods={isActiveUser} setShowShipping={setShowShipping} />

      <PlannerModal
        modalOpen={showShipping}
        onCloseModal={() => {
          setShowShipping(false)
        }}
        setModalOpen={setShowShipping}
        maskCloseable={true}
        width={380}
      >
        <div className="flex flex-col items-center gap-4">
          <TextComponent as="p" className="text-center text-[20px] font-bold leading-[26px]">
            Set Shipping Method
          </TextComponent>
          <div className="relative h-[200px] w-[200px]">
            <Image src="/assets/shipping.svg" alt="Shipping animation" layout="fill" objectFit="cover" />
          </div>
          <TextComponent as="p" className="py-4 text-center text-[14px] leading-[18px] text-[#6B7280]">
            Let&apos;s set up your shipping method first
          </TextComponent>

          <CustomButton
            onClick={() => {
              router.push('/vendor/shipping')
            }}
            disabled={false}
            type="button"
            className="w-full rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
          >
            {'Proceed'}
          </CustomButton>
        </div>
      </PlannerModal>
    </div>
  )
}

ProductPage.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default ProductPage
