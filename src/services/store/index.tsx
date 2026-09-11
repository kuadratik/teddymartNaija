import {BaseResponse} from '@/types/types'
import {api} from '..'
import {SpecifiedStoreModel, SpecifiedStoreQueryParams, StoreProuctQueryParams} from '@/types/store'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['specified-store-listing', 'store-product-listing', 'store-listing-total']
})

export const StoreEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getSpecifiedStoreListing: build.query<SpecifiedStoreModel, {params: SpecifiedStoreQueryParams}>({
      query: ({params}) => ({
        url: `front/stores/${params.store}/listings?listingType=${params.listingType}`,
        method: 'GET'
      }),
      providesTags: ['specified-store-listing']
    }),
    getStoreProductListing: build.query<BaseResponse, {params: StoreProuctQueryParams}>({
      query: ({params}) => ({
        url: `front/stores/${params.store}/listings/${params.listing}`,
        method: 'GET'
      }),
      providesTags: ['store-product-listing']
    }),
    getStoreMetrics: build.query<BaseResponse, {params: 'product' | 'service'}>({
      query: ({params}) => ({
        url: `store/user-store/metrics?listingType=${params}`,
        method: 'GET'
      }),
      providesTags: ['store-listing-total']
    }),
    getSearchStoreListing: build.query<
      BaseResponse,
      {listType: 'product' | 'service'; category?: number; search?: string}
    >({
      query: ({listType, category, search}) => {
        const params: {[key: string]: string} = {
          listingType: listType
        }

        if (category) params.category = category.toString()
        if (search) params.search = search

        return {
          url: `front/stores`,
          method: 'GET',
          params
        }
      },
      providesTags: ['store-listing-total']
    })
  }),
  overrideExisting: true
})

export const {
  useGetSpecifiedStoreListingQuery,
  useGetStoreProductListingQuery,
  useGetStoreMetricsQuery,
  useGetSearchStoreListingQuery
} = StoreEndpoint
