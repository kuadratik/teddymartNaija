import {BaseResponse} from '@/types/types'
import {api} from '..'
import {OnboardingType} from '@/components/Auth/Signup/utils'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['vendorApi', 'store-listing-total', 'authUser']
})

export const VendorEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getUserStoreListings: build.query<
      any,
      {
        from?: string
        to?: string
        page?: string
        search?: string
        listingType?: string
        availability?: boolean
        userStore?: string
      }
    >({
      query: arg => {
        const {from, userStore, to, page, search, listingType = 'product', availability = true} = arg
        const params: {[key: string]: string} = {
          page: page?.toString() ?? '1',
          search: search!
        }
        if (from) params.from = from
        if (to) params.to = to
        if (listingType) params.listingType = listingType
        if (availability) params.availability = availability.toString()

        return {
          url: `/store/${userStore}/listings`,
          method: 'GET',
          params
        }
      },
      providesTags: ['vendorApi']
    }),

    createUserStoreListingItem: build.mutation<any, {body: any; user_store: any; currency: any}>({
      query: ({body, user_store, currency}) => ({
        url: `/store/${user_store}/listings/create`,
        method: 'POST',
        body: {...body, currency}
      }),
      invalidatesTags: ['vendorApi', 'store-listing-total']
    }),

    getUserStoreListingItem: build.query<
      any,
      {
        userStore: string
        listing: string
      }
    >({
      query: arg => {
        const {userStore, listing} = arg
        const params: {[key: string]: string} = {}

        return {
          url: `/store/listings/${userStore}/listing/${listing}`,
          method: 'GET',
          params
        }
      },
      providesTags: ['vendorApi']
    }),
    updateStoreItemAvailability: build.mutation<any, {userStore: string; listing: string; body: any}>({
      query: ({userStore, listing, body}) => ({
        url: `/store/listings/${userStore}/listing/${listing}/set-availability`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['vendorApi', 'store-listing-total']
    }),

    updateUserStoreItem: build.mutation<any, {userStore: string; listing: string; body: any; currency: any}>({
      query: ({userStore, listing, body, currency}) => ({
        url: `/store/listings/${userStore}/listing/${listing}/update`,
        method: 'PATCH',
        body: {...body, currency}
      }),
      invalidatesTags: ['vendorApi', 'store-listing-total']
    }),

    deleteUserStoreItem: build.mutation<any, {userStore: string; listing: string}>({
      query: ({userStore, listing}) => ({
        url: `/store/listings/${userStore}/listing/${listing}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: ['vendorApi', 'store-listing-total']
    }),
    createStore: build.mutation<BaseResponse, {body: OnboardingType}>({
      query: ({body}) => ({
        url: `/store/create`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['authUser']
    })
  }),
  overrideExisting: true
})

export const {
  useGetUserStoreListingsQuery,
  useCreateUserStoreListingItemMutation,
  useGetUserStoreListingItemQuery,
  useUpdateStoreItemAvailabilityMutation,
  useUpdateUserStoreItemMutation,
  useDeleteUserStoreItemMutation,
  useCreateStoreMutation
} = VendorEndpoint
