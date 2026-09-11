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
    getStoreMetrics: build.query<BaseResponse, {params: 'product' | 'service'; userStore: string}>({
      query: ({params, userStore}) => ({
        url: `store/user-store/${userStore}/metrics?listingType=${params}`,
        method: 'GET'
      }),
      providesTags: ['store-listing-total']
    }),
    getSearchStoreListing: build.query<
      BaseResponse,
      {listType: 'product' | 'service'; category?: number; search?: string; uuid?: string; currency?: string}
    >({
      query: ({listType, category, search, uuid, currency}) => {
        const params: {[key: string]: string} = {
          listingType: listType
        }

        if (category) params.category = category.toString()
        if (search) params.search = search

        return {
          url: `front/listings`,
          method: 'GET',
          params,
          headers: {
            interactUid: uuid,
            currency: currency
          }
        }
      },
      providesTags: ['store-listing-total']
    }),
    getSearchStoreListingNew: build.query<
      BaseResponse,
      {listType: 'product' | 'service'; category?: number; search: string; uuid?: string; currency: string}
    >({
      query: ({listType, category, search, uuid, currency}) => {
        const params: {[key: string]: string} = {
          listingType: listType,
          search: search
        }

        if (category) params.category = category.toString()
        if (search) params.search = search

        return {
          url: `front/listings`,
          method: 'GET',
          params,
          headers: {
            interactUid: uuid,
            currency
          }
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
  useGetSearchStoreListingQuery,
  useGetSearchStoreListingNewQuery
} = StoreEndpoint
