import {SpecifiedStoreModel, SpecifiedStoreQueryParams, StoreProuctQueryParams} from '@/types/store'
import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: [
    'specified-store-listing',
    'store-product-listing',
    'store-listing-total',
    'get-all-stores',
    'get-user-stores'
  ]
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
      {listType: 'product' | 'service'; category?: number; search?: string; uuid?: string; currency: string}
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
            currency
          }
        }
      },
      providesTags: ['store-listing-total']
    }),
    getGroupedAlphaNumericStoreListing: build.query<
      BaseResponse,
      {category?: number; search?: string; currency: string; store_type: string}
    >({
      query: ({category, search, currency, store_type}) => {
        const params: {[key: string]: string} = {}

        // if (category) params.category = category.toString()
        if (store_type) params.store_type = store_type

        // const queryString = new URLSearchParams(params).toString()
        const url = `front/stores/grouped-alpha-numeric`

        return {
          url,
          method: 'GET',
          headers: {
            currency
          },
          params
        }
      },
      providesTags: ['store-listing-total']
    }),

    getAllStoreListing: build.query<
      BaseResponse,
      {
        listType: 'product' | 'service'
        category?: number
        search?: string
        uuid?: string
        currency: string
        sortType?: string
      }
    >({
      query: ({listType, category, search, uuid, currency, sortType}) => {
        const params: {[key: string]: string} = {
          listingType: listType
        }

        if (category) params.category = category.toString()
        if (search) params.search = search
        if (sortType) params.sortType = sortType

        return {
          url: `/front/stores`,
          method: 'GET',
          params,
          headers: {
            currency
          }
        }
      },
      providesTags: ['get-all-stores']
    }),

    getUserStore: build.query<BaseResponse, {currency: string}>({
      query: ({currency}) => {
        return {
          url: `/store/user-store`,
          method: 'GET',
          headers: {
            currency
          }
        }
      },
      providesTags: ['get-user-stores']
    })
  }),
  overrideExisting: true
})

export const {
  useGetSpecifiedStoreListingQuery,
  useGetGroupedAlphaNumericStoreListingQuery,
  useGetStoreProductListingQuery,
  useGetStoreMetricsQuery,
  useGetSearchStoreListingQuery,
  useGetSearchStoreListingNewQuery,
  useGetAllStoreListingQuery,
  useGetUserStoreQuery
} = StoreEndpoint
