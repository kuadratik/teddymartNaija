import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import DetailsCard from '@/components/Store/components/DetailsCard'
import {Listing} from '@/types/store'
import React from 'react'

interface CatalogCardViewProps {
  data: any
  isLoading: boolean
  isFetching: boolean
}

const CatalogCardview = ({data, isLoading, isFetching}: CatalogCardViewProps) => {
  if (isLoading || isFetching) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div>
      <div className="mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-6">
        {data?.data?.map((listing: Listing, id: number) => {
          return (
            <div key={id}>
              <DetailsCard listing={listing} store_name={listing?.store?.name} store_slug={listing?.store?.slug} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CatalogCardview
