import {GetAdsGalleryQuery} from '@/types/adsgallery'
import {SpecifiedStoreModel, SpecifiedStoreQueryParams, StoreProuctQueryParams} from '@/types/store'
import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: [
    'specified-store-listing',
    'get-user-stores',
    'vendor-dashboard-metrics',
    'store-product-listing',
    'store-listing-total',
    'get-all-stores'
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
      {
        listType: 'product' | 'service'
        category?: number[] | string[]
        search?: string
        country_id?: number
        per_page?: number
        page?: number
        state?: string
        uuid?: string
        currency?: string
        limit?: number | undefined
      }
    >({
      query: ({listType, category, search, uuid, currency, country_id, state, page, per_page, limit}) => {
        let url = `front/listings?listingType=${listType}`

        // Add category_ids directly to the URL to ensure proper formatting
        if (category && Array.isArray(category) && category.length > 0) {
          category.forEach(id => {
            // Handle if an array element contains comma-separated values
            if (typeof id === 'string' && (id as string).includes(',')) {
              // Split the comma-separated value and add each as a separate parameter
              id.split(',').forEach(subId => {
                url += `&category_ids[]=${subId.trim()}`
              })
            } else {
              url += `&category_ids[]=${id}`
            }
          })
        }

        // Add other params
        if (country_id) url += `&country_id=${country_id}`
        if (state) url += `&state=${state}`
        if (search) url += `&search=${search}`
        if (page) url += `&page=${page}`
        if (per_page) url += `&per_page=${per_page}`
        if (limit) url += `&limit=${limit}`

        return {
          url,
          method: 'GET',
          headers: {
            interactUid: uuid,
            currency: currency
          }
        }
      },
      // Improve caching behavior
      keepUnusedDataFor: 300, // Keep unused data for 5 minutes
      providesTags: (result, error, arg) =>
        result
          ? [
              {type: 'store-listing-total', id: 'LIST'},
              ...result?.data?.map((item: any) => ({type: 'store-listing-total' as const, id: item.id}))
            ]
          : [{type: 'store-listing-total', id: 'LIST'}]
    }),
    getDashboardMetrics: build.query<BaseResponse, {userStore: string}>({
      query: ({userStore}) => ({
        url: `store/user-store/${userStore}/overall-metrics`,
        method: 'GET'
      }),
      providesTags: ['vendor-dashboard-metrics']
    }),

    adsGallery: build.query<BaseResponse, {category_ids?: number[]; params: GetAdsGalleryQuery; currency: string}>({
      query: ({params, currency, category_ids}) => {
        // Create a base URL
        let url = `front/advert/gallery?`

        // Add all params from the params object
        if (params) {
          const paramEntries = Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== null && value !== ''
          )

          if (paramEntries.length > 0) {
            paramEntries.forEach(([key, value], index) => {
              // Skip category_ids in params as we'll handle it separately
              if (key !== 'category_ids') {
                url += `${key}=${encodeURIComponent(value.toString())}`
                if (index < paramEntries.length - 1) {
                  url += '&'
                }
              }
            })
          }
        }

        // Add category_ids directly to the URL to ensure proper formatting
        if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
          // Make sure we have a '&' if there are already params
          if (url.charAt(url.length - 1) !== '?' && url.charAt(url.length - 1) !== '&') {
            url += '&'
          }

          category_ids.forEach((id: any, idx) => {
            // Handle if an element contains comma-separated values
            if (typeof id === 'string' && id.includes(',')) {
              // Split the comma-separated value and add each as a separate parameter
              id.split(',').forEach(subId => {
                url += `category_ids[]=${subId.trim()}`
                url += '&'
              })
            } else {
              url += `category_ids[]=${id}`
              if (idx < category_ids.length - 1) {
                url += '&'
              }
            }
          })
        }

        // Remove trailing '&' or '?' if present
        if (url.charAt(url.length - 1) === '&' || url.charAt(url.length - 1) === '?') {
          url = url.slice(0, -1)
        }

        return {
          url,
          method: 'GET',
          headers: {
            currency
          }
        }
      },
      providesTags: ['store-listing-total']
    }),
    getBestDeals: build.query<
      BaseResponse,
      {
        uuid?: string
        currency: string
      }
    >({
      query: ({uuid, currency}) => {
        return {
          url: `front/listings/best-deals`,
          method: 'GET',

          headers: {
            interactUid: uuid,
            currency
          }
        }
      },
      keepUnusedDataFor: 300, // 5 minutes
      providesTags: ['store-listing-total']
    }),
    getTodayDeals: build.query<
      BaseResponse,
      {
        uuid?: string
        currency: string
        limit: number | undefined
      }
    >({
      query: ({uuid, currency, limit}) => {
        return {
          url: `front/listings/today-deals`,
          method: 'GET',

          headers: {
            interactUid: uuid,
            currency
          },
          params: limit && limit > 0 ? {limit} : undefined
        }
      },
      keepUnusedDataFor: 300, // 5 minutes
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

// Add a utility function to safely check if prefetch is available
export const safelyPrefetch = (endpoint: string, arg: any, options = {force: false}) => {
  if (StoreEndpoint && StoreEndpoint.util && typeof StoreEndpoint.util.prefetch === 'function') {
    return StoreEndpoint.util.prefetch(endpoint as any, arg, options)
  }
  return {type: 'prefetch/ignored'} // Return a dummy action if prefetch isn't available
}

export const {
  useGetSpecifiedStoreListingQuery,
  useGetGroupedAlphaNumericStoreListingQuery,
  useGetStoreProductListingQuery,
  useGetStoreMetricsQuery,
  useGetSearchStoreListingQuery,
  useGetAllStoreListingQuery,
  useGetUserStoreQuery,
  useGetBestDealsQuery,
  useGetTodayDealsQuery,
  useGetDashboardMetricsQuery
} = StoreEndpoint
