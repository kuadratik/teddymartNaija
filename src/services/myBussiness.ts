import {BusinessListingTopLevel, singleBusinessListingsTopLevel} from '@/types/business'
import {api} from '.'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Business-listing']
})

export const BusinessEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    businessListings: build.query<
      BusinessListingTopLevel,
      {
        search?: string
        industry?: number[]
        per_page?: number
        page?: number
        current_page?: number
        user?: string
        state?: string
        country?: string
      }
    >({
      query: arg => {
        const {page, search, industry, per_page, current_page, user, country, state} = arg
        const params: {[key: string | number]: string | number} = {
          page: page?.toString() ?? '1',
          search: search!,
          country: country?.toString() ?? '',
          state: state?.toString() ?? '',
          industry: industry?.toString() ?? ''
        }

        if (user) {
          params.user = user
        }

        return {
          url: `/front/business-listings`,
          method: 'GET',
          params
        }
      },
      providesTags: ['Business-listing']
    }),
    singleBusinessListings: build.query<
      singleBusinessListingsTopLevel,
      {
        business_slug: string
      }
    >({
      query: ({business_slug}: {business_slug: string}) => {
        return {
          url: `/front/business-listings/${business_slug}/details`,
          method: 'GET'
        }
      },
      providesTags: ['Business-listing']
    }),

    createBusinessListing: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/business-listings/create`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['Business-listing']
    }),
    updateBusinessListing: build.mutation<any, {body: any; id: number | string}>({
      query: ({body, id}) => ({
        url: `/front/business-listings/${id}/update`,
        method: 'PUT',
        body: {...body}
      }),
      invalidatesTags: ['Business-listing']
    }),
    deleteBusinessListing: build.mutation<any, {businessListingId: number | string}>({
      query: ({businessListingId}) => ({
        url: `front/business-listings/${businessListingId}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Business-listing']
    })
  }),
  overrideExisting: true
})

export const {
  useBusinessListingsQuery,
  useCreateBusinessListingMutation,
  useDeleteBusinessListingMutation,
  useSingleBusinessListingsQuery,
  useUpdateBusinessListingMutation
} = BusinessEndpoint
