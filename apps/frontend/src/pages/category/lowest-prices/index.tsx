// src/pages/category/[id].tsx

import Category from '@/components/Auth/Products/components/Category'
import NewNavigation from '@/components/Auth/Products/components/NewNavigation'
import BaseLayout from '@/components/Layout/BaseLayout'
import CustomerLayout from '@/components/Layout/Customerlayout'
import RecommendedStores from '@/components/Search/RecommendedStores'
import TextInput from '@/components/SharedUI/Input/TextInput'
import SEOHead from '@/components/SharedUI/SEOHead'
import DetailsCard from '@/components/Store/components/DetailsCard'
import DetailsCardSkeletonLoader from '@/components/Store/components/DetailsCardSkeletonLoader'
import {useAppSelector} from '@/hooks/reduxHooks'
import useWindowResize from '@/hooks/useWindowResize'
import {useGetBestDealsQuery} from '@/services/store'
import {useRouter} from 'next/router'
import React, {useMemo, useState} from 'react'

const LowestPrice = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const {selectedLanguage} = useAppSelector(state => state.country)
  const {isLoading, currentData: bestDealsData} = useGetBestDealsQuery({
    currency: selectedLanguage.value
  })
  console.log('🚀 ~ LowestPrice ~ bestDealsData:', bestDealsData)
  const filteredDeals = useMemo(() => {
    if (!bestDealsData?.data) return []
    return bestDealsData.data.filter((deal: any) =>
      deal?.listing.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [searchValue, bestDealsData])
  console.log('🚀 ~ filteredDeals ~ filteredDeals:', filteredDeals)
  const {width} = useWindowResize()

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 px-[20px] lg:max-w-[900px] lg:px-0">
        <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3">
          {Array(width > 1024 ? 6 : width > 760 ? 6 : 4)
            .fill(0)
            .map((_, index) => (
              <DetailsCardSkeletonLoader key={`skeleton-${index}`} />
            ))}
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Category open={open} setOpen={setOpen} />
      <NewNavigation />
      <SEOHead
        title={`AfricanDiasporaMart | Lowest Prices`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />

      <BaseLayout>
        <div className="pb-10 pt-5">
          <div className="mx-auto max-w-[900px]">
            <div className="flex w-full flex-col">
              {/* <TopBar title={currentCategory?.name} showClip /> */}

              <div className="w-full rounded-lg bg-black p-4">
                <div className="mx-auto flex w-full items-center justify-between gap-2 lg:w-[700px]">
                  <TextInput
                    iconName="carbon:search"
                    iconClassName="text-[#181A20] w-[16px] h-[16x]"
                    placeholder={`Search lowest prices...`}
                    onChange={e => {
                      setSearchValue(e.target.value)
                    }}
                    name=""
                    value={searchValue}
                    type="text"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        setSearchValue(searchValue)
                      }
                    }}
                  />
                </div>
              </div>
              <h1 className="mt-5 font-bold">{'Lowest Prices'}</h1>
              <div
                className={`flex w-full flex-col ${
                  filteredDeals?.length ? 'md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3' : ''
                }`}
              >
                {filteredDeals?.length ? (
                  filteredDeals?.map((item: any, index: number) => (
                    <div key={item?.id || index} className="mt-5">
                      <DetailsCard index={index} listing={item?.listing} />
                    </div>
                  ))
                ) : (
                  <RecommendedStores />
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </React.Fragment>
  )
}

LowestPrice.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export default LowestPrice
